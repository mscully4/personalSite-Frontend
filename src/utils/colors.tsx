import { createTheme, Theme } from "@mui/material/styles";

export const lightTheme: Theme = createTheme({
  palette: {
    primary: {
      dark: "#235E9A",
      main: "#016aff",
    },
  },
});

export const foo = {
  tuftsBlue: "#1c7ad9",
  blackCoffee: "#342e37",
  eggshell: "#f0ebd8",
  blue: "#016aff",
};

export const pinColors = [
  "#0084FF",
  "#44BEC7",
  "#FFC300",
  "#FA3C4C",
  "#D696BB",
  "#3FB1CE",
  "#17A589", // Turquoise
];

export const randomPinColor = () => {
  return pinColors[Math.floor(Math.random() * pinColors.length)];
};
