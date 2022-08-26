import { useState, useEffect } from "react";
import Gallery from "react-photo-gallery";
import preval from "preval.macro";
import CloseIcon from "@mui/icons-material/Close";
import { makeStyles, Theme } from "@material-ui/core/styles";
import { API_HOME_PHOTOS } from "../utils/backend";
import { getRandomSubarray } from "../utils/formulas";
import { objectKeysSnakeCasetoCamelCase } from "../utils/backend";
import Photo from "../types/photo";

const NUMBER_OF_PHOTOS = 40;

const styles = makeStyles((theme: Theme) => ({
  container: {
    height: "100%",
  },
  gallery: {
    height: "100%",
    overflow: "scroll",
    scrollbarWidth: "none",
    "&::-webkit-scrollbar": {
      display: "none",
    },
  },
  buildInfo: {
    textAlign: "center",
  },
  modal: {
    top: "50%",
    position: "fixed",
    left: "50%",
    transform: "translate(-50%, -50%)",
    backgroundColor: theme.palette.common.white,
    width: "30vw",
    boxShadow: theme.shadows[24],
    opacity: 0.9,
  },
  closeButton: {
    cursor: "pointer",
    fontSize: 40,
    position: "absolute",
    top: 5,
    right: 5,
  },
  welcomeMessage: {
    paddingLeft: "2vw",
    paddingRight: "2vw",
    fontSize: 20,
  },
}));

export default function Home() {
  const classes = styles();

  const [images, setImages] = useState<Photo[]>([]);
  const [popUpOpen, setPopUpOpen] = useState<boolean>(true);

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

  const popUp = (
    <div className={classes.modal}>
      <div className="modal_content">
        <CloseIcon
          className={classes.closeButton}
          onClick={() => setPopUpOpen(false)}
        />
        <p className={classes.welcomeMessage}>
          {
            "I created this website to showcase some of the things that I am \
        passionate about. The background photos are all photos that I took \
        (or that were taken of me) during my travels. You can use the menu \
        on the left to navigate to different portions of my site. Enjoy!"
          }
        </p>
      </div>
    </div>
  );

  return (
    <div className={classes.container}>
      <div className={classes.gallery}>
        <Gallery photos={images} />
        <p className={classes.buildInfo}>
          Build Date: {preval`module.exports = new Date().toLocaleString();`}.
        </p>
      </div>
      {popUpOpen ? popUp : null}
    </div>
  );
}
