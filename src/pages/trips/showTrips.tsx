import * as React from "react";

interface Trips {
    id: number;
    name: string;
    number_of_destinations: number;
    start_date: Date;
    end_date: Date;
    cost: number;
    user_id: number;
  }

interface TripsProps {
    selectedTrip: number | null;
    setSelectedTrip: React.Dispatch<React.SetStateAction<number | null>>;
}

export default function Trips({selectedTrip, setSelectedTrip}: TripsProps) {

    const [trips, setTrips] = React.useState<Trips[]>();

    const getTrips = async () => {
        try {
          const response = await fetch(
            `http://localhost:5000/api/trips`
          );
          const jsonData: Trips[] = await response.json();
          console.log(jsonData);
          setTrips(jsonData);
        } catch (error) {
          console.error(error.message);
        }
      };

    React.useEffect(()=>{
        setSelectedTrip(null);
        getTrips();
    },[]);

  return (
    <div className="flex flex-col items-center h-full px-8 py-4 max-w-[960px] mx-auto">

      {trips?.map(trip =>{
        return (
            <div 
            onClick={() => setSelectedTrip(trip.id)}
            key={trip.id} 
            className="flex flex-col my-4 w-[700px]  py-[1rem] px-[1.5rem] shadow-md hover:shadow-gray-400/80 ease-in-out transition duration-200 cursor-pointer rounded-lg">
                <header>{trip.name}</header>
                {/* <img alt="vacations" className="w-[700px] h-[300px]" src="https://encrypted-tbn2.gstatic.com/licensed-image?q=tbn:ANd9GcSaxhCejgMF1G8dnUqdRX2X9MflQbbBcO4ydLN2J7OCt07X3buX-ki-1ZUyQbvmIhSBEKKPIVR7UYq0VOQHQWTlmZ_QuWB_w-_1Fh_0cA"></img> */}
                <h1> Start Date: {new Date(trip.start_date).toLocaleDateString()}</h1>
                <h1> End Date: {new Date(trip.end_date).toLocaleDateString()}</h1>
                <h1> Nights: {" "}{Math.abs((new Date(trip.end_date).getTime() - new Date(trip.start_date).getTime())/(1000*60*60*24))} {" "}</h1>
            </div>
        );
      })}
    </div>
  );
}
