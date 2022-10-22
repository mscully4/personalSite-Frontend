import clsx from "clsx";
import { makeStyles, Theme } from "@material-ui/core/styles";
import { AppBar, Box, Toolbar, Typography } from "@material-ui/core";
import { BreakpointKeys, Orientation } from "../utils/display";
import { NavIcon, navIcons } from "../utils/images";

const styles = makeStyles((theme: Theme) => ({
  navigationBar: {
    backgroundColor: theme.palette.common.white,
    position: "relative",
    boxSizing: "border-box",
  },
  title: {
    fontFamily: "Allura",
    color: theme.palette.text.primary,
  },
  menu: {
    textAlign: "right",
    width: "100%",
  },
  card: {
    marginLeft: 5,
    marginRight: 5,
    display: "flex",
    alignItems: "center",
  },
  icon: {
    width: "6vw",
    maxWidth: 50,
    height: "100%",
    "&:hover": {
      fill: theme.palette.primary.main,
    },
  },
  spacer: {
    width: "100%",
    height: "100%",
  },
}));

interface NavigationProps {
  height: number;
  mediaQueries: Record<Orientation, Partial<Record<BreakpointKeys, boolean>>>;
}

export default function Navigation(props: NavigationProps) {
  const classes = styles();
  const maxIconHeight = props.height * 0.6;

  const createIcon = (navIcon: NavIcon) => {
    return (
      <a href={navIcon.href} title={navIcon.title} className={classes.card}>
        <svg
          className={clsx(classes.icon)}
          style={{ maxHeight: maxIconHeight }}
          xmlns="http://www.w3.org/2000/svg"
          viewBox={navIcon.viewBox}
        >
          {navIcon.paths.map((path, i) => (
            <path key={i} d={path}></path>
          ))}
        </svg>
      </a>
    );
  };

  return (
    <Box sx={{ flexGrow: 1, height: props.height }}>
      <AppBar
        position="static"
        className={classes.navigationBar}
        style={{ height: props.height, overflow: "hidden" }}
      >
        <Toolbar style={{ height: "100%" }}>
          <Typography
            variant="h5"
            style={{ fontSize: `min(5vw, ${props.height * 0.7}px)` }}
            className={clsx(classes.title)}
          >
            Michael Scully
          </Typography>
          <Box sx={{ flexGrow: 1 }} />
          <Box sx={{ display: "flex" }}>
            {navIcons.map((icon) => createIcon(icon))}
          </Box>
        </Toolbar>
      </AppBar>
    </Box>
  );
}
