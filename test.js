const playlists = require('./Data');
const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;

// Serve public folder
app.use(express.static('public'));

// API route to return JSON data
app.get('/api/playlists', (req, res) => {
  res.json(playlists);
});

// Default homepage route
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/public/index.html');
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`);
});
