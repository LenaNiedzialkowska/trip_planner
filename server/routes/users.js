const express = require("express");
const router = express.Router();
const pool = require("../db");

//user
//TODO: dodaj haszowanie hasła!!

//create a user
router.post("/users", async (req, res) => {
  try {
    const { username, email, password, created_at } = req.body;
    const newUser = await pool.query(
      "INSERT INTO users (username, email, password, created_at) VALUES($1, $2, $3, $4) RETURNING *",
      [username, email, password, created_at]
    );
    res.json(newUser.rows[0]);
    // console.log(req.body);
  } catch (error) {
    console.log(error.message);
  }
});

//get all users
router.get("/users", async (req, res) => {
  try {
    const allUsers = await pool.query("SELECT * FROM users");
    res.json(allUsers.rows);
  } catch (error) {
    console.log(error.message);
  }
});

//get a user
router.get("/users/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const user = await pool.query("SELECT * FROM users WHERE id = $1", [id]);
    res.json(user.rows[0]);
    // console.log(req.params);
  } catch (error) {
    console.log(error.message);
  }
});

//update a user
router.put("/users/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { username, email, password, created_at } = req.body;
    const updateUser = await pool.query(
      "UPDATE users SET username = $1, email = $2, password=$3, created_at=$4 WHERE id=$5",
      [username, email, password, created_at, id]
    );
  } catch (error) {
    console.log(error.message);
  }
  res.json("Users were updated!");
});

//delete a user
router.delete("/users/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const deleteUser = await pool.query("DELETE FROM users WHERE id=$1", [id]);
  } catch (error) {
    console.log(error.message);
  }
  res.json("User was deleted!");
});

module.exports = router;
