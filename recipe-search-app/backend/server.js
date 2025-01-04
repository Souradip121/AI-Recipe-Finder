const express = require("express");
const axios = require("axios");
const cors = require("cors");
require("dotenv").config();

const app = express();
app.use(cors());
app.use(express.json());

const EDAMAM_APP_ID = process.env.EDAMAM_APP_ID;
const EDAMAM_APP_KEY = process.env.EDAMAM_APP_KEY;
const EDAMAM_USER_ID = process.env.EDAMAM_USER_ID;

// Add validation
if (!EDAMAM_APP_ID || !EDAMAM_APP_KEY || !EDAMAM_USER_ID) {
  console.error("Missing Edamam API credentials");
  process.exit(1);
}

app.get("/api/recipes", async (req, res) => {
  try {
    const { query } = req.query;

    if (!query) {
      return res.status(400).json({ error: "Query parameter is required" });
    }

    console.log(
      "API Request URL:",
      `https://api.edamam.com/search?q=${query}&app_id=${EDAMAM_APP_ID}&app_key=${EDAMAM_APP_KEY}`
    );

    const response = await axios.get(
      `https://api.edamam.com/search?q=${query}&app_id=${EDAMAM_APP_ID}&app_key=${EDAMAM_APP_KEY}`,
      {
        headers: {
          'Edamam-Account-User': EDAMAM_USER_ID
        }
      }
    );

    console.log("API Response Status:", response.status);
    res.json(response.data);
  } catch (error) {
    console.error("API Error:", error.response?.data || error.message);
    res.status(500).json({
      error: "Failed to fetch recipes",
      details: error.response?.data || error.message,
    });
  }
});

app.listen(5000, () => {
  console.log("Server running on port 5000");
  console.log("APP_ID exists:", !!EDAMAM_APP_ID);
  console.log("APP_KEY exists:", !!EDAMAM_APP_KEY);
  console.log("USER_ID exists:", !!EDAMAM_USER_ID);
});
