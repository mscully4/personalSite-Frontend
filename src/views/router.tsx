import React from "react";
import { Switch, Route } from "react-router-dom";
import Home from "./home";
import Travel from "./travel";
import Resume from "./resume";

class Router extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <Switch>
        <Route path="/home" component={Home} />
        <Route path="/resume" component={Resume} />
        <Route path="/travel" component={Travel} />
        <Route path="/" component={Home} />
      </Switch>
    );
  }
}

export default Router;
