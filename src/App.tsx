import { BrowserRouter } from "react-router-dom";
import "./App.css";
import { Switch, Route } from "react-router-dom";
import Home from "./views/home";
import Travel from "./views/travel";
import Resume from "./views/resume";
import Navigation from "./components/navigation";
import { lightTheme } from "./utils/colors";
import { ThemeProvider } from "@material-ui/styles";

interface AppProps {}

function App(props: AppProps) {
  return (
    <ThemeProvider theme={lightTheme}>
      <Navigation />
      <BrowserRouter>
        <Switch>
          <Route path="/home" component={Home} />
          <Route path="/resume" component={Resume} />
          <Route path="/travel" component={Travel} />
          <Route path="/" component={Home} />
        </Switch>
      </BrowserRouter>
    </ThemeProvider>
  );
}

export default App;
