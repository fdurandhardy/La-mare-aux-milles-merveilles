class fleur_lotus{
  constructor(x,y,taille_nenuphar,couleur){
    // Informations sur le nénuphar
    this.x = x;
    this.y = y;
    this.taille_nenuphar = taille_nenuphar;
    
      
    // Informations sur les pétales quand elles seront finies
    this.n_feuille = floor(random(12,20));
    this.orientation = random(TWO_PI);
    this.translate_orientation = TWO_PI/this.n_feuille;
    this.couleur = couleur;
    this.taille_max = random(0.6,1)*this.taille_nenuphar/2;
    // this.n_couche = max(3,min(4,floor(this.taille_max/10)));
    this.n_couche = 4;
    this.d_coeur = 0.1*this.taille_nenuphar;

    // this.liste_rayon_petale = [0];
    // this.liste_longueur_petale = [random(0.1,0.2)];
    // this.liste_start_grow = [0];

    // config 1
    // this.liste_rayon_petale = [0.6,0.3,0.1,0];
    // this.liste_longueur_petale = [0.3,0.2,0.1,0.05];
    // this.liste_start_grow = [0,0.2,0.4,0.8];

    // config 2
    this.liste_rayon_petale = [0.5,0.4,0.1,0];
    this.liste_longueur_petale = [0.4,0.3,0.2,0.1];
    this.liste_start_grow = [0,0.2,0.4,0.8];
    // let tot = 1-this.liste_longueur_petale[0];

    // for(let i=1;i<this.n_couche;i++){

    //   this.liste_rayon_petale.push(this.liste_longueur_petale[i-1] - random(0.1));
    //   this.liste_longueur_petale.push(tot/(this.n_couche-i));
    //   this.liste_start_grow.push(i/this.n_couche);
    //   tot = tot - this.liste_rayon_petale[i];
    // }
    // this.liste_rayon_petale.reverse();
    // this.liste_longueur_petale.reverse();

    // console.log("r");
    // console.log(this.liste_rayon_petale);
    // console.log("long");
    // console.log(this.liste_longueur_petale);

    // Informations sur les pétales à l'instant t
    this.pourcentage_blooming = 0;
    this.d_coeur_actuel = map(this.pourcentage_blooming,0,1,0,this.d_coeur,true); // nécessaire pour le calcul de hauteur

  // Vitesse de croissance
  this.isGrowing = true;
  this.time_before_max_reach = time_before_complete_bloom; // temps avant que la fleur atteigne sa taille maximale en seconde
  this.speed_grow = 1/(this.time_before_max_reach*Const_frameRate);
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
    let apotheme = (rayon_petale+this.d_coeur_actuel/2)*cos(this.translate_orientation/2);
    translate(0,apotheme);
  
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

    push();
    translate(this.x,this.y);
    rotate(this.orientation + (decalage_orientation*this.translate_orientation) + this.translate_orientation*i);
    stroke("green");
    // rainure de la feuille
    line(0,0,-largeur_petale,apotheme);
    pop();
    }
  }

  // On trace les couches une à une puis
  draw(){

    for (let j = 0; j< this.n_couche;j++){
      let rayon_petale_t = map(this.pourcentage_blooming,this.liste_start_grow[j],1,0,this.liste_rayon_petale[j]*this.taille_max,true);
      let longueur_petale_t = map(this.pourcentage_blooming,this.liste_start_grow[j],1,0,this.liste_longueur_petale[j]*this.taille_max,true);
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

    this.update();

    
    
  }

  update(){

    
    if(this.isGrowing){
      this.pourcentage_blooming += this.speed_grow;
      

      if (this.pourcentage_blooming >= 1){
        this.pourcentage_blooming = 1;
        this.isGrowing = false;
      }

      this.d_coeur_actuel = map(this.pourcentage_blooming,0,1,0,this.d_coeur,true);

    }
  }
  
}