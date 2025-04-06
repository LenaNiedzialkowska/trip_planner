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
import { Grid } from "@mui/material";

interface PackingItem {
  id: number;
  name: string;
  quantity: number;
  packed: string;
  packing_list_id: number;
  item_category_id: number;
}

export default function CheckboxList() {
  const [checked, setChecked] = React.useState([0]);
  const [items, setItems] = React.useState<PackingItem[]>([]);
  const [refreshFlag, setRefreshFlag] = React.useState<boolean>(false);

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

  const getItems = async () => {
    //TODO - zmienić na wlasciwe id wycieczki
    const id = 1;
    try {
      const response = await fetch(
        `http://localhost:5000/api/packing_items/${id}`
      );
      const jsonData: PackingItem[] = await response.json();
      console.log(jsonData);
      setItems(jsonData);
    } catch (error) {
      console.error(error.message);
    }
  };
  React.useEffect(() => {
    getItems();
    setRefreshFlag(false);
  }, [refreshFlag]);

  return (
    <List sx={{ width: "100%", maxWidth: 360, bgcolor: "background.paper" }}>
      <AddItemInput setRefreshFlag={setRefreshFlag} />
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
              onClick={handleToggle(value.id)}
              dense
            >
              <ListItemIcon>
                <Checkbox
                  edge="start"
                  checked={checked.includes(value.id)}
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
  );
}
