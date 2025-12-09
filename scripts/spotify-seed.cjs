/* Seed automático usando a API do Spotify para preencher previewUrl */
const mongoose = require("mongoose");
const fetch = require("node-fetch");
require("dotenv").config({ path: ".env.local" });

const MONGO_URI = process.env.MONGO_URI;
const CLIENT_ID = process.env.SPOTIFY_CLIENT_ID;
const CLIENT_SECRET = process.env.SPOTIFY_CLIENT_SECRET;

if (!MONGO_URI || !CLIENT_ID || !CLIENT_SECRET) {
  console.error("Configure MONGO_URI, SPOTIFY_CLIENT_ID e SPOTIFY_CLIENT_SECRET no .env.local");
  process.exit(1);
}

const bandSchema = new mongoose.Schema({
  name: String,
  genres: [String]
});

const songSchema = new mongoose.Schema({
  title: String,
  artist: String,
  bandId: { type: mongoose.Schema.Types.ObjectId, ref: "Band" },
  genres: [String],
  previewUrl: String
});

const Band = mongoose.model("Band", bandSchema);
const Song = mongoose.model("Song", songSchema);

async function getSpotifyToken() {
  const credentials = Buffer.from(`${CLIENT_ID}:${CLIENT_SECRET}`).toString("base64");
  const res = await fetch("https://accounts.spotify.com/api/token", {
    method: "POST",
    headers: {
      Authorization: `Basic ${credentials}`,
      "Content-Type": "application/x-www-form-urlencoded"
    },
    body: "grant_type=client_credentials"
  });

  if (!res.ok) {
    console.error("Falha ao obter token do Spotify", await res.text());
    process.exit(1);
  }

  const data = await res.json();
  return data.access_token;
}

async function searchTrack(token, query) {
  const url = `https://api.spotify.com/v1/search?type=track&limit=1&q=${encodeURIComponent(
    query
  )}`;
  const res = await fetch(url, {
    headers: { Authorization: `Bearer ${token}` }
  });
  if (!res.ok) {
    console.warn("Erro ao buscar faixa:", query, await res.text());
    return null;
  }
  const data = await res.json();
  return data.tracks.items[0] || null;
}

