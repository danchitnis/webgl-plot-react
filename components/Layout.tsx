import React, { ReactNode } from "react";
//import Link from "next/link";
import Head from "next/head";

import useMediaQuery from "@material-ui/core/useMediaQuery";
import { createMuiTheme, MuiThemeProvider } from "@material-ui/core/styles";
import CssBaseline from "@material-ui/core/CssBaseline";
//import { createStyles, makeStyles, Theme } from "@material-ui/core/styles";

import MenuList from "./MenuList";

type Props = {
  children?: ReactNode;
  id: string;
  title: string;
};

export default function Layout({
  children,
  title = "This is the default title",
  id,
}: Props): JSX.Element {
  const prefersDarkMode = useMediaQuery("(prefers-color-scheme: dark)");

  const theme = React.useMemo(
    () =>
      createMuiTheme({
        palette: {
          type: prefersDarkMode ? "dark" : "light",
          //type: "light",
        },
        overrides: {},
        typography: {
          body1: {
            fontSize: "1.2rem",
          },
          body2: {
            fontSize: "1rem",
            lineHeight: "1.5rem",
            wordSpacing: "0.2rem",
          },
          h1: {
            fontSize: "2rem",
            textTransform: "uppercase",
          },
          h2: {
            fontSize: "1rem",
            textTransform: "uppercase",
          },
        },
      }),
    [prefersDarkMode]
  );

  /*const useStyles = makeStyles((theme: Theme) =>
    createStyles({
      root: {
        flexGrow: 1,
      },
      menuButton: {
        marginRight: theme.spacing(2),
      },
      title: {
        flexGrow: 1,
      },
    })
  );*/

  //const classes = useStyles();

  return (
    <MuiThemeProvider theme={theme}>
      <CssBaseline />
      <div>
        <Head>
          <title>{title + " | Danial Chitnis"}</title>
          <meta charSet="utf-8" />
          <meta name="viewport" content="initial-scale=1.0, width=device-width" />
        </Head>
        <header>
          <nav>
            <MenuList id={id} title={title}></MenuList>
          </nav>
        </header>
        {children}
        <footer>
          <hr />
          <span>I'm here to stay (Footer)</span>
        </footer>
      </div>
    </MuiThemeProvider>
  );
}
