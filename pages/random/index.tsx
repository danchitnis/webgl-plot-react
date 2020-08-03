import React from "react";
import Layout from "@theme/Layout";

import WebglappRandom from "./webglappRandom";

export default function Hello(): JSX.Element {
  return (
    <div>
      <Layout title="Hello">
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
          <WebglappRandom />
          <p>
            Edit <code>pages/hello.js</code> and save to reload.
          </p>
        </div>
      </Layout>
    </div>
  );
}
