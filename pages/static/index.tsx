import React, { useState, useEffect, useRef } from "react";

import { Chip, Avatar, ToggleButton, ToggleButtonGroup } from "@material-ui/core";
import AddIcon from "@material-ui/icons/Add";

import CustomSlider from "../../components/CustomSlider";

import WebGlPlot, { WebglLine, ColorRGBA } from "webgl-plot";

import Layout from "../../components/Layout";
import InfoTable from "../../components/infoTable";

let webglp: WebGlPlot;

const zoomRect = new WebglLine(new ColorRGBA(1, 1, 1, 1), 4);
const crossXLine = new WebglLine(new ColorRGBA(0.1, 1, 0.1, 1), 2);
const crossYLine = new WebglLine(new ColorRGBA(0.1, 1, 0.1, 1), 2);

type MouseDrag = {
  started: boolean;
  dragInitialX: number;
  dragOffsetOld: number;
};

type MouseZoom = {
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

  const [zoomStatus, setZoomStatus] = useState<ZoomStatus>({ scale: 1, offset: 0 });

  const [mouseZoom, setMouseZoom] = useState<MouseZoom>({
    started: false,
    cursorDownX: 0,
    cursorOffsetX: 0,
  });
  const [mouseDrag, setMouseDrag] = useState<MouseDrag>({
    started: false,
    dragInitialX: 0,
    dragOffsetOld: 0,
  });

  const [isCrosshair, setIsCrosshair] = React.useState(false);

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
  }, [mouseDrag, mouseZoom]);

  useEffect(() => {
    webglp.removeAllLines();
    webglp.addAuxLine(zoomRect);
    webglp.addAuxLine(crossXLine);
    webglp.addAuxLine(crossYLine);

    const numLinesActual = numList[numLines];

    for (let i = 0; i < numLinesActual; i++) {
      const color = new ColorRGBA(Math.random(), Math.random(), Math.random(), 1);
      const line = new WebglLine(color, numXList[numX]);
      line.lineSpaceX(-1, 2 / numXList[numX]);
      webglp.addDataLine(line);
    }

    webglp.linesData.forEach((line) => {
      const limit = 0.99;

      (line as WebglLine).setY(0, Math.random() - 0.5);
      for (let i = 1; i < line.numPoints; i++) {
        let y = (line as WebglLine).getY(i - 1) + 0.01 * (Math.round(Math.random()) - 0.5);
        if (y > limit) {
          y = limit;
        }
        if (y < -limit) {
          y = -limit;
        }
        (line as WebglLine).setY(i, y);
      }
    });

    // test rec
    const testRect = new WebglLine(new ColorRGBA(0.1, 0.9, 0.9, 1), 4);
    testRect.loop = true;
    testRect.xy = new Float32Array([-0.7, -0.8, -0.7, 0.8, -0.6, 0.8, -0.6, -0.8]);
    webglp.addAuxLine(testRect);

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
    let scale = zoomStatus.scale; //wheelZoom.scale;
    let offset = zoomStatus.offset;

    if (e.shiftKey) {
      offset += (e.deltaY / width) * 10;
      webglp.gOffsetX = offset;
    } else {
      scale += e.deltaY * -0.01;
      scale = Math.min(100, scale);
      scale = Math.max(1, scale);
      const gScaleXOld = webglp.gScaleX;

      webglp.gScaleX = 1 * Math.pow(scale, 1.5);
      //webglp.gScaleX = 1 * scale;
      if (scale > 1 && scale < 100) {
        webglp.gOffsetX = ((webglp.gOffsetX + cursorOffsetX) * webglp.gScaleX) / gScaleXOld;
      }
      if (scale <= 1) {
        webglp.gOffsetX = 0;
      }
    }
    console.log(zoomStatus);
    //setWheelZoom({ scale: scale, offset: offset });
    setZoomStatus({ scale: scale, offset: offset });
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
      setMouseZoom({ started: true, cursorDownX: cursorDownX, cursorOffsetX: 0 });
      //RectZ.visible = true;
    }
    if (e.button == 2) {
      (e.target as HTMLCanvasElement).style.cursor = "grabbing";
      const dragInitialX = (e.clientX - eOffset) * devicePixelRatio;
      const dragOffsetOld = webglp.gOffsetX;
      setMouseDrag({ started: true, dragInitialX: dragInitialX, dragOffsetOld: dragOffsetOld });
    }

    //const canvas = canvasMain.current;
  };

  const mouseMove = (e: React.MouseEvent) => {
    const eOffset = (e.target as HTMLCanvasElement).getBoundingClientRect().x;
    const width = (e.target as HTMLCanvasElement).getBoundingClientRect().width;
    if (mouseZoom.started) {
      const cursorOffsetX = (2 * (e.clientX - eOffset - width / 2)) / width;
      setMouseZoom({
        started: true,
        cursorDownX: mouseZoom.cursorDownX,
        cursorOffsetX: cursorOffsetX,
      });
      zoomRect.xy = new Float32Array([
        (mouseZoom.cursorDownX - webglp.gOffsetX) / webglp.gScaleX,
        -1,
        (mouseZoom.cursorDownX - webglp.gOffsetX) / webglp.gScaleX,
        1,
        (cursorOffsetX - webglp.gOffsetX) / webglp.gScaleX,
        1,
        (cursorOffsetX - webglp.gOffsetX) / webglp.gScaleX,
        -1,
      ]);
      zoomRect.visible = true;
    }
    /************Mouse Drag Evenet********* */
    if (mouseDrag.started) {
      const moveX = (e.clientX - eOffset) * devicePixelRatio - mouseDrag.dragInitialX;
      const offsetX = (webglp.gScaleY * moveX) / width;
      webglp.gOffsetX = offsetX + mouseDrag.dragOffsetOld;
    }
    /*****************cross hair************** */
    const canvas = canvasMain.current;
    if (canvas) {
      const x =
        (1 / webglp.gScaleX) *
        ((2 * ((e.pageX - canvas.offsetLeft) * devicePixelRatio - canvas.width / 2)) /
          canvas.width -
          webglp.gOffsetX);
      const y =
        (1 / webglp.gScaleY) *
        ((2 * (canvas.height / 2 - (e.pageY - canvas.offsetTop) * devicePixelRatio)) /
          canvas.height -
          webglp.gOffsetY);
      cross(x, y);
    }
  };

  const cross = (x: number, y: number): void => {
    crossXLine.xy = new Float32Array([x, -1, x, 1]);
    crossYLine.xy = new Float32Array([-1, y, 1, y]);
    //crossX = x;
    //crossY = y;
  };

  const mouseUp = (e: React.MouseEvent) => {
    e.preventDefault();
    const eOffset = (e.target as HTMLCanvasElement).getBoundingClientRect().x;
    if (mouseZoom.started) {
      const width = (e.target as HTMLCanvasElement).getBoundingClientRect().width;
      const cursorUpX = (2 * (e.clientX - eOffset - width / 2)) / width;
      const zoomFactor = Math.abs(cursorUpX - mouseZoom.cursorDownX) / (2 * webglp.gScaleX);
      const offsetFactor =
        (mouseZoom.cursorDownX + cursorUpX - 2 * webglp.gOffsetX) / (2 * webglp.gScaleX);

      if (zoomFactor > 0) {
        webglp.gScaleX = 1 / zoomFactor;
        webglp.gOffsetX = -offsetFactor / zoomFactor;
      }

      setMouseZoom({ started: false, cursorDownX: 0, cursorOffsetX: 0 });
    }
    /************Mouse Drag Evenet********* */
    setMouseDrag({ started: false, dragInitialX: 0, dragOffsetOld: 0 });
    (e.target as HTMLCanvasElement).style.cursor = "grab";
    zoomRect.visible = false;
  };

  const doubleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    webglp.gScaleX = 1;
    webglp.gOffsetX = 0;
    setZoomStatus({ scale: webglp.gScaleX, offset: webglp.gOffsetX });
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

  /*const [paramXY, setParamXY] = React.useState<"xAxis" | "yAxis">("xAxis");

  const handleParamXY = (_event: React.MouseEvent<HTMLElement>, newParam: typeof paramXY): void => {
    setParamXY(newParam);
  };*/

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

  const InfoTableXY = (): JSX.Element => {
    let leftX = 0;
    let deltaX = 0;
    let bottomY = 0;
    let deltaY = 0;
    if (webglp) {
      leftX = (-1 * webglp.gOffsetX - 1) / webglp.gScaleX;
      deltaX = 2 / webglp.gScaleX;

      bottomY = (-1 * webglp.gOffsetY - 1) / webglp.gScaleY;
      deltaY = 2 / webglp.gScaleY;
    }
    return (
      <div>
        <InfoTable id="X" d1={leftX} d2={leftX + deltaX} />
        <InfoTable id="Y" d1={bottomY} d2={bottomY + deltaY} />
      </div>
    );
  };

  useEffect(() => {
    if (isCrosshair) {
      crossXLine.visible = true;
      crossYLine.visible = true;
    } else {
      crossXLine.visible = false;
      crossYLine.visible = false;
    }
  }, [isCrosshair]);

  const paramStyle = {
    fontSize: "1.5em",
    marginLeft: "1em",
    marginRight: "1em",
    textTransform: "none" as const,
  } as React.CSSProperties;

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
              <span>X1</span>
              <span>X2</span>
            </div>

            <InfoTableXY />
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

          <ToggleButton
            value="check"
            selected={isCrosshair}
            onChange={() => {
              setIsCrosshair(!isCrosshair);
            }}>
            <AddIcon fontSize="large" />
          </ToggleButton>

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
