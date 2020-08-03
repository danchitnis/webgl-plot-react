import React from "react";

import Card from "@material-ui/core/Card";
import CardActionArea from "@material-ui/core/CardActionArea";
import CardActions from "@material-ui/core/CardActions";
import CardContent from "@material-ui/core/CardContent";
import CardMedia from "@material-ui/core/CardMedia";
import Button from "@material-ui/core/Button";
//import Typography from "@material-ui/core/Typography";

type props = {
  imgURL: string;
  content: JSX.Element;
  link?: string;
};

export default function MediaCard({ imgURL, content, link }: props) {
  return (
    <Card style={{ margin: "1em" }} raised={true}>
      <CardActionArea href={link == undefined ? "#" : link}>
        <CardMedia style={{ height: "15em" }} image={imgURL} />
        <CardContent>{content}</CardContent>
      </CardActionArea>

      <CardActions>
        <Button size="small" color="primary" href={link}>
          Learn More
        </Button>
      </CardActions>
    </Card>
  );
}
