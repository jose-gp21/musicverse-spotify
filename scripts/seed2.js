// scripts/offline-seed.cjs

require("dotenv").config({ path: ".env.local" });
const mongoose = require("mongoose");
const Song = require("../src/models/Song").default;

const MONGO_URI = process.env.MONGO_URI;

if (!MONGO_URI) {
  console.error("❌ MONGO_URI não definida no .env.local");
  process.exit(1);
}

const songs = [
  // ---------------- ROCK ----------------
  {
    title: "Firestorm",
    artist: "Neon Riot",
    genre: "rock",
    coverUrl: "https://images.unsplash.com/photo-1511379938547-c1f69419868d",
    audioUrl: "https://www.samplelib.com/lib/preview/mp3/sample-9s.mp3"
  },
  {
    title: "Broken Skies",
    artist: "The Last Dawn",
    genre: "rock",
    coverUrl: "https://images.unsplash.com/photo-1497032628192-86f99bcd76bc",
    audioUrl: "https://www.samplelib.com/lib/preview/mp3/sample-12s.mp3"
  },

  // ---------------- INDIE ----------------
  {
    title: "Lemonade Dreams",
    artist: "Soft Comet",
    genre: "indie",
    coverUrl: "https://images.unsplash.com/photo-1492684223066-81342ee5ff30",
    audioUrl: "https://www.samplelib.com/lib/preview/mp3/sample-3s.mp3"
  },
  {
    title: "Blue Window",
    artist: "Indigo Trees",
    genre: "indie",
    coverUrl: "https://images.unsplash.com/photo-1470225620780-dba8ba36b745",
    audioUrl: "https://www.samplelib.com/lib/preview/mp3/sample-15s.mp3"
  },

  // ---------------- POP ----------------
  {
    title: "Electric Heart",
    artist: "Crystal Nova",
    genre: "pop",
    coverUrl: "https://images.unsplash.com/photo-1507878866276-a947ef722fee",
    audioUrl: "https://www.samplelib.com/lib/preview/mp3/sample-6s.mp3"
  },
  {
    title: "Golden Waves",
    artist: "Skyline Duo",
    genre: "pop",
    coverUrl: "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4",
    audioUrl: "https://www.samplelib.com/lib/preview/mp3/sample-9s.mp3"
  },

  // ---------------- FUNK ----------------
  {
    title: "No Grau da Nave",
    artist: "MC Orion",
    genre: "funk",
    coverUrl: "https://images.unsplash.com/photo-1511379941034-06b95cf5a827",
    audioUrl: "https://www.samplelib.com/lib/preview/mp3/sample-12s.mp3"
  },
  {
    title: "Treme o Baile",
    artist: "DJ Vulcano",
    genre: "funk",
    coverUrl: "https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f",
    audioUrl: "https://www.samplelib.com/lib/preview/mp3/sample-3s.mp3"
  },

  // ---------------- HIPHOP ----------------
  {
    title: "Night Flow",
    artist: "LXNGBOY",
    genre: "hiphop",
    coverUrl: "https://images.unsplash.com/photo-1507874457470-272b3c8d8ee2",
    audioUrl: "https://www.samplelib.com/lib/preview/mp3/sample-15s.mp3"
  },
  {
    title: "Concrete Jungle",
    artist: "Urban Shade",
    genre: "hiphop",
    coverUrl: "https://images.unsplash.com/photo-1515378791036-0648a3ef77b2",
    audioUrl: "https://www.samplelib.com/lib/preview/mp3/sample-6s.mp3"
  },

  // ---------------- RAP ----------------
  {
    title: "Vida na Margem",
    artist: "Flow K9",
    genre: "rap",
    coverUrl: "https://images.unsplash.com/photo-1504384308090-c894fdcc538d",
    audioUrl: "https://www.samplelib.com/lib/preview/mp3/sample-9s.mp3"
  },
  {
    title: "Ritmo Pesado",
    artist: "Kappa ZN",
    genre: "rap",
    coverUrl: "https://images.unsplash.com/photo-1497032205916-ac775f0649ae",
    audioUrl: "https://www.samplelib.com/lib/preview/mp3/sample-12s.mp3"
  },

  // ---------------- PAGODE ----------------
  {
    title: "Luz do Amanhã",
    artist: "Grupo Essência",
    genre: "pagode",
    coverUrl: "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4",
    audioUrl: "https://www.samplelib.com/lib/preview/mp3/sample-6s.mp3"
  },
  {
    title: "Coração Moleque",
    artist: "Samba leve",
    genre: "pagode",
    coverUrl: "https://images.unsplash.com/photo-1485579149621-3123dd979885",
    audioUrl: "https://www.samplelib.com/lib/preview/mp3/sample-9s.mp3"
  },

  // ---------------- BRASILEIRO ----------------
  {
    title: "Sol da Serra",
    artist: "Flor do Cerrado",
    genre: "brasileiro",
    coverUrl: "https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f",
    audioUrl: "https://www.samplelib.com/lib/preview/mp3/sample-3s.mp3"
  },
  {
    title: "Maré Mansa",
    artist: "Orla Norte",
    genre: "brasileiro",
    coverUrl: "https://images.unsplash.com/photo-1503023345310-bd7c1de61c7d",
    audioUrl: "https://www.samplelib.com/lib/preview/mp3/sample-6s.mp3"
  }
];

async function run() {
  try {
    await mongoose.connect(MONGO_URI);
    console.log("✔ Conectado ao MongoDB"); 

    await Song.deleteMany({});
    console.log("🗑 Limpou coleção de músicas");

    await Song.insertMany(songs);
    console.log(`🎵 Inseriu ${songs.length} músicas`);

    await mongoose.disconnect();
    console.log("✔ Seed finalizado!");
  } catch (err) {
    console.error("Erro no seed:", err);
  }
}

run();
