function Highscore()
{
  this.data = undefined;

  this.loaded = false;
  this.visible = false;

  this.display = false;

  this.lasttime = millis();

  // Add HTML to dom
  /*
  select("body").elt.innerHTML += `<div id="highscore" style="visibility: hidden;">
    <h1>HIGHSCORES</h1>
    <h2 id="gameCount">x Games played</h2>
    <table id="highscoreTable">
      <thead>
      <tr>
        <th></th><th>Name</th><th>Score</th><th>Shots</th><th>Hits</th>
      </tr>
      </thead>
      <tbody>
      </tbody>
    </table>
  </div>
  `;
  */
}

Highscore.prototype =
{
    show: function()
    {
      this.lasttime = millis();
      this.load();

      this.display = true;
      select("#highscore").elt.style.visibility = "visible";
    },

    hide: function()
    {
      this.display = false;
      select("#highscore").elt.style.visibility = "hidden";
    },

    send: function(newHighscore)
    {
      var highscoreString = JSON.stringify(newHighscore);
      var data = new FormData();
      data.append("highscore", highscoreString);

      var xhr = (window.XMLHttpRequest) ? new XMLHttpRequest() : new activeXObject("Microsoft.XMLHTTP");
      xhr.open('post', 'highscore.php', true);
      xhr.send(data);
    },

    load: function()
    {
      this.loaded = false;
      var self = this;

      // Add Timestamp to bypass caching
      url = "highscore.php?get=highscore&timestamp=" + (new Date()).getTime();

      var xhr = new XMLHttpRequest();
      xhr.overrideMimeType("application/json");
      xhr.onreadystatechange = function ()
      {
        if (xhr.readyState == 4 && xhr.status == "200")
        {
          self.data = JSON.parse(xhr.responseText);
          self.loaded = true;
        }
      };

      xhr.open('GET', url, true);
      xhr.send(null);
    },

    render: function()
    {
      if (this.display == true)
      {
        var thistime = millis();

        if (thistime - this.lasttime > 5000)
        {
          this.load();
          this.lasttime = thistime;
        }

        if (this.loaded == true &&
            this.data != undefined)
        {
          var count = select("#gameCount");
          count.elt.innerHTML = this.data.games_played + " Games played";

          var scores = this.data.scores;
          var table = select("#highscoreTable");
          var body = table.elt.tBodies[0];

          body.innerHTML = "";

          var done = false;

          for (var h = 0; h < scores.length && h < 10; ++h)
          {
            var ratio = round(scores[h].hits / scores[h].shots * 100) / 100.0;

            body.innerHTML += "<tr>" +
                              "<td>" + scores[h].name + "</td>" +
                              "<td>" + scores[h].score + "</td>" +
                              "<td>" + scores[h].hits + "/" + scores[h].shots + " = " + ratio.toFixed(2) + "</td>" +
                              "<td>" + timespan( round(scores[h].frames/25)) + "</td>";
          }
        }
      }
    },

}
