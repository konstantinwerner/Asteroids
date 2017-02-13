function Projectile(p, v, h, shape, power, ttl,
                    flyAnimation, hitAnimation)
{
  this.shape = shape;

  this.pos = createVector(p.x, p.y);
  this.vel = createVector(v.x, v.y);
  this.heading = h;

  this.radius = 0;

  this.ttl = ttl;
  this.power = power;
  this.age = 0;

  this.flyAnimation = flyAnimation;
  this.hitAnimation = hitAnimation;

  phase = { FLYING: 0, HIT: 1, DECAYED: 2 };
  this.phase = phase.FLYING;
}

Projectile.prototype =
{
  defaultHitAnimation: function()
  {
    // To be overridden
    return true;
  },

  defaultFlyAnimation: function()
  {
    // To be overridden
    noFill();
    stroke(25 + 220 * (1 - (this.age / this.ttl)));
    strokeWeight(1);

    if (this.shape)
    {
      beginShape();

      for (var i = 0; i < this.shape.length; ++i)
        vertex(this.shape[i].x, this.shape[i].y);

      endShape(CLOSE);
    }
  },

  isDecayed: function()
  {
    return (this.phase == phase.DECAYED);
  },

  hit: function()
  {
    if (this.phase == phase.FLYING)
    {
      this.age = 0;
      this.phase = phase.HIT;
    }
  },

  update: function()
  {
    this.age++;

    if (this.phase == phase.FLYING)
    {
      if (this.age > this.ttl)
        this.phase = phase.DECAYED;

      // Move
      this.pos.add(this.vel);

      // Keep on screen
      if (this.pos.x > width)
        this.pos.x = 0;
      else if (this.pos.x < 0)
        this.pos.x = width;

      if (this.pos.y > height)
        this.pos.y = 0;
      else if (this.pos.y < 0)
        this.pos.y = height;
    }
  },

  render: function()
  {
    if (this.phase != phase.DECAYED)
    {
      push();

      translate(this.pos.x, this.pos.y);
      rotate(this.heading * PI / 180);

      if (this.phase == phase.HIT)
      {
        if (this.hitAnimation != undefined)
        {
          this.hitAnimation();
        } else {
          this.phase = phase.DECAYED;
        }
      } else {
        if (this.flyAnimation != undefined)
          this.flyAnimation();
        else
          this.defaultFlyAnimation();
      }

      pop();
    }
  }
}
