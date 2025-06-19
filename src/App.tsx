import { ThemeProvider, CssBaseline } from "@mui/material";
import { darkTheme } from "./theme";
import Layout from "./components/Layout.tsx";

export default function App() {
  return (
    <ThemeProvider theme={darkTheme}>
      <CssBaseline />
      <Layout />
    </ThemeProvider>
  );
}
