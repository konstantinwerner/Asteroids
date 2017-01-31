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

}

function draw()
{
  background(0);

  universe.keyDown();
  universe.collide();
  universe.update();
  universe.render();
}