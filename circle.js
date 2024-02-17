class Circle{
    constructor(x, y, r, cCircle) {
        this.x = x;
        this.y = y;
        this.size = r;
        this.colorCircle = cCircle;
        let options = {
            friction: 1,
            restitution: 1
        }
        this.body = Bodies.circle(this.x, this.y, this.size,  options);
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
        fill(this.colorCircle);
        ellipse(0, 0, this.size*2);
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
        ellipse(0, 0, this.size*2+40);
        pop();
  }

      
}

