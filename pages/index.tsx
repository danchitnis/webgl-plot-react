import React from "react";

import Layout from "../components/Layout";
import Typography from "@material-ui/core/Typography";

export default function IndexPage(): JSX.Element {
  const introStyle = {
    width: "80%",
  } as React.CSSProperties;

  const cvStyle = {
    width: "60%",
    marginBottom: "1em",
  } as React.CSSProperties;

  return (
    <Layout id="home" title="Home">
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
        <Typography variant="h1">About Me</Typography>
        <Typography variant="h2">a brief note on my career</Typography>
      </div>
    </Layout>
  );
}
