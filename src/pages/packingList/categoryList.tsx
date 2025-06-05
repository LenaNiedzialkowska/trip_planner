import React from "react";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import Checkbox from "@mui/material/Checkbox";
import IconButton from "@mui/material/IconButton";
// import CommentIcon from "@mui/icons-material/Comment";
import DeleteIcon from "@mui/icons-material/Delete";
import RemoveIcon from "@mui/icons-material/Remove";
import AddIcon from "@mui/icons-material/Add";
import AddItemInput from "./addItemInput.tsx";
import AddCategory from "./addCategory.tsx";
import { Typography, Grid, Box } from "@mui/material";
import CheckroomIcon from '@mui/icons-material/Checkroom';
import CircularProgress from '@mui/material/CircularProgress';
import LinearProgress from '@mui/material/LinearProgress';
import ChooseCategory from "./chooseCategory.tsx";

interface Category {
  id: string;
  name: string;
  trip_id: string | null;
  created_at: string;
  itemCount: number;
  packedItemCount: number;
}

interface Props {
  selectedCategoryId: string | null;
  setSelectedCategoryId: (id: string) => void;
  selectedCategoryName: string;
  setSelectedCategoryName: React.Dispatch<React.SetStateAction<string>>;
  trip_id: string | null;
  refreshPackedItemsFlag: boolean;
  setRefreshPackedItemsFlag: React.Dispatch<React.SetStateAction<boolean>>;
  numberOfNights?: number | null;
}

