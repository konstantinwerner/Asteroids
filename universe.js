function Universe()
{
  this.version = "v3.0";

  // Get or generate GUID
  this.guid = getCookie("asteroids_guid");
  if (!this.guid)
    this.guid = guid();

  // The Players Ship
  this.ship = undefined;
  // Array of other Objects (PowerUps, Ammo, etc.)
  this.powerups = [];
  // Array of Moving Projectiles
  this.projectiles = [];
  // Array of Asteroids
  this.asteroids = [];

  // Possible PowerUps
  this.availablePowerUps = [
    { chance: 3, obj: ShieldPowerup },
    { chance: 3, obj: LaserPowerup },
    { chance: 2, obj: PlasmaBombPowerup },
    { chance: 10, obj: PointsPowerup },
  ];

  // State of the Universe
  state = { INITALIZING: -1, PLAYING : 0, PAUSED: 1, WON: 2, LOST: 3 };
  this.state = state.INITALIZING;

  // Highscores
  this.highscore = new Highscore();
  this.highscoreSent = false;
}

Universe.prototype =
{
  create: function()
  {
    this.highscoreSent = false;
    this.highscore.hide();
    document.title = "Asteroids " + this.version;

    var s = state.INITALIZING;
    var pilotName = getCookie("asteroids_pilotName");

    if (pilotName == "" || pilotName == undefined)
    {
      select("#nameInput").elt.style.visibility = "visible";
    } else {
      s = state.PLAYING;
    }

    this.ship = new Ship(pilotName);
    this.powerups = [];
    this.projectiles = [];
    this.asteroids = [];

    // Adjust number of Asteroids to Screenarea
    var noOfAsteroids = width * height / 120000;
    for (var a = 0; a < noOfAsteroids; ++a)
      this.asteroids.push(new Asteroid);

    this.state = s;
  },

  setPilotName: function(event)
  {
    if (event == undefined || event.keyCode === 13)
    {
      var name = select("#pilotName").elt.value;

      // Build the expiration date string
      var expiration_date = new Date();
      expiration_date.setFullYear(expiration_date.getFullYear() + 1);

      document.cookie = "asteroids_pilotName=" + name + "; path=/; expires=" + expiration_date.toUTCString();
      document.cookie = "asteroids_guid=" + this.guid + "; path=/; expires=" + expiration_date.toUTCString();

      this.ship.setPilotName(name);

      select("#nameInput").elt.style.visibility = "hidden";

      this.state = state.PLAYING;
    }
  },

  keyPressed: function(key)
  {
    //console.log("v " + key);

    switch (key)
    {
    case 80: this.pause(); return true;               // Pause
    case 82: this.create(); return true;              // New Game
    case 78: this.ship.cycleWeapon(+1); return true;  // Next Weapon
    case 32: this.ship.fire(true); return true;       // Fire Weapon
    }

    return true;
  },

  keyReleased: function(key)
  {
    //console.log("^ " + key);

    switch (key)
    {
    case 32: this.ship.fire(false); return true;
    }
  },

  keyDown: function()
  {
    // Handle Userinputs
    if (this.state == state.PLAYING)
      this.ship.keyDown();
  },

  pause: function()
  {
    if (this.state == state.PLAYING)
    {
      this.state = state.PAUSED;
      document.title = "Asteroids " + this.version + " [PAUSED]";
      this.highscore.show();
    }
    else if (this.state == state.PAUSED)
    {
      this.state = state.PLAYING;
      document.title = "Asteroids " + this.version;
      this.highscore.hide();
    }
  },

  dropPowerup: function(asteroid)
  {
    for (var p = 0; p < this.availablePowerUps.length; ++p)
    {
      if (random(100) < this.availablePowerUps[p].chance)
      {
        this.powerups.push(
          new this.availablePowerUps[p].obj(asteroid.pos, asteroid.vel.mult(0.25), asteroid.heading));

        break; // Do not drop more than one powerup at once
      }
    }
  },

  collide: function()
  {
    // Only check collisions if state.PLAYING
    if (this.state == state.PLAYING)
    {
      // Powerup-Ship Collisions
      for (var p = this.powerups.length-1; p >= 0; --p)
      {
        if (this.ship.isHitBy(this.powerups[p].pos, this.powerups[p].size))
        {
          this.powerups[p].applyTo(this);
        }
      }

      // Check all Asteroids for Collisions
      for (var a = this.asteroids.length-1; a >= 0; --a)
      {
        // Asteroid-Ship Collisions
        if (this.ship.isHitBy(this.asteroids[a].pos, this.asteroids[a].size))
        {
          this.ship.hit(this.asteroids[a].size);
        }

        // Projectile-Asteroid Collisions
        for (var p = this.projectiles.length-1; p >= 0; --p)
        {
          if (!this.projectiles[p].hasHit &&
              this.asteroids[a].isHitBy(this.projectiles[p].pos))
          {
            // Get new Asteroids from the destroyed one
            this.asteroids = this.asteroids.
                            concat(this.asteroids[a].breakup(this.projectiles[p].power));

            // Set hasHit to render hit effect
            this.projectiles[p].hasHit = true;

            // Increase Score
            this.ship.score += floor(this.asteroids[a].maxsize / this.asteroids[a].size * 10);
            this.ship.asteroidsDestroyed++;

            this.dropPowerup(this.asteroids[a]);

            // Remove destroyed asteroid
            this.asteroids.splice(a, 1);
            break;
          }
        }
      }

      // Update Gamestate
      this.updateState();
    }
  },

  updateState: function()
  {
    if (this.asteroids.length == 0)
      this.state = state.WON;

    if (this.ship.shield <= 0)
      this.state = state.LOST;

    if (!this.highscoreSent &&
        (this.state == state.WON ||
         this.state == state.LOST))
    {
      var highscore = {
        guid: this.guid,
        timestamp: (new Date()).getTime(),
        name: this.ship.pilot,
        score: this.ship.score,
        hits: this.ship.asteroidsDestroyed,
        shots: this.ship.projectilesFired,
        duration: this.ship.timeSurvived(),
        frames: this.ship.age
      };

      this.highscore.send(highscore);  // Writes new entry asynchronously to file
      this.highscore.load();
      this.highscore.show();

      this.highscoreSent = true;
    }
  },

  update: function()
  {
    // Handle keyDown
    this.keyDown();

    // Handle Collisions only if playing
    if (this.state == state.PLAYING)
      this.collide();

    // Update Asteroids if not state.PAUSED
    if (this.state != state.PAUSED && this.state != state.INITALIZING)
    {
      for (var i = 0; i < this.asteroids.length; ++i)
        this.asteroids[i].update();
    }

    // Update Objects, Projectiles and Ship only if state.PLAYING
    if (this.state == state.PLAYING)
    {
      for (var i = 0; i < this.powerups.length; ++i)
      {
        this.powerups[i].update();

        // If this Powerup has decayed remove it
        if (this.powerups[i].isDecayed())
          this.powerups.splice(i, 1);
      }

      // Get Projectiles fired by the Ship
      this.projectiles = this.projectiles.concat(this.ship.getProjectiles());
      // Clear the projectiles stored by the ship
      this.ship.clearProjectiles();

      for (var i = this.projectiles.length-1; i >= 0; --i)
      {
          this.projectiles[i].update();

          // If this Projectile has decayed remove it
          if (this.projectiles[i].isDecayed())
            this.projectiles.splice(i, 1);
      }

      this.ship.update();
    }
  },

  render: function()
  {
    // Always render Asteroids
    for (var i = 0; i < this.asteroids.length; ++i)
      this.asteroids[i].render();

    // Show highscores
    this.highscore.render();

    // Render Objects, Projectiles and Ship only if state.PLAYING or state.PAUSED
    if (this.state == state.PLAYING || this.state == state.PAUSED)
    {
      for (var i = 0; i < this.powerups.length; ++i)
        this.powerups[i].render();

      for (var i = 0; i < this.projectiles.length; ++i)
          this.projectiles[i].render();

      this.ship.render();

      push();

      textFont("Courier");
      textStyle(BOLD);
      fill(255);
      noStroke();

      // Show Score
      textAlign(LEFT, CENTER);
      textSize(25);
      text(this.ship.pilot, 20, 25);
      textSize(20);
      text("Score: " + this.ship.score, 20, 50);
      text("Shots: " + this.ship.projectilesFired, 20, 70);
      text("Hits : " + this.ship.asteroidsDestroyed, 20, 90);

      // Show Help Text
      textAlign(CENTER, CENTER);
      textSize(15);
      text("[r] New Game    [p] Pause Game / Show Highscore    [n] Cycle Weapon    [Arrows] Move Ship    [Space] Fire Weapon",
      width/2, height-20);

      pop();
      if (this.state == state.PAUSED)
      {
       // Show Paused Message
       push();
       textFont("Courier");
       textAlign(CENTER, CENTER);
       textStyle(BOLD);
       fill(255);
       stroke(0);
       strokeWeight(3);

       textSize(50);
       text("Paused", width/2, height/2);

       textSize(20);
       text("Press [p] to resume.", width/2, height/2+50);
       pop();
       // Nothing dynamic to render -> stop drawing
       //noLoop();
     }
    } else if (this.state == state.LOST)
    {
      // Show GameOver Message
      push();
      textFont("Courier");
      textAlign(CENTER, CENTER);
      textStyle(BOLD);
      fill(255);
      stroke(0);
      strokeWeight(3);

      textSize(50);
      text("GAME OVER!", width/2, height/2-50);

      textSize(25);
      text("Score: " + this.ship.score, width/2, height/2 );

      textSize(20);
      text("Press [r] to try again.", width/2, height/2 + 50);
      pop();
    } else if (this.state == state.WON)
    {
      // Show Win Message
      push();
      textFont("Courier");
      textAlign(CENTER, CENTER);
      textStyle(BOLD);
      fill(255);
      noStroke();

      textSize(50);
      text("You win " + ship.score + " points!", width/2, height/2);

      textSize(20);
      text("Press [r] to play again.", width/2, height/2+50);
      pop();
      // Nothing dynamic to render -> stop drawing
      //noLoop();
    }
  }
}
