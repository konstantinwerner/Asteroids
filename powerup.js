function Powerup(name, p, v, h, shape, size, ttl, changes)
{
  this.name = name;

  this.pos = createVector(p.x, p.y);
  this.vel = createVector(v.x, v.y);
  this.heading = h;

  this.shape = shape;
  this.size = size;
  this.ttl = ttl;
  this.changes = changes;

  this.age = 0;
  this.hasHit = false;
}

Powerup.prototype =
{
  isDecayed: function()
  {
    return ((this.age > this.ttl) || (this.hasHit));
  },

  applyTo: function(ship)
  {
    for (var p = 0; p < this.changes.length; ++p)
    {
      if (ship[this.changes[p].property] != undefined)
      {
        // TODO: Make Array-properies changeable

        if (this.changes[p].type == "set")
          ship[this.changes[p].property] = this.changes[p].value;

        if (this.changes[p].type == "add")
            ship[this.changes[p].property] += this.changes[p].value;

        if (this.changes[p].type == "sub")
            ship[this.changes[p].property] -= this.changes[p].value;

        if (this.changes[p].type == "mul")
            ship[this.changes[p].property] *= this.changes[p].value;

        if (this.changes[p].type == "div")
            ship[this.changes[p].property] /= this.changes[p].value;
      }
    }

    this.hasHit = true;
  },

  update: function()
  {
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
  },

  render: function()
  {
    if (this.age < this.ttl)
    {
      push();

      translate(this.pos.x, this.pos.y);
      rotate(this.heading * PI / 180);

      noFill();
      stroke(55 + 200 * (1 - (this.age / this.ttl)));
      strokeWeight(1);

      if (this.shape)
      {
        beginShape();

        for (var i = 0; i < this.shape.length; ++i)
          vertex(this.shape[i].x, this.shape[i].y);

        endShape(CLOSE);
      }

      pop();
    }
  }
}
