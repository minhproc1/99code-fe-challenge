// Sidebar.tsx
import {
  Box,
  Drawer,
  List,
  ListItemButton,
  ListItemText,
  Toolbar,
  Typography,
} from "@mui/material";

const drawerWidth = 240;

type SidebarProps = {
  active: string;
  onSelect: (problem: string) => void;
};

export default function Sidebar({ active, onSelect }: SidebarProps) {
  const problems = ["Problem 1", "Problem 2", "Problem 3"];

  return (
    <Drawer
      variant="permanent"
      sx={{
        width: drawerWidth,
        flexShrink: 0,
        [`& .MuiDrawer-paper`]: {
          width: drawerWidth,
          boxSizing: "border-box",
          backgroundColor: "background.default",
          color: "#fff",
        },
      }}
    >
      <Toolbar>
        <Typography variant="h6" noWrap>
          99CodeChallenge
        </Typography>
      </Toolbar>
      <Box sx={{ overflow: "auto" }}>
        <List>
          {problems.map((text) => (
            <ListItemButton
              key={text}
              selected={active === text}
              onClick={() => onSelect(text)}
            >
              <ListItemText primary={text} />
            </ListItemButton>
          ))}
        </List>
      </Box>
    </Drawer>
  );
}
