import React, { useRef } from "react";
import Layout from "../../components/Layout";

import * as Comlink from "comlink";
import { WorkerApi } from "../../workers/comlink.worker";
import ToggleButtonGroup from "@material-ui/lab/ToggleButtonGroup";
import ToggleButton from "@material-ui/lab/ToggleButton";

const IndexPage = () => {
  // for standard

  // for comlink

  const canvasMain = useRef<HTMLCanvasElement>(null);

  const comlinkWorkerRef = React.useRef<Worker>();
  const comlinkWorkerApiRef = React.useRef<Comlink.Remote<WorkerApi>>();

  React.useEffect(() => {
    // Standard worker

    // Comlink worker
    comlinkWorkerRef.current = new Worker("../../workers/comlink.worker", {
      type: "module",
    });
    comlinkWorkerApiRef.current = Comlink.wrap<WorkerApi>(comlinkWorkerRef.current);
    if (canvasMain.current) {
      const htmlCanvas = canvasMain.current;
      const offscreen = htmlCanvas.transferControlToOffscreen();

      offscreen.width = htmlCanvas.clientWidth * window.devicePixelRatio;
      offscreen.height = htmlCanvas.clientHeight * window.devicePixelRatio;
      handleComlinkWork(offscreen);
    }

    return () => {
      comlinkWorkerRef.current?.terminate();
    };
  }, []);

  const handleComlinkWork = async (canvas: OffscreenCanvas) => {
    await comlinkWorkerApiRef.current?.getName(Comlink.transfer(canvas, [canvas]));
  };

  const [param, setParam] = React.useState<string | null>("amp");

  const handleParam = (_event: React.MouseEvent<HTMLElement>, newParam: string | null): void => {
    setParam(newParam);
  };

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
    <Layout title="Next.js + TypeScript + Web Worker" id={"test"}>
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
        </div>

        <p>Move the slider!</p>
      </div>
    </Layout>
  );
};

export default IndexPage;
