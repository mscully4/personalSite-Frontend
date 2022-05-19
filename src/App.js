import React from "react";
import { BrowserRouter } from "react-router-dom";
import "./App.css";
import Router from "./views/Router";

class App extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <BrowserRouter>
        <Router />
      </BrowserRouter>
    );
  }
}

export default App;
