import React from "react";
import { Switch, Route } from "react-router-dom";
import Home from "./Home";
import Travel from "./Travel";

class Router extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <Switch>
        <Route path="/home" component={Home} />
        <Route path="/travel" component={Travel} />
        <Route path="/" component={Home} />
      </Switch>
    );
  }
}

export default Router;
