const express = require("express");
const router = express.Router();
const pool = require("../db");

// === DAILY PLANS ===
//Create daily plans
router.post("/daily_plans", async (req, res) => {
    try {
      const { date, trip_id, description} = req.body;
      const newDailyPlan = await pool.query(
        "INSERT INTO packing_items ( date, trip_id, description, created_at) VALUES($1, $2, $3, NOW()) RETURNING *",
        [ date, trip_id, description]
      );
      res.status(201).json(newDailyPlan.rows[0]);
    } catch (error) {
      console.error(error.message);
      res.status(500).json({ error: "Internal server error" });
    }
  });

//Get daily plans for a trip
router.get("/daily_plans/:trip_id", async (req, res) => {
    try {
        const {trip_id} = req.params;
      const daily_plans = await pool.query(
        "SELECT * FROM daily_plans WHERE trip_id=$1", [trip_id]
      );
      res.json(daily_plans.rows);
    } catch (error) {
      console.error(error.message);
      res.status(500).json({ error: "Internal server error" });
    }
  });

//delete a daily plan
router.delete("/daily_plans/:trip_id", async (req, res) => {
    try {
      const { trip_id } = req.params;
      await pool.query("DELETE FROM daily_plans WHERE trip_id=$1", [trip_id]);
      res.json({ message: "Daily plan was deleted!" });
    } catch (error) {
      console.error(error.message);
      res.status(500).json({ error: "Internal server error" });
    }
  });

module.exports = router;