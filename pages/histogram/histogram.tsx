import React, { useState, useEffect, useRef } from "react";
import useThemeContext from "@theme/hooks/useThemeContext";

import ToggleButton from "@material-ui/lab/ToggleButton";
import ToggleButtonGroup from "@material-ui/lab/ToggleButtonGroup";

import { createMuiTheme, ThemeProvider } from "@material-ui/core/styles";
import { Chip, Avatar } from "@material-ui/core";

import CustomSlider from "../sine/CustomSlider";

import WebGlPlot, { WebglStep, ColorRGBA } from "webgl-plot";

let webglp: WebGlPlot;
let line: WebglStep;

const randXSize = 10;

let X: Float32Array;
let xbins: Float32Array;
let ybins: Float32Array;

//const numBins = 100;
const xmin = 0;
const xmax = 100;

//const Xmin = 25;
//const Xmax = 75;
//const Xskew = 1;

type Slider = {
  min?: number;
  max?: number;
  value?: number;
};

export default function WebglAppHistogram(): JSX.Element {
  //states
  const [numBins, setNumBins] = useState(100);
  const [randXSize, setRandXSize] = useState(10);
  const [Xrange, setXrange] = useState<number[]>([25, 75]);
  const [Xskew, setXskew] = useState(1);

  const numList = [1, 2, 5, 10, 20, 50, 100, 200, 500, 1000, 2000];

  const canvasMain = useRef<HTMLCanvasElement>(null);

  const { isDarkTheme, setLightTheme, setDarkTheme } = useThemeContext();

  const materialTheme = createMuiTheme({
    palette: {
      type: isDarkTheme ? "dark" : "light",
      primary: {
        contrastText: "rgba(0, 0, 0, 0.87)",
        dark: "rgb(100, 141, 174)",
        //dark: "rgb(255,0,0)",
        light: "rgb(166, 212, 250)",
        main: "#90caf9",
      },
      secondary: {
        contrastText: "rgba(0, 0, 0, 0.87)",
        dark: "rgb(170, 100, 123)",
        light: "rgb(246, 165, 192)",
        main: "#f48fb1",
      },
    },
  });

  useEffect(() => {
    //numX = Math.round(canvasMain.current.getBoundingClientRect().width);
    materialTheme;
  }, []);

  useEffect(() => {
    if (canvasMain.current) {
      webglp = new WebGlPlot(canvasMain.current);
    }
  }, []);

  useEffect(() => {
    webglp = new WebGlPlot(canvasMain.current);

    xbins = new Float32Array(numBins);
    ybins = new Float32Array(numBins);

    webglp.gOffsetY = -1;
    webglp.gOffsetX = -1;
    webglp.gScaleX = 2 / numBins;

    for (let i = 0; i < xbins.length; i++) {
      xbins[i] = (i * (xmax - xmin)) / numBins + xmin;
    }

    const color = new ColorRGBA(1, 1, 0, 1);
    line = new WebglStep(color, numBins);
    // line.linespaceX(-1, 2 / numBins);
    // instead of line above we are applying offsetX and scaleX
    line.lineSpaceX(0, 1);
    webglp.addLine(line);
  }, [numBins]);

  useEffect(() => {
    let id = 0;

    //this is to remove the previous line !!!!!!!!

    const randnBM = (min: number, max: number, skew: number): number => {
      let u = 0;
      let v = 0;
      while (u === 0) {
        u = Math.random();
      } // Converting [0,1) to (0,1)
      while (v === 0) {
        v = Math.random();
      }
      let num = Math.sqrt(-2.0 * Math.log(u)) * Math.cos(2.0 * Math.PI * v);

      num = num / 10.0 + 0.5; // Translate to 0 -> 1
      if (num > 1 || num < 0) {
        num = randnBM(min, max, skew);
      } // resample between 0 and 1 if out of range
      num = Math.pow(num, skew); // Skew
      num *= max - min; // Stretch to fill range
      num += min; // offset to min
      return num;
    };

    const randnArray = (array: Float32Array): void => {
      for (let i = 0; i < array.length; i++) {
        array[i] = randnBM(Math.min(Xrange[0], Xrange[1]), Math.max(Xrange[0], Xrange[1]), Xskew);
      }
    };

    let renderPlot = () => {
      X = new Float32Array(randXSize);
      randnArray(X);

      for (let i = 0; i < ybins.length; i++) {
        ybins[i] = 0;
      }

      for (let i = 0; i < X.length; i++) {
        const bin = X[i];

        if (bin < xmin) {
          ybins[0]++;
        } else {
          if (bin > xmax) {
            ybins[numBins - 1]++;
          } else {
            const index = (numBins * (bin - xmin)) / (xmax - xmin);
            ybins[Math.floor(index)]++;
          }
        }
      }

      // Normalize ?
      for (let i = 0; i < ybins.length; i++) {
        const y = (ybins[i] / randXSize) * numBins;
        line.setY(i, y * 0.02);
      }

      id = requestAnimationFrame(renderPlot);
      webglp.update();
    };

    id = requestAnimationFrame(renderPlot);

    return (): void => {
      renderPlot = null;
      // remove the previous line here!!!!!!!!!!
      cancelAnimationFrame(id);
    };
  }, [randXSize, numBins, Xrange, Xskew]);

  const [sliderComp, setSliderComp] = useState<JSX.Element>(null);

  const [param, setParam] = React.useState<string | null>("randXSize");

  const handleParam = (event: React.MouseEvent<HTMLElement>, newParam: string | null): void => {
    setParam(newParam);
  };

  useEffect(() => {
    switch (true) {
      case param == "randXSize": {
        sliderRandXSize();
        break;
      }
      case param == "numBins": {
        sliderNumBins();
        break;
      }
      case param == "Xrange": {
        sliderXrange();
        break;
      }
      case param == "Xskew": {
        sliderXskew();
        break;
      }
    }
  }, [param]);

  const sliderRandXSize = (): void => {
    console.log("change");
    setSliderComp(
      <CustomSlider
        key={Math.random()}
        min={0}
        max={4}
        step={0.1}
        defaultValue={Math.log10(randXSize)}
        //onChange={onDrag}
        onChange={(event: any, newSlider: number | number[]) => {
          const rxs = Math.pow(10, newSlider as number);
          setRandXSize(Math.round(rxs));
        }}
      />
    );
  };

  const sliderNumBins = (): void => {
    console.log("change");
    setSliderComp(
      <CustomSlider
        key={Math.random()}
        min={2}
        max={1000}
        step={1}
        defaultValue={numBins}
        //onChange={onDrag}
        onChange={(event: any, newSlider: number | number[]) => {
          setNumBins(newSlider as number);
        }}
      />
    );
  };

  const sliderXrange = (): void => {
    console.log("change");
    setSliderComp(
      <CustomSlider
        key={Math.random()}
        min={0}
        max={100}
        step={1}
        defaultValue={Xrange}
        //onChange={onDrag}
        onChange={(event: any, newSlider: number | number[]) => {
          setXrange(newSlider as number[]);
        }}
      />
    );
  };

  const sliderXskew = (): void => {
    console.log("change");
    setSliderComp(
      <CustomSlider
        key={Math.random()}
        min={0}
        max={5}
        step={0.01}
        defaultValue={Xskew}
        //onChange={onDrag}
        onChange={(event: any, newSlider: number | number[]) => {
          setXskew(newSlider as number);
        }}
      />
    );
  };

  const paramStyle = {
    //fontSize: "1.5em",
    //marginLeft: "1em",
    //marginRight: "1em",
    //textTransform: "none" as const,
  };

  const canvasStyle = {
    width: "100%",
    height: "70vh",
  };

  const mainDiv = {
    width: "90%",
  };

  return (
    <div style={mainDiv}>
      <canvas style={canvasStyle} ref={canvasMain}></canvas>

      <ThemeProvider theme={materialTheme}>
        <ToggleButtonGroup
          //style={}
          size="large"
          value={param}
          exclusive
          onChange={handleParam}
          aria-label="text formatting">
          <ToggleButton value="randXSize" aria-label="bold">
            <span style={paramStyle}>X Size</span>
          </ToggleButton>
          <ToggleButton value="numBins" aria-label="bold">
            <span style={paramStyle}>Number of Bins</span>
          </ToggleButton>
          <ToggleButton value="Xrange" aria-label="bold">
            <span style={paramStyle}>X range</span>
          </ToggleButton>
          <ToggleButton value="Xskew" aria-label="bold">
            <span style={paramStyle}>Skew</span>
          </ToggleButton>
        </ToggleButtonGroup>

        <Chip style={paramStyle} avatar={<Avatar>X</Avatar>} label={randXSize} />
        <Chip style={paramStyle} avatar={<Avatar>B</Avatar>} label={numBins} />
        <Chip style={paramStyle} avatar={<Avatar>X</Avatar>} label={Xrange[0]} />
        <Chip style={paramStyle} avatar={<Avatar>M</Avatar>} label={Xrange[1]} />
        <Chip style={paramStyle} avatar={<Avatar>S</Avatar>} label={Xskew} />

        {sliderComp}
      </ThemeProvider>
    </div>
  );
}
