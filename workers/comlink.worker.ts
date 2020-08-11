import * as Comlink from "comlink";
import WebGLplot, { ColorRGBA, WebglLine } from "webgl-plot";

export interface WorkerApi {
  start: (canvas: HTMLCanvasElement) => Promise<void>;
  set: (amp: number, freq: number, noise: number) => Promise<void>;
}

let wglp: WebGLplot;
let line: WebglLine;

let amp = 0.5;
let freq = 0.1;
let noise = 0.1;

export const WorkerApi = {
  start: async (canvas: OffscreenCanvas) => {
    console.log(canvas);

    //let amp = 0.5;

    const numX = canvas.width;

    const color = new ColorRGBA(Math.random(), Math.random(), Math.random(), 1);

    line = new WebglLine(color, numX);

    wglp = new WebGLplot(canvas, true);

    line.lineSpaceX(-1, 2 / numX);
    wglp.addLine(line);

    const newFrame = () => {
      update();
      wglp.update();
      requestAnimationFrame(newFrame);
    };

    const update = () => {
      //const freq = 0.001;
      //amp = 0.5;
      //const noise = 0.1;

      for (let i = 0; i < line.numPoints; i++) {
        const ySin = Math.sin(Math.PI * i * (freq / 100) * Math.PI * 2);
        const yNoise = Math.random() - 0.5;
        line.setY(i, ySin * amp + yNoise * noise);
      }
    };

    newFrame();
  },
  set: async (p_amp: number, p_freq: number, p_noise: number) => {
    amp = p_amp;
    freq = p_freq;
    noise = p_noise;
  },
};

Comlink.expose(WorkerApi);
