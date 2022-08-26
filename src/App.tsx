import { ThemeProvider } from "@material-ui/styles";
import { useState } from "react";
import { Switch, Route, BrowserRouter } from "react-router-dom";
import "./App.css";
import Home from "./views/home";
import Travel from "./views/travel";
import Resume from "./views/resume";
import Navigation from "./components/navigation";
import { lightTheme } from "./utils/colors";

const NAV_HEIGHT = 0.075;

function App() {
  const [height, setHeight] = useState(window.innerHeight);
  window.addEventListener("resize", () => {
    if (window.innerHeight !== height) setHeight(window.innerHeight);
  });
  return (
    <ThemeProvider theme={lightTheme}>
      <Navigation height={height * NAV_HEIGHT} />
      <div style={{ height: height * (1 - NAV_HEIGHT) }}>
        <BrowserRouter>
          <Switch>
            <Route path="/home" component={Home} />
            <Route path="/resume" component={Resume} />
            <Route path="/travel" component={Travel} />
            <Route path="/" component={Home} />
          </Switch>
        </BrowserRouter>
      </div>
    </ThemeProvider>
  );
}

export default App;
