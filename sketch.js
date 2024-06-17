function setup() {
  list_sound = [frog_sound_1, frog_sound_2,frog_sound_3];
  let canvas = createCanvas(850, 550);
  noStroke();

  c = color(water_color);
  dir_frog = createVector(0,1);

  // fleur = new fleur_lotus(width/2,height/2,100,"white");
  // fleur.pourcentage_blooming = 1;
  // fleur.d_coeur_actuel = fleur.d_coeur;
  // fleur.n_couche = 1;
  // fleur.orientation = 0;

  tapis = new tapis_nenuphar(10);

  // Attacher un gestionnaire d'événements de clic au canvas
  canvas.mousePressed(toggle);

  }

function draw() {
  // background(0, 0, 0, 100);
  background(c);
  // fleur.draw();
  tapis.addNenuphar(1);
  tapis.draw();
  frog.draw();
}