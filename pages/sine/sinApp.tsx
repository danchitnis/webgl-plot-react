import React, { useState, useEffect } from "react";

import ToggleButton from "@material-ui/lab/ToggleButton";
import ToggleButtonGroup from "@material-ui/lab/ToggleButtonGroup";

import { Chip, Avatar } from "@material-ui/core";

import WebglAppSin from "./webglAppSin";

import CustomSlider from "./CustomSlider";

export default function SinApp(): JSX.Element {
  //const freq = useParam();

  //const option = ["amp", "freq"];

  //const prefersDarkMode = useMediaQuery("(prefers-color-scheme: dark)");

  const [freq, setFreq] = useState(1);
  const [amp, setAmp] = useState(0.5);
  const [noiseAmp, setNoiseAmp] = useState(0.1);
  const [noisePhase, setNoisePhase] = useState(0.1);

  const [slider, setSlider] = React.useState<number>(50);

  const handleChange = (event: any, newSlider: number | number[]): void => {
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

  const handleParam = (event: React.MouseEvent<HTMLElement>, newParam: string | null): void => {
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
    <div style={{ width: "90%" }}>
      <WebglAppSin freq={freq} amp={amp} noiseAmp={noiseAmp} noisePhase={0.05} />

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
  );
}
