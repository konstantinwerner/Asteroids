var universe;

function reset()
{
  universe.create();
}

function setup()
{
  frameRate(25);
  //noCursor();

  createCanvas(windowWidth, windowHeight);

  universe = new Universe;
  universe.create();
}

function keyPressed()
{
  return universe.keyPressed(keyCode);
}

function keyReleased()
{
  return universe.keyReleased(keyCode);
}

function draw()
{
  background(0);

  universe.update();
  universe.render();
}
