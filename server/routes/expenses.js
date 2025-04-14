const express = require("express");
const router = express.Router();
const pool = require("../db");

// === expenses ===
//Create expense
router.post("/expenses", async (req, res) => {
    try {
      const {  name, date, location, amount, currency, status, trip_id, expenses_category_id} = req.body;
      const newExpense = await pool.query(
        "INSERT INTO packing_items ( name, date, location, amount, currency, status, trip_id, expenses_category_id, created_at) VALUES($1, $2, $3, $4, $5, $6, $7, $8, NOW()) RETURNING *",
        [  name, date, location, amount, currency, status, trip_id, expenses_category_id]
      );
      res.status(201).json(newExpense.rows[0]);
    } catch (error) {
      console.error(error.message);
      res.status(500).json({ error: "Internal server error" });
    }
  });

//Get expenses for a trip
router.get("/expenses/:trip_id", async (req, res) => {
    try {
        const {trip_id} = req.params;
      const expenses = await pool.query(
        "SELECT * FROM expenses WHERE trip_id=$1", [trip_id]
      );
      res.json(expenses.rows);
    } catch (error) {
      console.error(error.message);
      res.status(500).json({ error: "Internal server error" });
    }
  });

  
//Get expenses for a expenses_category
router.get("/expenses/:expenses_category_id", async (req, res) => {
    try {
        const {expenses_category_id} = req.params;
      const expenses = await pool.query(
        "SELECT * FROM expenses WHERE expenses_category_id=$1", [expenses_category_id]
      );
      res.json(expenses.rows);
    } catch (error) {
      console.error(error.message);
      res.status(500).json({ error: "Internal server error" });
    }
  });

//delete a expense
router.delete("/expenses/:trip_id", async (req, res) => {
    try {
      const { trip_id } = req.params;
      await pool.query("DELETE FROM expenses WHERE trip_id=$1", [trip_id]);
      res.json({ message: "Expense was deleted!" });
    } catch (error) {
      console.error(error.message);
      res.status(500).json({ error: "Internal server error" });
    }
  });

  //delete a expense
router.delete("/expenses/:expenses_category_id", async (req, res) => {
    try {
      const { expenses_category_id } = req.params;
      await pool.query("DELETE FROM expenses WHERE expenses_category_id=$1", [expenses_category_id]);
      res.json({ message: "Expense was deleted!" });
    } catch (error) {
      console.error(error.message);
      res.status(500).json({ error: "Internal server error" });
    }
  });

module.exports = router;