let circles = [];
let trail = [];

function setup() {
  createCanvas(500, 500);
}

function draw() {
  background(0,128,255);

  if (circles.length < 1000){
    addCircles(1);
  }

  for (let c of circles) {
    c.draw();
  }

  stopExistingCircles();
 
  ReorderCircle();
 
  BillardCircle();
 
  push();
  noFill();
  stroke("red");
  strokeWeight(2);
  circle(mouseX, mouseY, 50);
  pop();
}
    
function pushCircles(CirclePusher,CirclePushed){

      let x_temp = (CirclePushed.x - CirclePusher.x)*(CirclePusher.r + CirclePushed.r + 1) / dist(CirclePushed.x, CirclePushed.y, CirclePusher.x, CirclePusher.y) + CirclePusher.x;
      let y_temp = (CirclePushed.y - CirclePusher.y)*(CirclePusher.r + CirclePushed.r + 1) / dist(CirclePushed.x, CirclePushed.y, CirclePusher.x, CirclePusher.y) + CirclePusher.y;

      CirclePushed.x = x_temp;
      CirclePushed.y = y_temp;
    }

function addCircles(amount) {
  for (let i = 0; i < amount; i++) {
    let newCircle = new Circle(random(width), random(height));
    if (!newCircleOverlaps(newCircle)) {
      circles.push(newCircle);
    }
  }
}

function newCircleOverlaps(newCircle) {
  for (let otherCircle of circles) {
    if (newCircle.overlaps(otherCircle)) {
      return true;
    }
  }
  return false;
}

function ReorderCircle(){
  let circle_mouse = new Circle(mouseX,mouseY);
  circle_mouse.r = 50/2;

// Permet de trier la liste des cercles en fonction de la distance à la souris
  let circles_distance =[]

  for (i = 0; i < circles.length; i++) {
    objet_temp = {
      "distance" : dist(circle_mouse.x, circle_mouse.y, circles[i].x, circles[i].y),
      "indice" : i
    };
    circles_distance.push(objet_temp);
  }
  circles_distance.sort((a,b) => a.distance - b.distance);
  let new_circle = [];

  for (i = 0; i < circles.length; i++) {
  let j = circles_distance[i].indice;
  new_circle[i] = circles[j];
  }
  circles = new_circle;
}

function BillardCircle(){
  let circle_mouse = new Circle(mouseX,mouseY);
  circle_mouse.r = 50/2;

  for (let i = 0; i < circles.length - 1; i++) {
    let circleOne = circles[i];

    if(circle_mouse.overlaps(circleOne)){
      pushCircles(circle_mouse,circleOne);
    }

    for (let j = i + 1; j < circles.length; j++) {
      let circleTwo = circles[j];

      if(circleOne.overlaps(circleTwo)){
        pushCircles(circleOne,circleTwo);
      }
    }
  }
}

function stopExistingCircles(){
  for (let i = 0; i < circles.length - 1; i++) {
    let circleOne = circles[i];
    for (let j = i + 1; j < circles.length; j++) {
      let circleTwo = circles[j];

      if(circleOne.overlaps(circleTwo)){
        circleOne.isGrowing = false;
        circleTwo.isGrowing = false;
      }
    }

  }
} 
 
class Circle {
  constructor(x, y) {
    this.x = x;
    this.y = y; 
    this.r = 1;
    this.isGrowing = true;
    this.color = color(0, random(255), 0);
  }

  draw() {
    fill(this.color);
    circle(this.x, this.y, this.r * 2);

    if(this.isGrowing){
      this.r += .1;
    }
  }

  overlaps(otherCircle){
    return dist(this.x, this.y, otherCircle.x, otherCircle.y)
      < this.r + otherCircle.r;
  }
}