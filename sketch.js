
const { Engine, World, Bodies, Composite } = Matter;
Matter.use('matter-attractors');

//----SONIDO----
let monitorear = true;

let FREC_MIN = 1;
let FREC_MAX = 2500;

let AMP_MIN = 0.02;
let AMP_MAX = 0.3;

let mic;
let pitch;
let audioContext;

let gestorAmp;
let gestorPitch;

let haySonido; // estado de cómo está el sonido en cada momento
let antesHabiaSonido; // moemoria del estado anterior del sonido

const model_url = 'https://cdn.jsdelivr.net/gh/ml5js/ml5-data-and-models/models/pitch-detection/crepe/';

//----TIEMPO----
let marcaEnElTiempo;
let tiempoLimite = 2500;
let ahora;
let startTime;
let elapsedTime;
let tiempoGlobal = 0;

//----OTROS----
let estado = "inicio";
let forma = 0;
let selector = 0;
let bottomLayer;
let gravity = 0.00005;
let cantidad;


//----MATTER---
let engine;
let world;
let centro;

//----OBJETOS---
let circles = [];
let squares = [];
let rectangles = [];
let boundaries = [];
let tamanioX = 100;
let tamanioY = 100;
let xPrev;
let yPrev;

//----COLOR----
let cForma;
let cFormaPrev;
let colores = [];
let coloresDes = [];


