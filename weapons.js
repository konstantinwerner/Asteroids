function LaserProjectile(p, v, h)
{
  // TODO: Move to prototype
  var shape  = [
    {x: -5, y: 0},
    {x: +5, y: 0}
  ];

  var flyAnimation = function()
  {

  };

  var hitAnimation = function(frame)
  {

  };

  Projectile.call(this,
                  p, v, h,
                  shape,
 /*Power*/        1,
 /*TTL*/          15,
                  undefined,
                  undefined);

}
LaserProjectile.prototype = Object.create(Projectile.prototype);

function Laser()
{
  var shape = [];

  Weapon.call(this,
  /*Name*/        "Laser",
  /*Auto Rate*/    3,
  /*MaxCharge*/    100,
  /*Charge*/       100,
  /*Refill*/       0.2,
  /*Shape*/        this.shape,
  /*Proj.Speed*/   35,
  /*Proj.Inertia*/ 0,
                   LaserProjectile);
}
Laser.prototype = Object.create(Weapon.prototype);

//------------------------------------------------------------------------------

function ProtonGunProjectile(p, v, h)
{
  // TODO: Move to prototype
  var shape  = [
    {x: -5, y:  0},
    {x:  0, y: +5},
    {x: +5, y:  0},
    {x:  0, y: -5},
  ];

  var flyAnimation = function()
  {

  };

  var hitAnimation = function(frame)
  {
    noFill();
    stroke(255);
    strokeWeight(1);
    scale(frame / 2);
    rotate(frame/5 * TWO_PI + this.heading * PI / 180);

    beginShape();
    for (var i = 0; i < this.shape.length; ++i)
      vertex(this.shape[i].x, this.shape[i].y);
    endShape(CLOSE);

    return (frame == 5);
  };

  Projectile.call(this,
                  p, v, h,
                  shape,
 /*Power*/        3,
 /*TTL*/          60,
                  undefined,
                  hitAnimation);
}

ProtonGunProjectile.prototype = Object.create(Projectile.prototype);


function ProtonGun()
{
  var shape = [];

  Weapon.call(this,
  /*Name*/        "Proton Gun",
  /*Auto Rate*/    10,
  /*MaxCharge*/    10,
  /*Charge*/       10,
  /*Refill*/       0.01,
  /*Shape*/        this.shape,
  /*Proj.Speed*/   10,
  /*Proj.Inertia*/ 0.25,
                   ProtonGunProjectile);
}
ProtonGun.prototype = Object.create(Weapon.prototype);

//------------------------------------------------------------------------------

function PlasmaBombProjectile(p, v, h)
{
  // TODO: Move to prototype
  var shape  = [
    {x: -5, y: 10},
    {x: +5, y: 10},

    {x: 10, y: +5},
    {x: 10, y: -5},

    {x: +5, y: -10},
    {x: -5, y: -10},

    {x: -10, y: -5},
    {x: -10, y: +5},
  ];

  var flyAnimation = function()
  {

  };

  var hitAnimation = function(frame)
  {
    noFill();
    stroke(255);
    strokeWeight(2);
    ellipse(0, 0, 8*frame);
    ellipse(0, 0, 2*frame);
    ellipse(0, 0, frame*frame);

    return (frame == 6);
  };

  Projectile.call(this,
                  p, v, h,
                  shape,
 /*Power*/        5,
 /*TTL*/          200,
                  undefined,
                  hitAnimation);
}

PlasmaBombProjectile.prototype = Object.create(Projectile.prototype);

function PlasmaBomb()
{
  var shape = [];

  Weapon.call(this,
  /*Name*/        "Plasma Bombs",
  /*Auto Rate*/    0,
  /*MaxCharge*/    5,
  /*Charge*/       5,
  /*Refill*/       0.01,
  /*Shape*/        this.shape,
  /*Proj.Speed*/   0,
  /*Proj.Inertia*/ 0.5,
                   PlasmaBombProjectile);
}
PlasmaBomb.prototype = Object.create(Weapon.prototype);
