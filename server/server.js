require('dotenv').config({ path: './server/.env' });

const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const { Client } = require("pg");
const axios = require("axios");

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
  .then(() => console.log("Connected to PostgreSQL database"))
  .catch((err) => console.error("Database connection error:", err.stack));


app.get("/quote", async (req, res) => {
  try {
    const response = await axios.get("https://api.api-ninjas.com/v1/quotes", {
      headers: { "X-Api-Key": API_KEY },
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
    console.error("Error fetching posts:", error);
    res.status(500).send("Error fetching posts");
  }
});


app.post("/post", async (req, res) => {
  const { text, author } = req.body;

  if (!text || !author) {
    return res.status(400).send('"text" and "author" fields are required');
  }

  try {
    const result = await client.query(
      "INSERT INTO posts (text, author) VALUES ($1, $2) RETURNING *",
      [text, author]
    );
    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error("Error creating post:", error);
    res.status(500).send("Error creating post");
  }
});


app.put("/post/:id", async (req, res) => {
  const { id } = req.params;
  const { text, author } = req.body;

  if (!text || !author) {
    return res.status(400).send('"text" and "author" fields are required');
  }

  try {
    const result = await client.query(
      "UPDATE posts SET text = $1, author = $2, timestamp = CURRENT_TIMESTAMP WHERE id = $3 RETURNING *",
      [text, author, id]
    );

    if (result.rows.length === 0) {
      return res.status(404).send("Post not found");
    }

    res.json(result.rows[0]);
  } catch (error) {
    console.error("Error updating post:", error);
    res.status(500).send("Error updating post");
  }
});


app.delete("/post/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const result = await client.query(
      "DELETE FROM posts WHERE id = $1 RETURNING *",
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).send("Post not found");
    }

    res.json({ message: "Post successfully deleted", post: result.rows[0] });
  } catch (error) {
    console.error("Error deleting post:", error);
    res.status(500).send("Error deleting post");
  }
});


const port = 3000;
app.listen(port, () => {
  console.log(`Server listening on http://localhost:${port}`);
});
