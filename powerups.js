function PointsPowerup(p, v, h)
{
  var shape = [
    {x: -5, y:  -5},
    {x: -5, y:  +5},
    {x: +5, y:  -5},
    {x: +5, y:  +5}
  ];

  var changes = [
    // Add Extrapoints
    { obj: "ship", property: "score", type: "add", value: (round(random(1,5))*5), duration: 0 }
  ];

  Powerup.call(this,
               "$[0].value Points",
               p, v, h,
               shape,
               10,
   /*TTL*/     50,
               changes);
}

PointsPowerup.prototype = Object.create(Powerup.prototype);

//------------------------------------------------------------------------------

function ShieldPowerup(p, v, h)
{
  var shape = [
    {x:  0, y: -10},
    {x: -5, y:  +5},
    {x: +5, y:  +5}
  ];

  var changes = [
    // Set Shield to 100%
    { obj: "ship", property: "shield", type: "set", value: 100, duration: 0 },
    // Double Shield Refill for 500frames
    { obj: "ship", property: "shield_refill", type: "mul", value: 2, duration: 200 },
  ];

  Powerup.call(this,
               "Shield",
               p, v, h,
               shape,
               10,
   /*TTL*/     150,
               changes);
}

ShieldPowerup.prototype = Object.create(Powerup.prototype);

//------------------------------------------------------------------------------

function LaserPowerup(p, v, h)
{
  var shape = [
    {x: -5, y:  -5},
    {x: +5, y:  -5},
    {x: -5, y:  +5},
    {x: +5, y:  +5}
  ];

  var changes = [
    // Set Laser Charge to 100%
    { obj: "ship.weapons[0]", property: "charge", type: "set", value: 100, duration: 0 }
  ];

  Powerup.call(this,
               "Laser",
               p, v, h,
               shape,
               10,
   /*TTL*/     150,
               changes);
}

LaserPowerup.prototype = Object.create(Powerup.prototype);
