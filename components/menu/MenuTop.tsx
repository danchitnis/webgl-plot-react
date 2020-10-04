import React, { CSSProperties } from "react";

import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemText from "@material-ui/core/ListItemText";
import GitHubIcon from "@material-ui/icons/GitHub";
//import ExpandMoreIcon from "@material-ui/icons/ExpandMore";

import NextLink from "next/link";
import MuiLink from "@material-ui/core/Link";

import { MenuList } from "./MenuList";

const MenuStyleMain = {
  display: "flex",
  flexDirection: "row",
  //flex: "1 1 0",
  //transitionDuration: "1s",
} as React.CSSProperties;

const MenuStyleEx = {
  display: "flex",
  flexDirection: "row",
  margin: "auto",
  marginTop: "0em",
  paddingTop: "0em",
  paddingBottom: "0em",
  backgroundColor: "slategray",

  //flex: "1 1 0",
  //transitionDuration: "1s",
} as React.CSSProperties;

//prevent large icons when loading the page
const styleIcon = {
  maxHeight: "2em",
} as CSSProperties;

type Props = {
  menuList: typeof MenuList;
  pageId: string;
};

export default function MenuTop({ menuList, pageId }: Props): JSX.Element {
  return (
    <div>
      <div style={{ display: "flex", flexDirection: "row", width: "100%" }}>
        <div>
          <List style={MenuStyleMain}>
            <MuiLink
              href="https://webgl-plot.now.sh/"
              variant="inherit"
              color="inherit"
              style={{ textDecoration: "none" /*flex: "1 1 0"*/ }}>
              <ListItem button>
                <ListItemIcon>
                  <img src="/logo.svg" style={styleIcon} />
                </ListItemIcon>
                <ListItemText primary="WebGL-Plot" />
              </ListItem>
            </MuiLink>

            <MuiLink
              href="https://webgl-plot.now.sh/docs"
              variant="inherit"
              color="inherit"
              style={{ textDecoration: "none" /*flex: "1 1 0"*/ }}>
              <ListItem button>
                <ListItemText primary="Docs" />
              </ListItem>
            </MuiLink>

            <NextLink href="/sine">
              <MuiLink
                href="/sine"
                variant="inherit"
                color="inherit"
                style={{ textDecoration: "none", alignSelf: "flex-end" }}>
                <ListItem button>
                  <ListItemText primary="Examples" />
                </ListItem>
              </MuiLink>
            </NextLink>
          </List>
        </div>

        <div style={{ margin: "auto", marginRight: "1em" }}>
          <List>
            <MuiLink
              href="https://github.com/danchitnis/webgl-plot"
              target="_blank"
              rel="noopener"
              variant="inherit"
              color="inherit"
              style={{}}>
              <ListItem button>
                <GitHubIcon style={styleIcon} />
              </ListItem>
            </MuiLink>
          </List>
        </div>
      </div>

      <div>
        <List style={MenuStyleEx}>
          {menuList.map((mL, index) => (
            <NextLink href={mL.href} key={index}>
              <MuiLink
                href={mL.href}
                variant="inherit"
                color="inherit"
                style={{ textDecoration: "none", flex: "1 1 0" }}>
                <ListItem button key={index} selected={pageId?.localeCompare(mL.id) == 0}>
                  <ListItemText primary={mL.text} />
                </ListItem>
              </MuiLink>
            </NextLink>
          ))}
        </List>
      </div>
    </div>
  );
}
