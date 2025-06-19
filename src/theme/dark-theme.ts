import { createTheme } from "@mui/material";

export const darkTheme = createTheme({
  palette: {
    mode: "dark",
    background: {
      default: "#0f1214",
      paper: "#11171d",
    },
    text: {
      primary: "#ffffff",
      secondary: "#aaaaaa",
    },
  },
  shape: {
    borderRadius: 10,
  },
});
