import React, { useEffect, useRef } from "react";

import WebGlPlot, { WebglLine, ColorRGBA } from "webgl-plot";

let webglp: WebGlPlot;
let line: WebglLine;
let numX: number;

type prop = {
  freq: number;
  amp: number;
  noiseAmp?: number;
  noisePhase?: number;
};

export default function WebglAppSin({ freq, amp, noiseAmp, noisePhase }: prop): JSX.Element {
  //
  //const [freq, setFreq] = useState(0.001);
  //const [amp, setAmp] = useState(0.5);

  //let canvas: HTMLCanvasElement;

  const canvasMain = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (canvasMain.current) {
      webglp = new WebGlPlot(canvasMain.current);

      numX = Math.round(canvasMain.current.getBoundingClientRect().width);

      line = new WebglLine(new ColorRGBA(1, 0, 0, 1), numX);
      webglp.addLine(line);

      line.lineSpaceX(-1, 2 / numX);

      //this.setState({ Amp: 0.5 });
    }
  }, []);

  useEffect(() => {
    let id = 0;
    let renderPlot = (): void => {
      const freqA = (freq * 1) / numX;
      //const noise = 0.1;
      //const amp = 0.5;
      const noiseA = noiseAmp == undefined ? 0.1 : noiseAmp;
      const noiseP = noisePhase == undefined ? 0 : noisePhase;

      const phase = noiseP * 2 * Math.PI * Math.random();

      for (let i = 0; i < line.numPoints; i++) {
        const ySin = Math.sin(Math.PI * i * freqA * Math.PI * 2 + phase);
        const yNoise = Math.random() - 0.5;
        line.setY(i, ySin * amp + yNoise * noiseA);
      }
      id = requestAnimationFrame(renderPlot);
      webglp.update();
    };
    id = requestAnimationFrame(renderPlot);

    return (): void => {
      renderPlot = (): void => {};
      cancelAnimationFrame(id);
    };
  }, [freq, amp, noiseAmp, noisePhase]);

  const canvasStyle = {
    width: "100%",
    height: "70vh",
  };

  return (
    <div>
      <canvas style={canvasStyle} ref={canvasMain}></canvas>
    </div>
  );
}
