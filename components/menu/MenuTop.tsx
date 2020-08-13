import React, { CSSProperties } from "react";

import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemText from "@material-ui/core/ListItemText";
import GitHubIcon from "@material-ui/icons/GitHub";

import NextLink from "next/link";
import MuiLink from "@material-ui/core/Link";

import { MenuList } from "./MenuList";

const MenuStyle = {
  display: "flex",
  flexDirection: "row",
  flex: "1 1 0",
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
      <div />

      <List style={MenuStyle}>
        {menuList.map((mL, index) => (
          <NextLink href={mL.href} key={index}>
            <MuiLink
              href={mL.href}
              variant="inherit"
              color="inherit"
              style={{ textDecoration: "none", flex: "1 1 0" }}>
              <ListItem button key={index} selected={pageId?.localeCompare(mL.id) == 0}>
                <ListItemIcon>{mL.icon}</ListItemIcon>
                <ListItemText primary={mL.text} />
              </ListItem>
            </MuiLink>
          </NextLink>
        ))}

        <MuiLink
          href="https://github.com/danchitnis"
          target="_blank"
          rel="noopener"
          variant="inherit"
          color="inherit"
          style={{ textDecoration: "none", flex: "1 1 0" }}>
          <ListItem button>
            <ListItemIcon>
              <GitHubIcon style={styleIcon} />
            </ListItemIcon>
            <ListItemText primary="Github" />
          </ListItem>
        </MuiLink>
      </List>
    </div>
  );
}
