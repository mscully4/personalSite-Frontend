import React from "react";
import Gallery from "react-photo-gallery";
import { withStyles } from "@material-ui/styles";
import Navigation from "../components/Navigation";
import Popup from "../components/Popup";
import { API_HOME_PHOTOS } from "../utils/Constants";
import { getRandomSubarray } from "../utils/Formulas";

const NUMBER_OF_PHOTOS = 40;

const styles = (theme) => ({
  gallery: {
    height: "92.5vh",
    overflow: "scroll",
    scrollbarWidth: "none",
    "&::-webkit-scrollbar": {
      display: "none",
    },
  },
});

const theme = {
  navBarBackgroundColor: "#ffffff",
  logoColor: "#000000",
  menuBackgroundColor: "#ffffff",
  cardBackgroundColor: "#ffffff",
  iconFillColor: "#000000",
};

class Home extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      images: [],
    };
  }

  componentDidMount = () => {
    fetch(API_HOME_PHOTOS)
      .then((res) => res.json())
      .then((json) => json.map((el) => el.Entity))
      .then((json) => {
        json.map((obj) => {
          obj.width = parseInt(obj.width);
          obj.height = parseInt(obj.height);
          return obj;
        });
        this.setState({
          images: getRandomSubarray(json, NUMBER_OF_PHOTOS),
        });
      });
  };

  render() {
    const classes = this.props.classes;
    return (
      <div>
        <Navigation theme={theme} />
        <div className={classes.gallery}>
          <Gallery photos={this.state.images} />
        </div>
        <Popup />
      </div>
    );
  }
}

export default withStyles(styles)(Home);
