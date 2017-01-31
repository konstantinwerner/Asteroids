function Weapon(name, maxcharge, charge, refill, shape,
                projectile_speed, projectile_inertia, projectile)
{
  this.name = name;

  this.maxcharge = maxcharge;
  this.charge = charge;
  this.refill = refill;

  this.shape = shape;
  this.gauge = new Gauge(name, width-100, height-100, 80, 0, this.maxcharge);

  this.projectile = projectile;
  this.projectile_speed = projectile_speed;
  this.projectile_inertia = projectile_inertia;
}

Weapon.prototype =
{
  fire: function(p, v, h)
  {
    if (this.charge > 0)
    {
      var vel = p5.Vector.fromAngle(h * PI / 180);
      vel = vel.mult(this.projectile_speed);
      var v_in = createVector(v.x, v.y).mult(this.projectile_inertia);

      var projectiles = [this.projectile.getCopy(p, vel.add(v_in), h)];

      this.charge--;

      return projectiles;
    } else {
      return [];
    }
  },

  update: function()
  {
    if (this.charge < this.maxcharge )
      this.charge += this.refill;
  },

  render: function()
  {
    if (this.shape)
    {
      beginShape();

      for (var i = 0; i < this.shape.length; ++i)
        vertex(this.shape[i].x, this.shape[i].y);

      endShape(CLOSE);
    }
  },

  render_hud: function()
  {
    this.gauge.render(this.charge);
  }
}
