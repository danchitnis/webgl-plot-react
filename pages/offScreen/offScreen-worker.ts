import { expose } from "comlink";
import WebGLplot, { WebglLine, ColorRGBA } from "webgl-plot";

const exports = {
  amp: 0.5,

  run(canvas: OffscreenCanvas) {
    console.log(canvas);

    const numX = canvas.width;

    const color = new ColorRGBA(Math.random(), Math.random(), Math.random(), 1);

    const line = new WebglLine(color, numX);

    const wglp = new WebGLplot(canvas, true);

    line.lineSpaceX(-1, 2 / numX);
    wglp.addLine(line);

    function newFrame(): void {
      update();
      wglp.update();
      requestAnimationFrame(newFrame);
    }
    requestAnimationFrame(newFrame);

    function update() {
      const freq = 0.001;
      //const amp = 0.5;
      const noise = 0.1;

      for (let i = 0; i < line.numPoints; i++) {
        const ySin = Math.sin(Math.PI * i * freq * Math.PI * 2);
        const yNoise = Math.random() - 0.5;
        line.setY(i, ySin * exports.amp + yNoise * noise);
      }
    }
  },
  set(a: number) {
    exports.amp = a;
  },
};
export type CanvasWorker = typeof exports;

expose(exports);
