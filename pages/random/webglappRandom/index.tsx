import React, { useState, useEffect, useRef } from "react";
import useThemeContext from "@theme/hooks/useThemeContext";

import Button from "@material-ui/core/Button";
import ToggleButton from "@material-ui/lab/ToggleButton";
import ToggleButtonGroup from "@material-ui/lab/ToggleButtonGroup";
import FormatBoldIcon from "@material-ui/icons/FormatBold";
import {
  withStyles,
  makeStyles,
  createMuiTheme,
  MuiThemeProvider,
  ThemeProvider,
} from "@material-ui/core/styles";
import { Chip, Avatar, Typography } from "@material-ui/core";

import CustomSlider from "../../webglappSin/CustomSlider";

import WebGlPlot, { WebglLine, ColorRGBA } from "webgl-plot";

import FPSStat from "@danchitnis/react-fps-stats";
import { blue, pink } from "@material-ui/core/colors";

let webglp: WebGlPlot;
let lines: WebglLine[];
let numX = 1;

type Slider = {
  min?: number;
  max?: number;
  value?: number;
};

export default function WebglAppRandom(): JSX.Element {
  const [shiftSize, setShiftSize] = useState(1);
  const [numLines, setNumLines] = useState(1);
  const [yScale, setYScale] = useState(1);

  const numList = [1, 2, 5, 10, 20, 50, 100, 200, 500, 1000, 2000];

  const canvasMain = useRef<HTMLCanvasElement>(null);
  const canvasDraw = useRef<HTMLCanvasElement>(null);

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
    numX = Math.round(canvasMain.current.getBoundingClientRect().width);
    materialTheme;
  }, []);

  useEffect(() => {
    if (canvasMain.current) {
      webglp = new WebGlPlot(canvasMain.current);

      lines = [];

      const numLinesActual = numList[numLines];

      for (let i = 0; i < numLinesActual; i++) {
        const color = new ColorRGBA(Math.random(), Math.random(), Math.random(), 1);
        lines.push(new WebglLine(color, numX));
      }

      lines.forEach((line) => {
        webglp.addLine(line);
      });

      for (let i = 0; i < numX; i++) {
        // set x to -num/2:1:+num/2
        lines.forEach((line) => {
          line.lineSpaceX(-1, 2 / numX);
        });
      }
    }
  }, [numLines]);

  useEffect(() => {
    let id = 0;

    const randomWalk = (initial: number, walkSize: number): Float32Array => {
      const y = new Float32Array(walkSize);
      y[0] = initial + 0.01 * (Math.round(Math.random()) - 0.5);
      for (let i = 1; i < walkSize; i++) {
        y[i] = y[i - 1] + 0.01 * (Math.round(Math.random()) - 0.5);
      }
      return y;
    };

    let renderPlot = (): void => {
      lines.forEach((line) => {
        const yArray = randomWalk(line.getY(numX - 1), shiftSize);
        line.shiftAdd(yArray);
      });
      id = requestAnimationFrame(renderPlot);
      webglp.update();
    };
    id = requestAnimationFrame(renderPlot);

    return (): void => {
      renderPlot = null;
      cancelAnimationFrame(id);
    };
  }, [shiftSize]);

  useEffect(() => {
    webglp.gScaleY = yScale;
  }, [yScale]);

  const canvasStyle = {
    width: "100%",
    height: "70vh",
  };

  const mainDiv = {
    width: "90%",
  };

  const [slider, setSlider] = React.useState(1);
  //let slider = 1;

  const onDrag = (event: any, newSlider: number | number[]): void => {
    setSlider(newSlider as number);
    //slider = newSlider as number;
    console.log(newSlider, slider);
    setShiftSize(newSlider as number);
  };

  const onUpdate = (event: any, newSlider: number | number[]): void => {
    //setSlider(newSlider as number);
    setNumLines(newSlider as number);
    console.log("😀");
  };

  const silderShift = (): void => {
    console.log("change");
    setSliderComp(
      <CustomSlider
        key={Math.random()}
        min={0}
        max={10}
        step={1}
        defaultValue={shiftSize}
        onChange={onDrag}
      />
    );
  };

  const sliderNumLine = (): void => {
    console.log("change");
    setSliderComp(
      <CustomSlider
        key={Math.random()}
        min={0}
        max={numList.length - 1}
        step={1}
        defaultValue={numLines}
        //onChange={onDrag}
        onChangeCommitted={onUpdate}
      />
    );
    console.log(slider);
  };

  const sliderYScale = (): void => {
    console.log("change");
    setSliderComp(
      <CustomSlider
        key={Math.random()}
        min={0}
        max={2}
        step={0.01}
        defaultValue={yScale}
        //onChange={onDrag}
        onChange={onYScale}
      />
    );
    console.log(slider);
  };

  const onYScale = (event: any, newSlider: number | number[]): void => {
    setYScale(newSlider as number);
  };

  const [sliderComp, setSliderComp] = useState<JSX.Element>(null);

  const [param, setParam] = React.useState<string | null>("shift");

  const handleParam = (event: React.MouseEvent<HTMLElement>, newParam: string | null): void => {
    setParam(newParam);
  };

  useEffect(() => {
    switch (true) {
      case param == "shift": {
        silderShift();
        break;
      }
      case param == "numLine": {
        sliderNumLine();
        break;
      }
      case param == "yScale": {
        sliderYScale();
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

  /*
 <div style={{ width: "10%", height: "3em", position: "absolute" }}>
        <FPSStat capacity={20} color={"rgba(0,255,255,0.5)"} />
      </div>
  */

  return (
    <div style={mainDiv}>
      <div style={{ width: "10%", height: "3em", position: "absolute" }}>
        <FPSStat capacity={20} barColor={"rgba(0,255,255,0.5)"} />
      </div>

      <canvas style={canvasStyle} ref={canvasMain}></canvas>
      <ThemeProvider theme={materialTheme}>
        <ToggleButtonGroup
          style={{ textTransform: "none" }}
          value={param}
          exclusive
          onChange={handleParam}
          aria-label="text formatting">
          <ToggleButton value="shift" aria-label="bold">
            <span style={paramStyle}>Shift Size</span>
          </ToggleButton>
          <ToggleButton value="numLine" aria-label="freq">
            <span style={paramStyle}>Num Line</span>
          </ToggleButton>
          <ToggleButton value="yScale" aria-label="yScale">
            <span style={paramStyle}>Scale Y</span>
          </ToggleButton>
        </ToggleButtonGroup>

        <Chip style={paramStyle} avatar={<Avatar>S</Avatar>} label={shiftSize} />
        <Chip style={paramStyle} avatar={<Avatar>N</Avatar>} label={numList[numLines]} />
        <Chip style={paramStyle} avatar={<Avatar>Y</Avatar>} label={yScale} />

        {sliderComp}
      </ThemeProvider>
    </div>
  );
}
