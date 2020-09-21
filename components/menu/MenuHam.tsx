import React, { CSSProperties } from "react";

import Drawer from "@material-ui/core/Drawer";
import Button from "@material-ui/core/Button";
import List from "@material-ui/core/List";
import Divider from "@material-ui/core/Divider";
import ListItem from "@material-ui/core/ListItem";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemText from "@material-ui/core/ListItemText";
import GitHubIcon from "@material-ui/icons/GitHub";
import MenuIcon from "@material-ui/icons/Menu";

import NextLink from "next/link";
import MuiLink from "@material-ui/core/Link";

import { MenuList } from "./MenuList";

type Prop = {
  menuList: typeof MenuList;
  pageId: string;
};

//prevent large icons when loading the page
const styleIcon = {
  maxHeight: "1.5em",
} as CSSProperties;

export default function HamMenu({ menuList, pageId }: Prop): JSX.Element {
  const [open, setOpen] = React.useState(false);

  const toggleDrawer = (open: boolean) => (event: React.KeyboardEvent | React.MouseEvent) => {
    if (
      event.type === "keydown" &&
      ((event as React.KeyboardEvent).key === "Tab" ||
        (event as React.KeyboardEvent).key === "Shift")
    ) {
      return;
    }

    setOpen(open);
  };

  const SideList = (): JSX.Element => {
    return (
      <div role="presentation" onClick={toggleDrawer(false)} onKeyDown={toggleDrawer(false)}>
        <List>
          {menuList.map((mL, index) => (
            <div key={index} style={{ minWidth: "50vw" }}>
              <NextLink href={mL.href}>
                <MuiLink
                  href={mL.href}
                  variant="inherit"
                  color="inherit"
                  style={{ textDecoration: "none" /*flex: "1 1 0"*/ }}>
                  <ListItem button key={index} selected={pageId?.localeCompare(mL.id) == 0}>
                    {/*<ListItemIcon>{mL.icon}</ListItemIcon>*/}
                    <ListItemText primary={mL.text} />
                  </ListItem>
                </MuiLink>
              </NextLink>
            </div>
          ))}
        </List>
      </div>
    );
  };

  return (
    <div>
      <Button onClick={toggleDrawer(true)}>
        <MenuIcon fontSize="large" />
      </Button>
      <Drawer anchor="left" open={open} onClose={toggleDrawer(false)} style={{ width: "500px" }}>
        <SideList />
        <Divider />
        <List>
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
            style={{ textDecoration: "none" }}>
            <ListItem button>
              <ListItemText primary="Docs" />
            </ListItem>
          </MuiLink>

          <NextLink href="/sine">
            <MuiLink
              href="/sine"
              variant="inherit"
              color="inherit"
              style={{ textDecoration: "none" }}>
              <ListItem button>
                <ListItemText primary="Examples" />
              </ListItem>
            </MuiLink>
          </NextLink>
        </List>
        <Divider />
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
      </Drawer>
    </div>
  );
}
