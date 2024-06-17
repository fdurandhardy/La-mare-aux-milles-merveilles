class tapis_nenuphar{
    constructor(n_nenuphar){
        this.nenuphar_max = n_nenuphar;
        this.n_nenuphar_pop = 0;
        this.liste_nenuphar = [];
    }

    Overlaps(nenupharOne,nenupharTwo){
        return dist(nenupharOne.x, nenupharOne.y, nenupharTwo.x, nenupharTwo.y) < nenupharOne.r + nenupharTwo.r;
    }

    newNenupharOverlaps(newNenuphar){
        for (let i = 0; i < this.n_nenuphar_pop; i++) {
            if(this.Overlaps(newNenuphar,this.liste_nenuphar[i])){
                return true;
            }
          }
          return false;
    }

    addNenuphar(amount) {
        if(this.n_nenuphar_pop < this.nenuphar_max){
            for (let i = 0; i < amount; i++) {
            let newNenuph = new nenuphar(random(width), random(height));
            if (!this.newNenupharOverlaps(newNenuph) & this.n_nenuphar_pop < this.nenuphar_max) {
                this.liste_nenuphar.push(newNenuph);
                this.n_nenuphar_pop += 1;
            }
            }
        }
      }

      Reorder(){
        let grenouille = new nenuphar(mouseX,mouseY);
        grenouille.r = width_frog/2;
        
      
      // Permet de trier la liste des cercles en fonction de la distance à la grenouille
        let ListNenupharDistance =[]
      
        for (let i = 0; i < this.n_nenuphar_pop; i++) {
          let objet_temp = {
            "distance" : dist(grenouille.x, grenouille.y, this.liste_nenuphar[i].x, this.liste_nenuphar[i].y),
            "indice" : i
          };
          ListNenupharDistance.push(objet_temp);
        }
        ListNenupharDistance.sort((a,b) => a.distance - b.distance);
        let ListNenupharSorted = [];
        
      
        for (let i = 0; i < this.n_nenuphar_pop; i++) {
        let j = ListNenupharDistance[i].indice;
        ListNenupharSorted.push(this.liste_nenuphar[j]);
        // ListNenupharSorted[i] = this.liste_nenuphar[j];
        }
        this.liste_nenuphar = ListNenupharSorted;
      }

      Push(nenupharPusher,nenupharPushed){
        let x_temp = (nenupharPushed.x - nenupharPusher.x)*(nenupharPusher.r + nenupharPushed.r) / dist(nenupharPushed.x, nenupharPushed.y, nenupharPusher.x, nenupharPusher.y) + nenupharPusher.x;
        let y_temp = (nenupharPushed.y - nenupharPusher.y)*(nenupharPusher.r + nenupharPushed.r) / dist(nenupharPushed.x, nenupharPushed.y, nenupharPusher.x, nenupharPusher.y) + nenupharPusher.y;
    
        nenupharPushed.x = x_temp;
        nenupharPushed.y = y_temp;
      }

      Billard(){
        let grenouille = new nenuphar(mouseX,mouseY);
        grenouille.r = width_frog/2;
      
        for (let i = 0; i < this.n_nenuphar_pop - 1; i++) {
          let nenupharOne = this.liste_nenuphar[i];
      
          if(this.Overlaps(grenouille,nenupharOne)){
            this.Push(grenouille,nenupharOne);
          }
      
          for (let j = i + 1; j < this.n_nenuphar_pop; j++) {
            let nenupharTwo = this.liste_nenuphar[j];
      
            if(this.Overlaps(nenupharOne,nenupharTwo)){
                this.Push(nenupharOne,nenupharTwo);
            }
          }
        }
      }

      StopGrowing(){
        for (let i = 0; i < this.n_nenuphar_pop - 1; i++) {
            for (let j = i + 1; j < this.n_nenuphar_pop; j++) {
              if(this.Overlaps(this.liste_nenuphar[i],this.liste_nenuphar[j])){
                this.liste_nenuphar[i].isGrowing = false;
                this.liste_nenuphar[j].isGrowing = false;
        
                this.liste_nenuphar[i].isBlooming = true;
                this.liste_nenuphar[j].isBlooming = true;
              }
            }
        
          }
      }

      draw(){
        this.StopGrowing();
        this.Reorder();
        this.Billard();
        for (let i = 0; i < this.n_nenuphar_pop; i++) {
            this.liste_nenuphar[i].draw();
        }
      }
}