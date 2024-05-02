// Déclaration des paramètres des nénuphars
let circles = [];
const water_color = "#0080FF";
let c; // variable permettant d'appliquer la couleur de l'eau là ou c'est nécessaire (autour de la grenouille notamment)

// Déclaration des paramètres de la trainée
let trail = [];

const r_trail = 10; // Rayon des points constituant la trainée
const long_trail = 25; // Nombre de points constituant la trainée

let v0,v1;
let new_angle;

let trail_new,trail_old,trail_ref;
let maj_x, maj_y, maj_vec = 0;

// Importation des fichiers audios
let soundFile;
let isPlaying = false;
let list_sound;
let random_sound_frog;

// déclaration des paramètres de la grenouille
let frog; 
const d = 50; // taille de la grenouille
const r = d/2; // rayon facilitant les calculs

function preload() {
  // Charger le fichier audio
  frog_sound_1 = loadSound('la mare aux milles merveilles/utils/frog/son/frog_1.mp3');
  frog_sound_2 = loadSound('la mare aux milles merveilles/utils/frog/son/frog_2.mp3');
  frog_sound_3 = loadSound('la mare aux milles merveilles/utils/frog/son/frog_3.mp3');
  // frog_sound_4 = loadSound('la mare aux milles merveilles/utils/frog/son/frog_4.mp3');
  // frog_sound_5 = loadSound('la mare aux milles merveilles/utils/frog/son/frog_5.mp3');

  frog_head = loadImage('la mare aux milles merveilles/utils/frog/head/head_frog1.png');

  frog = new Frog();
  
}

function setup() {
  list_sound = [frog_sound_1, frog_sound_2,frog_sound_3];
  let canvas = createCanvas(500, 500);

  noStroke();
  frameRate(68);

  c = color(water_color);

  trail_new = new CirclePousse(0, 0);
  trail_old = new CirclePousse(0, 0);
  trail_ref = new CirclePousse(0, 0);
  v0 = createVector(1,0);
  v1 = createVector(1,0);

  // Attacher un gestionnaire d'événements de clic au canvas
  canvas.mousePressed(toggle);
}

function draw() {
  // background(0,128,255);
  background(c);

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

  // On dessine ensuite la grenouille ET la trainée :
  drawFrog();
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
  circle_mouse.r = d/2;

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
  circle_mouse.r = d/2;

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

function drawFrog(){
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
frog.angle = new_angle;


// Enfin, on trace d'abords la grenouille puis la trainée par dessus.
frog.draw();

for (let i = 0; i < trail.length; i++) {
  let p = trail[i];
  p.draw_trail();
}


// trail_new.draw_circle();
}

function toggle(){
  frog.isOutOfWater = true;
  random_sound_frog = Math.floor(Math.random() * list_sound.length);
  list_sound[random_sound_frog].play();

}

function displayImage(){
  if(isPoping){
    imageMode(CENTER);
    image(frog_head, mouseX,mouseY);
  }
}
 
class Circle {
  constructor(x, y) {
    this.x = x;
    this.y = y; 
    this.r = 1;

    this.angle = random(TWO_PI);
    this.angle_length = random(PI/8,PI/3);
    this.hauteur_encoche = random(0.2,0.7);
    
    this.isGrowing = true;
    this.color = color(0, random(30,255), 0);

    this.n_veine = floor(random(10,18));
    this.start_veine = this.angle + this.angle_length/2;
    this.ecart_veine = TWO_PI/this.n_veine;
    this.col_veine = color(0,green(this.color)-30, 0);
  }

  draw() {
    // on dessine la base du nenuphar
    push();
    fill(this.color);
    stroke(this.col_veine);
    arc(this.x,this.y,this.r*2,this.r*2,this.angle+this.angle_length,this.angle);
    pop();

   

    // On bouche la petite encoche
    var xStartAngle = this.r*cos(this.angle);
    var yStartAngle = this.r*sin(this.angle);

    var xStopAngle = this.r*cos(this.angle + this.angle_length);
    var yStopAngle = this.r*sin(this.angle + this.angle_length);

    var xInterAngle = this.r*cos(this.angle+this.angle_length/2)*this.hauteur_encoche;
    var yInterAngle = this.r*sin(this.angle+this.angle_length/2)*this.hauteur_encoche;

   
    push();
    translate(this.x,this.y);
    fill(this.color);
    stroke(this.color);
    beginShape();
    vertex(xStartAngle,yStartAngle);
    vertex(xInterAngle,yInterAngle);
    vertex(xStopAngle,yStopAngle);
    vertex(0,0);
    endShape();
    pop();

    push();
    translate(this.x,this.y);
    stroke(this.col_veine);
    line(xStartAngle,yStartAngle,xInterAngle,yInterAngle);
    line(xStopAngle,yStopAngle,xInterAngle,yInterAngle);
    pop();


    // On rajoute les veines
    push();
    var modif_i = 0;
    stroke(this.col_veine);
    translate(this.x,this.y);
    line(0,0,xInterAngle,yInterAngle);
    if(this.ecart_veine < this.angle_length/2){
      modif_i = 1;
    }
    for (let i = 1+modif_i; i < this.n_veine-modif_i ; i++) {
      line(0,0,this.r*cos(this.start_veine + i*this.ecart_veine),this.r*sin(this.start_veine + i*this.ecart_veine));
    }
    pop();

    if(this.isGrowing){
      this.r += .1;
    }
  }

  overlaps(otherCircle){
    return dist(this.x, this.y, otherCircle.x, otherCircle.y) < this.r + otherCircle.r;
  }
 
}

class CirclePousse {
  constructor(x, y) {
    this.x = x;
    this.y = y; 
    this.angle = 0;

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

class Frog {
  constructor() {

    this.size = d; // taille de la tete de la grenouille
    this.image = frog_head; // modele de la tete
    this.d_circle = 0; // a quel point la tete est hors de l'eau
    this.isOutOfWater = false; // est-ce que la grenouille fait une sortie ?
    this.isComing = true; // est-ce que la grenouille est en train de sortir de l'eau ou de rentrer dans l'eau?
    this.speed = 1.2; // vitesse de sortie de la grenouille
    this.angle = 0; // Orientation de la grenouille
  }

  draw() {
    if (this.isOutOfWater){
    // On dessine la tête de la grenouille en entière
    push();
    translate(mouseX, mouseY);
    rotate(this.angle);
    imageMode(CENTER);
    this.image.resize(this.size,this.size);
    image(this.image,0,0);
    pop();

    // On dessine par dessus un anneau avec des traits plus ou moins épais afin de faire semblant qu'on ne voit pas toute la tête de la grenouille
    push();
    noFill();
    stroke(c);
    strokeWeight((this.size - this.d_circle)/2);
    circle(mouseX,mouseY,(this.size-(this.size-this.d_circle)/2));
    pop();

    // la grenouille sort ou rentre petit à petit de l'eau

    if (this.isComing){this.d_circle += this.speed};
    if (!this.isComing){this.d_circle -= this.speed};

    // Quand la grenouille n'est pas sortie, on trace juste de l'eau normal

  } else {
    push();
    fill(c);
    circle(mouseX,mouseY,this.size);
    pop();
  }


  // Une fois la grenouille totalement hors de l'eau, elle doit rerentrer
  if(this.d_circle > this.size){
    this.isComing = false;
  }
  if(this.d_circle < 0){
    this.d_circle = 0;
    this.isComing = true;
    this.isOutOfWater = false;
  }
  }
}