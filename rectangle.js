class Rectangle{
    constructor(x, y, tamanioX, tamanioY, cForma) {
        this.x = x;
        this.y = y;
        this.sizeX = tamanioX;
        this.sizeY = tamanioY;
        this.colorRect = cForma;
        let options = {
            friction: 1,
            restitution: 1
        }
        this.body = Bodies.rectangle(this.x, this.y, this.sizeX, this.sizeY, options);
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
        fill(this.colorRect);

        rect(0,0, this.sizeX, this.sizeY);

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
        rect(0,0, this.sizeX+40, this.sizeY+40);
        pop();
      }

      
}

