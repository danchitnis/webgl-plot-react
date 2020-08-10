import React, { useState, useEffect, useRef } from "react";

import ToggleButton from "@material-ui/lab/ToggleButton";
import ToggleButtonGroup from "@material-ui/lab/ToggleButtonGroup";

import { Chip, Avatar } from "@material-ui/core";

import CustomSlider from "../../components/CustomSlider";
import Layout from "../../components/Layout";

import { wrap, transfer } from "comlink";

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
      init(canvasMain.current);
    }
  }, [canvasMain]);

  const init = async (htmlCanvas: HTMLCanvasElement) => {
    const offscreen = htmlCanvas.transferControlToOffscreen();

    offscreen.width = htmlCanvas.clientWidth * window.devicePixelRatio;
    offscreen.height = htmlCanvas.clientHeight * window.devicePixelRatio;

    const worker = new Worker("./offScreen-worker", { type: "module" });
    const workerApi = wrap<import("./offScreen-worker").CanvasWorker>(worker);
    await workerApi.run(transfer(offscreen, [offscreen]));
    await workerApi.set(0.8);
  };

  useEffect(() => {
    let id = 0;
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