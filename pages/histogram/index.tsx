import React from "react";
import Layout from "@theme/Layout";

import WebglappHistogram from "./histogram";

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
          <WebglappHistogram />
          <p>Move the slider!</p>
        </div>
      </Layout>
    </div>
  );
}
