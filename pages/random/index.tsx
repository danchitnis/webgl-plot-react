import React, { useState, useEffect, useRef } from "react";

import ToggleButton from "@material-ui/lab/ToggleButton";
import ToggleButtonGroup from "@material-ui/lab/ToggleButtonGroup";

import { Chip, Avatar } from "@material-ui/core";

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

  const [slider, setSlider] = React.useState(1);
  //let slider = 1;

  const onDrag = (_event: any, newSlider: number | number[]): void => {
    setSlider(newSlider as number);
    //slider = newSlider as number;
    setShiftSize(newSlider as number);
  };

  const onUpdate = (_event: any, newSlider: number | number[]): void => {
    //setSlider(newSlider as number);
    setNumLines(newSlider as number);
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

  const onYScale = (_event: any, newSlider: number | number[]): void => {
    setYScale(newSlider as number);
  };

  const [sliderComp, setSliderComp] = useState<JSX.Element>();

  const [param, setParam] = React.useState<string | null>("shift");

  const handleParam = (_event: React.MouseEvent<HTMLElement>, newParam: string | null): void => {
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

          <Chip style={paramStyle} avatar={<Avatar>S</Avatar>} label={shiftSize} />
          <Chip style={paramStyle} avatar={<Avatar>N</Avatar>} label={numList[numLines]} />
          <Chip style={paramStyle} avatar={<Avatar>Y</Avatar>} label={yScale} />

          {sliderComp}
        </div>

        <p>
          Edit <code>pages/hello.js</code> and save to reload.
        </p>
      </div>
    </Layout>
  );
}
