import React, { useState, useEffect, useRef } from "react";

import WebGlPlot, { WebglLine, ColorRGBA } from "webgl-plot";

import { Chip, Avatar, ToggleButton, ToggleButtonGroup } from "@material-ui/core";

import CustomSlider from "../../components/CustomSlider";
import Layout from "../../components/Layout";

let webglp: WebGlPlot;
//let lines: WebglLine[];
let numX: number;

type SliderConfig = {
  min: number;
  max: number;
  step: number;
};

const lineNumberList = [
  1,
  2,
  3,
  4,
  5,
  6,
  7,
  8,
  9,
  10,
  20,
  30,
  40,
  50,
  60,
  70,
  80,
  90,
  100,
  200,
  300,
  400,
  500,
  600,
  700,
  800,
  900,
  1000,
  2000,
  3000,
  4000,
  5000,
  6000,
  7000,
  8000,
  9000,
  10000,
];

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

  const [displayValue, setDisplayValue] = useState("");

  const [sliderValue, setSliderValue] = React.useState<number>(50);
  const [sliderConfig, setSliderConfig] = React.useState<SliderConfig>({
    min: 0,
    max: 100,
    step: 0.1,
  });

  const canvasMain = useRef<HTMLCanvasElement>(null);

  //const [webglp, setWebglp] = useState<WebGlPlot>();

  const canvasStyle = {
    width: "100%",
    height: "70vh",
  };

  useEffect(() => {
    if (canvasMain.current) {
      const devicePixelRatio = window.devicePixelRatio || 1;
      canvasMain.current.width = canvasMain.current.clientWidth * devicePixelRatio;
      canvasMain.current.height = canvasMain.current.clientHeight * devicePixelRatio;

      console.log(webglp);
      webglp = new WebGlPlot(canvasMain.current, {
        debug: true,
        powerPerformance: "high-performance",
      });
      //setWebglp(new WebGlPlot(canvasMain.current));

      numX = Math.round(canvasMain.current.getBoundingClientRect().width);

      return () => {
        console.log("😬");
        //webglp?.delete();
      };
    }
  }, [canvasMain]);

  /*useEffect(() => {
    //temporary addition
    //webglp?.lines.pop();
    //webglp?.webgl.clear();
    const color = new ColorRGBA(Math.random(), Math.random(), Math.random(), 1);
    const line = new WebglLine(color, numX);
    line.lineSpaceX(-1, 2 / numX);
    //console.log(webglp);
    webglp?.addLine(line);
    webglp?.update();
  }, [webglp]);*/

  useEffect(() => {
    if (webglp?.lines) {
      if (lineNum < webglp.lines.length) {
        while (lineNum < webglp.lines.length) {
          webglp.popLine();
        }
      } else {
        while (lineNum > webglp.lines.length) {
          const color = new ColorRGBA(Math.random(), Math.random(), Math.random(), 0.8);
          const line = new WebglLine(color, numX);
          line.lineSpaceX(-1, 2 / numX);
          webglp.addLine(line);
        }
      }
    }
  }, [lineNum]);

  useEffect(() => {
    let id = 0;

    let renderPlot = (): void => {
      const freqA = (freq * 1) / numX;
      //const noise = 0.1;
      //const amp = 0.5;
      const noiseA = noiseAmp == undefined ? 0.1 : noiseAmp;
      const noiseP = noisePhase == undefined ? 0 : noisePhase;

      webglp?.lines.forEach((line, index) => {
        const phase = (noiseP / 5) * 2 * Math.PI * Math.random() + (index / lineNum) * Math.PI * 2;

        for (let i = 0; i < line.numPoints; i++) {
          const ySin = Math.sin(Math.PI * i * freqA * Math.PI * 2 + phase);
          const yNoise = Math.random() - 0.5;
          line.offsetY = ((index - lineNum / 2) * lineOffset) / 10;
          (line as WebglLine).setY(i, ySin * amp + yNoise * noiseA);
        }
      });

      id = requestAnimationFrame(renderPlot);
      webglp?.update();
    };
    id = requestAnimationFrame(renderPlot);

    return (): void => {
      renderPlot = (): void => {};
      cancelAnimationFrame(id);
    };
  }, [webglp, freq, amp, noiseAmp, noisePhase, lineNum, lineOffset]);

  const handleChange = (_event: React.SyntheticEvent, newSlider: unknown): void => {
    //console.log(event);
    //console.log(newSlider);

    setSliderValue(newSlider as number);
    switch (true) {
      case paramAF == "amp" && paramMN == "mean": {
        setAmp(sliderValue / 100);
        break;
      }
      case paramAF == "freq" && paramMN == "mean": {
        setFreq(sliderValue / 10);
        break;
      }
      case paramAF == "amp" && paramMN == "noise": {
        setNoiseAmp(sliderValue / 100);
        break;
      }
      case paramAF == "freq" && paramMN == "noise": {
        setNoisePhase(sliderValue / 100);
        break;
      }
      case paramAF != null && paramMN == null: {
        setParamMN("mean");
        break;
      }
      case paramLO == "lines": {
        setLineNum(lineNumberList[sliderValue]);
        break;
      }
      case paramLO == "offset": {
        setLineOffset(sliderValue / 100);
        break;
      }
    }
  };

  const [paramAF, setParamAF] = React.useState<"amp" | "freq" | null>("amp");
  const [paramMN, setParamMN] = React.useState<"mean" | "noise" | null>("mean");
  const [paramLO, setParamLO] = React.useState<"lines" | "offset" | null>(null);

  useEffect(() => {
    switch (true) {
      case paramAF == "amp" && paramMN == "mean": {
        setSliderValue(amp * 100);
        break;
      }
      case paramAF == "freq" && paramMN == "mean": {
        setSliderValue(freq * 10);
        break;
      }
      case paramAF == "amp" && paramMN == "noise": {
        setSliderValue(noiseAmp * 100);
        break;
      }
      case paramAF == "freq" && paramMN == "noise": {
        setSliderValue(noisePhase * 100);
        break;
      }
      case paramLO == "lines": {
        setSliderValue(lineNumberList.findIndex((element) => element === lineNum));
        break;
      }
      case paramLO == "offset": {
        setSliderValue(lineOffset * 100);
        break;
      }
    }
  }, [paramAF, paramMN, paramLO]);

  useEffect(() => {
    if (paramLO == "lines") {
      setSliderConfig({ min: 0, max: lineNumberList.length - 1, step: 1 });
    } else {
      setSliderConfig({ min: 0, max: 100, step: 0.1 });
    }
  }, [paramAF, paramMN, paramLO]);

  useEffect(() => {
    if (paramAF == "amp" && paramMN == "mean") setDisplayValue(amp.toFixed(2));
  }, [amp, paramAF, paramMN]);
  useEffect(() => {
    if (paramAF == "freq" && paramMN == "mean") setDisplayValue(freq.toFixed(2));
  }, [freq, paramAF, paramMN]);
  useEffect(() => {
    if (paramAF == "amp" && paramMN == "noise") setDisplayValue(noiseAmp.toFixed(2));
  }, [noiseAmp, paramAF, paramMN]);
  useEffect(() => {
    if (paramAF == "freq" && paramMN == "noise") setDisplayValue(noisePhase.toFixed(2));
  }, [noisePhase, paramAF, paramMN]);
  useEffect(() => {
    if (paramLO == "lines") setDisplayValue(`${lineNum}`);
  }, [lineNum, paramLO]);
  useEffect(() => {
    if (paramLO == "offset") setDisplayValue(`${lineOffset.toFixed(3)}`);
  }, [lineOffset, paramLO]);

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
        <canvas key="WebglCanvas" style={canvasStyle} ref={canvasMain}></canvas>
        <div style={{ width: "90%" }}>
          <ToggleButtonGroup
            style={{ textTransform: "none", marginRight: "1em" }}
            value={paramAF}
            exclusive
            onChange={(_event: React.MouseEvent<HTMLElement>, newParam: typeof paramAF) => {
              if (newParam) {
                setParamAF(newParam);
                if (paramMN == null) setParamMN("mean");
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
            onChange={(_event: React.MouseEvent<HTMLElement>, newParam: typeof paramMN) => {
              if (newParam) {
                setParamMN(newParam);
                if (paramAF == null) setParamAF("amp");
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
            onChange={(_event: React.MouseEvent<HTMLElement>, newParam: typeof paramLO) => {
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

          <Chip style={paramStyle} avatar={<Avatar>N</Avatar>} label={displayValue} />

          <CustomSlider
            min={sliderConfig.min}
            max={sliderConfig.max}
            step={sliderConfig.step}
            value={sliderValue}
            onChange={handleChange}
            aria-labelledby="con-slider"
          />
        </div>
        <p>Move the slider!</p>
      </div>
    </Layout>
  );
}
