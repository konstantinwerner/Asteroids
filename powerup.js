const regex = /[\$][\[](\d+)[\]][\.](\w*)/g;

function Powerup(name, p, v, h, shape, size, ttl, changes)
{
  this.pos = createVector(p.x, p.y);
  this.vel = createVector(v.x, v.y);
  this.heading = h;

  this.shape = shape;
  this.size = size;
  this.ttl = ttl;
  this.changes = changes;

  this.age = 0;
  this.hasHit = false;

  // Replace variable placeholders with values
  var found = getMatches(name, regex);
  if (found.length > 0)
  {
    var replacement = this.changes[found[1]][found[2]];
    this.name = name.replace(found[0], "" + replacement);
  }
  else
    this.name = name;
}

Powerup.prototype =
{
  isDecayed: function()
  {
    return ((this.age > this.ttl) || (this.hasHit));
  },

  applyTo: function(universe)
  {
    //TODO: Add temporary effects

    for (var p = 0; p < this.changes.length; ++p)
    {
      var obj = index(universe, this.changes[p].obj);

      if (obj[this.changes[p].property] != undefined)
      {
        if (this.changes[p].type == "set")
        {
          obj[this.changes[p].property] = this.changes[p].value;
          continue;
        }

        if (this.changes[p].type == "add")
        {
          obj[this.changes[p].property] += this.changes[p].value;
          continue;
        }

        if (this.changes[p].type == "sub")
        {
          obj[this.changes[p].property] -= this.changes[p].value;
          continue;
        }

        if (this.changes[p].type == "mul")
        {
          obj[this.changes[p].property] *= this.changes[p].value;
          continue;
        }

        if (this.changes[p].type == "div")
        {
          obj[this.changes[p].property] /= this.changes[p].value;
          continue;
        }
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

      var fade = 55 + 200 * (1 - (this.age / this.ttl));

      noFill();
      stroke(fade);
      strokeWeight(1);

      if (this.shape)
      {
        beginShape();

        for (var i = 0; i < this.shape.length; ++i)
          vertex(this.shape[i].x, this.shape[i].y);

        endShape(CLOSE);
      }

      noStroke();
      fill(fade);
      textSize(10);
      textAlign(CENTER, CENTER);
      text(this.name, 0, 12);
      pop();
    }
  }
}
