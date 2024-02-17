class Square{
    constructor(x, y, tamanioX, tamanioX, cForma) {
        this.x = x;
        this.y = y;
        this.sizeX = tamanioX;
        this.colorSquare = cForma;
        let options = {
            friction: 1,
            restitution: 1
        }
        this.body = Bodies.rectangle(this.x, this.y, this.sizeX, this.sizeX,  options);
        Composite.add(world, this.body);
    }

    show() {
        let pos = this.body.position;
        let angle = this.body.angle;
        push();
        translate(pos.x, pos.y);
        rotate(angle);
        rectMode(CENTER);
        strokeWeight(7)
        stroke(0,0,0,255);
        fill(this.colorSquare);
        rect(0,0, this.sizeX, this.sizeX);
        pop();
    }

    bottomShow() {
        let pos = this.body.position;
        let angle = this.body.angle;
        push();
        translate(pos.x, pos.y);
        rotate(angle);
        rectMode(CENTER);
        noStroke();
        fill (color('#D8CEAD'));
        rect(0,0, this.sizeX+40, this.sizeX+40 );
        pop();
      }

      
}

