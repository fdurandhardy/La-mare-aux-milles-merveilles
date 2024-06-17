///////////////////////////////////////////////////
// PARAMETRES GENERAUX
///////////////////////////////////////////////////

const Const_frameRate  = 60; // frame par seconde

// Couleur de la mare
let c;
const water_color = "#0080FF"; 

let tapis;

///////////////////////////////////////////////////
// NENUPHAR
///////////////////////////////////////////////////
// Paramètres nénuphar
const rSpeed_nenuph = .1;
// Paramètres de la fleur de lotus
let fleur;
const length_couche = 10;
const time_before_complete_bloom = 1;
let chance_fleur = 0.8;
let taille_min_fleur = 0;


// Importation des fichiers audios
let soundFile;
let isPlaying = false;
let list_sound;
let random_sound_frog;

///////////////////////////////////////////////////
// GRENOUILLE
///////////////////////////////////////////////////
// déclaration des paramètres de la grenouille
let frog;

let dir_frog; // Vecteur de direction de la grenouille

// Mise à jour de l'orientation de la grenouille
let majx_dir_frog = 0;
let majy_dir_frog = 0;
const maj_dir_frog = 5; // fréquence de mise à jour

// Ancien point de coordonnées sur lequel se trouvait la grenouille
// permet de déterminer l'orientation de la grenouille
let xRef_dir_frog = 0;
let yRef_dir_frog = 0;
const width_frog = 50;

const long_trail = 25; // Nombre de points constituant la trainée

const rStart_Sidetrail = 10; // Rayon des points sur le coté constituant la trainée
const rSpeed_Sidetrail = -rStart_Sidetrail/long_trail; // Vitesse à laquelle le rayon des points sur le coté de la trainée diminue

const rSpeed_Maintrail = -width_frog/long_trail; // Vitesse à laquelle le rayon des points principaux de la trainée diminue


function preload() {
  // Charger le fichier audio
  frog_sound_1 = loadSound('old/utils/frog/son/frog_1.mp3');
  frog_sound_2 = loadSound('old/utils/frog/son/frog_2.mp3');
  frog_sound_3 = loadSound('old/utils/frog/son/frog_3.mp3');
  // frog_sound_4 = loadSound('la mare aux milles merveilles/utils/frog/son/frog_4.mp3');
  // frog_sound_5 = loadSound('la mare aux milles merveilles/utils/frog/son/frog_5.mp3');

  frog_head = loadImage('old/utils/frog/head/head_frog1.png');

  frog = new Frog();
  
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