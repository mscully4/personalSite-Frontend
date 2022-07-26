import React from "react";
import Gallery from "react-photo-gallery";
import { withStyles } from "@material-ui/styles";
import Navigation from "../components/Navigation";
import Popup from "../components/Popup";
import { API_HOME_PHOTOS } from "../utils/Constants";
import { getRandomSubarray } from "../utils/Formulas";
import preval from "preval.macro";
import { useState, useEffect } from "react";
import { makeStyles, Theme } from "@material-ui/core/styles";
import { objectKeysSnakeCasetoCamelCase } from "../utils/backend";
import Photo from "../types/photo";

const NUMBER_OF_PHOTOS = 40;

const styles = makeStyles((theme: Theme) => ({
  gallery: {
    height: "92.5vh",
    overflow: "scroll",
    scrollbarWidth: "none",
    "&::-webkit-scrollbar": {
      display: "none",
    },
  },
  buildInfo: {
    textAlign: "center",
  },
}));

const theme = {
  navBarBackgroundColor: "#ffffff",
  logoColor: "#000000",
  menuBackgroundColor: "#ffffff",
  cardBackgroundColor: "#ffffff",
  iconFillColor: "#000000",
};

interface HomeProps {}

export default function Home(props: HomeProps) {
  const classes = styles();

  const [images, setImages] = useState<Photo[]>([]);

  useEffect(() => {
    fetch(API_HOME_PHOTOS)
      .then((res) => res.json())
      .then((json) => json.map((el) => el.Entity))
      .then((json) => {
        json.map((obj) => {
          obj.width = parseInt(obj.width);
          obj.height = parseInt(obj.height);
          return objectKeysSnakeCasetoCamelCase(obj);
        });
        setImages(getRandomSubarray(json, NUMBER_OF_PHOTOS));
      });
  }, []);

  return (
    <div>
      <Navigation theme={theme} />
      <div className={classes.gallery}>
        <Gallery photos={images} />
        <p className={classes.buildInfo}>
          Build Date: {preval`module.exports = new Date().toLocaleString();`}.
        </p>
      </div>
      <Popup />
    </div>
  );
}
