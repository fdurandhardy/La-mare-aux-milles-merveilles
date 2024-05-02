let x,y,fleur;
const frameRate = 60;
// Pour dessiner la fleur de lotus, l'idée est de se placer dans un polygone inscrit dans un cercle.
// Les feuilles partiront de chaque coté de ce polygone régulier.

function setup() {
  createCanvas(600, 600);
  x = width/2;
  y = height/2;

  fleur = new fleur_lotus(x,y,100,"white",8);
  }

function draw() {
  background(0, 0, 0, 100);
  fleur.draw();
}

class fleur_lotus{
  constructor(x,y,taille_nenuphar,couleur,n_feuille){
    // Informations sur le nénuphar
    this.x = x;
    this.y = y;
    this.taille_nenuphar = taille_nenuphar;
      
    // Informations sur les pétales quand elles seront finies
    this.n_feuille = n_feuille;
    this.orientation = random(TWO_PI);
    this.translate_orientation = TWO_PI/this.n_feuille;
    this.couleur = couleur;
    this.taille_max = 0.7*this.taille_nenuphar;
    this.n_couche = ceil(this.taille_max/20);
    this.d_coeur = 0.1*this.taille_nenuphar;

    this.liste_rayon_petale = [];
    this.liste_longueur_petale = [];

    for(let i=0;i<this.n_couche;i++){
      this.liste_rayon_petale.push((this.n_couche-i)*this.taille_max/this.n_couche);
      this.liste_longueur_petale.push((this.n_couche-(i+1))*this.taille_max/(this.n_couche-1));
    }

    // Informations sur les pétales à l'instant t
  this.taille_actuelle = 0;
  this.d_coeur_actuel = 0;

  // Vitesse de croissance
  this.liste_start_grow = [0,0.2,0.6,0.8];
  this.isGrowing = true;
  this.time_before_max_reach = 5; // temps avant que la fleur atteigne sa taille maximale en seconde
  this.speed_grow = this.taille_max/(this.time_before_max_reach*frameRate);
    // this.liste_couleur = "white";


  }

  draw_couche(rayon_petale,longueur_petale,decalage_orientation,couleur){
    // La largeur d'une pétale doit faire la même longueur qu'un coté du polynome
    let largeur_petale = (this.d_coeur_actuel/2 + rayon_petale)*sin(this.translate_orientation/2);

    // On rempli la fleur qui se trouve autour du coeur du lotus (la partie ronde à la base des pétales)
  push();
  translate(this.x,this.y);
  stroke(couleur);
  noFill()
  strokeWeight(rayon_petale);
  circle(0,0,rayon_petale+this.d_coeur_actuel);
  pop();

    // On trace les pétales une à une
  for (let i = 0; i< this.n_feuille;i++){
    push();
    translate(this.x,this.y);
    rotate(this.orientation + (decalage_orientation*this.translate_orientation) + this.translate_orientation*i);
     
    // Pour plus de simplicité, on se place à une hauteur de l'apothème du polygone inscrit
    translate(0,(rayon_petale+this.d_coeur_actuel/2)*cos(this.translate_orientation/2));
  
    stroke("green");
    fill(couleur);
    // noFill();
    // 1er cote feuille
    beginShape();
    curveVertex(largeur_petale,-longueur_petale);
    curveVertex(largeur_petale,0);
    curveVertex(0,longueur_petale);
    curveVertex(-largeur_petale,longueur_petale);
    endShape();
  
    // 2eme cote feuille
    beginShape();
    curveVertex(-largeur_petale,-longueur_petale);
    curveVertex(-largeur_petale,0);
    curveVertex(0,longueur_petale);
    curveVertex(largeur_petale,longueur_petale);
    endShape();
  
    // Intérieur des feuilles
    noStroke();
    beginShape();
    vertex(-largeur_petale,0);
    vertex(0,longueur_petale);
    vertex(largeur_petale,0);
    endShape();
  
    pop();
    }
  }

  // On trace les couches une à une puis on met à jour les attributs de l'objet
  draw(){

    for (let j = 0; j< this.n_couche;j++){
      let rayon_petale_t = map(this.taille_actuelle,0,this.taille_max,0,this.liste_rayon_petale[j]);
      let longueur_petale_t = map(this.taille_actuelle,0,this.taille_max,0,this.liste_longueur_petale[j]);
      let decalage_orientation_t = (sin(HALF_PI*j)**2)/2;

      // let rayon_petale_t = map(this.taille_actuelle/this.taille_max,this.liste_start_grow[j],1,0,this.liste_rayon_petale[j],true);
      // let longueur_petale_t = map(this.taille_actuelle/this.taille_max,this.liste_start_grow[j],1,0,this.liste_longueur_petale[j],true);

      
      this.draw_couche(rayon_petale_t,longueur_petale_t,decalage_orientation_t,"white");
    }

    // On finit par tracer le coeur de la fleur
    push();
    translate(this.x,this.y);
    noStroke();
    fill("red");
    circle(0,0,this.d_coeur_actuel);
    pop();

    if (this.taille_actuelle >= this.taille_max){
      this.isGrowing = false;
    }
    if(this.isGrowing){
      this.taille_actuelle = this.taille_actuelle + this.speed_grow;
      this.d_coeur_actuel = map(this.taille_actuelle,0,this.taille_max,0,this.d_coeur)
    }


  }
  
}