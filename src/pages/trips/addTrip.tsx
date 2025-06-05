import { Typography } from "@mui/material";
import dayjs, { Dayjs } from "dayjs";
import React, { Fragment, useState } from "react";

interface Props {
    setRefreshFlag: React.Dispatch<React.SetStateAction<boolean>>;
    user_id?: string;
}



export default function AddTrip({
    setRefreshFlag,
    user_id,
}: Props) {
    const [tripName, setTripName] = useState("");
    const [startDate, setStartDate] = useState<Dayjs>();
    const [endDate, setEndDate] = useState<Dayjs>();
    const [image, setImage] = useState<File | null>(null);
    const [tripImages, setTripImages] = useState<File[]>([]);

    const addTripImage = async (tripId: string) => {
        try {
            const formData = new FormData();
            if (!image) {
                console.error("No image selected for upload.");
                return;
            }
            formData.append("id", tripId);
            formData.append("image", image);
            formData.append("filename", image.name);
            formData.append("mime_type", image.type);

            const response = await fetch(`http://localhost:5000/api/tripImages`, {
                method: "POST",
                body: formData
            })
            const jsonData = await response.json();
            setTripImages((prevImages) => [...prevImages, image]);
        } catch (error) {
            console.error("Error uploading image:", error);
        }
    }


    const onSubmitForm = async (e) => {
        e.preventDefault();
        let response;
        try {

            const body = {
                name: tripName,
                start_date: dayjs(startDate?.toDate()).format("YYYY-MM-DD"),
                end_date: dayjs(endDate?.toDate()).format("YYYY-MM-DD"),
                cost: 0,
                user_id: user_id,
            };
            response = await fetch(`http://localhost:5000/api/trips`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(body),
            });

            setRefreshFlag(true);
        } catch (error) {
            console.error(error.message);
        }
        if (response.ok) {
            const trip = await response.json();
            await addTripImage(trip.id);
            openPopup();
        }


    };

    const openPopup = async () => {
        const popup = document.getElementById("categoryPopup");
        const popupBg = document.getElementById("categoryPopup-bg");
        if (popup) {
            popup.classList.toggle("hidden");
            popupBg?.classList.toggle("hidden");
        }
    }

    return (
        <div>
            <div id="categoryPopup-bg" className="w-screen h-screen hidden bg-black/50 fixed top-0 left-0  z-[10000]" onClick={openPopup}></div>
            <div
                id="categoryPopup"
                className="flex flex-col items-center m-[auto]  justify-center hidden absolute bg-white shadow-lg rounded-lg p-4 w-[50vw] h-[70vh] z-[10001] overflow-y-auto top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 Overflow-y-auto "
            >
                <Typography variant="h5" className="text-center font-semibold mb-4">
                    Create a new trip  </  Typography>
                <form className="flex flex-col content-end flex-wrap mb-4 w-[50%] items-center" onSubmit={onSubmitForm}>
                    <div className="w-full">
                        <label className="block text-md font-semibold text-gray-800 mt-4 flex items-center gap-2">Trip name</label>
                        <input
                            type="text"
                            value={tripName}
                            onChange={(e) => setTripName(e.target.value)}
                            required
                            className="w-full p-3 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="Trip name"
                        />
                    </div>
                    <div className="w-full">
                        <label className="block text-md font-semibold text-gray-800 mt-4 flex items-center gap-2">Start date</label>
                        <input
                            type="date"
                            // value={startDate?.toString()}
                            max={endDate?.format("YYYY-MM-DD")}
                            onChange={(e) => setStartDate(dayjs(e.target.value))}
                            required
                            className="w-full p-3 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="Start date"
                        />
                    </div>
                    <div className="w-full">
                        <label className="block text-md font-semibold text-gray-800 mt-4 flex items-center gap-2">End date</label>
                        <input
                            type="date"
                            // value={endDate}
                            min={startDate?.format("YYYY-MM-DD")}
                            onChange={(e) => setEndDate(dayjs(e.target.value))}
                            required
                            className="w-full p-3 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="End date"
                        />
                    </div>
                    <div className="w-full">
                        <label htmlFor="imageInput" className="block text-md font-semibold text-gray-800 mt-4 flex items-center gap-2">
                            Add Images
                        </label>
                        <input
                            id="imageInput"
                            type="file"
                            accept="image/*"
                            onChange={(e) => setImage(e.target.files?.[0] || null)}
                            className="block w-full text-sm text-gray-700
               file:mr-4 file:py-2 file:px-4
               file:rounded-md file:border-0
               file:text-sm file:font-semibold
               file:bg-blue-50 file:text-blue-700
               hover:file:bg-blue-100
               border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                        />
                    </div>


                    <button
                        type="submit"
                        className="w-full py-3 mt-4 bg-blue-600 text-white font-semibold rounded-md hover:bg-blue-700 transition"
                    >
                        Start planning
                    </button>
                </form>

                <div className="grid grid-cols-2 gap-1 overflow-auto max-h-[60%]">

                </div>


            </div>
            <Fragment>
                {/* <div className="pl-2 border-2 border-grey rounded-lg shadow-md shadow-grey-500/50"> */}
                <button
                    className="bg-transparent hover:bg-blue-400 text-blue-400 font-semibold hover:text-white py-2 px-4 border border-blue-400 hover:border-transparent rounded-lg duration-300 ease-in-out"
                    //   disabled={newTripName ? false : true}
                    onClick={() => openPopup()}
                >
                    {"Create new trip"}
                </button>
                {/* </div> */}
            </Fragment>
        </div>

    );
}
