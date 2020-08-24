import * as Comlink from "comlink";
import WebGLplot, { ColorRGBA, WebglLine } from "webgl-plot";

export interface WorkerApi {
  start: (canvas: HTMLCanvasElement) => Promise<void>;
  set: (
    amp: number,
    freq: number,
    noiseAmp: number,
    noisePhase: number,
    lineOffset: number
  ) => Promise<void>;
  setLineNum: (lineNum: number) => Promise<void>;
}

let wglp: WebGLplot;
let lines: WebglLine[];

let amp = 0.5;
let freq = 0.1;
let noiseAmp = 0.1;
let noisePhase = 0;
let lineNum = 1;
let lineOffset = 0;

let numX = 2;

export const WorkerApi = {
  start: async (canvas: OffscreenCanvas) => {
    console.log(canvas);

    //let amp = 0.5;

    numX = canvas.width;

    wglp = new WebGLplot(canvas, true);

    const color = new ColorRGBA(Math.random(), Math.random(), Math.random(), 1);
    lines = [new WebglLine(color, numX)];
    lines[0].lineSpaceX(-1, 2 / numX);
    wglp.addLine(lines[0]);

    const newFrame = () => {
      update();
      wglp.update();
      requestAnimationFrame(newFrame);
    };

    const update = () => {
      //const freq = 0.001;
      //amp = 0.5;
      //const noise = 0.1;
      const freqA = (freq * 1) / numX;
      const noiseA = noiseAmp == undefined ? 0.1 : noiseAmp;
      const noiseP = noisePhase == undefined ? 0 : noisePhase;

      lines.forEach((line, index) => {
        const phase = (noiseP / 5) * 2 * Math.PI * Math.random() + (index / lineNum) * Math.PI * 2;

        for (let i = 0; i < line.numPoints; i++) {
          const ySin = Math.sin(Math.PI * i * freqA * Math.PI * 2 + phase);
          const yNoise = Math.random() - 0.5;
          line.offsetY = ((index - lineNum / 2) * lineOffset) / 10;
          line.setY(i, ySin * amp + yNoise * noiseA);
        }
      });
    };

    newFrame();
  },

  setLineNum: async (p_lineNum: number) => {
    //lineNum = p_lineNum;

    if (p_lineNum < lineNum) {
      while (p_lineNum < lineNum) {
        wglp.popLine();
        lines.pop();
        lineNum--;
      }
    } else {
      while (p_lineNum > lineNum) {
        const color = new ColorRGBA(Math.random(), Math.random(), Math.random(), 0.8);
        const line = new WebglLine(color, numX);
        line.lineSpaceX(-1, 2 / numX);
        lines.push(line);
        wglp.addLine(line);
        lineNum++;
      }
    }
  },

  set: async (
    p_amp: number,
    p_freq: number,
    p_noiseAmp: number,
    p_noisePhase: number,
    p_lineOffset: number
  ) => {
    amp = p_amp;
    freq = p_freq;
    noiseAmp = p_noiseAmp;
    noisePhase = p_noisePhase;
    lineOffset = p_lineOffset;
  },
};

Comlink.expose(WorkerApi);
