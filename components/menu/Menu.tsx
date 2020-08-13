import React from "react";
import { useMediaQuery } from "@material-ui/core";

import { MenuList } from "./MenuList";

import MenuTop from "./MenuTop";
import HamMenu from "./MenuHam";

type Props = {
  id?: string;
  //title?: string;
};

export default function Menu({ id }: Props): JSX.Element {
  const small = useMediaQuery("(max-width:800px)");
  return (
    <div>
      {small ? (
        <HamMenu menuList={MenuList} pageId={id ? id : ""} />
      ) : (
        <MenuTop menuList={MenuList} pageId={id ? id : ""} />
      )}
    </div>
  );
}
