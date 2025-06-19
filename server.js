// server.js
const express = require('express');
const cors = require('cors');
const Joi = require('joi');
const app = express();
const PORT = process.env.PORT || 3000;

const playlists = require('./Data');

app.use(cors());
app.use(express.json());

const playlistSchema = Joi.object({
  img_name: Joi.string().required(),
  title: Joi.string().required(),
  artist: Joi.string().required(),
  album: Joi.string().allow(''),
  genre: Joi.string().allow(''),
  spotify_url: Joi.string().uri().allow('')
});

app.get('/api/playlists', (req, res) => {
  res.json(playlists);
});

app.post('/api/playlists', (req, res) => {
  const { error } = playlistSchema.validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const newSong = { _id: Date.now(), ...req.body };
  playlists.push(newSong);
  res.json(newSong);
});

app.put('/api/playlists/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const index = playlists.findIndex(p => p._id === id);
  if (index === -1) return res.status(404).send("Not found");

  const { error } = playlistSchema.validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  playlists[index] = { _id: id, ...req.body };
  res.json(playlists[index]);
});

app.delete('/api/playlists/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const index = playlists.findIndex(p => p._id === id);
  if (index === -1) return res.status(404).send("Not found");

  playlists.splice(index, 1);
  res.json({ message: "Deleted", id });
});

app.get('/', (req, res) => {
  res.send("🎧 Welcome to the MySound API<br>GET /api/playlists — Returns playlist data");
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});

