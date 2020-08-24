import React, { useState, useEffect, useRef } from "react";

import ToggleButton from "@material-ui/lab/ToggleButton";
import ToggleButtonGroup from "@material-ui/lab/ToggleButtonGroup";

import WebGlPlot, { WebglLine, ColorRGBA } from "webgl-plot";

import { Chip, Avatar } from "@material-ui/core";

import CustomSlider from "../../components/CustomSlider";
import Layout from "../../components/Layout";

let webglp: WebGlPlot;
let lines: WebglLine[];
let numX: number;

export default function SinApp(): JSX.Element {
  //const freq = useParam();

  //const option = ["amp", "freq"];

  //const prefersDarkMode = useMediaQuery("(prefers-color-scheme: dark)");

  const [freq, setFreq] = useState(1);
  const [amp, setAmp] = useState(0.5);
  const [noiseAmp, setNoiseAmp] = useState(0.1);
  const [noisePhase, setNoisePhase] = useState(0.1);
  const [lineNum, setLineNum] = useState(1);
  const [lineOffset, setLineOffset] = useState(0);

  const [slider, setSlider] = React.useState<number>(50);

  const canvasMain = useRef<HTMLCanvasElement>(null);

  const canvasStyle = {
    width: "100%",
    height: "70vh",
  };

  useEffect(() => {
    if (canvasMain.current) {
      const devicePixelRatio = window.devicePixelRatio || 1;
      canvasMain.current.width = canvasMain.current.clientWidth * devicePixelRatio;
      canvasMain.current.height = canvasMain.current.clientHeight * devicePixelRatio;

      webglp = new WebGlPlot(canvasMain.current);

      numX = Math.round(canvasMain.current.getBoundingClientRect().width);
    }
  }, [canvasMain]);

  useEffect(() => {
    lines = [];
    for (let i = 0; i < lineNum; i++) {
      const color = new ColorRGBA(Math.random(), Math.random(), Math.random(), 1);
      const line = new WebglLine(color, numX);
      line.lineSpaceX(-1, 2 / numX);
      lines.push(line);
      webglp.addLine(line);
    }
    return () => {
      webglp.lines = []; ///???????????? add removeAllLines to webgl-plot
    };
  }, [lineNum]);

  useEffect(() => {
    let id = 0;

    let renderPlot = (): void => {
      const freqA = (freq * 1) / numX;
      //const noise = 0.1;
      //const amp = 0.5;
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

      id = requestAnimationFrame(renderPlot);
      webglp.update();
    };
    id = requestAnimationFrame(renderPlot);

    return (): void => {
      renderPlot = (): void => {};
      cancelAnimationFrame(id);
    };
  }, [freq, amp, noiseAmp, noisePhase, lineNum, lineOffset]);

  const handleChange = (_event: React.SyntheticEvent, newSlider: unknown): void => {
    //console.log(event);
    //console.log(newSlider);

    setSlider(newSlider as number);
    switch (true) {
      case paramAF == "amp" && paramMN == "mean": {
        setAmp(slider / 100);
        break;
      }
      case paramAF == "freq" && paramMN == "mean": {
        setFreq(slider / 10);
        break;
      }
      case paramAF == "amp" && paramMN == "noise": {
        setNoiseAmp(slider / 100);
        break;
      }
      case paramAF == "freq" && paramMN == "noise": {
        setNoisePhase(slider / 100);
        break;
      }
      case paramAF != null && paramMN == null: {
        setParamMN("mean");
        break;
      }
      case paramLO == "lines": {
        setLineNum(slider > 0 ? Math.round(slider) : 1);
        break;
      }
      case paramLO == "offset": {
        setLineOffset(slider / 100);
        break;
      }
    }
  };

  const [paramAF, setParamAF] = React.useState<string | null>("amp");
  const [paramMN, setParamMN] = React.useState<string | null>("mean");
  const [paramLO, setParamLO] = React.useState<string | null>(null);

  useEffect(() => {
    switch (true) {
      case paramAF == "amp" && paramMN == "mean": {
        setSlider(amp * 100);
        break;
      }
      case paramAF == "freq" && paramMN == "mean": {
        setSlider(freq * 10);
        break;
      }
      case paramAF == "amp" && paramMN == "noise": {
        setSlider(noiseAmp * 100);
        break;
      }
      case paramAF == "freq" && paramMN == "noise": {
        setSlider(noisePhase * 100);
        break;
      }
      case paramLO == "lines": {
        setSlider(lineNum);
        break;
      }
      case paramLO == "offset": {
        setSlider(lineOffset * 100);
        break;
      }
    }
  }, [paramAF, paramMN, paramLO]);

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
        <canvas key="webglCanvas" style={canvasStyle} ref={canvasMain}></canvas>;
        <div style={{ width: "90%" }}>
          <ToggleButtonGroup
            style={{ textTransform: "none", marginRight: "1em" }}
            value={paramAF}
            exclusive
            onChange={(_event: React.MouseEvent<HTMLElement>, newParam: string | null) => {
              if (newParam) {
                setParamAF(newParam);
                setParamLO(null);
              }
            }}
            aria-label="text formatting">
            <ToggleButton value="amp" aria-label="bold">
              <span style={paramStyle}>Amp</span>
            </ToggleButton>
            <ToggleButton value="freq" aria-label="freq">
              <span style={paramStyle}>Freq</span>
            </ToggleButton>
          </ToggleButtonGroup>

          <ToggleButtonGroup
            style={{ textTransform: "none", marginRight: "1em" }}
            value={paramMN}
            exclusive
            onChange={(_event: React.MouseEvent<HTMLElement>, newParam: string | null) => {
              if (newParam) {
                setParamMN(newParam);
                setParamLO(null);
              }
            }}
            aria-label="text formatting">
            <ToggleButton value="mean" aria-label="bold">
              <span style={paramStyle}>Mean</span>
            </ToggleButton>
            <ToggleButton value="noise" aria-label="freq">
              <span style={paramStyle}>Noise</span>
            </ToggleButton>
          </ToggleButtonGroup>

          <ToggleButtonGroup
            style={{ textTransform: "none" }}
            value={paramLO}
            exclusive
            onChange={(_event: React.MouseEvent<HTMLElement>, newParam: string | null) => {
              if (newParam) {
                setParamAF(null);
                setParamMN(null);
                setParamLO(newParam);
              }
            }}
            aria-label="text formatting">
            <ToggleButton value="lines" aria-label="bold">
              <span style={paramStyle}>Lines</span>
            </ToggleButton>
            <ToggleButton value="offset" aria-label="freq">
              <span style={paramStyle}>Offset</span>
            </ToggleButton>
          </ToggleButtonGroup>

          <Chip style={paramStyle} avatar={<Avatar>N</Avatar>} label={amp.toPrecision(2)} />
          <Chip style={paramStyle} avatar={<Avatar>F</Avatar>} label={freq.toPrecision(2)} />
          <Chip style={paramStyle} avatar={<Avatar>AN</Avatar>} label={noiseAmp.toPrecision(2)} />
          <Chip style={paramStyle} avatar={<Avatar>FN</Avatar>} label={noiseAmp.toPrecision(2)} />

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
