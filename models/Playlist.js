const mongoose = require("mongoose");

const PlaylistSchema = new mongoose.Schema({
  img_name: String,
  title: { type: String, required: true },
  artist: { type: String, required: true },
  album: String,
  genre: String,
  spotify_url: String
});

module.exports = mongoose.model("Playlist", PlaylistSchema);
