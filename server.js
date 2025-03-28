// Loading environment variables (API key) and Importing required libraries

require("dotenv").config();

import express from "express";
import axios from "axios";
import { error } from "console";

// Init Express app, port for local deployment and the marketstack API key

const app = express()
const PORT = process.env.PORT || 3000;
const MARKSTACK_API = process.env.MARKSTACK_API

// Configuration for EJS | Service for static files

app.set("view engine", "ejs")
app.use(express.static("public"));

// GET API call to marketstack API, with promise based structure
    // Goal: Fetch the 5 best performing stocks and 5 worst performing stocks of the day
app.get("/", (req, res) => {
    axios.get(`https://api.marketstack.com/v1/eod/latest?access_key=${MARKETSTACK_API}&limit=100`)
    .then(response => {
        
        // Save the fetched stock objects into an array
        const stocks = response.data.data

        // Example Format for Apple stock object: 
        // "symbol": "AAPL", "name": "Apple Inc", "close": 175.49, "open": 173.52, 
        // "high": 176.15, "low": 173.34, "volume": 54321000, "change": 2.15, 
        // "change_percent": 1.24, "date": "2024-03-27T00:00:00+0000"

        // Sort by "change_percent" field which will allows us to form an
        // array of objects in sorted in decreasing order
        stocks.sort((a, b) => b.change_percent - a.change_percent);

        // Best and Worst Sotcks of the day
        const best5 = stocks.slice(0, 5)
        const worst5 = stocks.slice(-5).reverse()

        // Render the results
        res.render("index", {best5, worst5})
    })
    .catch(error => {
        console.log(error)
        
        // Just display the error if one occurs
        res.render("index", { top5: [], bottom5: [], error: "Error fetching data" });
    })
})

// Start the server
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`))