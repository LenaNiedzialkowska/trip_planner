const express = require("express");
const router = express.Router();
const pool = require("../db");
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const JWT_SECRET = 'twoj_sekret';

//user
//TODO: dodaj haszowanie hasła!!

//create a user
router.post("/register", async (req, res) => {
  try {
    const { username, email, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = await pool.query(
      "INSERT INTO users (username, email, password) VALUES($1, $2, $3) RETURNING *",
      [username, email, hashedPassword]
    );
    res.json(newUser.rows[0]);
    // console.log(req.body);
  } catch (error) {
    console.log(error.message);
  }
});

router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const userResult = await pool.query("SELECT id, username, email, password, created_at FROM users WHERE email=$1", [email]);
    const user = userResult.rows[0];
    if (!user) return res.status(400).json({ error: "Nieprawidłowy email lub hasło" });

    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) return res.status(400).json({ error: "Nieprawidłowy email lub hasło" });

    const token = jwt.sign({ userId: user.id }, JWT_SECRET, { expiresIn: '1h' });
    res.json({ token, username: user.username, userId: user.id });
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ error: "Logowanie nieudane" });
  }
});

//get a user
router.get("/users/:id", async (req, res) => {
  try {
    const {id} = req.params;
    const user = await pool.query("SELECT id, username, email, created_at FROM users WHERE id = $1", [id]);
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
    const { username, email, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    const updateUser = await pool.query(
      "UPDATE users SET username = $1, email = $2, password=$3 WHERE id=$4",
      [username, email, hashedPassword, id]
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
