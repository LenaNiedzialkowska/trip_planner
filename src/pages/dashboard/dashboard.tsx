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
import BasicDateCalendar from "../plan/calendar.tsx";
import SettingsIcon from '@mui/icons-material/Settings';
import { useParams } from "react-router-dom";
import { setRef } from "@mui/material";

const drawerWidth = 240;
interface Trips {
  id: string;
  name: string;
  number_of_destinations: number;
  start_date: Date;
  end_date: Date;
  cost: number;
  user_id: string;
}

interface Props{
  userID: string | null;
}


export default function MyApp() {
  const { userID } = useParams();
  const [selectedTab, setSelectedTab] = React.useState("Trips");
  const [selectedCategoryId, setSelectedCategoryId] = React.useState<
    string | null
  >(null);
  const [selectedCategoryName, setSelectedCategoryName] = React.useState<string>("");
  const [selectedTrip, setSelectedTrip] = React.useState<string | null>(null);
  const [numberOfNights, setNumberOfNights] = React.useState<number | null>(null);
  const [refreshPackedItemsFlag, setRefreshPackedItemsFlag] = React.useState(false);
  const [tripName, setTripName] = React.useState<string>("");
  const [userName, setUserName] = React.useState<string>("");
  const [refreshFlag, setRefreshFlag] = React.useState(false);
  const [tripStartDate, setTripStartDate] = React.useState<Date | null>(null);
  const [numberOfTrips, setNumberOfTrips] = React.useState<number>(0);

  // const getTripId = async () => {
  //   const id = 1;
  //   try {
  //     const response = await fetch(`http://localhost:5000/api/trips`);
  //     const jsonData: Trips[] = await response.json();
  //     console.log(jsonData);
  //   } catch (error) {
  //     console.error(error.message);
  //   }
  // };

  //fetch user name
  const getUserName = async () =>{
    try {
      const response = await fetch(`http://localhost:5000/api/auth/users/${userID}`);
      if(response.ok){
        const userData = await response.json();
        console.log("User data: ", userData);
        setUserName(userData.username);
        setRefreshFlag(true);
      }
    } catch (error) {
      console.log(error.message);
    }
  }
  //fetch count trips for user

  React.useEffect(() => {
    if(userID){
      getUserName();
      console.log("User ID: ", userID);
      if(userName)
      console.log("User name:", userName)
    }
    setRefreshFlag(false);
  },[userID, refreshFlag])


  React.useEffect(()=>{
    if(selectedTrip){
      setSelectedTab("Plan");
    }
  },[selectedTrip]);

    React.useEffect(()=>{
    if(tripStartDate){
      console.log("Trip start date set to: ", tripStartDate);
    }
  },[tripStartDate]);

  // const tabs = ["Trips", "Plan", "Packing"];
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
        <Box
          sx={{
            overflow: "auto",
            // bgcolor: "background.paper", 
            // borderRadius: 3, 
            // boxShadow: 3, 
            p: 3,
            // maxWidth: 300, 
            // mx: "auto" 
          }}
        >
          <List>
            <Box sx={{ display: "flex", justifyContent: "center", mt: 4, mb: 2 }}>
              <AccountCircleIcon sx={{ width: 120, height: 120, color: "primary.main" }} />
            </Box>
            <Typography variant="h5" sx={{ textAlign: "center", fontWeight: "bold", mb: 2 }}>
              {userName || "User Name"}
            </Typography>
            <Typography variant="subtitle1" sx={{ textAlign: "center", fontWeight: "medium", mb: 1 }}>
              Trips: {numberOfTrips}
            </Typography>
            <Divider sx={{ mb: 2 }} />

            {["Trips", "Plan", "Packing"].map((text, index) => (
              <ListItem key={text} disablePadding sx={{ mb: 1 }}>
                <ListItemButton
                  onClick={() => setSelectedTab(text)}
                  selected={selectedTab === text}
                  disabled={text !== "Trips" && !selectedTrip}
                  sx={{
                    borderRadius: 2,
                    "&.Mui-selected": {
                      bgcolor: "primary.light",
                      color: "primary.contrastText",
                      "& .MuiListItemIcon-root": { color: "primary.contrastText" },
                    },
                  }}
                >
                  <ListItemIcon sx={{ minWidth: 40 }}>
                    {index === 0 && <CardTravelIcon />}
                    {index === 1 && <LocationOnIcon />}
                    {/* {index === 2 && <AttachMoneyIcon />} */}
                    {index === 2 && <ChecklistIcon />}
                  </ListItemIcon>
                  <ListItemText primary={text} />
                </ListItemButton>
              </ListItem>
            ))}
          </List>
          <Divider sx={{ mt: 2 }} />
          
          <Box>
            <ListItemButton
              sx={{
                borderRadius: 2,
                marginTop: 20,
                "&.Mui-selected": {
                  bgcolor: "primary.light",
                  color: "primary.contrastText",
                  "& .MuiListItemIcon-root": { color: "primary.contrastText" },
                },
              }}
            >
              <ListItemIcon sx={{ minWidth: 40 }}>
                <SettingsIcon />
              </ListItemIcon>
              <ListItemText primary={"Settings"} />
            </ListItemButton>
          </Box>
        </Box>

      </Drawer>
      <Box component="main" sx={{ flexGrow: 1, height: "100%" }}>
        {/* <Toolbar /> */}

        {selectedTab === "Trips" && (
          <Trips 
          selectedTrip={selectedTrip} 
          setSelectedTrip={setSelectedTrip} 
          numberOfNights={numberOfNights} 
          setNumberOfNights={setNumberOfNights} 
          setTripName={setTripName} 
          user_id={userID}
          setTripStartDate={setTripStartDate}
          setNumberOfTrips={setNumberOfTrips}
          />
        )}
        {selectedTab === "Packing" && (
          <div className="grid grid-cols-2 justify-items-center h-[100vh]">
            <>
              <CategoryList
                selectedCategoryId={selectedCategoryId}
                setSelectedCategoryId={setSelectedCategoryId}
                selectedCategoryName={selectedCategoryName}
                setSelectedCategoryName={setSelectedCategoryName}
                trip_id={selectedTrip}
                refreshPackedItemsFlag={refreshPackedItemsFlag}
                setRefreshPackedItemsFlag={setRefreshPackedItemsFlag}
                numberOfNights={numberOfNights}
              />
              {selectedCategoryId && (
                <PackingList
                  item_category_id={selectedCategoryId}
                  selectedCategoryName={selectedCategoryName}
                  setSelectedCategoryName={setSelectedCategoryName}
                  refreshPackedItemsFlag={refreshPackedItemsFlag}
                  setRefreshPackedItemsFlag={setRefreshPackedItemsFlag} />
              )}
            </>
          </div>
        )}
        {selectedTrip && selectedTab === "Plan" && tripStartDate && (<BasicDateCalendar trip_id={selectedTrip} tripName={tripName} tripStartDate={tripStartDate}/>)}
      </Box>
    </Box>
  );
}