export default function CategoryList({
  selectedCategoryId,
  setSelectedCategoryId,
  selectedCategoryName, 
  setSelectedCategoryName,
  trip_id,
  refreshPackedItemsFlag,
  setRefreshPackedItemsFlag,
  numberOfNights,
}: Props) {
  const [checked, setChecked] = React.useState([0]);
  const [categories, setCategories] = React.useState<Category[]>([]);
  const [refreshFlag, setRefreshFlag] = React.useState<boolean>(false);
  const [packingId, setPackingId] = React.useState<number | null>(null);
  const defaultCategories = ["Ubrania", "Kosmetyki", "Elektronika"];
  // const [selectedCategory, setSelectedCategory] =
  //   React.useState<string>("Ubrania");
  const handleToggle = (value: number) => () => {
    const currentIndex = checked.indexOf(value);
    const newChecked = [...checked];

    if (currentIndex === -1) {
      newChecked.push(value);
    } else {
      newChecked.splice(currentIndex, 1);
    }

    setChecked(newChecked);
  };

  // const updateQuantity = async (item: PackingItem, newQuantity: number) => {
  //   try {
  //     const response = await fetch(
  //       `http://localhost:5000/api/packing_items/${item.id}`,
  //       {
  //         method: "PUT",
  //         headers: {
  //           "Content-Type": "application/json",
  //         },
  //         body: JSON.stringify({ quantity: newQuantity }),
  //       }
  //     );
  //     if (!response.ok) {
  //       throw new Error("Failed to change quantity");
  //     }
  //   } catch (error) {
  //     console.error(error.message);
  //   }
  // };

  // const deleteItem = async (item: PackingItem) => {
  //   try {
  //     const response = await fetch(
  //       `http://localhost:5000/api/packing_items/${item.id}`,
  //       {
  //         method: "DELETE",
  //         headers: {
  //           "Content-Type": "application/json",
  //         },
  //         // body: JSON.stringify({}),
  //       }
  //     );
  //     setRefreshFlag(true);
  //     if (!response.ok) {
  //       throw new Error("Failed to delete item");
  //     }
  //   } catch (error) {
  //     console.error(error.message);
  //   }
  // };

  // const addItem = (item: PackingItem) => {
  //   console.log(`adding ${item.quantity}`);
  //   const newQuantity = item.quantity + 1;
  //   updateQuantity(item, newQuantity);
  //   setItems((prevItems) =>
  //     prevItems.map((prevItem) =>
  //       prevItem.id === item.id
  //         ? { ...prevItem, quantity: newQuantity }
  //         : prevItem
  //     )
  //   );
  // };

  // const substractItem = (item: PackingItem) => {
  //   console.log(`substracting ${item.quantity}`);
  //   let newQuantity = item.quantity - 1 <= 1 ? 1 : item.quantity - 1;
  //   updateQuantity(item, newQuantity);
  //   setItems((prevItems) =>
  //     prevItems.map((prevItem) =>
  //       prevItem.id === item.id
  //         ? { ...prevItem, quantity: newQuantity }
  //         : prevItem
  //     )
  //   );
  // };

  const truncateText = (text: string, length: number) => {
    if (text.length >= length) {
      text = text.substring(0, length);
      text += "...";
    }
    return text;
  };

  // const getPackingId = async (trip_id: string | null) => {
  //   try {
  //     if (!trip_id) return;
  //     const response = await fetch(
  //       `http://localhost:5000/api/packing_lists/${trip_id}`
  //     );
  //     if (!response.ok) throw new Error("Błąd pobierania listy pakowania");
  //     const jsonData = await response.json();
  //     if (jsonData.length > 0) {
  //       setPackingId(jsonData[0].id);
  //     }
  //   } catch (error) {
  //     console.error(error.message);
  //   }
  // };

  const getCategories = async () => {
    //TODO - zmienić na wlasciwe id wycieczki
    // const packing_list_id = 1;
    try {
      const response = await fetch(
        `http://localhost:5000/api/item_category/${trip_id}`
      );
      const jsonData: Category[] = await response.json();
      console.log("DLUGOSC", jsonData, jsonData.length);

      const addNewParam = await Promise.all(
        jsonData.map(async (category) => {
          const itemCount = await getNumerOfItemsFromCategory(category.id);
          const packedItemCount = await getNumerOfPackedItemsFromCategory(
            category.id
          );
          return { ...category, itemCount, packedItemCount };
        })
      );

      setCategories(addNewParam);
    } catch (error) {
      console.error(error.message);
    }
  };

  const getNumerOfItemsFromCategory = async (
    item_category_id: string
  ): Promise<number> => {
    //TODO - zmienić na wlasciwe id wycieczki
    // const packing_list_id = 1;
    try {
      const response = await fetch(
        `http://localhost:5000/api/packing_items/${item_category_id}/count`
      );

      const data = await response.json();
      return data.count;
    } catch (error) {
      console.error(error.message);
      return 0;
    }
  };

  const getNumerOfPackedItemsFromCategory = async (
    item_category_id: string
  ): Promise<number> => {
    //TODO - zmienić na wlasciwe id wycieczki
    // const packing_list_id = 1;
    try {
      const response = await fetch(
        `http://localhost:5000/api/packing_items/${item_category_id}/count_packed `
      );

      const data = await response.json();
      return data.count;
    } catch (error) {
      console.error(error.message);
      return 0;
    }
  };
  // React.useEffect(() => {
  //   if(trip_id){
  //     getPackingId(trip_id);

  //   }
  // }, [trip_id]);
  React.useEffect(() => {
    if (trip_id) {
      getCategories();
      setRefreshFlag(false);
      setRefreshPackedItemsFlag(false);
    }
  }, [refreshFlag, refreshPackedItemsFlag, trip_id]);

  const generateCategoriesInReact = async (category) => {
    try {
      await fetch("http://localhost:5000/api/generate-categories", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({category, trip_id: trip_id, nights: numberOfNights }),
      });
      console.log("Kategorie wygenerowane pomyślnie.");
    } catch (error) {
      console.error("Wystąpił błąd:", error.message);
    }
  };

  React.useEffect(() => {
    const fetchData = async () =>{
      for (const category of defaultCategories){
        await generateCategoriesInReact(category);
        console.log(`Generated category: ${category}`);
      }
    setRefreshFlag(true);

    }
    fetchData();
  }, []);




  const initialValue = 0;
  const countPackedItems = categories.reduce(
    (accumulator, currentValue) => accumulator + currentValue.packedItemCount, initialValue);
  
    const countAllItems = categories.reduce(
    (accumulator, currentValue) => accumulator + currentValue.itemCount, initialValue);



  return (
    <div className="py-2 px-4 w-[100%] bg-[#f9fcfd]">
      {/* <AddCategory
        setRefreshFlag={setRefreshFlag}
        trip_id={trip_id}
      /> */}
      <ChooseCategory
      setRefreshFlag={setRefreshFlag}
        trip_id={trip_id}
        numberOfNights={numberOfNights}
      />
      <Box sx={{mb:2, display: "flex", alignItems: "center", justifyContent: "space-between"}}>

          <span className="text-blue-400 font-bold">{Math.trunc((countPackedItems/countAllItems)*100)||0}%</span>
        <LinearProgress variant="determinate" value={(countPackedItems/countAllItems)*100}  sx={{height: "7px", borderRadius:"5px", width: '90%', backgroundColor: "#e8e8e8", '& .MuiLinearProgress-bar': {
        backgroundColor: '#00bcff', 
      },}} />
        </Box>

      <div className="grid grid-cols-3 gap-1 overflow-auto">
        {categories?.map((value, index) => (
          <div key={value.id}>
            <div
              // style={{
              //   border: "1px solid #ccc",
              //   borderRadius: "8px",
              //   padding: "16px",
              //   textAlign: "center",
              // }}
              className={`border-2 bg-white rounded-lg hover:border-blue-400 p-4 text-center cursor-pointer duration-300 ease-in-out ${selectedCategoryId === value.id
                  ? "border-blue-400"
                  : "border:-gray"
                }`}
              onClick={() => {setSelectedCategoryId(value.id); setSelectedCategoryName(value.name)}}
            >
              <Typography variant="h6">
                {truncateText(value.name, 10)}{" "}
              </Typography>
              <Box position="relative" display="inline-flex">
                <CircularProgress variant="determinate" value={100} sx={{ color: "#e8e8e8" }} />
                <CircularProgress variant="determinate" value={(value.packedItemCount / value.itemCount) > 0 ?(value.packedItemCount / value.itemCount) * 100 : 0} sx={{position: "absolute", color: "#00bcff"}} />
                </Box>
              <Typography variant="body2">{value.packedItemCount}/{value.itemCount}</Typography>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
