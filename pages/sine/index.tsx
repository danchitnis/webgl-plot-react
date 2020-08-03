import React, { useState, useEffect, useRef } from "react";

import ToggleButton from "@material-ui/lab/ToggleButton";
import ToggleButtonGroup from "@material-ui/lab/ToggleButtonGroup";

import WebGlPlot, { WebglLine, ColorRGBA } from "webgl-plot";

import { Chip, Avatar } from "@material-ui/core";

import CustomSlider from "./CustomSlider";
import Layout from "../../components/Layout";

let webglp: WebGlPlot;
let line: WebglLine;
let numX: number;

export default function SinApp(): JSX.Element {
  //const freq = useParam();

  //const option = ["amp", "freq"];

  //const prefersDarkMode = useMediaQuery("(prefers-color-scheme: dark)");

  const [freq, setFreq] = useState(1);
  const [amp, setAmp] = useState(0.5);
  const [noiseAmp, setNoiseAmp] = useState(0.1);
  const [noisePhase] = useState(0.1);

  const canvasMain = useRef<HTMLCanvasElement>(null);

  const [slider, setSlider] = React.useState<number>(50);

  useEffect(() => {
    if (canvasMain.current) {
      webglp = new WebGlPlot(canvasMain.current);

      numX = Math.round(canvasMain.current.getBoundingClientRect().width);

      line = new WebglLine(new ColorRGBA(1, 0, 0, 1), numX);
      webglp.addLine(line);

      line.lineSpaceX(-1, 2 / numX);

      //this.setState({ Amp: 0.5 });
    }
  }, [canvasMain]);

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

  const handleChange = (_event: React.SyntheticEvent, newSlider: unknown): void => {
    //console.log(event);
    //console.log(newSlider);

    setSlider(newSlider as number);
    switch (true) {
      case param == "amp": {
        setAmp(slider / 100);
        break;
      }
      case param == "freq": {
        setFreq(slider / 10);
        break;
      }
      case param == "noise": {
        setNoiseAmp(slider / 100);
        break;
      }
    }
  };

  const [param, setParam] = React.useState<string | null>("amp");

  const handleParam = (_event: React.MouseEvent<HTMLElement>, newParam: string | null): void => {
    setParam(newParam);
  };

  useEffect(() => {
    switch (true) {
      case param == "amp": {
        setSlider(amp * 100);
        break;
      }
      case param == "freq": {
        setSlider(freq * 10);
        break;
      }
      case param == "noise": {
        setSlider(noiseAmp * 100);
        break;
      }
    }
  }, [param]);

  const paramStyle = {
    fontSize: "1.5em",
    marginLeft: "1em",
    marginRight: "1em",
    textTransform: "none" as const,
  };

  return (
    <Layout id="sin" title="Sin App">
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          flexDirection: "column",
          alignItems: "center",
          //height: "50vh",
          fontSize: "20px",
          width: "100%",
        }}>
        <div style={{ width: "90%" }}>
          <canvas style={canvasStyle} ref={canvasMain}></canvas>

          <ToggleButtonGroup
            style={{ textTransform: "none" }}
            value={param}
            exclusive
            onChange={handleParam}
            aria-label="text formatting">
            <ToggleButton value="amp" aria-label="bold">
              <span style={paramStyle}>Amp</span>
            </ToggleButton>
            <ToggleButton value="freq" aria-label="freq">
              <span style={paramStyle}>Freq</span>
            </ToggleButton>
            <ToggleButton value="noise" aria-label="noise">
              <span style={paramStyle}>Noise</span>
            </ToggleButton>
          </ToggleButtonGroup>

          <Chip style={paramStyle} avatar={<Avatar>A</Avatar>} label={amp.toPrecision(2)} />
          <Chip style={paramStyle} avatar={<Avatar>F</Avatar>} label={freq.toPrecision(2)} />
          <Chip style={paramStyle} avatar={<Avatar>N</Avatar>} label={noiseAmp.toPrecision(2)} />

          <CustomSlider
            min={0}
            max={100}
            step={0.1}
            value={slider}
            onChange={handleChange}
            aria-labelledby="con-slider"
          />
        </div>

        <p>Move the slider!</p>
      </div>
    </Layout>
  );
}
