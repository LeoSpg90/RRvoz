class Caminante{

    constructor(){
        
        this.saltar();
        this.diam = random(15, 40);

        this.vel = 3;
        this.dir = radians(random(360));

        this.elColor = color(random(255), random(255), random(255) );
    }

    //-----------------------------------------------

    actualizar(amplitud){

        this.diam = map(amplitud, AMP_MIN, AMP_MAX, 15, 50 ); // mapeamos el valor de amp de entrada al diámetro del caminante
        this.vel = map(amplitud, AMP_MIN, AMP_MAX, 1, 25 ); // lo mismo hacemos con la velocidad
    }
    //-----------------------------------------------
    saltar(){
        this.x = random(windowWidth);
        this.y = random(windowHeight);
        //this.elColor = color(random(255), random(255), random(255) );
    }
    
    //-----------------------------------------------
    cambiarTamanio(tam){
        this.diam = tam;
    }

    //-----------------------------------------------
    cambiarColor(){
        this.elColor = color(random(255), random(255), random(255) );
    }
    //-----------------------------------------------
    mover(){

        this.dir += radians(random(-5, 5));

        this.x = this.x + this.vel * cos(this.dir);
        this.y = this.y + this.vel * sin(this.dir);

        //--------Espacio toroidal---

        this.x = this.x > windowWidth ? this.x - windowWidth :  this.x;
        this.x = this.x < 0 ? this.x + windowWidth : this.x;

        this.y = this.y > windowHeight ? this.y - windowHeight :  this.y;
        this.y = this.y < 0 ? this.y + windowHeight : this.y;
    }
    //-----------------------------------------------
    dibujar(){
  
        push();
        noStroke();
        fill(this.elColor)
        ellipse(this.x, this.y, this.diam, this.diam);
        pop();
    }
}