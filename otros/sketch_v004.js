
const { Engine, World, Bodies, Composite } = Matter;
Matter.use('matter-attractors');

//----SONIDO----
let monitorear = true;

let FREC_MIN = 0;
let FREC_MAX = 100;

let AMP_MIN = 0.01;
let AMP_MAX = 0.4;

let mic;
let pitch;
let audioContext;

let gestorAmp;
let gestorPitch;

let haySonido; // estado de cómo está el sonido en cada momento
let antesHabiaSonido; // moemoria del estado anterior del sonido

const model_url = 'https://cdn.jsdelivr.net/gh/ml5js/ml5-data-and-models/models/pitch-detection/crepe/';

//----TIEMPO----
let marca;
let tiempoLimiteAgregar = 3000;
let tiempoLimiteGrosor = 3000;
let tiempoLimiteColor = 3000;
let tiempoLimiteFin = 3000;

//----OTROS----
let estado = 0;
let selector = 0;
let bottomLayer;
let gravity = 0.00005;

//----MATTER---
let engine;
let world;
let centro;

//----OBJETOS---
let circles = [];
let rectangles = [];
let boundaries = [];
let cantidad;
let tamanioX = 100;
let tamanioY = 100;
let cRect;
let cCircle;
let cCirclePrev;
let cRectPrev;
let colores = [];
let coloresDes = [];


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

  //----SONIDO----
  audioContext = getAudioContext(); // inicia el motor de audio
  mic = new p5.AudioIn(); // inicia el micrófono
  mic.start(startPitch); // se enciende el micrófono y le transmito el analisis de frecuencia (pitch) al micrófono. Conecto la libreria con el micrófono
  userStartAudio();// por la dudas para forzar inicio de audio en algunos navegadores
  gestorAmp =  new GestorSenial( AMP_MIN, AMP_MAX);
  gestorPitch = new GestorSenial( FREC_MIN, FREC_MAX);
  antesHabiaSonido = false;

    //----ENGINE & BOUNDARIES----
    engine = Engine.create();
    world = engine.world;
    boundaries.push(new Boundary(width/2, height, width, 20, 0)); //PISO
    boundaries.push(new Boundary(0, height/2, width, 20, PI/2)); //PARED DER
    boundaries.push(new Boundary(width, height/2, width, 20, PI/2)); //PARED IZQ
    boundaries.push(new Boundary(width/2, 0, width, 20, 0)); //TECHO

    //----CENTRO DE GRAVEDAD-----  
    var attractiveBody = Bodies.circle(width/2, height/2, 0,
      {
      isStatic: true,
      plugin: {
        attractors: [
          function(bodyA, bodyB) {
            return {
              x: (bodyA.position.x - bodyB.position.x) * gravity,
              y: (bodyA.position.y - bodyB.position.y) * gravity,
            };
          }
        ]
      }
    });
    World.add(world, attractiveBody);
    console.log(attractiveBody);
    
    world.gravity.scale = 0;

}
    

function draw() {
    background(233);

    //----SONIDO----
    let vol = mic.getLevel(); // cargo en vol la amplitud del micrófono (señal cruda);
    gestorAmp.actualizar(vol);
    haySonido = gestorAmp.filtrada > 0.1; // umbral de ruido que define el estado haySonido
    let inicioElSonido = haySonido && !antesHabiaSonido; // evendo de INICIO de un sonido
    let finDelSonido = !haySonido && antesHabiaSonido; // evento de fIN de un sonido

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
    cantidad = rectangles.length + circles.length; 
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

    if(monitorear){
      //console.log("hay sonido?",haySonido);
      //console.log("la frec esta en: ",gestorPitch.filtrada);
      //console.log("la amp esta en: ",gestorAmp.filtrada);
      //gestorAmp.dibujar(100, 100);
      //gestorPitch.dibujar(100, 300);
    }

    antesHabiaSonido =  haySonido;
  
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
    //console.log (estado);
  }

  function mouseClicked() {
    if (estado === 0 && cantidad < 5) { //DIBUJA CIRCULOS
    circles.push(new Circle(mouseX, mouseY, tamanioX/2, cCircle));
    console.log("Cantidad de figuras", cantidad);
    }

    if (estado === 1 && cantidad < 5) { //DIBUJA RECTANGULOS
    rectangles.push(new Rectangle(mouseX, mouseY, tamanioX, tamanioY, cRect));
        }
}


  
// ---- Pitch detection ---
function startPitch() {
  pitch = ml5.pitchDetection(model_url, audioContext , mic.stream, modelLoaded);
  console.log("hecho")

}

function modelLoaded() {
  getPitch();
}

function getPitch() {
  pitch.getPitch(function(err, frequency) {
    if (frequency) {

      gestorPitch.actualizar(frequency);    
    } 
    getPitch();
  })
}

