const express = require("express");
const router = express.Router();
const pool = require("../db");

// === EVENTS ===
//Create events
router.post("/events", async (req, res) => {
    try {
      const {  name, date, start_time, end_time, description, cost, trip_id} = req.body;
      const newEvent = await pool.query(
        "INSERT INTO events (  name, date, start_time, end_time, description, cost, trip_id, created_at) VALUES($1, $2, $3, $4, $5, $6, $7, NOW()) RETURNING *",
        [  name, date, start_time, end_time, description, cost, trip_id]
      );
      res.status(201).json(newEvent.rows[0]);
    } catch (error) {
      console.error(error.message);
      res.status(500).json({ error: "Internal server error" });
    }
  });

//Get events for a trip
router.get("/events/:trip_id", async (req, res) => {
    try {
        const {trip_id} = req.params;
      const events = await pool.query(
        "SELECT * FROM events WHERE trip_id=$1", [trip_id]
      );
      res.json(events.rows);
    } catch (error) {
      console.error(error.message);
      res.status(500).json({ error: "Internal server error" });
    }
  });

//Get unplanned events for a trip
router.get("/events/:trip_id/unplanned", async (req, res) => {
    try {
        const {trip_id} = req.params;
      const events = await pool.query(
        "SELECT * FROM events WHERE trip_id=$1 AND date IS NULL;", [trip_id]
      );
      res.json(events.rows);
    } catch (error) {
      console.error(error.message);
      res.status(500).json({ error: "Internal server error" });
    }
  });

  
//edit item
router.put("/events/:trip_id/:id", async (req, res) => {
  try {
    const { trip_id, id } = req.params;
    const { start_time, end_time, description, cost, date } = req.body;
    await pool.query(
      "UPDATE events SET description = $1, cost = $2, date = $3, start_time=$4, end_time = $5 WHERE trip_id = $6 AND id = $7",
      [description, cost, date, start_time, end_time, trip_id, id]
    );
    res.json({ message: "Event status updated" });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ error: "Internal server error" });
  }
});

//delete an event
router.delete("/events/:trip_id/:id", async (req, res) => {
    try {
      const { trip_id, id } = req.params;
      await pool.query("DELETE FROM events WHERE trip_id=$1 AND id=$2", [trip_id, id]);
      res.json({ message: "Event was deleted!" });
    } catch (error) {
      console.error(error.message);
      res.status(500).json({ error: "Internal server error" });
    }
  });

module.exports = router;