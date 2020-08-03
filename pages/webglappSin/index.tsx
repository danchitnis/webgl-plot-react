import React from "react";

import Layout from "../../components/Layout";

//import FPSStats from "react-fps-stats";

import SinApp from "./sinApp";

export default function Hello(): JSX.Element {
  return (
    <Layout id="sin" title="Sin App">
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
        <SinApp />
        <p>Move the slider!</p>
      </div>
    </Layout>
  );
}
