class Frog {
    constructor() {
      this.size = width_frog; // taille de la tete de la grenouille
      this.image = frog_head; // modele de la tete
      this.d_flaque = 0; // a quel point la tete est hors de l'eau
      this.isOutOfWater = false; // est-ce que la grenouille fait une sortie ?
      this.isComing = true; // est-ce que la grenouille est en train de sortir de l'eau ou de rentrer dans l'eau?
      this.speed = 1.2; // vitesse de sortie de la grenouille
      this.angle = 0; // Orientation de la grenouille

      this.trail = new trail(long_trail); // On créé l'objet trainée qui suivra la grenouille
    }
    
    draw() {
      // On commence par tracer la trainée principale. La tête de la grenouille passera par dessus pour un meilleur effet.
      this.trail.draw_main();

      // On regarde si la grenouille est hors de l'eau ou dans l'eau
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
      strokeWeight((this.size - this.d_flaque)/2);
      circle(mouseX,mouseY,(this.size-(this.size-this.d_flaque)/2));
      pop();
   
    
      // Quand la grenouille n'est pas sortie, on trace juste de l'eau normal
    } else {
      push();
      fill(c);
      circle(mouseX,mouseY,this.size);
      pop();
    }

    // On finit par rajouter la trainée sur le coté
    this.trail.draw_side();
   
    // On met à jour les informations de la grenouille
    this.update();
    }

    update(){
      // On commence par mettre à jour l'orientation de la grenouille

      // Comme il y a 64 frames par seconde, les coordonnées sont enregistrée trop vite pour pouvoir calculer une nouvelle direction entre l'ancienne et la nouvelle position
      // On attend donc qu'un certain nombre de coordonnées soient calculées avant de calculer une direction
      if(this.trail.liste_trail.length > 1){
        majx_dir_frog += abs(this.trail.liste_trail[this.trail.liste_trail.length-1].Centerx - mouseX);
        majy_dir_frog += abs(this.trail.liste_trail[this.trail.liste_trail.length-1].Centery - mouseY);
        if(majx_dir_frog + majy_dir_frog > maj_dir_frog){
          majx_dir_frog = 0;
          majy_dir_frog = 0;

          dir_frog = createVector(xRef_dir_frog-mouseX,yRef_dir_frog-mouseY);
          xRef_dir_frog = mouseX;
          yRef_dir_frog = mouseY;
          this.angle = createVector(0,1).angleBetween(dir_frog);
          
        }
      }

      // On met à jour la trainée de la grenouille
      this.trail.add(new trail_point(mouseX,mouseY,this.angle,rStart_Sidetrail,width_frog));

      // On vérifie si la grenouille est en train de rentrer ou de sortir sa tête de l'eau
      // On met à jour la taille de la flaque qui recouvre la tête en fonction
      if (this.isComing){this.d_flaque += this.speed};
      if (!this.isComing){this.d_flaque -= this.speed};

      if(this.d_flaque > this.size){
        this.isComing = false;
      }
      if(this.d_flaque < 0){
        this.d_flaque = 0;
        this.isComing = true;
        this.isOutOfWater = false;
      }
 
    }
  }