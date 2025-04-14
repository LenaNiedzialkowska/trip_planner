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
import ResponsiveAppBar from "./appBar.tsx";
import CategoryList from "../packingList/categoryList.tsx";
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import CardTravelIcon from '@mui/icons-material/CardTravel';
import Trips from "../trips/showTrips.tsx";

const drawerWidth = 240;
interface Trips {
  id: number;
  name: string;
  number_of_destinations: number;
  start_date: Date;
  end_date: Date;
  cost: number;
  user_id: number;
}

export default function ClippedDrawer() {
  const [selectedTab, setSelectedTab] = React.useState("Plan");
  const [selectedCategoryId, setSelectedCategoryId] = React.useState<
    number | null
  >(null);
  const [selectedTrip, setSelectedTrip] = React.useState<number | null>(null);

  const getTripId = async () => {
    const id = 1;
    try {
      const response = await fetch(`http://localhost:5000/api/trips`);
      const jsonData: Trips[] = await response.json();
      console.log(jsonData);
    } catch (error) {
      console.error(error.message);
    }
  };

  const tabs = ["Trips", "Plan", "Budget", "Packing"];
  return (
    <Box sx={{ display: "flex" }}>
      <CssBaseline />
      <AppBar
        position="fixed"
        sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}
      >
        {/* <Toolbar>
          <Typography variant="h6" noWrap component="div">
            Clipped drawer
          </Typography>
        </Toolbar> */}
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
        {/* <Toolbar /> */}
        <Box sx={{ overflow: "auto" }}>
          <List>

            {["Trips", "Account", "Plan", "Budget", "Packing"].map((text, index) => (
              <ListItem key={text} disablePadding>
                <ListItemButton
                  onClick={() => setSelectedTab(text)}
                  selected={selectedTab === text}
                  disabled={text !== "Trips" && !selectedTrip}
                >
                  <ListItemIcon>
                    {index === 0 && <CardTravelIcon/>}
                    {index === 1 && <AccountCircleIcon/>}
                    {index === 2 && <LocationOnIcon />}
                    {index === 3 && <AttachMoneyIcon />}
                    {index === 4 && <ChecklistIcon />}
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
        {/* <Toolbar /> */}
        
        {selectedTab === "Trips" && (
          <Trips selectedTrip={selectedTrip} setSelectedTrip={setSelectedTrip} />
        )}
                {selectedTab === "Packing" && (
          <div className="grid grid-cols-2 justify-items-center">
            <>
              <CategoryList
                selectedCategoryId={selectedCategoryId}
                setSelectedCategoryId={setSelectedCategoryId}
                trip_id={selectedTrip}
              />
              {selectedCategoryId && (
                <PackingList item_category_id={selectedCategoryId} />
              )}
            </>
          </div>
        )}
      </Box>
    </Box>
  );
}
