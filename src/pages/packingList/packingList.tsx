import * as React from "react";
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
import { Grid, Typography } from "@mui/material";

interface PackingItem {
  id: number;
  name: string;
  quantity: number;
  packed: boolean;
  trip_id: number;
}

interface Props {
  item_category_id: number;
}

export default function CheckboxList({ item_category_id }: Props) {
  // const [checked, setChecked] = React.useState(packed);
  const [items, setItems] = React.useState<PackingItem[]>([]);
  const [refreshFlag, setRefreshFlag] = React.useState<boolean>(false);
  // const [items, setItems] = React.useState<PackingItem[]>([]);

  const handleToggle = async (item: PackingItem) => {
    const newPacked = item.packed === true ? false : true;
    try {
      await fetch(
        `http://localhost:5000/api/packing_items/${item.id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ packed: newPacked, quantity: item.quantity })
        });
        // getItems();
      setItems((prevItems) => prevItems.map(i => i.id === item.id ? { ...i, packed: newPacked } : i));
    } catch (error) {
      console.error("Error updating packed status:", error);

    }
    // const currentIndex = checked.indexOf(value);
    // const newChecked = [...checked];

    // if (currentIndex === -1) {
    //   newChecked.push(value);
    // } else {
    //   newChecked.splice(currentIndex, 1);
    // }

    // setChecked(newChecked);
  };

  React.useEffect(() => {
    async function fetchItems() {
      const response = await fetch(`http://localhost:5000/api/packing_items/${item_category_id}`);
      const data: PackingItem[] = await response.json();
      setItems(data);
    }
    fetchItems();
  }, [item_category_id]);

  const updateQuantity = async (item: PackingItem, newQuantity: number) => {
    try {
      const response = await fetch(
        `http://localhost:5000/api/packing_items/${item.id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ quantity: newQuantity }),
        }
      );
      if (!response.ok) {
        throw new Error("Failed to change quantity");
      }
    } catch (error) {
      console.error(error.message);
    }
  };

  const deleteItem = async (item: PackingItem) => {
    try {
      const response = await fetch(
        `http://localhost:5000/api/packing_items/${item.id}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
          },
          // body: JSON.stringify({}),
        }
      );
      setRefreshFlag(true);
      if (!response.ok) {
        throw new Error("Failed to delete item");
      }
    } catch (error) {
      console.error(error.message);
    }
  };

  const addItem = (item: PackingItem) => {
    console.log(`adding ${item.quantity}`);
    const newQuantity = item.quantity + 1;
    updateQuantity(item, newQuantity);
    setItems((prevItems) =>
      prevItems.map((prevItem) =>
        prevItem.id === item.id
          ? { ...prevItem, quantity: newQuantity }
          : prevItem
      )
    );
  };

  const substractItem = (item: PackingItem) => {
    console.log(`substracting ${item.quantity}`);
    let newQuantity = item.quantity - 1 <= 1 ? 1 : item.quantity - 1;
    updateQuantity(item, newQuantity);
    setItems((prevItems) =>
      prevItems.map((prevItem) =>
        prevItem.id === item.id
          ? { ...prevItem, quantity: newQuantity }
          : prevItem
      )
    );
  };

  const updatePackedStatus = async (item: PackingItem, newPackedStatus: boolean, quantity: number) => {
    console.log(`updating packed status for ${item.name} to ${newPackedStatus}`);
    try {
      const response = await fetch(
        `http://localhost:5000/api/packing_items/${item.id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ packed: newPackedStatus, quantity: quantity }),
        }
      );
      if (!response.ok) {
        throw new Error("Failed to change quantity");
      }
    } catch (error) {
      console.error(error.message);
    }
  };

  const getItems = async () => {
    try {
      const response = await fetch(
        `http://localhost:5000/api/packing_items/${item_category_id}`
      );
      const jsonData: PackingItem[] = await response.json();
      console.log(jsonData);
      setItems(jsonData);
    } catch (error) {
      console.error(error.message);
    }
  };

  React.useEffect(() => {
    if (item_category_id) {
      getItems();
      setRefreshFlag(false);
    }
  }, [refreshFlag, item_category_id]);

  return (
    <div className="flex flex-col align-center h-[100%] w-[80%]">
      {/* <Typography variant="h6">{value.name}</Typography> */}
      <List
        sx={{
          width: "100%",
          maxWidth: 360,
          bgcolor: "background.paper",
          height: "70vh",
          overflow: "auto",
        }}
      >
        {items?.map((value) => {
          const labelId = `checkbox-list-label-${value}`;

          return (
            <ListItem
              key={value.id}
              secondaryAction={
                <IconButton edge="end" aria-label="comments">
                  <RemoveIcon onClick={() => substractItem(value)} />
                  {/* {value.quantity} */} {value.quantity}
                  <AddIcon onClick={() => addItem(value)} />
                  <DeleteIcon onClick={() => deleteItem(value)} />
                </IconButton>
              }
              disablePadding
            >
              <ListItemButton
                role={undefined}
                // onClick={handleToggle(value.id)}
                dense
              >
                <ListItemIcon>
                  <Checkbox
                    edge="start"
                    checked={value.packed === true}
                    // onChange={() => {updatePackedStatus(value, !value.packed, value.quantity)}}
                    onChange={() => handleToggle(value)}
                    tabIndex={-1}
                    disableRipple
                    inputProps={{ "aria-labelledby": labelId }}
                  />
                </ListItemIcon>
                <ListItemText id={labelId} primary={`${value.name}`} />
              </ListItemButton>
            </ListItem>
          );
        })}
      </List>
      <AddItemInput
        setRefreshFlag={setRefreshFlag}
        item_category_id={item_category_id}
      />
    </div>
  );
}
