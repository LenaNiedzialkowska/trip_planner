const express = require("express");
const app = express();
const cors = require("cors");
const pool = require("./db");

//middleware
app.use(cors());
app.use(express.json()); //req.body
app.use(express.urlencoded({ extended: true })); 

//ROUTES//
const packingRoutes = require("./routes/packing");
const userRoutes = require("./routes/users");
// const dailyPlans = require("./routes/daily_plans");
const events = require("./routes/events");
const expenseCategories = require("./routes/expense_categories");
const expenses = require("./routes/expenses");
const trips = require("./routes/trips");
const generateCategories = require("./generateCategories");
const tripImages = require("./routes/tripImages");

app.use("/api", packingRoutes);
app.use("/api/auth", userRoutes);
// app.use("/api", dailyPlans);
app.use("/api", events);
app.use("/api", expenseCategories);
app.use("/api", expenses);
app.use("/api", trips);
app.use("/api", tripImages);

// app.use("/api", generateCategories);

app.post("/api/generate-categories", async(req, res) =>{
  const {category, trip_id, nights} = req.body;
  try {
    await generateCategories(category, trip_id, nights);
    res.status(200).json({message: "Kategoria wygenerowana pomyślnie."});
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
})

app.listen(5000, () => {
  console.log("server has started on port 5000");
});
