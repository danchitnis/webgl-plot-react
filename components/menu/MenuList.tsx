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
    id: "sin",
    text: "Sine",
    icon: "",
    href: "/sine",
  },
  { id: "random", text: "Random", icon: "", href: "/random" },
  { id: "static", text: "Static", icon: "", href: "/random" },
  { id: "histogram", text: "Histogram", icon: "", href: "/histogram" },
  { id: "radar", text: "Radar", icon: "", href: "/histogram" },
  { id: "offScreen", text: "OffScreen", icon: "", href: "/offScreen" },
] as MenuListType[];
