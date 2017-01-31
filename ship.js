function Ship()
{
  // Size and Mass
  this.mass = 100;
  this.size = 50;

  // Position, Orientation and Velocity
  this.pos = createVector(width/2, height/2);
  this.heading = -90;

  this.vel = createVector(0, 0);
  this.acc = createVector(0, 0);

  this.omega = 0;
  this.omega_dot = 0;

  // Score
  this.score = 0;

  // HUD
  this.hud = true;

  // Hitpoints
  this.isHit = false;
  this.shield = 100;
  this.shield_refill = 0.05;
  this.shield_gauge = new Gauge("Shields", 100, height-100, 80, 0, 100);

  // Weapons
  this.weapon = 0;
  this.weapons = [new Laser(), new ProtonGun()];
}

Ship.prototype =
{
  keyDown: function()
  {
    if (keyIsDown(RIGHT_ARROW))
      this.rotate(+1);
    else if (keyIsDown(LEFT_ARROW))
      this.rotate(-1);
    else
      this.rotate(0);

    if (keyIsDown(UP_ARROW))
      this.accelerate(+1);
    else if (keyIsDown(DOWN_ARROW))
      this.accelerate(-1);
    else
      this.accelerate(0);
  },

  rotate: function(dir)
  {
      this.omega_dot = Math.sign(dir) * 1.75;
  },

  accelerate: function(dir)
  {
      this.acc = p5.Vector.fromAngle(this.heading * PI / 180);
      this.acc.mult(Math.sign(dir) * 75 / this.mass);
  },

  selectWeapon: function(nr)
  {
    this.weapon = constrain(nr, 0, this.weapons.length-1);
  },

  cycleWeapon: function(dir)
  {
    if (dir > 0)
      this.weapon++;
    else
      this.weapon--;

    if (this.weapon >= this.weapons.length)
      this.weapon = 0;
    else if (this.weapon < 0)
      this.weapon = this.weapons.length-1;
  },

  fire: function()
  {
    // Fire Weapon and return Projectiles
    return this.weapons[this.weapon].fire(this.pos, this.vel, this.heading);
  },

  isHitBy: function(pos, size)
  {
    var d = dist(pos.x, pos.y, this.pos.x, this.pos.y);

    return (d < (this.size + size));
  },

  hit: function(size)
  {
    this.shield -= size / 100;
    this.isHit = true;
  },

  update: function()
  {
    // Shield refill
    if (this.shield < 100)
      this.shield += this.shield_refill;

    for (var i = 0; i < this.weapons.length; ++i)
       this.weapons[i].update();

    // Move
    this.vel.add(this.acc);
    this.pos.add(this.vel);

    this.vel.mult(0.98);

    // Rotate
    this.omega += this.omega_dot;
    this.heading += this.omega;

    this.omega *= 0.75;

    // Keep on screen
    if (this.pos.x > (width + this.size/2))
      this.pos.x = -this.size/2;
    else if (this.pos.x < (-this.size/2))
      this.pos.x = width + this.size/2;

    if (this.pos.y > (height + this.size/2))
      this.pos.y = -this.size/2;
    else if (this.pos.y < (-this.size/2))
      this.pos.y = height + this.size/2;
  },

  render: function()
  {
    // Render Ship
    push();

    fill(0);
    if (this.isHit) stroke(255, 0, 0); else stroke(255);
    this.isHit = false;

    translate(this.pos.x, this.pos.y);
    rotate((this.heading + 90) * PI / 180);

    triangle(-this.size/2,this.size/2,
             this.size/2, this.size/2,
             0, -this.size/1.25);

    // Render Weapons on top of Ship
    for (var i = 0; i < this.weapons.length; ++i)
       this.weapons[i].render();

    pop();

    // Render HUD
    if (this.hud)
    {
      this.shield_gauge.render(this.shield);
      this.weapons[this.weapon].render_hud();
    }
  }
}