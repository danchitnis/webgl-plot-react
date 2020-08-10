import * as Comlink from "comlink";
import WebGLplot, { ColorRGBA, WebglLine } from "webgl-plot";

export interface WorkerApi {
  getName: typeof getName;
}

const workerApi: WorkerApi = {
  getName,
};

let wglp: WebGLplot;
let line: WebglLine;

async function getName(canvas: OffscreenCanvas) {
  console.log(canvas);

  const numX = canvas.width;

  const color = new ColorRGBA(Math.random(), Math.random(), Math.random(), 1);

  line = new WebglLine(color, numX);

  wglp = new WebGLplot(canvas, true);

  line.lineSpaceX(-1, 2 / numX);
  wglp.addLine(line);
  newFrame();
}

function newFrame(): void {
  update();
  wglp.update();
  requestAnimationFrame(newFrame);
}

function update() {
  const freq = 0.001;
  const amp = 0.5;
  const noise = 0.1;

  for (let i = 0; i < line.numPoints; i++) {
    const ySin = Math.sin(Math.PI * i * freq * Math.PI * 2);
    const yNoise = Math.random() - 0.5;
    line.setY(i, ySin * amp + yNoise * noise);
  }
}

Comlink.expose(workerApi);
