import React, { Fragment, use, useState } from "react";
import AddCategory from "./addCategory.tsx";
import { Typography } from "@mui/material";
import { IoIosClose } from "react-icons/io";

interface Category {
    id: string;
    name: string;
    trip_id: string | null;
    created_at: string;
    itemCount: number;
    packedItemCount: number;
}


interface Props {
    setRefreshFlag: React.Dispatch<React.SetStateAction<boolean>>;
    trip_id: string | null;
    numberOfNights?: number | null;
}

export default function ChooseCategory({
    setRefreshFlag,
    trip_id,
    numberOfNights = 0
}: Props) {
    const [newCategoryName, setNewCategoryName] = useState("");
    const [categoriesList, setCategoriesList] = useState<Category[]>([]);
    const [closePopup, setClosePopup] = useState(false);
    const additionaltCategories =
        [
            "Beach",
            "Child",
            "FirstAid",
            "Documents",
            "Food",
            "Sports",
            "Winter",
            "Camping",
            "Business",
            "Elegant",
            "Pets",
            "Accommodation",
            "Transport",
            "Entertainment",
        ];


    //     const additionaltCategories = [
    //   "Kosmetyki",
    //   "Dokumenty",
    //   "Elektronika",
    //   "Ubrania",
    //   "Jedzenie",
    //   "Nocleg",
    //   "Transport",
    //   "Rozrywka",
    //   "Inne"
    // ];



    const getCategories = async () => {
        //TODO - zmienić na wlasciwe id wycieczki
        // const packing_list_id = 1;
        try {
            const response = await fetch(
                `http://localhost:5000/api/item_category`
            );
            console.log(response);
            setCategoriesList(await response.json());
            setRefreshFlag(true);
        } catch (error) {
            console.error(error.message);
            return 0;
        }
    };

    const openPopup = async () => {
        const popup = document.getElementById("categoryPopup");
        const popupBg = document.getElementById("categoryPopup-bg");
        const popupButton = document.getElementById("close-button-category");
        if (popup) {
            popup.classList.toggle("hidden");
            popupBg?.classList.toggle("hidden");
            popupButton?.classList.toggle("hidden");
            document.body.style.overflow = popup.classList.contains("hidden") ? 'auto' : 'hidden';
            await getCategories();
            console.log(categoriesList)
        }
    }


    React.useEffect(() => {
        getCategories();
    }, [trip_id])

    //po wbraniu kategorii z kafelka generateCategoriesInReact z kategorią
    //Prześlij trip id i liczbe nocy z categoryList 

    const generateCategoriesInReact = async (category) => {
        try {
            await fetch("http://localhost:5000/api/generate-categories", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ category, trip_id: trip_id, nights: numberOfNights }),
            });
            console.log("Kategorie wygenerowane pomyślnie.");
        } catch (error) {
            console.error("Wystąpił błąd:", error.message);
        }
    };

    // React.useEffect(() => {

    //     const fetchAdditionalData = async () => {
    //         for (const category of additionaltCategories) {
    //             await generateCategoriesInReact(category);
    //             console.log(`Generated additional category: ${category}`);
    //         }
    //         setRefreshFlag(true);

    //     }
    //     fetchAdditionalData();
    // }, []);

    React.useEffect(() => {
        if (closePopup) {
            const popup = document.getElementById("categoryPopup");
            const popupBg = document.getElementById("categoryPopup-bg");
            const popupButton = document.getElementById("close-button-category");

            if (popup) {
                popup.classList.add("hidden");
                popupBg?.classList.add("hidden");
                popupButton?.classList.add("hidden");
                document.body.style.overflow = 'auto'; // Reset body overflow
                setClosePopup(false);
            }
        }
    }, [closePopup])

    return (
        <div>
            <div className="flex flex-col content-end flex-wrap mb-4 " onClick={openPopup}>
                <button
                    className="bg-transparent hover:bg-blue-400 text-blue-400 font-semibold hover:text-white py-2 px-4 border border-blue-400 hover:border-transparent rounded-lg transition-all duration-300 ease-in-out"
                >
                    {"Add category"}
                </button>
            </div>
            <div id="categoryPopup-bg" className="backdrop-blur-sm w-screen h-screen hidden bg-black/50 fixed top-0 left-0  z-[10000]" onClick={openPopup}></div>
            <div
                id="categoryPopup"
                className="flex flex-col justify-between hidden absolute bg-white shadow-lg rounded-lg p-4 w-[50vw] h-[70vh] z-[10001] overflow-y-auto top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 Overflow-y-auto"
            >
                <div id="close-button-category"
                    className="hidden  z-[10002] absolute top-4 right-4 text-2xl text-zinc-400 hover:text-blue-500 transition cursor-pointer"
                    aria-label="Zamknij"
                    onClick={openPopup}><IoIosClose size={36} /></div>

                <h2 className="text-xl font-semibold mb-2 text-center">Choose Category</h2>

                {/* <ul className="mt-4">
                        {categoriesList.map((category) => (
                            <li key={category.id} className="py-1">
                                {category.name}
                            </li>
                        ))}
                    </ul> */}
                <div className="grid grid-cols-2 gap-1 overflow-auto max-h-[60%]">
                    {additionaltCategories?.map((value, index) => (
                        <div
                            // style={{
                            //   border: "1px solid #ccc",
                            //   borderRadius: "8px",
                            //   padding: "16px",
                            //   textAlign: "center",
                            // }}
                            onClick={() => { generateCategoriesInReact(value); openPopup(); setRefreshFlag(true) }}
                            className={`border-2 bg-white rounded-lg hover:border-blue-400 p-4 text-center cursor-pointer duration-300 ease-in-out 
                                // {selectedCategoryId === value.id
                                //   ? "border-blue-400"
                                //   : "border:-gray"
                                // }
                                `}

                        >
                            <Typography variant="h6">
                                {value}{" "}
                            </Typography>
                        </div>

                    ))}
                </div>
                <AddCategory
                    setRefreshFlag={setRefreshFlag}
                    trip_id={trip_id}
                    setClosePopup={setClosePopup}
                />
            </div>
        </div>
        // </div>
    );
}

