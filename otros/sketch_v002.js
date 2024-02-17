
const { Engine, World, Bodies, Composite } = Matter;
Matter.use('matter-attractors');
let monitorear = false;

let FREC_MIN = 900;
let FREC_MAX = 2000;

let AMP_MIN = 0.01;
let AMP_MAX = 0.4;


let mic;
let pitch;
let audioCotext;

let gestorAmp;
let gestorPitch;

let haySonido; // estado de cómo está el sonido en cada momento
let antesHabiaSonido; // moemoria del estado anterior del sonido

let estado = 0;
let engine;
let world;
let circles = [];
let rectangles = [];
let boundaries = [];
let tamanioX = 100;
let tamanioY = 100;
let bottomLayer;
let cRect;
let cCircle;
let cCirclePrev;
let cRectPrev;
let colores = [];
let coloresDes = [];
let selector = 0;


function setup() {
    createCanvas(800, 800);
    bottomLayer = createGraphics (800,800);
    colores[0] = color(228, 185, 30);
    colores[1] = color(100,255, 100);
    colores[2] = color(79, 133, 184);
    colores[3] = color(3, 207, 252);
    colores[4] = color(150, 38, 124);
    colores[5] = color(200, 2, 16);

    coloresDes[0] = color(228, 185, 30, 30);
    coloresDes[1] = color(100,255, 100, 30);
    coloresDes[2] = color(79, 133, 184, 30);
    coloresDes[3] = color(3, 207, 252, 30);
    coloresDes[4] = color(150, 38, 124, 30);
    coloresDes[5] = color(200, 2, 16, 30);
    
    cCircle = colores[0];
    cRect = colores[2];
    cCirclePrev = coloresDes[0]
    cRectPrev = coloresDes[2];

    for (let i = 0; i < circles.length; i++) {
      circles[i] = new Circle(x, y, tamanioX);
    }

    for (let i = 0; i < rectangles.length; i++) {
        rectangles[i] = new Rectangle(x, y, tamanioX, tamanioY, cRect);
      }
    // create an engine
    engine = Engine.create();
    world = engine.world;
    boundaries.push(new Boundary(width/2, height, width, 20, 0)); //PISO
    boundaries.push(new Boundary(0, height/2, width, 20, PI/2)); //PARED DER
    boundaries.push(new Boundary(width, height/2, width, 20, PI/2)); //PARED IZQ
    boundaries.push(new Boundary(width/2, 0, width, 20, 0)); //TECHO

    world.gravity.scale = 0;

    /*var attractiveBody = Bodies.circle(
      render.options.width / 2,
      render.options.height / 2,
      50, 
      {
      isStatic: true,
  
      // example of an attractor function that 
      // returns a force vector that applies to bodyB
      plugin: {
        attractors: [
          function(bodyA, bodyB) {
            return {
              x: (bodyA.position.x - bodyB.position.x) * 1e-6,
              y: (bodyA.position.y - bodyB.position.y) * 1e-6,
            };
          }
        ]
      }
    });
  
    World.add(world, attractiveBody);
  
    // add some bodies that to be attracted
    for (var i = 0; i < 150; i += 1) {
      var body = Bodies.polygon(
        Common.random(0, render.options.width), 
        Common.random(0, render.options.height),
        Common.random(1, 5),
        Common.random() > 0.9 ? Common.random(15, 25) : Common.random(5, 10)
      );
  
      World.add(world, body);
    }
  */



}
    
function mouseClicked() {
    if (estado === 0 ) { //DIBUJA CIRCULOS
    circles.push(new Circle(mouseX, mouseY, tamanioX/2, cCircle));
    }

    if (estado === 1 ) { //DIBUJA RECTANGULOS
    rectangles.push(new Rectangle(mouseX, mouseY, tamanioX, tamanioY, cRect));
        }
}

