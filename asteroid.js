function Asteroid(p, v, s)
{
  this.color = random(200, 255);

  this.maxsize = round(min(height, width) / 10);
  this.minsize = round(this.maxsize / 2);
  this.size = s || random(this.minsize, this.maxsize);

  if (v)
    this.vel = v.copy();
  else
    this.vel = createVector(random(-3, 3), random(-3, 3));

  if (p)
    this.pos = p.copy();
  else
    this.pos = createVector(random(width), random(height));

  this.angle = random(360);
  this.omega = random(-3, 3);

  this.vertex = [];
  this.createShape();
}

Asteroid.prototype =
{
  createShape: function()
  {
    var nr = round(random(6, 15));

    for (v = 0; v < nr; ++v)
    {
      var r = random(0.6, 1);

      var a = map(v, 0, nr, 0, TWO_PI);

      var x = this.size * r * cos(a);
      var y = this.size * r * sin(a);

      this.vertex.push(createVector(x, y));
    }
  },

  isHitBy: function(pos)
  {
    return collidePointPoly(pos.x - this.pos.x, pos.y - this.pos.y, this.vertex);
/*
    var d = dist(pos.x, pos.y, this.pos.x, this.pos.y);
    return (d < this.size);
*/
  },

  breakup: function(power)
  {
    var chunks = [];

    // If big enough to split up
    if ((this.size / random(0.5, power)) > this.minsize)
    {
      var maxsplits = ceil(this.size / this.minsize);
      var splits = ceil(random(2, maxsplits));
      var f = 1.4 * this.size / splits;
      var a_offset = random(0, TWO_PI);

      for (var c = 0; c < splits; c++)
      {
        var a = a_offset + TWO_PI * c / splits;

        // Create Positions of chunks radially from old Asteroid center
        var p_offset = createVector(f * cos(a), f* sin(a));

        // Create Velocity offset outward
        var v = random(1, 3);
        var v_offset = createVector(v * cos(a), v * sin(a));

        chunks.push(new Asteroid(this.pos.add(p_offset), v_offset.add(this.vel), f));
      }
    } else {
      // Add new Asteroid off screen with a 25% chance
      if (chance(0.25))
      {
        var p = createVector(random(width), -this.maxsize);
        chunks.push(new Asteroid(p));
      }
    }

    return chunks;
  },

  update: function()
  {
    // Move
    this.pos.add(this.vel);

    // Rotate
    this.angle += this.omega;

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
      push();

      noFill();
      stroke(this.color);
      translate(this.pos.x, this.pos.y);
      rotate(this.angle * PI / 180);

      beginShape();
      for (v = 0; v < this.vertex.length; ++v)
          vertex(this.vertex[v].x, this.vertex[v].y);
      endShape(CLOSE);

      pop();
  }
}
