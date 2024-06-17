class trail{
    constructor(taille){
        this.length_max_trail = taille;
        this.liste_trail = [];
    }

    draw_side(){
        for (let i = 0; i < this.liste_trail.length; i++) {
            this.liste_trail[i].draw_side();
          }
    }

    draw_main(){
        for (let i = 0; i < this.liste_trail.length; i++) {
            this.liste_trail[i].draw_main();
          }
    }

    add(trail_point){
        this.liste_trail.push(trail_point);

        if (this.liste_trail.length > this.length_max_trail) {
            this.liste_trail.shift();
            }
        
        for (let i = 0; i < this.liste_trail.length; i++) {
            this.liste_trail[this.liste_trail.length - i - 1].rSide += rSpeed_Sidetrail;
            this.liste_trail[this.liste_trail.length - i - 1].rMain += rSpeed_Maintrail;
        }

    }

}

class trail_point{
    constructor(x,y,angle,rSide,rMain){
        this.Centerx = x;
        this.Centery = y;
        this.angle = angle;
        this.rSide = rSide;
        this.rMain = rMain;

        this.Rightx = x + width_frog/2*cos(angle);
        this.Righty = y + width_frog/2*sin(angle);

        this.Leftx = x - width_frog/2*cos(angle);
        this.Lefty = y - width_frog/2*sin(angle);
    }

    draw_side(){
      push;
      fill("white");
      noStroke();
      circle(this.Leftx,this.Lefty, this.rSide);
      circle(this.Rightx,this.Righty, this.rSide);
      pop;
    }

    draw_main(){
      push;
      fill("white");
      noStroke();
      arc(this.Centerx,this.Centery,this.rMain,this.rMain,this.angle,this.angle+PI); // On ne trace que la moitié du cercle pour que le devant de la grenouille soit vide et ne soit pas blanc
    //   circle(this.Centerx,this.Centery, this.rMain);
      pop;
      }
}