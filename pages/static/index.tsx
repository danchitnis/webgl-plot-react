import React, { useState, useEffect, useRef } from "react";

import ToggleButton from "@material-ui/lab/ToggleButton";
import ToggleButtonGroup from "@material-ui/lab/ToggleButtonGroup";

import { Chip, Avatar } from "@material-ui/core";

import CustomSlider from "../../components/CustomSlider";

import WebGlPlot, { WebglLine, ColorRGBA } from "webgl-plot";

import Layout from "../../components/Layout";

let webglp: WebGlPlot;
//let lines: WebglLine[];
//let numX = 1000;

const RectZ = new WebglLine(new ColorRGBA(1, 1, 1, 1), 4);

type WheelZoom = {
  scale: number;
  offset: number;
};

type Drag = {
  started: boolean;
  dragInitialX: number;
  dragOffsetOld: number;
};

type Zoom = {
  started: boolean;
  cursorDownX: number;
  cursorOffsetX: number;
};

type ZoomStatus = {
  scale: number;
  offset: number;
};

export default function WebglAppRandom(): JSX.Element {
  const [numX, setNumX] = useState(3);
  const [numLines, setNumLines] = useState(1);
  const [wheelZoom, setWheelZoom] = useState<WheelZoom>({ scale: 1, offset: 0 });

  const [zoomStatus, setZoomStatus] = useState<ZoomStatus>({ scale: 1, offset: 0 });

  const [zoom, setZoom] = useState<Zoom>({ started: false, cursorDownX: 0, cursorOffsetX: 0 });
  const [drag, setDrag] = useState<Drag>({ started: false, dragInitialX: 0, dragOffsetOld: 0 });

  const numList = [1, 2, 5, 10, 20, 50, 100, 200, 500, 1000];
  const numXList = [
    100,
    200,
    500,
    1000,
    2000,
    5000,
    10000,
    20000,
    50000,
    100000,
    200000,
    500000,
    1000000,
  ];

  const canvasMain = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (canvasMain.current) {
      const devicePixelRatio = window.devicePixelRatio || 1;
      canvasMain.current.width = canvasMain.current.clientWidth * devicePixelRatio;
      canvasMain.current.height = canvasMain.current.clientHeight * devicePixelRatio;

      webglp = new WebGlPlot(canvasMain.current, { powerPerformance: "high-performance" });

      const newFrame = () => {
        webglp.update();
        requestAnimationFrame(newFrame);
      };
      requestAnimationFrame(newFrame);

      //bug fix see https://github.com/facebook/react/issues/14856#issuecomment-586781399
      canvasMain.current.addEventListener(
        "wheel",
        (e) => {
          e.preventDefault();
        },
        { passive: false }
      );
    }
    ////bug fix see https://github.com/facebook/react/issues/14856#issuecomment-586781399
    return () => {
      canvasMain.current?.removeEventListener("wheel", (e) => {
        e.preventDefault();
      });
    };
  }, [canvasMain]);

  useEffect(() => {
    setZoomStatus({ scale: webglp.gScaleX, offset: webglp.gOffsetX / webglp.gScaleX });
  }, [drag, zoom, wheelZoom]);

  useEffect(() => {
    webglp.removeAllLines();
    webglp.addLine(RectZ);

    const numLinesActual = numList[numLines];

    for (let i = 0; i < numLinesActual; i++) {
      const color = new ColorRGBA(Math.random(), Math.random(), Math.random(), 1);
      const line = new WebglLine(color, numXList[numX]);
      line.lineSpaceX(-1, 2 / numXList[numX]);
      webglp.addLine(line);
    }

    webglp.lines.forEach((line) => {
      (line as WebglLine).setY(0, Math.random() - 0.5);
      for (let i = 1; i < line.numPoints; i++) {
        let y = (line as WebglLine).getY(i - 1) + 0.01 * (Math.round(Math.random()) - 0.5);
        if (y > 0.9) {
          y = 0.9;
        }
        if (y < -0.9) {
          y = -0.9;
        }
        (line as WebglLine).setY(i, y);
      }
    });

    // add zoom rectangle
    const Rect = new WebglLine(new ColorRGBA(0.9, 0.9, 0.9, 1), 4);
    Rect.loop = true;
    Rect.xy = new Float32Array([-0.5, -1, -0.5, 1, 0.5, 1, 0.5, -1]);
    Rect.visible = false;
    webglp.addLine(Rect);

    // test rec
    const testRect = new WebglLine(new ColorRGBA(0.1, 0.9, 0.9, 1), 4);
    testRect.loop = true;
    testRect.xy = new Float32Array([-0.7, -0.8, -0.7, 0.8, -0.6, 0.8, -0.6, -0.8]);
    webglp.addLine(testRect);

    //wglp.viewport(0, 0, 1000, 1000);
    webglp.gScaleX = 1;
    webglp.update();
  }, [numLines, numX]);

  /**
   * Canvas events
   */

  const mouseWheel = (e: React.WheelEvent) => {
    //e.preventDefault();
    const eOffset = (e.target as HTMLCanvasElement).getBoundingClientRect().x;
    const width = (e.target as HTMLCanvasElement).getBoundingClientRect().width;

    //const width = canvasMain.current == undefined ? 1 : canvasMain.current.width;

    const cursorOffsetX = (-2 * (e.clientX - eOffset - width / 2)) / width;
    let scale = wheelZoom.scale;
    let offset = wheelZoom.offset;

    if (e.shiftKey) {
      offset = +e.deltaY * 0.1;
      webglp.gOffsetX = 0.1 * offset;
    } else {
      scale += e.deltaY * -0.01;
      scale = Math.min(100, scale);
      scale = Math.max(1, scale);
      const gScaleXOld = webglp.gScaleX;

      webglp.gScaleX = 1 * Math.pow(scale, 1.5);
      if (scale > 1 && scale < 100) {
        webglp.gOffsetX = ((webglp.gOffsetX + cursorOffsetX) * webglp.gScaleX) / gScaleXOld;
      }
      if (scale <= 1) {
        webglp.gOffsetX = 0;
      }
    }
    console.log(wheelZoom);
    setWheelZoom({ scale: scale, offset: offset });
    //webglp.update();
  };

  const mouseDown = (e: React.MouseEvent) => {
    e.preventDefault();
    const eOffset = (e.target as HTMLCanvasElement).getBoundingClientRect().x;
    console.log(e.clientX - eOffset); //offset from the edge of the element
    //const cStyle = (e.target as HTMLCanvasElement).style;
    if (e.button == 0) {
      (e.target as HTMLCanvasElement).style.cursor = "pointer";
      const width = (e.target as HTMLCanvasElement).getBoundingClientRect().width;
      const cursorDownX = (2 * (e.clientX - eOffset - width / 2)) / width;
      setZoom({ started: true, cursorDownX: cursorDownX, cursorOffsetX: 0 });
      //RectZ.visible = true;
    }
    if (e.button == 2) {
      (e.target as HTMLCanvasElement).style.cursor = "grabbing";
      const dragInitialX = (e.clientX - eOffset) * devicePixelRatio;
      const dragOffsetOld = webglp.gOffsetX;
      setDrag({ started: true, dragInitialX: dragInitialX, dragOffsetOld: dragOffsetOld });
    }

    //const canvas = canvasMain.current;
  };

  const mouseMove = (e: React.MouseEvent) => {
    const eOffset = (e.target as HTMLCanvasElement).getBoundingClientRect().x;
    const width = (e.target as HTMLCanvasElement).getBoundingClientRect().width;
    if (zoom.started) {
      const cursorOffsetX = (2 * (e.clientX - eOffset - width / 2)) / width;
      setZoom({ started: true, cursorDownX: zoom.cursorDownX, cursorOffsetX: cursorOffsetX });
      RectZ.xy = new Float32Array([
        (zoom.cursorDownX - webglp.gOffsetX) / webglp.gScaleX,
        -1,
        (zoom.cursorDownX - webglp.gOffsetX) / webglp.gScaleX,
        1,
        (cursorOffsetX - webglp.gOffsetX) / webglp.gScaleX,
        1,
        (cursorOffsetX - webglp.gOffsetX) / webglp.gScaleX,
        -1,
      ]);
      RectZ.visible = true;
    }

    if (drag.started) {
      const moveX = (e.clientX - eOffset) * devicePixelRatio - drag.dragInitialX;
      const offsetX = (webglp.gScaleY * moveX) / width;
      webglp.gOffsetX = offsetX + drag.dragOffsetOld;
    }
  };

  const mouseUp = (e: React.MouseEvent) => {
    e.preventDefault();
    const eOffset = (e.target as HTMLCanvasElement).getBoundingClientRect().x;
    if (zoom.started) {
      //const width = canvasMain.current.width;
      const width = (e.target as HTMLCanvasElement).getBoundingClientRect().width;
      const cursorUpX = (2 * (e.clientX - eOffset - width / 2)) / width;
      const zoomFactor = Math.abs(cursorUpX - zoom.cursorDownX) / (2 * webglp.gScaleX);
      const offsetFactor =
        (zoom.cursorDownX + cursorUpX - 2 * webglp.gOffsetX) / (2 * webglp.gScaleX);

      if (zoomFactor > 0) {
        webglp.gScaleX = 1 / zoomFactor;
        webglp.gOffsetX = -offsetFactor / zoomFactor;
      }

      setZoom({ started: false, cursorDownX: 0, cursorOffsetX: 0 });
    }
    setDrag({ started: false, dragInitialX: 0, dragOffsetOld: 0 });
    (e.target as HTMLCanvasElement).style.cursor = "grab";
    RectZ.visible = false;
  };

  const doubleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    webglp.gScaleX = 1;
    webglp.gOffsetX = 0;
  };

  const contextMenu = (e: React.MouseEvent) => {
    e.preventDefault();
  };

  const canvasStyle = {
    width: "100%",
    height: "70vh",
  };

  const mainDiv = {
    width: "90%",
  };

  const SliderNumX = (): JSX.Element => {
    return (
      <CustomSlider
        key={1}
        min={0}
        max={numXList.length}
        step={1}
        defaultValue={numX}
        onChangeCommitted={(_event: any, newSlider: number | number[]): void => {
          setNumX(newSlider as number);
        }}
      />
    );
  };

  const SliderNumLine = (): JSX.Element => {
    return (
      <CustomSlider
        key={2}
        min={0}
        max={numList.length - 1}
        step={1}
        defaultValue={numLines}
        //onChange={onDrag}
        onChangeCommitted={(_event: any, newSlider: number | number[]): void => {
          setNumLines(newSlider as number);
        }}
      />
    );
  };

  const [param, setParam] = React.useState<"numX" | "numLine">("numX");

  const handleParam = (_event: React.MouseEvent<HTMLElement>, newParam: typeof param): void => {
    setParam(newParam);
  };

  useEffect(() => {
    switch (true) {
      case param == "numX": {
        SliderNumX();
        break;
      }
      case param == "numLine": {
        SliderNumLine();
        break;
      }
    }
  }, [param]);

  const LeftSide = (): JSX.Element => {
    let left = 0;
    if (webglp) {
      left = (-1 * webglp.gOffsetX - 1) / webglp.gScaleX;
    }
    return <span>{`${left.toExponential(2)} + 0`}</span>;
  };

  const RightSide = (): JSX.Element => {
    let left = 0;
    let right = 0;
    if (webglp) {
      left = (-1 * webglp.gOffsetX - 1) / webglp.gScaleX;
      right = 2 / webglp.gScaleX;
    }
    return <span>{`${left.toExponential(2)} + ${right.toExponential(2)}`}</span>;
  };

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
          <div>
            <canvas
              style={canvasStyle}
              ref={canvasMain}
              onWheel={mouseWheel}
              onMouseDown={mouseDown}
              onMouseMove={mouseMove}
              onMouseUp={mouseUp}
              onDoubleClick={doubleClick}
              onContextMenu={contextMenu}></canvas>

            <div
              style={
                {
                  display: "flex",
                  flexDirection: "row",
                  width: "100%",
                  justifyContent: "space-between",
                } as React.CSSProperties
              }>
              <LeftSide />
              <RightSide />
            </div>
          </div>

          <br />

          <ToggleButtonGroup
            style={{ textTransform: "none" }}
            value={param}
            exclusive
            onChange={handleParam}
            aria-label="text formatting">
            <ToggleButton value="numX" aria-label="bold">
              <span style={paramStyle}>Data Size</span>
            </ToggleButton>
            <ToggleButton value="numLine" aria-label="freq">
              <span style={paramStyle}>Num Line</span>
            </ToggleButton>
          </ToggleButtonGroup>

          <Chip style={paramStyle} avatar={<Avatar>D</Avatar>} label={numXList[numX]} />
          <Chip style={paramStyle} avatar={<Avatar>N</Avatar>} label={numList[numLines]} />
          <Chip
            style={paramStyle}
            avatar={<Avatar>Z</Avatar>}
            label={`${zoomStatus.scale.toFixed(3)}`}
          />
          <Chip
            style={paramStyle}
            avatar={<Avatar>O</Avatar>}
            label={`${zoomStatus.offset.toExponential(3)}`}
          />

          {param == "numX" ? <SliderNumX /> : <SliderNumLine />}
        </div>

        <p>
          With Mouse: turn the mouse wheel for zoom (zooming where the cursor is)
          <br />
          With Mouse: Right click and hold to pan
          <br />
          With Mouse: Left click hold & drag to zoom in the selected window
          <br />
          With Mouse: Double click to reset view With Touch: pinch & zoom - drag
          <br />
          Refresh the page for a new random data set
        </p>
      </div>
    </Layout>
  );
}
