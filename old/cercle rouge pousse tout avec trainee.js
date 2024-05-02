let circles = [];
let trail = [];

let trail_new,trail_old,trail_ref;
let maj_x, maj_y, maj_vec = 0;

let v0,v1;
let new_angle;

const r = 25;
const r_trail = 10;
const long_trail = 25;

function setup() {
  createCanvas(500, 500);

  noStroke();
  frameRate(68);

  trail_new = new CirclePousse(0, 0);
  trail_old = new CirclePousse(0, 0);
  trail_ref = new CirclePousse(0, 0);
  v0 = createVector(1,0);
  v1 = createVector(1,0);
}

function draw() {
  background(0,128,255);

  if (circles.length < 100){
    addCircles(1);
  }

  for (let c of circles) {
    c.draw();
  }

  // Les cercles qui se touchent arretent de grandir
  stopExistingCircles();
 
  // On trie la liste des cercles par rapport à la distance avec la souris du plus proche au plus loin
  ReorderCircle();

  // Chaque cercle se pousse du plus proche au plus loin
  BillardCircle();

  // On dessine ensuite le cercle et la trainée :
  drawCirclePousse();
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
  circle_mouse.r = r;

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
  circle_mouse.r = r;

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

function drawCirclePousse(){
  // On enregistre les anciennes positions par où le cercle est passé
trail_old = trail_new;
trail.push(trail_old);

// On dessine les premiers éléments de la trainée
if (trail.length > long_trail) {
trail.shift();
}


trail_new = new CirclePousse(mouseX, mouseY);

// Comme il y a 64 frames par seconde, les coordonnées sont enregistrée trop vite pour pouvoir calculer une nouvelle direction entre l'ancienne et la nouvelle position
// On attend donc qu'un certain nombre de coordonnées soient calculées avant de calculer une direction
maj_x = trail_old.x-trail_new.x;
maj_y = trail_old.y-trail_new.y;
maj_vec = abs(maj_x) + abs(maj_y) + maj_vec;

if (maj_vec > 5){
  // Une fois qu'on est certain que le cercle a bougé, on met à jour la direction (et donc un angle)
  v1 = createVector(trail_new.x - trail_ref.x,trail_new.y - trail_ref.y);
  new_angle = v0.angleBetween(v1) + PI/2;

  maj_vec = 0;
  trail_ref = trail_new;
}
trail_new.angle = new_angle;

// Enfin, on trace d'abords la trainée et le cercle par dessus.
for (let i = 0; i < trail.length; i++) {
  let p = trail[i];
  p.draw_trail();
}
trail_new.draw_circle();
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

class CirclePousse {
  constructor(x, y) {
    this.x = x;
    this.y = y; 
    this.angle = 0;

  }

  draw_circle() {
    push;
    fill("red");
    noStroke();
    circle(this.x, this.y, r * 2);
    pop;
  }

  draw_trail() {
    push;
    fill("white");
    noStroke();
    circle(this.x + r*cos(this.angle), this.y + r*sin(this.angle), r_trail);
    circle(this.x - r*cos(this.angle), this.y - r*sin(this.angle), r_trail);
    pop;
  }
}