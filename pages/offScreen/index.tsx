import React, { useRef, useState, useEffect } from "react";
import Layout from "../../components/Layout";

import * as Comlink from "comlink";
import { WorkerApi } from "../../workers/comlink.worker";

import ToggleButtonGroup from "@material-ui/lab/ToggleButtonGroup";
import ToggleButton from "@material-ui/lab/ToggleButton";

import { Chip, Avatar } from "@material-ui/core";

import CustomSlider from "../../components/CustomSlider";

//Assuming one instance only otherwise use useRef
//see here: https://www.emgoto.com/storing-values-with-useref/
let comlinkWorker: Worker;
let comlinkWorkerApi: Comlink.Remote<WorkerApi>;

export default function OffScreen(): JSX.Element {
  // for standard

  // for comlink

  const [freq, setFreq] = useState(1);
  const [amp, setAmp] = useState(0.5);
  const [noiseAmp, setNoiseAmp] = useState(0.1);
  const [noisePhase, setNoisePhase] = useState(0.1);
  const [lineNum, setLineNum] = useState(1);
  const [lineOffset, setLineOffset] = useState(0);

  const [slider, setSlider] = React.useState<number>(50);

  const canvasMain = useRef<HTMLCanvasElement>(null);

  //const comlinkWorkerRef = React.useRef<Worker>();
  //const comlinkWorkerApiRef = React.useRef<Comlink.Remote<WorkerApi>>();

  React.useEffect(() => {
    comlinkWorker = new Worker("../../workers/comlink.worker", { type: "module" });
    comlinkWorkerApi = Comlink.wrap<WorkerApi>(comlinkWorker);

    if (canvasMain.current) {
      const htmlCanvas = canvasMain.current;
      const offscreen = htmlCanvas.transferControlToOffscreen();

      offscreen.width = htmlCanvas.clientWidth * window.devicePixelRatio;
      offscreen.height = htmlCanvas.clientHeight * window.devicePixelRatio;
      handleComlinkWork(offscreen);
    }

    return () => {
      comlinkWorker.terminate();
    };
  }, [canvasMain]);

  React.useEffect(() => {
    comlinkWorkerApi.set(amp, freq, noiseAmp, noisePhase, lineOffset);
  }, [amp, freq, noiseAmp, noisePhase, lineNum, lineOffset]);

  React.useEffect(() => {
    comlinkWorkerApi.setLineNum(lineNum);
  }, [lineNum]);

  const handleComlinkWork = async (canvas: OffscreenCanvas) => {
    await comlinkWorkerApi.start(Comlink.transfer(canvas, [canvas]));
  };

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