function draw() {
    background(233);
    cRect = colores[selector];
    cCircle = colores[selector];
    cCirclePrev = coloresDes[selector];
    cRectPrev = coloresDes[selector];


    //PREVIEW
    if (estado === 0) { 
        stroke(0,0,0,30);
        fill(cCirclePrev);
        ellipse(mouseX, mouseY,tamanioX);
        }

    if (estado === 1) { 
        stroke(0,0,0,30);
        fill(cRectPrev);
        rect (mouseX - tamanioX/2 , mouseY - tamanioX/2, tamanioX, tamanioY);
        }
    
    Engine.update(engine);
    bottomLayer.push();
    for (let i = 0; i < circles.length; i++) {
        circles[i].bottomShow();
    }
    for (let i = 0; i < rectangles.length; i++) {
        rectangles[i].bottomShow();
    }
    bottomLayer.pop();

    for (let i = 0; i < circles.length; i++) {
        circles[i].show();
    }
    for (let i = 0; i < rectangles.length; i++) {
        rectangles[i].show();
    }
    for (let i = 0; i < boundaries.length; i++) {
        boundaries[i].show();
    }
}

// FUNCIONES DE ESTADO; CAMBIA FIGURA
function mouseWheel(event) {
    if (event.deltaY > 0) {
      estado++;
    } else {
      estado--;
    }
    limitar();
  }
  
  function limitar() {
    if (estado > 2) {
      estado = 0;
    }
    else if (estado <0 ){
      estado = 2;
    }
    console.log (estado);
  }

  function keyPressed() {
    /*
    if (keyCode === ENTER) {
      rectangles.pop();
      circles.pop();  
      background(233);
    }
    
      if (key === "w") { // GRAVEDAD HACIA ARRIBA
        engine.gravity.x = 0;
        engine.gravity.y = -1;
        console.log(engine.gravity.x, engine.gravity.y, engine.gravity.scale)
      }
    if (key === "a") { // GRAVEDAD HACIA IZQUIERDA
       engine.gravity.x = -1;
       engine.gravity.y = 0;
       console.log(engine.gravity.x, engine.gravity.y, engine.gravity.scale)
     }
    if (key === 'd') { // GRAVEDAD HACIA DERECHA
       engine.gravity.x = 1;
       engine.gravity.y = 0;
       console.log(engine.gravity.x, engine.gravity.y, engine.gravity.scale)
    }
    if (key === 's') { // GRAVEDAD HACIA ABAJO
        engine.gravity.x = 0;
        engine.gravity.y = 1;
        console.log(engine.gravity.x, engine.gravity.y, engine.gravity.scale)
     } 

     if (key === 'e') { // AUMENTA GRAVEDAD
        engine.gravity.scale += 0.001;
        console.log(engine.gravity.x, engine.gravity.y, engine.gravity.scale)
    } 
     if (key === 'q') { // DISMINUYE GRAVEDAD
        engine.gravity.scale -= 0.001;
        console.log(engine.gravity.x, engine.gravity.y, engine.gravity.scale)
     } 

     */

    if (keyCode === UP_ARROW) {
      tamanioX=tamanioX+10;
      console.log("tamanioX= " + tamanioX);
      console.log("tamanioY= " + tamanioY);
    }
    if (keyCode === DOWN_ARROW) {
      tamanioX=tamanioX-10;
      console.log("tamanioX= " + tamanioX);
      console.log("tamanioY= " + tamanioY);
    }
    if (keyCode === LEFT_ARROW) {
      tamanioY=tamanioY-10;
      console.log("tamanioX= " + tamanioX);
      console.log("tamanioY= " + tamanioY);
    }
    if (keyCode === RIGHT_ARROW) {
      tamanioY=tamanioY+10;
      console.log("tamanioX= " + tamanioX);
      console.log("tamanioY= " + tamanioY);
    }

    if (keyCode === CONTROL) {
        selector++;
        if (selector>=colores.length){
            selector=0;
        }
        console.log(selector);
    }
 
      
  
  }

