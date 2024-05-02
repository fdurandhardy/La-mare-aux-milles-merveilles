
let list_veinure = [];

function setup() {
  createCanvas(300, 300);
  noStroke();

  nenuphar = new Circle(width/2,height/2);
  nenuphar.r = 75;
  nenuphar.isGrowing = false;
  }

function draw() {
  background(0, 0, 0, 100);
  nenuphar.draw();
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
    arc(this.x,this.y,this.x,this.y,this.angle+this.angle_length,this.angle);
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