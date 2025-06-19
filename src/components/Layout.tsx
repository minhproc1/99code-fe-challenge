import { Box, Container, Grid, Paper } from "@mui/material";
import Problem1 from "./Problem1.tsx";
import Sidebar from "./Sidebar.tsx";
import Problem2 from "./Problem2.tsx";
import { useState } from "react";
import Problem3 from "./Problem3.tsx";

export default function Layout() {
  const [selectedProblem, setSelectedProblem] = useState("Problem 1");

  const renderContent = () => {
    switch (selectedProblem) {
      case "Problem 1":
        return <Problem1 />;
      case "Problem 2":
        return <Problem2 />;
      case "Problem 3":
        return <Problem3 />;
      default:
        return <Box>Not found</Box>;
    }
  };
  return (
    <Box
      sx={{
        bgcolor: "background.default",
        color: "text.primary",
        minHeight: "100vh",
      }}
    >
      <Container maxWidth="lg" sx={{ mt: 4 }}>
        <Grid container spacing={2}>
          <Grid sx={{ md: 4 }}>
            <Sidebar active={selectedProblem} onSelect={setSelectedProblem} />
          </Grid>
          <Grid sx={{ md: 8 }}>
            <Paper elevation={3} sx={{ p: 2, bgcolor: "background.paper" }}>
              {renderContent()}
            </Paper>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
}
