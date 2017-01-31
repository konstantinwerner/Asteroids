function Projectile(p, v, h, shape, power, ttl, hitframes, hitAnimation)
{
  this.shape = shape;

  this.pos = createVector(p.x, p.y);
  this.vel = createVector(v.x, v.y);
  this.heading = h;

  this.ttl = ttl;
  this.power = power;
  this.age = 0;

  this.hasHit = false;
  this.hitAnimation = hitAnimation;
  this.hitFrames = hitframes;
  this.hitFrame = 0;
}

Projectile.prototype =
{
  getCopy: function(p, v, h)
  {
    return new Projectile(p, v, h,
                          this.shape,
                          this.power,
                          this.ttl,
                          this.hitFrames,
                          this.hitAnimation);
  },

  isDecayed: function()
  {
    if (this.hitFrames == 0)
      return ((this.age > this.ttl) || (this.hasHit));
    else
      return ((this.age > this.ttl) || (this.hitFrame > this.hitFrames));
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

      if (this.hasHit)
      {
        if (this.hitAnimation != undefined)
          this.hitAnimation(this.hitFrame);
      } else {
        noFill();
        stroke(255 * (1-(this.age / this.ttl)));
        strokeWeight(1);

        rotate(this.heading * PI / 180);

        if (this.shape)
        {
          beginShape();

          for (var i = 0; i < this.shape.length; ++i)
            vertex(this.shape[i].x, this.shape[i].y);

          endShape(CLOSE);
        }
      }

      pop();
    }
  }
}