async function run() {
  await mongoose.connect(MONGO_URI);
  console.log("Conectado ao MongoDB");

  await Band.deleteMany({});
  await Song.deleteMany({});

  const bandsConfig = [
    { name: "Arctic Monkeys", genres: ["indie", "rock"] },
    { name: "The Strokes", genres: ["rock", "indie"] },
    { name: "Imagine Dragons", genres: ["rock", "pop"] },
    { name: "Kendrick Lamar", genres: ["hiphop", "rap"] },
    { name: "Travis Scott", genres: ["hiphop", "rap"] },
    { name: "Charlie Brown Jr.", genres: ["rock", "brasileiro"] },
    { name: "Ludmilla", genres: ["pop", "funk"] },
    { name: "Anitta", genres: ["pop", "funk"] },
    { name: "Sorriso Maroto", genres: ["pagode"] },
    { name: "Pixote", genres: ["pagode"] }
  ];

  const bands = {};
  for (const b of bandsConfig) {
    const band = await Band.create(b);
    bands[b.name] = band;
  }

  const tracksConfig = [
    // rock / indie
    { query: "Do I Wanna Know? Arctic Monkeys", title: "Do I Wanna Know?", artist: "Arctic Monkeys", band: "Arctic Monkeys", genres: ["indie", "rock"] },
    { query: "R U Mine? Arctic Monkeys", title: "R U Mine?", artist: "Arctic Monkeys", band: "Arctic Monkeys", genres: ["indie", "rock"] },
    { query: "Fluorescent Adolescent Arctic Monkeys", title: "Fluorescent Adolescent", artist: "Arctic Monkeys", band: "Arctic Monkeys", genres: ["indie", "rock"] },
    { query: "Reptilia The Strokes", title: "Reptilia", artist: "The Strokes", band: "The Strokes", genres: ["indie", "rock"] },
    { query: "Someday The Strokes", title: "Someday", artist: "The Strokes", band: "The Strokes", genres: ["rock", "indie"] },
    { query: "Last Nite The Strokes", title: "Last Nite", artist: "The Strokes", band: "The Strokes", genres: ["rock"] },
    { query: "Believer Imagine Dragons", title: "Believer", artist: "Imagine Dragons", band: "Imagine Dragons", genres: ["rock", "pop"] },
    { query: "Radioactive Imagine Dragons", title: "Radioactive", artist: "Imagine Dragons", band: "Imagine Dragons", genres: ["rock", "pop"] },
    { query: "Demons Imagine Dragons", title: "Demons", artist: "Imagine Dragons", band: "Imagine Dragons", genres: ["rock", "pop"] },

    // hiphop / rap
    { query: "HUMBLE. Kendrick Lamar", title: "HUMBLE.", artist: "Kendrick Lamar", band: "Kendrick Lamar", genres: ["hiphop", "rap"] },
    { query: "DNA. Kendrick Lamar", title: "DNA.", artist: "Kendrick Lamar", band: "Kendrick Lamar", genres: ["hiphop", "rap"] },
    { query: "Swimming Pools Drank Kendrick Lamar", title: "Swimming Pools (Drank)", artist: "Kendrick Lamar", band: "Kendrick Lamar", genres: ["hiphop"] },
    { query: "SICKO MODE Travis Scott", title: "SICKO MODE", artist: "Travis Scott", band: "Travis Scott", genres: ["rap", "hiphop"] },
    { query: "goosebumps Travis Scott", title: "goosebumps", artist: "Travis Scott", band: "Travis Scott", genres: ["rap", "hiphop"] },
    { query: "HIGHEST IN THE ROOM Travis Scott", title: "HIGHEST IN THE ROOM", artist: "Travis Scott", band: "Travis Scott", genres: ["rap"] },

    // brasileiro / rock
    { query: "Só os Loucos Sabem Charlie Brown Jr.", title: "Só Os Loucos Sabem", artist: "Charlie Brown Jr.", band: "Charlie Brown Jr.", genres: ["rock", "brasileiro"] },
    { query: "Dias de Luta, Dias de Glória Charlie Brown Jr.", title: "Dias de Luta, Dias de Glória", artist: "Charlie Brown Jr.", band: "Charlie Brown Jr.", genres: ["rock", "brasileiro"] },

    // funk / pop
    { query: "Verdinha Ludmilla", title: "Verdinha", artist: "Ludmilla", band: "Ludmilla", genres: ["funk", "pop"] },
    { query: "Malokera Ludmilla", title: "Malokera", artist: "Ludmilla", band: "Ludmilla", genres: ["funk"] },
    { query: "Din Din Din Ludmilla", title: "Din Din Din", artist: "Ludmilla", band: "Ludmilla", genres: ["pop"] },
    { query: "Vai Malandra Anitta", title: "Vai Malandra", artist: "Anitta", band: "Anitta", genres: ["funk"] },
    { query: "Bang Anitta", title: "Bang", artist: "Anitta", band: "Anitta", genres: ["pop"] },
    { query: "Envolver Anitta", title: "Envolver", artist: "Anitta", band: "Anitta", genres: ["funk", "pop"] },

    // pagode
    { query: "1 Metro e 65 Sorriso Maroto", title: "1 Metro e 65", artist: "Sorriso Maroto", band: "Sorriso Maroto", genres: ["pagode"] },
    { query: "Sinais Sorriso Maroto", title: "Sinais", artist: "Sorriso Maroto", band: "Sorriso Maroto", genres: ["pagode"] },
    { query: "Futuro Prometido Sorriso Maroto", title: "Futuro Prometido", artist: "Sorriso Maroto", band: "Sorriso Maroto", genres: ["pagode"] },
    { query: "Insegurança Pixote", title: "Insegurança", artist: "Pixote", band: "Pixote", genres: ["pagode"] },
    { query: "Frieza Pixote", title: "Frieza", artist: "Pixote", band: "Pixote", genres: ["pagode"] }
  ];

  const token = await getSpotifyToken();
  console.log("Token Spotify obtido");

  for (const t of tracksConfig) {
    const track = await searchTrack(token, t.query);
    if (!track) {
      console.warn("Nenhuma faixa encontrada para:", t.query);
      continue;
    }
    const previewUrl = track.preview_url || null;

    const bandDoc = bands[t.band];
    await Song.create({
      title: t.title,
      artist: t.artist,
      bandId: bandDoc ? bandDoc._id : undefined,
      genres: t.genres,
      previewUrl
    });

    console.log("Criada música:", t.title, "-", t.artist, "preview:", !!previewUrl);
  }

  console.log("Seed concluído.");
  await mongoose.disconnect();
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
