const express = require('express'); //import express module
const cors = require('cors'); //import cors module

const app = express(); //create an express application

app.use(cors());
app.use(express.json());

app.get('/api/health', (req, res) => { //test endpoint
  res.json({ status: 'ok' });
});

const PORT = 4000;
app.listen(PORT, () => {
  console.log(`Backend running at http://localhost:${PORT}`);
});