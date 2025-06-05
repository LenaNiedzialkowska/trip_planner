const express = require("express");
const router = express.Router();
const pool = require("../db");

//packing_items
//Add item to packing_items
router.post("/packing_items", async (req, res) => {
  try {
    const { name, quantity, packed, item_category_id } = req.body;
    const newItem = await pool.query(
      "INSERT INTO packing_items (name, quantity, packed, item_category_id, created_at) VALUES($1, $2, $3, $4, NOW()) RETURNING *",
      [name, quantity, packed, item_category_id]
    );
    res.status(201).json(newItem.rows[0]);
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ error: "Internal server error" });
  }
});

//Get all items from category
router.get("/packing_items/:item_category_id", async (req, res) => {
  try {
    const { item_category_id } = req.params;
    const packingItems = await pool.query(
      "SELECT * FROM packing_items WHERE item_category_id = $1",
      [item_category_id]
    );
    res.json(packingItems.rows);
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ error: "Internal server error" });
  }
});

//Get number of all items from category
router.get("/packing_items/:item_category_id/count", async (req, res) => {
  try {
    const { item_category_id } = req.params;
    const packingItems = await pool.query(
      "SELECT COUNT (*) FROM packing_items WHERE item_category_id = $1",
      [item_category_id]
    );
    res.json({ count: parseInt(packingItems.rows[0].count, 10) });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ error: "Internal server error" });
  }
});

//Get number of all items from category
router.get("/packing_items/:item_category_id/count_packed", async (req, res) => {
  try {
    const { item_category_id } = req.params;
    const packingItems = await pool.query(
      "SELECT COUNT (*) FROM packing_items WHERE item_category_id = $1 AND packed = true",
      [item_category_id]
    );
    res.json({ count: parseInt(packingItems.rows[0].count, 10) });
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
    const { name, trip_id } = req.body;
    const newCategory = await pool.query(
      "INSERT INTO item_category (name, trip_id, created_at) VALUES($1, $2, NOW()) RETURNING *",
      [name, trip_id]
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

//Get categories for trip
router.get("/item_category/:trip_id", async (req, res) => {
  try {
    const { trip_id } = req.params;
    const itemCategory = await pool.query(
      "SELECT * FROM item_category WHERE trip_id=$1",
      [trip_id]
    );
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
