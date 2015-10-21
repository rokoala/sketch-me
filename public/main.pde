/* @pjs preload="Octocat.png"; */

int w = 500;
int h = 500;
int max = w*h;
var iteration = 0;
int j = 0;
int fr = 0;
backPixels = [];

PImage loadedImg;

void setup() {
  size(w,h)
  loadedImg = loadImage("Octocat.png");

  smooth();
  strokeWeight(1);

  image(loadedImg, 0, 0,w,h);
  loadPixels();

  frameRate(10000);
  background(255);
}

int getRandomX(){
  des = random(-15,15);
  nextX = j + des;
  return ceil(nextX);
}

int getRandomY(){
  des = (random(-15,15) * width);
  nextY = j + des;
  return ceil(nextY);
}

int getX(){
  return j % width;
}

int getY(value){
  return ceil(value / width);
}

boolean checkValid(v1,v2,v3){
  if( pixels[v1] < -1 && pixels[v2] < -1 && pixels[v3] < -1){
    stroke(pixels[v1]);
    return true;
  }else{
    return false;
  }
}

void draw(){

  j = random(0,max);

  currentY = getY(j);
  currentX = getX();

  x1 = getRandomX();

  dx1 = getRandomX();
  dy1 = getRandomY();


  stroke(0, 0, 0);

  if(checkValid(x1,dx1,dy1)){
    if(iteration <= 5000){
        fill(255,0);
        bezier(getX(x1) + random(-50,50), currentY, currentX, currentY, getX(dx1)+random(-50,50), getY(dy1)+random(-50,50),currentX+random(-50,50), currentY);
    }else if(iteration > 5000){
        bezier(getX(x1) + random(-15,15), currentY, currentX, currentY, getX(dx1)+random(-20,20), getY(dy1)+random(-20,20),currentX+random(-15,15), currentY);
    }else if(iteration > 7500){
        bezier(getX(x1) + random(-10,10), currentY, currentX, currentY, getX(dx1)+random(-10,10), getY(dy1)+random(-5,5),currentX+random(-5,5), currentY);
    }else if(iteration > 10000){
        fill(pixels[x1]);
        bezier(getX(x1) + random(-3,3), currentY, currentX, currentY, getX(dx1)+random(-3,3), getY(dy1)+random(-3,3),currentX+random(-3,3), currentY);
    }
  }

  iteration++;
  if(iteration > 50000)
    noLoop();
}
