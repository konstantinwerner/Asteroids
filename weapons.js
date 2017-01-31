function Laser()
{
  this.shape = [];
  this.beam  = [
    {x: -5, y: 0},
    {x: +5, y: 0}
  ];

  Weapon.call(this, "Laser", 100, 100, 0.1, this.shape, 1, 30, 0, 0, 10, this.beam);
}

Laser.prototype = Object.create(Weapon.prototype);

//------------------------------------------------------------------------------

function ProtonGun()
{
  this.shape = [];
  this.beam  = [
    {x: -5, y:  0},
    {x:  0, y: +5},
    {x: +5, y:  0},
    {x:  0, y: -5},
  ];

  Weapon.call(this, "Proton Gun", 10, 10, 0.01, this.shape, 3, 15, 0.25, 5, 40, this.beam);
}

ProtonGun.prototype = Object.create(Weapon.prototype);

ProtonGun.prototype.hitAnimation = function(frame)
{
  noFill();
  stroke(255);
  strokeWeight(1);
  scale(frame / 2);
  rotate(frame/5 * TWO_PI + this.heading * PI / 180);
}
