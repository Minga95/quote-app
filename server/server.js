const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const { Client } = require('pg');

const app = express();
app.use(cors());
app.use(bodyParser.json());


const client = new Client({
  user: 'admin',
  host: 'localhost',
  database: 'quotesdb',
  password: '1234',
  port: 5432,
});

client.connect();


app.get('/post', async (req, res) => {
  try {
    const result = await client.query('SELECT * FROM quotes ORDER BY created_at DESC');
    res.json(result.rows);
  } catch (error) {
    console.error(error);
    res.status(500).send('Errore nel recupero delle citazioni');
  }
});


app.post('/post', async (req, res) => {
  const { quote, author } = req.body;
  try {
    const result = await client.query('INSERT INTO quotes (quote, author) VALUES ($1, $2) RETURNING *', [quote, author]);
    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).send('Errore nell\'aggiunta della citazione');
  }
});


const port = 3000;
app.listen(port, () => {
  console.log(`Server in ascolto sulla porta ${port}`);
});
