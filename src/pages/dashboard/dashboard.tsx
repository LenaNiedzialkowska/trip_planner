import * as React from "react";
import Box from "@mui/material/Box";
import Drawer from "@mui/material/Drawer";
import AppBar from "@mui/material/AppBar";
import CssBaseline from "@mui/material/CssBaseline";
import Toolbar from "@mui/material/Toolbar";
import List from "@mui/material/List";
import Typography from "@mui/material/Typography";
import Divider from "@mui/material/Divider";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import AttachMoneyIcon from "@mui/icons-material/AttachMoney";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import ChecklistIcon from "@mui/icons-material/Checklist";
import PackingList from "../packingList/packingList.tsx";

const drawerWidth = 240;

export default function ClippedDrawer() {
  const [selectedTab, setSelectedTab] = React.useState("Plan");

  const tabs = {
    // Plan: <PlanComponent />,
    // Budget: <BudgetComponent />,
    Packing: <PackingList />,
  };
  return (
    <Box sx={{ display: "flex" }}>
      <CssBaseline />
      <AppBar
        position="fixed"
        sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}
      >
        <Toolbar>
          <Typography variant="h6" noWrap component="div">
            Clipped drawer
          </Typography>
        </Toolbar>
      </AppBar>
      <Drawer
        variant="permanent"
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          [`& .MuiDrawer-paper`]: {
            width: drawerWidth,
            boxSizing: "border-box",
          },
        }}
      >
        <Toolbar />
        <Box sx={{ overflow: "auto" }}>
          <List>
            {["Plan", "Budget", "Packing"].map((text, index) => (
              <ListItem key={text} disablePadding>
                <ListItemButton
                  onClick={() => setSelectedTab(text)}
                  selected={selectedTab === text}
                >
                  <ListItemIcon>
                    {index === 0 && <AttachMoneyIcon />}
                    {index === 1 && <LocationOnIcon />}
                    {index === 2 && <ChecklistIcon />}
                  </ListItemIcon>
                  <ListItemText primary={text} />
                </ListItemButton>
              </ListItem>
            ))}
          </List>
          <Divider />
        </Box>
      </Drawer>
      <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
        <Toolbar />
        {tabs[selectedTab]}
      </Box>
    </Box>
  );
}
