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

  const [amp, setAmp] = useState(0.5);
  const [freq, setFreq] = useState(0.1);
  const [noiseAmp, setNoiseAmp] = useState(0.1);

  const canvasMain = useRef<HTMLCanvasElement>(null);

  const [slider, setSlider] = React.useState<number>(50);

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
    comlinkWorkerApi.set(amp, freq, noiseAmp);
  }, [amp, freq, noiseAmp]);

  const handleComlinkWork = async (canvas: OffscreenCanvas) => {
    await comlinkWorkerApi.start(Comlink.transfer(canvas, [canvas]));
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
        setFreq(slider / 100);
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
        setSlider(freq * 100);
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
