import React from "react";
import Slider, { SliderProps } from "@material-ui/core/Slider";
//import Typography from "@material-ui/core/Typography";
//import Tooltip from "@material-ui/core/Tooltip";
import { withStyles } from "@material-ui/core/styles";

//rgba(136, 136, 136, 0.5)

const PrettoSlider = withStyles({
  root: {
    //color: color,
    height: "1em",
  },
  thumb: {
    height: "2em",
    zIndex: 0,
    width: "2em",
    borderRadius: "0.5em",
    backgroundColor: "darkslategrey",
    border: `0.2em solid rgba(136, 136, 136, 0.5)`,
    marginTop: "-0.5em",
    marginLeft: "-1em",
    "&:focus, &:hover, &$active": {
      boxShadow: "inherit",
    },
  },
  active: {},
  valueLabel: {
    left: "calc(-50% + 1em + 0.2em)",
  },
  track: {
    height: "1em",
    borderRadius: "0.2em",
  },
  rail: {
    height: "1em",
    borderRadius: "0.2em",
  },
})(Slider);

export default function CustomSlider(props: SliderProps): JSX.Element {
  //const classes = useStyles();

  return (
    <div>
      <PrettoSlider {...props} />
    </div>
  );
}
