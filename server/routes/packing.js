const express = require("express");
const router = express.Router();
const pool = require("../db");

//create a packing list
router.post("/packing_lists", async (req, res) => {
  try {
    const { category, trip_id } = req.body;
    const existingList = await pool.query(
      "SELECT * FROM packing_lists WHERE trip_id = $1",
      [trip_id]
    );
    if (existingList.rows.length > 0) {
      return res
        .status(409)
        .json({ error: "There is existing list for this trip" });
    }
    const newList = await pool.query(
      "INSERT INTO packing_lists (category, trip_id, created_at) VALUES($1, $2, NOW()) RETURNING *",
      [category, trip_id]
    );
    res.status(201).json(newList.rows[0]);
    // console.log(req.body);
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ error: "internal server error" });
  }
});

//get a packing list
router.get("/packing_lists/:trip_id", async (req, res) => {
  try {
    const { trip_id } = req.params;
    const packingLists = await pool.query(
      "SELECT * FROM packing_lists WHERE trip_id = $1",
      [trip_id]
    );
    res.json(packingLists.rows);
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ error: "Internal server error" });
  }
});

//get all packing lists
router.get("/packing_lists", async (req, res) => {
  try {
    const packingLists = await pool.query("SELECT * FROM packing_lists");
    res.json(packingLists.rows);
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ error: "Internal server error" });
  }
});

//delete a packing list
router.delete("/packing_lists", async (req, res) => {
  try {
    await pool.query("DELETE FROM packing_lists WHERE id=1");
    res.json({ message: "List was deleted!" });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ error: "Internal server error" });
  }
});

//packing_items
//Add item to packing list
router.post("/packing_items", async (req, res) => {
  try {
    const { name, quantity, packed, packing_list_id, item_category_id } =
      req.body;
    const newItem = await pool.query(
      "INSERT INTO packing_items (name, quantity, packed, packing_list_id, item_category_id, created_at) VALUES($1, $2, $3, $4, $5, NOW()) RETURNING *",
      [name, quantity, packed, packing_list_id, item_category_id]
    );
    res.status(201).json(newItem.rows[0]);
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ error: "Internal server error" });
  }
});

//Get all items from list
router.get("/packing_items/:packing_list_id", async (req, res) => {
  try {
    const { packing_list_id } = req.params;
    const packingItems = await pool.query(
      "SELECT * FROM packing_items WHERE packing_list_id = $1",
      [packing_list_id]
    );
    res.json(packingItems.rows);
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ error: "Internal server error" });
  }
});

//edit item
router.put("/packing_items/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { packed, quantity } = req.body;
    await pool.query(
      "UPDATE packing_items SET packed = $1, quantity = $2 WHERE id = $3",
      [packed, quantity, id]
    );
    res.json({ message: "Item status updated" });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ error: "Internal server error" });
  }
});

//delete an item from list
router.delete("/packing_items/:id", async (req, res) => {
  try {
    const { id } = req.params;
    await pool.query("DELETE FROM packing_items WHERE id=$1", [id]);
    res.json({ message: "Item was deleted!" });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ error: "Internal server error" });
  }
});

//item_category
//Add category to item_category
router.post("/item_category", async (req, res) => {
  try {
    const { name } = req.body;
    const newCategory = await pool.query(
      "INSERT INTO packing_items (name, created_at) VALUES($1, NOW()) RETURNING *",
      [name]
    );
    res.status(201).json(newCategory.rows[0]);
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ error: "Internal server error" });
  }
});

//Get all categories from item_category
router.get("/item_category", async (req, res) => {
  try {
    const itemCategory = await pool.query("SELECT * FROM item_category");
    res.json(itemCategory.rows);
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ error: "Internal server error" });
  }
});

//Get a category from item_category
router.get("/item_category/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const itemCategory = await pool.query(
      "SELECT * FROM item_category WHERE id = $1",
      [id]
    );
    res.json(itemCategory.rows);
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ error: "Internal server error" });
  }
});

//delete an item_category
router.delete("/item_category/:id", async (req, res) => {
  try {
    const { id } = req.params;
    await pool.query("DELETE FROM item_category WHERE id=$1", [id]);
    res.json({ message: "Category of item was deleted!" });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ error: "Internal server error" });
  }
});
module.exports = router;
