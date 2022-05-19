import React, { Component } from "react";
import { withStyles } from "@material-ui/styles";

const styles = {
  modal: {
    top: "50%",
    position: "fixed",
    left: "50%",
    transform: "translate(-50%, -50%)",
    backgroundColor: "#fff",
    width: "30vw",
    boxShadow: `0 0 4px #000 !important`,
    opacity: "0.90",
  },
  closeButton: {
    cursor: "pointer",
    fontSize: 40,
    position: "absolute",
    top: 0,
    right: 5,
  },
  welcomeMessage: {
    paddingLeft: "2vw",
    paddingRight: "2vw",
    fontSize: 20,
  },
};

class PopUp extends Component {
  constructor(props) {
    super(props);
    this.state = {
      show: true,
    };
  }

  handleClick = () => {
    this.setState({
      show: false,
    });
  };

  render() {
    const classes = this.props.classes;
    if (this.state.show) {
      return (
        <div className={classes.modal}>
          <div className="modal_content">
            <span className={classes.closeButton} onClick={this.handleClick}>
              &times;{" "}
            </span>
            <p className={classes.welcomeMessage}>Hello! Welcome to my site!</p>
            <p className={classes.welcomeMessage}>
              {" "}
              I created this website to showcase some of the things that I am
              passionate about. The background photos are all photos that I took
              (or that were taken of me) during my travels. You can use the menu
              on the left to navigate to different portions of my site. Enjoy!
            </p>
          </div>
        </div>
      );
    } else {
      return null;
    }
  }
}

export default withStyles(styles)(PopUp);
