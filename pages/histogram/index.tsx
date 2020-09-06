import React, { useState, useEffect, useRef } from "react";

import ToggleButton from "@material-ui/lab/ToggleButton";
import ToggleButtonGroup from "@material-ui/lab/ToggleButtonGroup";

import { Chip, Avatar } from "@material-ui/core";

import CustomSlider from "../../components/CustomSlider";

import WebGlPlot, { WebglStep, ColorRGBA } from "webgl-plot";
import Layout from "../../components/Layout";

let webglp: WebGlPlot;
//let line: WebglStep;

//const randXSize = 10;

let X: Float32Array;
let xbins: Float32Array;
let ybins: Float32Array;

//const numBins = 100;
const xmin = 0;
const xmax = 100;

//const Xmin = 25;
//const Xmax = 75;
//const Xskew = 1;

export default function WebglAppHistogram(): JSX.Element {
  //states
  const [numBins, setNumBins] = useState(100);
  const [randXSize, setRandXSize] = useState(10);
  const [Xrange, setXrange] = useState<number[]>([25, 75]);
  const [Xskew, setXskew] = useState(1);

  //const numList = [1, 2, 5, 10, 20, 50, 100, 200, 500, 1000, 2000];

  const canvasMain = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    //numX = Math.round(canvasMain.current.getBoundingClientRect().width);
  }, []);

  useEffect(() => {
    if (canvasMain.current) {
      const devicePixelRatio = window.devicePixelRatio || 1;
      canvasMain.current.width = canvasMain.current.clientWidth * devicePixelRatio;
      canvasMain.current.height = canvasMain.current.clientHeight * devicePixelRatio;

      webglp = new WebGlPlot(canvasMain.current);
    }
  }, [canvasMain]);

  useEffect(() => {
    xbins = new Float32Array(numBins);
    ybins = new Float32Array(numBins);

    webglp.gOffsetY = -1;
    webglp.gOffsetX = -1;
    webglp.gScaleX = 2 / numBins;

    for (let i = 0; i < xbins.length; i++) {
      xbins[i] = (i * (xmax - xmin)) / numBins + xmin;
    }

    const color = new ColorRGBA(1, 1, 0, 1);
    const line = new WebglStep(color, numBins);
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
        (webglp.lines[0] as WebglStep).setY(i, y * 0.02);
      }

      id = requestAnimationFrame(renderPlot);
      webglp.update();
    };

    id = requestAnimationFrame(renderPlot);

    return (): void => {
      renderPlot.prototype = null;
      // remove the previous line here!!!!!!!!!!
      cancelAnimationFrame(id);
    };
  }, [randXSize, numBins, Xrange, Xskew]);

  const [sliderComp, setSliderComp] = useState<JSX.Element>();

  const [param, setParam] = React.useState<string | null>("randXSize");

  const handleParam = (_event: React.MouseEvent, newParam: string | null): void => {
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
        onChange={(_event: React.SyntheticEvent, newSlider: unknown) => {
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
        onChange={(_event: React.SyntheticEvent, newSlider: unknown) => {
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
        onChange={(_event: React.SyntheticEvent, newSlider: unknown) => {
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
        onChange={(_event: React.SyntheticEvent, newSlider: unknown) => {
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
    <Layout id="histogram" title="Hist App">
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
          <canvas style={canvasStyle} ref={canvasMain}></canvas>

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
        </div>

        <p>Move the slider!</p>
      </div>
    </Layout>
  );
}
