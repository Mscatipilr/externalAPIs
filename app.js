const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const cors = require('cors');
const axios = require('axios');

const app = express();
const port = 3000;

// Middleware to parse request body
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());

// Serve static files
app.use(express.static(path.join(__dirname, 'public')));

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.get('/get-key-statistics', async (req, res) => {
  const stockSymbol = req.query.symbol; // Retrieve symbol from query parameter
  const options = {
    method: 'GET',
    url: `https://yahoo-finance127.p.rapidapi.com/key-statistics/${stockSymbol}`,
    headers: {
      'x-rapidapi-key': '1f9e13d339mshe750bb6a96aa643p185567jsnc318463dc050',
      'x-rapidapi-host': 'yahoo-finance127.p.rapidapi.com'
    }
  };

  try {
    const response = await axios.request(options);
    res.json(response.data);
  } catch (error) {
    console.error('Error with API request:', error.message);
    res.status(500).send('Error fetching key statistics');
  }
});

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
