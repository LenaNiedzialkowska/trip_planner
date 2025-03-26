const express = require("express");
const app = express();
const cors = require("cors");
const pool = require("./db")

//middleware
app.use(cors());
app.use(express.json()); //req.body

//ROUTES//

//create a trip

app.post("/trips", async(req, res) => {
    try {
        const {description} = req.body;
        const newTrip = await pool.query("INSERT INTO trip (description) VALUES($1)", [description]);
        res.json(newTrip)
        // console.log(req.body);
    } catch (error) {
        console.log(error.message);
    }
})

//get all trips

//get a trip

//update a trip

app.listen(5000, () =>{
    console.log("server has started on port 5000")
});