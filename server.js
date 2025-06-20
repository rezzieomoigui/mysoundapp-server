const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const multer = require("multer");
const path = require("path");
const Joi = require("joi");
require("dotenv").config();

const Playlist = require("./models/Playlist");

const app = express();
const PORT = process.env.PORT || 4000;

// Middleware
app.use(cors());
app.use(express.json());
app.use("/uploads", express.static(path.join(__dirname, "uploads"))); // Serve uploaded images

// Connect to MongoDB
mongoose
  .connect(process.env.MONGO_URI || "your-mongodb-uri-here", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("✅ MongoDB connected"))
  .catch((err) => console.error("❌ MongoDB error:", err));

// Multer storage config
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "uploads/"),
  filename: (req, file, cb) =>
    cb(null, Date.now() + path.extname(file.originalname)),
});
const upload = multer({ storage });

// Joi validation schema
const playlistSchema = Joi.object({
  title: Joi.string().required(),
  artist: Joi.string().required(),
  album: Joi.string().allow(""),
  genre: Joi.string().allow(""),
  spotify_url: Joi.string().uri().allow(""),
});

// Routes

// GET all playlists
app.get("/api/playlists", async (req, res) => {
  try {
    const playlists = await Playlist.find();
    res.json(playlists);
  } catch (err) {
    res.status(500).send("Server error");
  }
});

// POST new playlist with image
app.post("/api/playlists", upload.single("img_name"), async (req, res) => {
  const { error } = playlistSchema.validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  try {
    const newPlaylist = new Playlist({
      img_name: req.file ? req.file.filename : "",
      ...req.body,
    });
    await newPlaylist.save();
    res.json(newPlaylist);
  } catch (err) {
    res.status(500).send("Server error");
  }
});

// PUT update playlist with optional image
app.put("/api/playlists/:id", upload.single("img_name"), async (req, res) => {
  const { error } = playlistSchema.validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  try {
    const updatedData = {
      ...req.body,
      ...(req.file && { img_name: req.file.filename }),
    };

    const updated = await Playlist.findByIdAndUpdate(req.params.id, updatedData, {
      new: true,
    });
    if (!updated) return res.status(404).send("Not found");
    res.json(updated);
  } catch (err) {
    res.status(500).send("Server error");
  }
});

// DELETE a playlist
app.delete("/api/playlists/:id", async (req, res) => {
  try {
    const deleted = await Playlist.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).send("Not found");
    res.json({ message: "Deleted", id: req.params.id });
  } catch (err) {
    res.status(500).send("Server error");
  }
});

// Home route
app.get("/", (req, res) => {
  res.send(
    "🎧 Welcome to the MySound API<br>GET /api/playlists — Returns playlist data"
  );
});

app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});

