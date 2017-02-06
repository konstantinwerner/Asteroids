function PointsPowerup(p, v, h)
{
  var shape = [
    {x: -5, y:  -5},
    {x: -5, y:  +5},
    {x: +5, y:  -5},
    {x: +5, y:  +5}
  ];

  var changes = [
    { obj: "ship", property: "score", type: "add", value: (round(random(1,5))*5) } // Add Extrapoints
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
    { obj: "ship", property: "shield", type: "set", value: 100 } // Set Shield to 100%
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
    { obj: "ship.weapons[0]", property: "charge", type: "set", value: 100 } // Set Laser Charge to 100%
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
