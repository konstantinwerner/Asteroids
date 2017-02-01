function ShieldPowerup(p, v, h)
{
  var shape = [
    {x:  0, y: -10},
    {x: -5, y:  +5},
    {x: +5, y:  +5}
  ];

  var changes = [
    { property: "shield", type: "set", value: 100 } // Set Shield to 100%
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
