const express = require("express");
const router = express.Router();
const pool = require("../db");

// === EVENTS ===
//Create events
router.post("/events", async (req, res) => {
    try {
      const {  name, time, description, cost, daily_plan_id} = req.body;
      const newEvent = await pool.query(
        "INSERT INTO packing_items (  name, time, description, cost, daily_plan_id, created_at) VALUES($1, $2, $3, $4, $5, NOW()) RETURNING *",
        [  name, time, description, cost, daily_plan_id]
      );
      res.status(201).json(newEvent.rows[0]);
    } catch (error) {
      console.error(error.message);
      res.status(500).json({ error: "Internal server error" });
    }
  });

//Get events for a trip
router.get("/events/:daily_plan_id", async (req, res) => {
    try {
        const {daily_plan_id} = req.params;
      const events = await pool.query(
        "SELECT * FROM events WHERE daily_plan_id=$1", [daily_plan_id]
      );
      res.json(events.rows);
    } catch (error) {
      console.error(error.message);
      res.status(500).json({ error: "Internal server error" });
    }
  });

//delete a daily plan
router.delete("/events/:daily_plan_id", async (req, res) => {
    try {
      const { daily_plan_id } = req.params;
      await pool.query("DELETE FROM events WHERE daily_plan_id=$1", [daily_plan_id]);
      res.json({ message: "Event was deleted!" });
    } catch (error) {
      console.error(error.message);
      res.status(500).json({ error: "Internal server error" });
    }
  });

module.exports = router;