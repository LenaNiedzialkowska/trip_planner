const express = require("express");
const router = express.Router();
const pool = require("../db");
const multer = require("multer");
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

// === TRIP IMAGES ===

// Upload image
router.post("/tripImages/", upload.single("image"), async (req, res) => {
  try {
    const { trip_id, filename, mime_type } = req.body;
    const blob = req.file.buffer;
    const newTrip = await pool.query(
      "INSERT INTO trip_images (trip_id, blob, filename, mime_type) VALUES($1, $2, $3, $4) RETURNING *",
      [trip_id, blob, filename, mime_type]
    );
    res.status(201).json(newTrip.rows[0]);
  } catch (error) {
    console.error("Upload error:", error.message);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Get images
router.get("/tripImages/:trip_id", async (req, res) => {
  try {
    const { trip_id } = req.params;
    const result = await pool.query(
      `SELECT id, filename, mime_type, encode(blob, 'base64') AS base64_data
       FROM trip_images
       WHERE trip_id = $1`,
      [trip_id]
    );
    const images = result.rows.map(img => ({
      id: img.id,
      filename: img.filename,
      mime_type: img.mime_type,
      url: `data:${img.mime_type};base64,${img.base64_data}`
    }));
    res.json(images);
  } catch (error) {
    console.error("Fetch error:", error.message);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Delete image
router.delete("/tripImages/:trip_id/:id", async (req, res) => {
  try {
    const { trip_id, id } = req.params;
    await pool.query("DELETE FROM trip_images WHERE id=$1 AND trip_id=$2", [id, trip_id]);
    res.json({ message: "Trip image was deleted!" });
  } catch (error) {
    console.error("Delete error:", error.message);
    res.status(500).json({ error: "Internal server error" });
  }
});

module.exports = router;
