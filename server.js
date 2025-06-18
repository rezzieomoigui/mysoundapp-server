// server.js

const playlists = require('./Data'); 
const express = require('express');
const cors = require('cors');
const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json()); // ✅ Required to parse POST requests

// Serve public folder
app.use(express.static('public'));

// GET all playlists
app.get('/api/playlists', (req, res) => {
  res.json(playlists);
});

// ✅ POST route to add a new song (with Spotify URL)
app.post('/api/playlists', (req, res) => {
  const newSong = {
    _id: Date.now(),
    img_name: req.body.img_name,
    title: req.body.title,
    artist: req.body.artist,
    album: req.body.album,
    genre: req.body.genre,
    spotify_url: req.body.spotify_url || ""
  };
  playlists.push(newSong);
  res.json(newSong);
});

// Default homepage route
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/public/index.html');
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`);
});
