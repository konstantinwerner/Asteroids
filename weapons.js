function LaserProjectile()
{
  // TODO: Move to prototype
  var shape  = [
    {x: -5, y: 0},
    {x: +5, y: 0}
  ];

  Projectile.call(this,
                  0, 0, 0,
                  shape,
 /*Power*/        1,
 /*TTL*/          38,
 /*HitFrames*/    0,
 /*HitAnimation*/ undefined);
}
LaserProjectile.prototype = Object.create(Projectile.prototype);

function Laser()
{
  var shape = [];

  Weapon.call(this,
  /*Name*/        "Laser",
  /*MaxCharge*/    100,
  /*Charge*/       100,
  /*Refill*/       0.1,
  /*Shape*/        this.shape,
  /*Proj.Speed*/   30,
  /*Proj.Inertia*/ 0,
                   new LaserProjectile);
}
Laser.prototype = Object.create(Weapon.prototype);

//------------------------------------------------------------------------------

function ProtonGunProjectile()
{
  // TODO: Move to prototype
  var shape  = [
    {x: -5, y:  0},
    {x:  0, y: +5},
    {x: +5, y:  0},
    {x:  0, y: -5},
  ];

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

  };

  Projectile.call(this,
                  0, 0, 0,
                  shape,
 /*Power*/        3,
 /*TTL*/          60,
 /*HitFrames*/    5,
 /*HitAnimation*/ hitAnimation);
}
ProtonGunProjectile.prototype = Object.create(Projectile.prototype);

function ProtonGun()
{
  var shape = [];

  Weapon.call(this,
  /*Name*/        "Proton Gun",
  /*MaxCharge*/    10,
  /*Charge*/       10,
  /*Refill*/       0.01,
  /*Shape*/        this.shape,
  /*Proj.Speed*/   10,
  /*Proj.Inertia*/ 0.25,
                   new ProtonGunProjectile);
}
ProtonGun.prototype = Object.create(Weapon.prototype);

//------------------------------------------------------------------------------

function PlasmaBombProjectile()
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

  var hitAnimation = function(frame)
  {
    noFill();
    stroke(255);
    strokeWeight(2);
    ellipse(0, 0, 8*frame);
    ellipse(0, 0, 2*frame);
    ellipse(0, 0, frame*frame);
  };

  Projectile.call(this,
                  0, 0, 0,
                  shape,
 /*Power*/        5,
 /*TTL*/          200,
 /*HitFrames*/    10,
 /*HitAnimation*/ hitAnimation);
}
PlasmaBombProjectile.prototype = Object.create(Projectile.prototype);

function PlasmaBomb()
{
  var shape = [];

  Weapon.call(this,
  /*Name*/        "Plasma Bombs",
  /*MaxCharge*/    5,
  /*Charge*/       5,
  /*Refill*/       0.002,
  /*Shape*/        this.shape,
  /*Proj.Speed*/   0,
  /*Proj.Inertia*/ 0.0,
                   new PlasmaBombProjectile);
}
PlasmaBomb.prototype = Object.create(Weapon.prototype);
