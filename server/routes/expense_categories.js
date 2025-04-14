const express = require("express");
const router = express.Router();
const pool = require("../db");

// === expenses_category ===
//Create expenses_category
router.post("/expenses_category", async (req, res) => {
    try {
      const {  name} = req.body;
      const newExpensesCategory = await pool.query(
        "INSERT INTO packing_items (name, created_at) VALUES($1, NOW()) RETURNING *",
        [  name]
      );
      res.status(201).json(newExpensesCategory.rows[0]);
    } catch (error) {
      console.error(error.message);
      res.status(500).json({ error: "Internal server error" });
    }
  });

//Get all expenses_category
router.get("/expenses_category", async (req, res) => {
    try {
      const expenses_category = await pool.query(
        "SELECT * FROM expenses_category"
      );
      res.json(expenses_category.rows);
    } catch (error) {
      console.error(error.message);
      res.status(500).json({ error: "Internal server error" });
    }
  });

//delete a daily plan
router.delete("/expenses_category", async (req, res) => {
    try {
      const { id } = req.params;
      await pool.query("DELETE FROM expenses_category WHERE id=$1", [id]);
      res.json({ message: "Expenses category was deleted!" });
    } catch (error) {
      console.error(error.message);
      res.status(500).json({ error: "Internal server error" });
    }
  });

module.exports = router;