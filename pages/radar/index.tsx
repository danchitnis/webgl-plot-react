import React, { useState, useEffect, useRef } from "react";

import ToggleButton from "@material-ui/lab/ToggleButton";
import ToggleButtonGroup from "@material-ui/lab/ToggleButtonGroup";

import WebGlPlot, { WebglPolar, ColorRGBA } from "webgl-plot";

import { Chip, Avatar } from "@material-ui/core";

import CustomSlider from "../../components/CustomSlider";
import Layout from "../../components/Layout";

let webglp: WebGlPlot;

let numX = 1;
let numY = 1;

let indexNow = 0;
let preR = 0.5;

type SliderConfig = {
  min: number;
  max: number;
  step: number;
};

const lineNumberList = [
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
];

export default function RadarApp(): JSX.Element {
  //const freq = useParam();

  //const option = ["amp", "freq"];

  //const prefersDarkMode = useMediaQuery("(prefers-color-scheme: dark)");

  const [noiseAmp, setNoiseAmp] = useState(0.1);
  const [lineNum, setLineNum] = useState(1);
  const [lineOffset, setLineOffset] = useState(0);

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
      numX = canvasMain.current.clientWidth * devicePixelRatio;
      numY = canvasMain.current.clientHeight * devicePixelRatio;

      canvasMain.current.width = numX;
      canvasMain.current.height = numY;

      console.log(webglp);
      webglp = new WebGlPlot(canvasMain.current, {
        debug: true,
        powerPerformance: "high-performance",
      });
      webglp.gScaleX = numY / numX;
      webglp.gScaleY = 1;
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
          const line = new WebglPolar(color, numX);
          for (let i = 0; i < line.numPoints; i++) {
            const theta = (i * 360) / line.numPoints;
            const r = noiseAmp * 1;
            //const r = 1;
            line.setRtheta(i, theta, r);
          }
          line.loop = true;
          webglp.addLine(line);
        }
      }
    }
  }, [lineNum]);

  useEffect(() => {
    let id = 0;

    let renderPlot = (): void => {
      //const noise = 0.1;
      //const amp = 0.5;

      webglp?.lines.forEach((line) => {
        if (indexNow < line.numPoints) {
          const theta = (indexNow * 360) / line.numPoints;
          let r = noiseAmp * (Math.random() - 0.5) + preR;
          (line as WebglPolar).setRtheta(indexNow, theta, r);

          //line2.setRtheta(0, 0, 0);
          //line2.setRtheta(1, theta, 1);

          //line2.setX(1,line.getX(indexNow));
          //line2.setY(1,line.getY(indexNow));

          r = r < 1 ? r : 1;
          r = r > 0.1 ? r : 0.1;
          preR = r;

          indexNow++;
        } else {
          indexNow = 0;
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
  }, [webglp, noiseAmp, lineNum, lineOffset]);

  const handleChange = (_event: React.SyntheticEvent, newSlider: unknown): void => {
    //console.log(event);
    //console.log(newSlider);

    setSliderValue(newSlider as number);
    switch (true) {
      case paramNR == "noiseAmp": {
        setNoiseAmp(sliderValue / 100);
        break;
      }
      case paramNR == "Rate": {
        //setFreq(sliderValue / 10);
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

  const [paramNR, setParamNR] = React.useState<string | null>("noiseAmp");
  const [paramLO, setParamLO] = React.useState<string | null>(null);

  useEffect(() => {
    switch (true) {
      case paramNR == "noiseAmp": {
        //setSliderValue(amp * 100);
        break;
      }
      case paramNR == "Rate": {
        //setSliderValue(freq * 10);
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
  }, [paramNR, paramLO]);

  useEffect(() => {
    if (paramLO == "lines") {
      setSliderConfig({ min: 0, max: lineNumberList.length - 1, step: 1 });
    } else {
      setSliderConfig({ min: 0, max: 100, step: 0.1 });
    }
  }, [paramNR, paramLO]);

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
            value={paramNR}
            exclusive
            onChange={(_event: React.MouseEvent<HTMLElement>, newParam: string | null) => {
              if (newParam) {
                setParamNR(newParam);
                setParamLO(null);
              }
            }}
            aria-label="text formatting">
            <ToggleButton value="noiseAmp" aria-label="bold">
              <span style={paramStyle}>Noise</span>
            </ToggleButton>
            <ToggleButton value="Rate" aria-label="freq">
              <span style={paramStyle}>Rate</span>
            </ToggleButton>
          </ToggleButtonGroup>

          <ToggleButtonGroup
            style={{ textTransform: "none" }}
            value={paramLO}
            exclusive
            onChange={(_event: React.MouseEvent<HTMLElement>, newParam: string | null) => {
              if (newParam) {
                setParamNR(null);
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

          <Chip
            style={paramStyle}
            avatar={<Avatar>P</Avatar>}
            label={`${noiseAmp.toPrecision(2)}`}
          />
          <Chip style={paramStyle} avatar={<Avatar>L</Avatar>} label={lineNum} />

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
