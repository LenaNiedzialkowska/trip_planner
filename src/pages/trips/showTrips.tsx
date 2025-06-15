import { Box, Divider, Typography } from "@mui/material";
import * as React from "react";
import AddTrip from "./addTrip.tsx";
import EditTrip from "./editTrip.tsx";
import { FaMoon } from "react-icons/fa6";
import Carousel from "./imgCarousel.tsx";
import { calculateNumberOfNights } from "./dateUtils.ts";

interface Trips {
  id: string;
  name: string;
  number_of_destinations: number;
  start_date: Date;
  end_date: Date;
  number_of_nights: number;
  cost: number;
  user_id: string;
}

interface TripsProps {
  selectedTrip: string | null;
  setSelectedTrip: React.Dispatch<React.SetStateAction<string | null>>;
  numberOfNights: number | null;
  setNumberOfNights: React.Dispatch<React.SetStateAction<number | null>>;
  setTripName: React.Dispatch<React.SetStateAction<string>>;
  user_id?: string;
  setTripStartDate: React.Dispatch<React.SetStateAction<Date | null>>;
  setNumberOfTrips: React.Dispatch<React.SetStateAction<number>>;
}

export default function Trips({ selectedTrip, setSelectedTrip, numberOfNights, setNumberOfNights, setTripName, user_id, setTripStartDate, setNumberOfTrips }: TripsProps) {

  const [trips, setTrips] = React.useState<Trips[]>();
  const [refreshFlag, setRefreshFlag] = React.useState<boolean>(false);
  const [tripImages, setTripImages] = React.useState<{ [tripId: string]: string[] }>({});

  const getTrips = async () => {
    try {
      const response = await fetch(
        `http://localhost:5000/api/trips/${user_id}`
      );
      const jsonData: Trips[] = await response.json();
      console.log(jsonData);
      setTrips(jsonData);
    } catch (error) {
      console.error(error.message);
    }
  };

  const getTripImages = async (tripId: string) => {
    try {
      const res = await fetch(`http://localhost:5000/api/tripImages/${tripId}`);
      const data = await res.json();
      setTripImages(prev => ({
        ...prev,
        [tripId]: data.map(img => img.url)
      }));
    } catch (error) {
      console.log("Failed to fetch trip images:", error.message);
    }

  }

  React.useEffect(() => {
    setSelectedTrip(null);
    getTrips();
    setRefreshFlag(false);

  }, [refreshFlag]);

  React.useEffect(() => {
    if (trips && trips.length > 0) {
      setTripName(trips[0].name);
      console.log("Setting trip start date to: ", trips[0].start_date);
      console.log("Setting trip name to: ", trips[0].name);
      trips.forEach(trip => getTripImages(trip.id));
      setNumberOfTrips(trips.length);
    }
  }, [trips]);

  return (
    <div className="flex flex-col items-center h-full px-8 py-4 max-w-[960px] mx-auto">
      <Typography variant="h4" sx={{ mt: 10, mb: 2 }}>
        Trips
      </Typography>

      <div className="text-center">
        {trips && trips.length === 0 && (
          <><Typography variant="h5"> Nothing planned... yet!</Typography><Typography variant="h5">Every great story starts with a single step. Start your travel story now by creating a new trip!</Typography></>

        )}
        {trips && trips.length > 0 && (
          <><Typography variant="h5">Welcome back!</Typography><Typography variant="h5">These are your upcoming adventures.</Typography></>

        )}
      </div>
      <Divider sx={{ mt: 4 }} />
      <AddTrip setRefreshFlag={setRefreshFlag} user_id={user_id} />
      <Divider sx={{ mt: 2 }} />
      {trips?.map(trip => {
        return (
          <Box sx={{ display: "flex" }} key={trip.id}>
            <div className="flex flex-col my-4 w-[700px]  py-[1rem] px-[1.5rem] shadow-md hover:shadow-gray-400/80 ease-in-out transition duration-200 cursor-pointer rounded-lg">
              <div className="flex justify-end">
                <EditTrip
                  setRefreshFlag={setRefreshFlag}
                  user_id={user_id}
                  trip_id={trip.id}
                  name={trip.name}
                  number_of_destinations={trip.number_of_destinations}
                  start_date={trip.start_date}
                  end_date={trip.end_date}
                  number_of_nights={trip.number_of_nights}
                  cost={trip.cost}
                  tripImages={tripImages}
                  setTripImages={setTripImages}
                />
              </div>
              <div
                onClick={() => { setSelectedTrip(trip.id); setNumberOfNights(calculateNumberOfNights(trip.start_date, trip.end_date)); setTripStartDate(new Date(trip.start_date)); }}
                key={trip.id}
              >
                <Typography variant="h5" className="text-center">{trip.name}</Typography >
                {/* <img alt="vacations" className="w-[700px] h-[300px]" src="https://encrypted-tbn2.gstatic.com/licensed-image?q=tbn:ANd9GcSaxhCejgMF1G8dnUqdRX2X9MflQbbBcO4ydLN2J7OCt07X3buX-ki-1ZUyQbvmIhSBEKKPIVR7UYq0VOQHQWTlmZ_QuWB_w-_1Fh_0cA"></img> */}
                <Typography variant="h6" className="text-gray-600">{new Date(trip.start_date).toLocaleDateString()} - {new Date(trip.end_date).toLocaleDateString()}</Typography>
                <div className="flex items-center gap-2 text-gray-600">
                  <FaMoon />
                  <Typography variant="h6"> {"  "}{calculateNumberOfNights(trip.start_date, trip.end_date)} {" nights"}</Typography>
                </div>
                {/* {tripImages[trip.id]?.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-2">
                    {tripImages[trip.id].map((url, idx) => (
                      <img
                        key={idx}
                        src={url}
                        alt={`Trip ${trip.name} image ${idx + 1}`}
                        className="w-[700px] h-[300px] object-cover rounded shadow"
                      />
                    ))}
                    
                  </div>
                )} */}
                <Carousel images={tripImages[trip.id] || []} />


              </div>

            </div>
            <Divider sx={{ mt: 2 }} />
          </Box>
        );
      })}
    </div>
  );
}