function setup() {
  createCanvas(800, 800);
  startTime = millis(); // Captura el tiempo en el que se llamó a la función setup()
  bottomLayer = createGraphics(800, 800);
  colores[0] = color(228, 185, 30);
  colores[1] = color(100, 255, 100);
  colores[2] = color(79, 133, 184);
  colores[3] = color(3, 207, 252);
  colores[4] = color(150, 38, 124);
  colores[5] = color(200, 2, 16);

  coloresDes[0] = color(228, 185, 30, 50);
  coloresDes[1] = color(100, 255, 100, 50);
  coloresDes[2] = color(79, 133, 184, 50);
  coloresDes[3] = color(3, 207, 252, 50);
  coloresDes[4] = color(150, 38, 124, 50);
  coloresDes[5] = color(200, 2, 16, 50);

  cForma = colores[0];
  cFormaPrev = coloresDes[0]

  //----SONIDO----
  audioContext = getAudioContext(); // inicia el motor de audio
  mic = new p5.AudioIn(); // inicia el micrófono
  mic.start(startPitch); // se enciende el micrófono y le transmito el analisis de frecuencia (pitch) al micrófono. Conecto la libreria con el micrófono
  userStartAudio();// por la dudas para forzar inicio de audio en algunos navegadores
  gestorAmp = new GestorSenial(AMP_MIN, AMP_MAX);
  gestorPitch = new GestorSenial(FREC_MIN, FREC_MAX);
  antesHabiaSonido = false;

  //----ENGINE & BOUNDARIES----
  engine = Engine.create();
  world = engine.world;
  boundaries.push(new Boundary(width / 2, height, width, 20, 0)); //PISO
  boundaries.push(new Boundary(0, height / 2, width, 20, PI / 2)); //PARED DER
  boundaries.push(new Boundary(width, height / 2, width, 20, PI / 2)); //PARED IZQ
  boundaries.push(new Boundary(width / 2, 0, width, 20, 0)); //TECHO

  //----CENTRO DE GRAVEDAD-----  
  var attractiveBody = Bodies.circle(width / 2, height / 2, 0,
    {
      isStatic: true,
      plugin: {
        attractors: [
          function (bodyA, bodyB) {
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
  Engine.update(engine);
  limitar();
  console.log("El estado es ", estado);
  console.log("CAnridad de figuras", cantidad);
  elapsedTime = millis() - startTime;
  antesHabiaSonido = haySonido;
  xPrev = random(0 + tamanioX, 800 - tamanioX);
  yPrev = random(0 + tamanioY, 800 - tamanioY);

  //----SONIDO----
  let vol = mic.getLevel(); // cargo en vol la amplitud del micrófono (señal cruda);
  gestorAmp.actualizar(vol);
  haySonido = gestorAmp.filtrada > 0.15; // umbral de ruido que define el estado haySonido
  let inicioElSonido = haySonido && !antesHabiaSonido; // evendo de INICIO de un sonido
  let finDelSonido = !haySonido && antesHabiaSonido; // evento de fIN de un sonido

  //-----------------------------------------------------------------ESTADOS-------
  //----INICIO--------
  if (estado == "inicio") {
    textSize(32);
    fill(0, 0, 0);
    textAlign(CENTER, CENTER);
    text("Para comenzar, mantenga un sonido", 400, 350);
    text("durante 2 segundos", 400, 380);
    gestorAmp.dibujar(0, 700);
    gestorPitch.dibujar(400, 700);

    if (inicioElSonido) {
      startTime = millis();
    }
    if (haySonido) {
      ahora = millis();
      if (ahora - startTime >= 1500) {
        estado = "tamaño";
        haySonido = 0;
      }
    }
  }

  //----AGREGA----
  if (estado == "forma") {

    if (inicioElSonido) {
      //----CAMBIO DE FORMAS----
      forma++;
      limitar();
      startTime = millis();

    }
    if (finDelSonido) {
      startTime = millis()
    }
    if (!haySonido) {
      ahora = millis();
      if (ahora - startTime >= 3000) {
        estado = "color";
        startTime = millis();
      }
    }

    //----GROSOR----
  } else if (estado == "tamaño") {
    tamanioX = map(gestorPitch.filtrada, 0.2, 1, 80, 300);
    tamanioY = map(gestorPitch.filtrada, 0.2, 1, 300, 10);
    if (inicioElSonido) {
      startTime = millis();
    }

    if (haySonido) {
      ahora = millis();
      if (forma === 0 && ahora - startTime >= 1500) {
        circles.push(new Circle(xPrev, yPrev, tamanioX / 2, cForma));
        antesHabiaSonido = true;
        startTime = millis();
      }
      else if (forma === 1 && ahora - startTime >= 1500) {
        squares.push(new Rectangle(xPrev, yPrev, tamanioX, tamanioX, cForma));
        antesHabiaSonido = true;
        startTime = millis();
      }
      else if (forma === 2 && ahora - startTime >= 1500) {
        rectangles.push(new Rectangle(xPrev, yPrev, tamanioX, tamanioY, cForma));
        antesHabiaSonido = true;
        startTime = millis();
      }
    }

    if (finDelSonido) {
      startTime = millis();

    }
    if (!haySonido) {
      ahora = millis();
      if (ahora - startTime >= 3000) {
        estado = "forma";
        startTime = millis();
      }
    }
    //----COLOR----
  } else if (estado == "color") {

    if (inicioElSonido) {
      selector++;
      if (selector >= colores.length) {
        selector = 0;
      }
      startTime = millis();
    }
    if (finDelSonido) {
      startTime = millis();
    }

    if (!haySonido) {
      ahora = millis();
      if (ahora - startTime >= 3000) {
        estado = "tamaño";
        startTime = millis();
      }
    }
  }

  //----ESTADOS----------------------------------------------------------------

  cForma = colores[selector];
  cFormaPrev = coloresDes[selector];

  for (let i = 0; i < circles.length; i++) {
    circles[i].bottomShow();
  }
  for (let i = 0; i < rectangles.length; i++) {
    rectangles[i].bottomShow();
  }
  for (let i = 0; i < squares.length; i++) {
    squares[i].bottomShow();
  }

  for (let i = 0; i < circles.length; i++) {
    circles[i].show();
  }
  for (let i = 0; i < rectangles.length; i++) {
    rectangles[i].show();
  }

  for (let i = 0; i < squares.length; i++) {
    squares[i].show();
  }

  for (let i = 0; i < boundaries.length; i++) {
    boundaries[i].show();
  }

  if (monitorear) {
    console.log("hay sonido?", haySonido);
    //console.log("la frec esta en: ",gestorPitch.filtrada);
    //console.log("la amp esta en: ",gestorAmp.filtrada);
    //gestorAmp.dibujar(0, 700);
    //gestorPitch.dibujar(400, 700);
    tiempoGlobal = ahora - startTime;
    textSize(32);
    fill(0, 0, 0);
    text(estado, 700, 40);
    if (haySonido) {
      fill(10, 250, 10)
      text(tiempoGlobal / 1000, 700, 70);
    }
    else {
      text(tiempoGlobal / 1000, 700, 70);

    }

    //text(elapsedTime, 600, 80);

    //text(forma, 600, 130);

    //text(startTime, 600, 160);
    //console.log("estado: ",estado);

  }


  //----PREVIEW----
  if (estado !== "inicio") {
    if (forma === 0) {
      stroke(0, 0, 0, 30);
      fill(cFormaPrev);
      ellipse(100, 100, tamanioX);
    }

    if (forma === 1) {
      fill(cFormaPrev);
      push();
      rectMode(CENTER);
      rect(100, 100, tamanioX, tamanioX);
      pop();

    }

    if (forma === 2) {
      fill(cFormaPrev);
      push();
      rectMode(CENTER);
      rect(100, tamanioY - tamanioY / 4, tamanioX, tamanioY);
      pop();

    }
  }






}

function limitar() {
  //----CONTROL CANTIDAD DE ELEMENTOS----
  cantidad = rectangles.length + circles.length + squares.length;
  //console.log(cantidad)
  if (cantidad >= 5) {
    console.log("Limite de cantidad de figuras alcanzado", cantidad);
  }
  if (forma > 2) {
    forma = 0;
  }
  else if (forma < 0) {
    forma = 2;
  }
}



// ---- Pitch detection ---
function startPitch() {
  pitch = ml5.pitchDetection(model_url, audioContext, mic.stream, modelLoaded);
  console.log("hecho")

}

function modelLoaded() {
  getPitch();
}

function getPitch() {
  pitch.getPitch(function (err, frequency) {
    if (frequency) {

      gestorPitch.actualizar(frequency);
    }
    getPitch();
  })
}

