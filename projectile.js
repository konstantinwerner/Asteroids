function Projectile(p, v, h, shape, power, ttl, flyAnimation, hitAnimation)
{
  this.shape = shape;

  this.pos = createVector(p.x, p.y);
  this.vel = createVector(v.x, v.y);
  this.heading = h;

  this.ttl = ttl;
  this.power = power;
  this.age = 0;

  this.flyAnimation = flyAnimation;
  this.hitAnimation = hitAnimation;

  this.hitFrame = 0;
  this.hasHit = false;
  this.hitEnd = false;
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
    stroke(255 * (1-(this.age / this.ttl)));
    strokeWeight(1);

    if (this.shape)
    {
      beginShape();

      for (var i = 0; i < this.shape.length; ++i)
        vertex(this.shape[i].x, this.shape[i].y);

      endShape(CLOSE);
    }
  },

  getCopy: function(p, v, h)
  {
    return new Projectile(p, v, h,
                          this.shape,
                          this.power,
                          this.ttl,
                          this.flyAnimation,
                          this.hitAnimation);
  },

  isDecayed: function()
  {
    return ((this.age > this.ttl) || (this.hitEnd));
  },

  update: function()
  {
    if (this.hasHit)
    {
        this.hitFrame++;
    } else {
      this.age++;

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
    if (this.age < this.ttl)
    {
      push();

      translate(this.pos.x, this.pos.y);
      rotate(this.heading * PI / 180);

      if (this.hasHit)
      {
        if (this.hitAnimation != undefined)
          this.hitEnd = this.hitAnimation(this.hitFrame);
        else
          this.hitEnd = this.defaultHitAnimation();
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
