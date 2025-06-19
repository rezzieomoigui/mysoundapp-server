// server.js

const playlists = require('./data'); // ✅ matches your current export
const express = require('express');
const cors = require('cors');
const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use(express.static('public')); // if you're serving index.html or images

// ✅ GET all playlists
app.get('/api/playlists', (req, res) => {
  res.json(playlists);
});

// ✅ POST new playlist item
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
  res.status(201).json(newSong);
});

// ✅ PUT (Edit an item by ID)
app.put('/api/playlists/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const index = playlists.findIndex(p => p._id === id);

  if (index === -1) {
    return res.status(404).json({ error: 'Playlist not found' });
  }

  playlists[index] = {
    _id: id,
    img_name: req.body.img_name,
    title: req.body.title,
    artist: req.body.artist,
    album: req.body.album,
    genre: req.body.genre,
    spotify_url: req.body.spotify_url || ""
  };

  res.status(200).json(playlists[index]);
});

// ✅ DELETE an item by ID
app.delete('/api/playlists/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const index = playlists.findIndex(p => p._id === id);

  if (index === -1) {
    return res.status(404).json({ error: 'Playlist not found' });
  }

  playlists.splice(index, 1);
  res.status(200).json({ message: 'Deleted successfully', id });
});

// Serve homepage fallback (optional for public/index.html)
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/public/index.html');
});

// Start server
app.listen(PORT, () => {
  console.log(`✅ Server running at http://localhost:${PORT}`);
});

