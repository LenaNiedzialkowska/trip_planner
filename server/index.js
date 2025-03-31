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

app.use("/api", packingRoutes);
app.use("/api", userRoutes);

//user
//TODO: dodaj haszowanie hasła!!

app.listen(5000, () => {
  console.log("server has started on port 5000");
});
