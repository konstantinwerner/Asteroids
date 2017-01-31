function Gauge(name, x, y, d, min, max)
{
  this.name = name;
  this.pos = createVector(x, y);
  this.d = d;

  this.min = min;
  this.max = max;
}

Gauge.prototype =
{
  render: function(p)
  {
    push();
    translate(this.pos.x, this.pos.y);

    p = constrain(p, this.min, this.max);
    var v = map(p, this.min, this.max, 0, 1);

    // Background
    fill(0);
    ellipse(0, 0, this.d);

    if (v > 0)
    {
      // Procentual Arc
      fill(255);
      arc(0, 0, this.d, this.d, 3*PI/4, 3*PI/4 + 6*PI/4 * v, PIE);
    }

    // Inner Circle
    fill(0);
    ellipse(0, 0, this.d * 0.8);

    fill(255);
    textFont("Courier");
    textStyle(BOLD);
    textAlign(CENTER, CENTER);

    // Inner Text
    textSize(20);
    text(ceil(v*100) + "%", 0, 0);

    // Name
    textSize(18);
    text(this.name, 0, this.d/2 + 10);

    pop();
  }
}
