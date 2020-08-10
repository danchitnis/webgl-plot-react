import React from "react";

import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemText from "@material-ui/core/ListItemText";

import NextLink from "next/link";
import MuiLink from "@material-ui/core/Link";
import GitHubIcon from "@material-ui/icons/GitHub";

//import { makeStyles, useTheme, Theme, createStyles } from "@material-ui/core/styles";

const MenuStyle = {
  display: "flex",
  flexDirection: "row",
  flex: "1 1 0",
  transitionDuration: "1s",
} as React.CSSProperties;

type Props = {
  id?: string;
  title?: string;
};

type MenuList = {
  id: string;
  text: string;
  icon: string;
  href: string;
};

const menuList = [
  {
    id: "home",
    text: "Home",
    icon: "",
    href: "/",
  },
  {
    id: "sin",
    text: "Sine App",
    icon: "",
    href: "/sine",
  },
  { id: "random", text: "Random App", icon: "", href: "/random" },
  { id: "histogram", text: "Hist App", icon: "", href: "/histogram" },
  { id: "offScreen", text: "OffScreen", icon: "", href: "/offScreen" },
  { id: "test", text: "Test", icon: "", href: "/test" },
] as MenuList[];

export default function MenuList({ id }: Props) {
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
              <ListItem button key={index} selected={id?.localeCompare(mL.id.toLowerCase()) == 0}>
                <ListItemIcon>{mL.icon}</ListItemIcon>
                <ListItemText primary={mL.text} />
              </ListItem>
            </MuiLink>
          </NextLink>
        ))}

        <MuiLink
          href="https://github.com/danchitnis/webgl-plot"
          target="_blank"
          rel="noopener"
          variant="inherit"
          color="inherit"
          style={{ textDecoration: "none", flex: "1 1 0" }}>
          <ListItem button>
            <ListItemIcon>
              <GitHubIcon />
            </ListItemIcon>
            <ListItemText primary="Github" />
          </ListItem>
        </MuiLink>
      </List>
    </div>
  );
}
