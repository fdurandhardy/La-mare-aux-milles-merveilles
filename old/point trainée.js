let trail_new = new p5.Vector(100, 100);
let trail_old = new p5.Vector(150, 150);
let coord_vec = new p5.Vector(0, 0);
let vecteur_cote = new p5.Vector(0, 0);

let trail_cote_droit = [];
let trail_cote_gauche = [];
let point_cote_droit = new p5.Vector(0, 0);
let point_cote_gauche = new p5.Vector(0, 0);

const size = 50;
const long_trait = 100;

function setup() {
createCanvas(300, 300);
noStroke();
}

function draw() {
background(50);
  
push;  
stroke("blue");
circle(trail_new.x, trail_new.y, size);
pop;
  
push; 
stroke("green");
circle(trail_old.x, trail_old.y, size);
pop;

coord_vec.x = trail_new.x - trail_old.x;
coord_vec.y = trail_new.y - trail_old.y;

vecteur_cote.y = sqrt((coord_vec.x**2)/(coord_vec.y**2 + coord_vec.x**2)*((size)*1/2)**2);
vecteur_cote.x = -(coord_vec.y*vecteur_cote.y)/coord_vec.x;

point_cote_droit.x = vecteur_cote.x + trail_new.x;
point_cote_droit.y = vecteur_cote.y + trail_new.y;

point_cote_gauche.x = -vecteur_cote.x + trail_new.x;
point_cote_gauche.y = -vecteur_cote.y + trail_new.y;
  
console.log(dist(point_cote_droit.x,point_cote_droit.y,trail_new.x, trail_new.y));

push;
stroke("red");
circle(point_cote_droit.x, point_cote_droit.y, 5);
circle(point_cote_gauche.x, point_cote_gauche.y, 5);
line(trail_old.x,trail_old.y,trail_old.x+coord_vec.x,trail_old.y+coord_vec.y);
line(point_cote_droit.x,point_cote_droit.y,trail_new.x, trail_new.y);
pop;
}