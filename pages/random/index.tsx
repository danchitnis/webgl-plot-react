import React, { useState, useEffect, useRef } from "react";
import { Chip, Avatar, ToggleButton, ToggleButtonGroup } from "@material-ui/core";

import CustomSlider from "../../components/CustomSlider";

import WebGlPlot, { WebglLine, ColorRGBA } from "webgl-plot";

import FPSStat from "@danchitnis/react-fps-stats";

import Layout from "../../components/Layout";

let webglp: WebGlPlot;
//let lines: WebglLine[];
let numX = 1;

export default function WebglAppRandom(): JSX.Element {
  const [shiftSize, setShiftSize] = useState(1);
  const [numLines, setNumLines] = useState(1);
  const [yScale, setYScale] = useState(1);

  const numList = [1, 2, 5, 10, 20, 50, 100, 200, 500, 1000, 2000, 5000, 10000];

  const [displayValue, setDisplayValue] = useState("");

  const canvasMain = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (canvasMain.current) {
      const devicePixelRatio = window.devicePixelRatio || 1;
      canvasMain.current.width = canvasMain.current.clientWidth * devicePixelRatio;
      canvasMain.current.height = canvasMain.current.clientHeight * devicePixelRatio;

      webglp = new WebGlPlot(canvasMain.current, { powerPerformance: "high-performance" });
      numX = Math.round(canvasMain.current.getBoundingClientRect().width);
    }
  }, [canvasMain]);

  useEffect(() => {
    //webglp.lines = [];
    webglp.removeAllLines();
    //lines = [];

    const numLinesActual = numList[numLines];

    for (let i = 0; i < numLinesActual; i++) {
      const color = new ColorRGBA(Math.random(), Math.random(), Math.random(), 1);
      const line = new WebglLine(color, numX);
      line.lineSpaceX(-1, 2 / numX);
      webglp.addLine(line);
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
      webglp.lines.forEach((line) => {
        const yArray = randomWalk((line as WebglLine).getY(numX - 1), shiftSize);
        (line as WebglLine).shiftAdd(yArray);
      });
      id = requestAnimationFrame(renderPlot);
      webglp.update();
    };
    id = requestAnimationFrame(renderPlot);

    return (): void => {
      renderPlot.prototype = null;
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

  /*const sliderShift = (): void => {
    console.log("change");
    setSliderComp(
      <CustomSlider
        key={Math.random()}
        min={0}
        max={10}
        step={1}
        defaultValue={shiftSize}
        onChange={(_event: any, newSlider: number | number[]) => {
          setShiftSize(newSlider as number);
        }}
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
        onChangeCommitted={(_event: any, newSlider: number | number[]) => {
          setNumLines(newSlider as number);
        }}
      />
    );
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
        onChange={(_event: any, newSlider: number | number[]): void => {
          setYScale(newSlider as number);
        }}
      />
    );
  };*/

  type SliderConfigType = {
    min: number;
    max: number;
    step: number;
  };

  const [sliderValue, setSliderValue] = useState(0);
  const [sliderConfig, setSliderConfig] = useState<SliderConfigType>({
    min: 0,
    max: 1,
    step: 0.1,
  });

  const [param, setParam] = React.useState<"shift" | "numLine" | "yScale">("shift");

  const handleParam = (_event: React.MouseEvent<HTMLElement>, newParam: typeof param): void => {
    setParam(newParam);
  };

  useEffect(() => {
    switch (true) {
      case param == "shift": {
        setSliderConfig({
          min: 0,
          max: 10,
          step: 1,
        });
        setSliderValue(shiftSize);
        break;
      }
      case param == "numLine": {
        setSliderConfig({
          min: 0,
          max: numList.length - 1,
          step: 1,
        });
        setSliderValue(numLines);
        break;
      }
      case param == "yScale": {
        setSliderConfig({
          min: 0,
          max: 2,
          step: 0.01,
        });
        setSliderValue(yScale);
        break;
      }
    }
  }, [param]);

  const handleChange = (value: number) => {
    setSliderValue(value);
    switch (true) {
      case param == "shift": {
        setShiftSize(value);
        break;
      }
      case param == "numLine": {
        setNumLines(value);
        break;
      }
      case param == "yScale": {
        setYScale(value);
        break;
      }
    }
  };

  useEffect(() => {
    if (param == "shift") setDisplayValue(`${shiftSize}`);
  }, [shiftSize, param]);
  useEffect(() => {
    if (param == "numLine") setDisplayValue(`${numLines}`);
  }, [numLines, param]);
  useEffect(() => {
    if (param == "yScale") setDisplayValue(yScale.toFixed(2));
  }, [yScale, param]);

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
    <Layout id="random" title="Random App">
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
        <div style={mainDiv}>
          <div style={{ width: "10%", height: "3em", position: "absolute" }}>
            <FPSStat capacity={20} barColor={"rgba(0,255,255,0.5)"} />
          </div>

          <canvas style={canvasStyle} ref={canvasMain}></canvas>

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

          <Chip style={paramStyle} avatar={<Avatar>N</Avatar>} label={displayValue} />

          <CustomSlider
            min={sliderConfig.min}
            max={sliderConfig.max}
            step={sliderConfig.step}
            value={sliderValue}
            onChange={(_event: any, newSlider: number | number[]): void => {
              handleChange(newSlider as number);
            }}
          />
        </div>

        <p>Move the slider!</p>
      </div>
    </Layout>
  );
}
