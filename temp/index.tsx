import React, { useRef, useState, useEffect } from "react";
import Layout from "../components/Layout";

//import * as Comlink from "comlink";
//import { WorkerApi } from "../../workers/comlink.worker";

import { Chip, Avatar, ToggleButton, ToggleButtonGroup } from "@material-ui/core";

import CustomSlider from "../components/CustomSlider";

//Assuming one instance only otherwise use useRef
//see here: https://www.emgoto.com/storing-values-with-useref/
//let comlinkWorker: Worker;
//let comlinkWorkerApi: Comlink.Remote<WorkerApi>;

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

type SliderConfig = {
  min: number;
  max: number;
  step: number;
};

export default function OffScreen(): JSX.Element {
  // for standard

  // for comlink

  const [freq, setFreq] = useState(1);
  const [amp, setAmp] = useState(0.5);
  const [noiseAmp, setNoiseAmp] = useState(0.1);
  const [noisePhase, setNoisePhase] = useState(0.1);
  const [lineNum, setLineNum] = useState(1);
  const [lineOffset, setLineOffset] = useState(0);

  const [sliderValue, setSliderValue] = React.useState<number>(50);
  const [sliderConfig, setSliderConfig] = React.useState<SliderConfig>({
    min: 0,
    max: 100,
    step: 0.1,
  });

  const canvasMain = useRef<HTMLCanvasElement>(null);

  //const comlinkWorkerRef = React.useRef<Worker>();
  //const comlinkWorkerApiRef = React.useRef<Comlink.Remote<WorkerApi>>();

  React.useEffect(() => {
    //comlinkWorker = new Worker("../../workers/comlink.worker", { type: "module" });
    //comlinkWorkerApi = Comlink.wrap<WorkerApi>(comlinkWorker);

    if (canvasMain.current) {
      const htmlCanvas = canvasMain.current;
      const offscreen = htmlCanvas.transferControlToOffscreen();

      offscreen.width = htmlCanvas.clientWidth * window.devicePixelRatio;
      offscreen.height = htmlCanvas.clientHeight * window.devicePixelRatio;
      //handleComlinkWork(offscreen);
    }

    return () => {
      //comlinkWorker.terminate();
    };
  }, []);

  React.useEffect(() => {
    //comlinkWorkerApi.set(amp, freq, noiseAmp, noisePhase, lineOffset);
  }, [amp, freq, noiseAmp, noisePhase, lineOffset]);

  React.useEffect(() => {
    //comlinkWorkerApi.setLineNum(lineNum);
  }, [lineNum]);

  /*const handleComlinkWork = async (canvas: OffscreenCanvas) => {
    //await comlinkWorkerApi.start(Comlink.transfer(canvas, [canvas]));
  };*/

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

  const [paramAF, setParamAF] = React.useState<string | null>("amp");
  const [paramMN, setParamMN] = React.useState<string | null>("mean");
  const [paramLO, setParamLO] = React.useState<string | null>(null);

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

  const paramStyle = {
    fontSize: "1.5em",
    marginLeft: "1em",
    marginRight: "1em",
    textTransform: "none" as const,
  };

  const canvasStyle = {
    width: "100%",
    height: "70vh",
  };

  return (
    <Layout id="offScreen" title="OffScreen & WebWorker">
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

          <Chip
            style={paramStyle}
            avatar={<Avatar>P</Avatar>}
            label={`${amp.toPrecision(2)}, ${freq.toPrecision(2)}`}
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
