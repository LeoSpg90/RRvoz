class Triangle{
    constructor(x, y, s , r, cTriangle) {
        this.x = x;
        this.y = y;
        this.size = s;
        this.size = r;
        this.colorTriangle = cTriangle;
        let options = {
            friction: 1,
            restitution: 0.5
        }
        this.body = Bodies.polygon(x, y, sides, radius, [options])
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
        stroke(0, 0, 0, 255);
        fill(this.colorTriangle);
        triangle(0, 0, this.size*2);
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
        triang(0, 0, this.size);
        pop();
  }

      
}

