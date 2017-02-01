function Universe()
{
  // The Players Ship
  this.ship = {};
  // Array of other Objects (PowerUps, Ammo, etc.)
  this.powerups = [];
  // Array of Moving Projectiles
  this.projectiles = [];
  // Array of Asteroids
  this.asteroids = [];

  // State of the Universe
  state = { INITALIZING: -1, PLAYING : 0, PAUSED: 1, WON: 2, LOST: 3 };
  this.state = state.INITALIZING;
}

Universe.prototype =
{
  create: function()
  {
    this.ship = new Ship();
    this.objects = [];
    this.projectiles = [];
    this.asteroids = [];

    // Adjust number of Asteroids to Screenarea
    var noOfAsteroids = width * height / 100000;
    for (var a = 0; a < noOfAsteroids; ++a)
      this.asteroids.push(new Asteroid);

    this.state = state.PLAYING;
  },

  keyPressed: function(key)
  {
    console.log(key);

    switch (key)
    {
    case 80: this.pause(); return false;   // Pause
    case 82: this.create(); return false;  // New Game
    case 78: this.ship.cycleWeapon(+1); return false; // Next Weapon
    case 32:
      this.projectiles = this.projectiles.concat(this.ship.fire());
    return false;
    }

    return true;
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
      document.title = "Asteroids [PAUSED]";
    }
    else if (this.state == state.PAUSED)
    {
      this.state = state.PLAYING;
      document.title = "Asteroids";
    }
  },

  collide: function()
  {
    // Only check collisions if state.PLAYING
    if (this.state == state.PLAYING)
    {
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

            // Remove destroyed asteroid
            this.asteroids.splice(a, 1);
            break;
          }
        }
      }

      // Update Gamestate
      if (this.asteroids.length == 0)
        this.state = state.WON;

      if (this.ship.shield <= 0)
        this.state = state.LOST;
    }
  },

  update: function()
  {
    // Update Asteroids if not state.PAUSED
    if (this.state != state.PAUSED)
    {
      for (var i = 0; i < this.asteroids.length; ++i)
        this.asteroids[i].update();
    }

    // Update Objects, Projectiles and Ship only if state.PLAYING
    if (this.state == state.PLAYING)
    {
      for (var i = 0; i < this.objects.length; ++i)
        this.objects[i].update();

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

    // Render Objects, Projectiles and Ship only if state.PLAYING or state.PAUSED
    if (this.state == state.PLAYING || this.state == state.PAUSED)
    {
      for (var i = 0; i < this.objects.length; ++i)
        this.objects[i].render();

      for (var i = 0; i < this.projectiles.length; ++i)
          this.projectiles[i].render();

      this.ship.render();


      push();

      textFont("Courier");
      textAlign(CENTER, CENTER);
      textStyle(BOLD);
      fill(255);
      noStroke();

      // Show Score
      textSize(20);
      text(this.ship.score, width/2, 30);

      // Show Help Text
      textSize(15);
      text("[r] New Game    [p] Pause Game    [n] Cycle Weapon    [Arrows] Move Ship    [Space] Fire Weapon",
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
