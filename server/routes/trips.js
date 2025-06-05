const express = require("express");
const router = express.Router();
const pool = require("../db");

// === TRIPS ===
//Create trip
router.post("/trips", async (req, res) => {
  try {
    const { name, start_date, end_date, cost, user_id } = req.body;
    const newTrip = await pool.query(
      "INSERT INTO trips (name, start_date, end_date, cost, user_id, created_at) VALUES($1, $2, $3, $4, $5, NOW()) RETURNING *",
      [name, start_date, end_date, cost, user_id]
    );
    res.status(201).json(newTrip.rows[0]);
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ error: "Internal server error" });
  }
});

//Get all trips
router.get("/trips/:user_id", async (req, res) => {
  try {
    const {user_id} = req.params;
    const trips = await pool.query(
      "SELECT * FROM trips WHERE user_id=$1", [user_id]
    );
    res.json(trips.rows);
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ error: "Internal server error" });
  }
});

//Edit trip
router.put("/trips/:id", async (req, res) => {
  try {
    const { name, start_date, end_date, cost } = req.body;
    const {id} = req.params;
    const newTrip = await pool.query(
      "UPDATE trips SET name=$1, start_date=$2, end_date=$3, cost=$4 WHERE id=$5 RETURNING *",
      [name, start_date, end_date, cost, id]
    );
    res.status(200).json(newTrip.rows[0]);
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ error: "Internal server error" });
  }
});

//Get a trip
router.get("/trips/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const trips = await pool.query(
      "SELECT * FROM trips WHERE id=$1", [id]
    );
    res.json(trips.rows);
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ error: "Internal server error" });
  }
});

//delete a trip
router.delete("/trips/:id", async (req, res) => {
  try {
    const { id } = req.params;
    await pool.query("DELETE FROM trips WHERE id=$1", [id]);
    res.json({ message: "Trip was deleted!" });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ error: "Internal server error" });
  }
});

module.exports = router;