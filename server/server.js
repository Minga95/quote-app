require('dotenv').config({ path: './server/.env' });

const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const { Client } = require("pg");

const axios = require('axios')

const app = express();

app.use(cors());
app.use(bodyParser.json());

const client = new Client({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_DATABASE,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
});

const API_KEY = process.env.API_KEY;

client
  .connect()
  .then(() => console.log("Connesso al database PostgreSQL"))
  .catch((err) => console.error("Errore nella connessione al DB:", err.stack));

app.get("/quote", async (req, res) => {
  try {
    const response = await axios.get("https://api.api-ninjas.com/v1/quotes", {
      headers: {
        "X-Api-Key": API_KEY,
      },
    });
    res.json(response.data);
  } catch (error) {
    console.error("Error fetching quotes:", error);
    res.status(500).send("Error fetching quotes");
  }
});

app.get("/post", async (req, res) => {
  try {
    const result = await client.query(
      "SELECT * FROM posts ORDER BY timestamp DESC"
    );
    res.json(result.rows);
  } catch (error) {
    console.error("Errore nel recupero dei post:", error);
    res.status(500).send("Errore nel recupero dei post");
  }
});

app.post("/post", async (req, res) => {
  const { text, author } = req.body;

  if (!text || !author) {
    return res.status(400).send('Campi "text" e "author" sono obbligatori');
  }

  try {
    const result = await client.query(
      "INSERT INTO posts (text, author) VALUES ($1, $2) RETURNING *",
      [text, author]
    );
    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error("Errore nell'aggiunta del post:", error);
    res.status(500).send("Errore nell'aggiunta del post");
  }
});

const port = 3000;
app.listen(port, () => {
  console.log(`Server in ascolto su http://localhost:${port}`);
});
