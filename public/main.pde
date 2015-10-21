/* @pjs preload="me.jpg"; */
int w = 500;
int h = 500;
int j = 0;
int fr = 0;
backPixels = [];

PImage loadedImg;

void setup() {
  size(w,h)
  loadedImg = loadImage("me.jpg");

  image(loadedImg, 0, 0,w,h);
  filter(THRESHOLD,0.35);
  loadPixels();
  frameRate(50);
  background(255);
}

int getRandomX(){
  des = random(-20,10);
  nextX = des;
  return nextX;
}

int getRandomY(){
  des = random(-25,10);
  nextY = des;
  return nextY;
}

int getX(){

}

int getY(value){
  return (value / 20);
}

void draw(){
  j++;
  currentY = getY(j);
  currentX = j - currentY;
  fill(255,0);

  bezier(getRandomX(currentX), getRandomY(currentY), currentX, currentY, getRandomX(currentX), getRandomY(currentY), getRandomX(currentX), getRandomY(currentY));
  stroke(0, 0, 0);

}
