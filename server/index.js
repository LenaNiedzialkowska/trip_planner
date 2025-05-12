const express = require("express");
const app = express();
const cors = require("cors");
const pool = require("./db");

//middleware
app.use(cors());
app.use(express.json()); //req.body

//ROUTES//
const packingRoutes = require("./routes/packing");
const userRoutes = require("./routes/users");
// const dailyPlans = require("./routes/daily_plans");
const events = require("./routes/events");
const expense_categories = require("./routes/expense_categories");
const expenses = require("./routes/expenses");
const trips = require("./routes/trips");

app.use("/api", packingRoutes);
app.use("/api", userRoutes);
// app.use("/api", dailyPlans);
app.use("/api", events);
app.use("/api", expense_categories);
app.use("/api", expenses);
app.use("/api", trips);

//user
//TODO: dodaj haszowanie hasła!!

app.listen(5000, () => {
  console.log("server has started on port 5000");
});
