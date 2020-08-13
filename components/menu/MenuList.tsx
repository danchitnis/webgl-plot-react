//import React, { CSSProperties } from "react";

export type MenuListType = {
  id: string;
  text: string;
  icon: string;
  href: string;
};

//prevent large icons when loading the page
/*const styleIcon = {
  maxHeight: "2em",
} as CSSProperties;*/

export const MenuList = [
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
] as MenuListType[];
