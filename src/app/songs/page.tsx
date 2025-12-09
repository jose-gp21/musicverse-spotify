"use client";

import { useEffect, useState } from "react";
import Navbar from "@/components/Navbar";
import SongCard from "@/components/SongCard";
import GenrePill from "@/components/GenrePill";

type Song = {
  _id: string;
  title: string;
  artist: string;
  genres: string[];
  previewUrl?: string;
};

const ALL_GENRES = [
  "rock",
  "indie",
  "hiphop",
  "rap",
  "pop",
  "funk",
  "pagode",
  "brasileiro"
];

export default function SongsPage() {
  const [songs, setSongs] = useState<Song[]>([]);
  const [favoriteSongs, setFavoriteSongs] = useState<string[]>([]);
  const [selectedGenre, setSelectedGenre] = useState<string | null>(null);

  async function loadSongs(genre?: string | null) {
    const params = genre ? `?genre=${encodeURIComponent(genre)}` : "";
    const res = await fetch(`/api/songs${params}`);
    const data = await res.json();
    setSongs(data.songs ?? []);
  }

  useEffect(() => {
    loadSongs();
    async function fetchFav() {
      const meRes = await fetch("/api/auth/me");
      if (!meRes.ok) return;
      const meData = await meRes.json();
      setFavoriteSongs(meData.user.favoriteSongs ?? []);
    }
    fetchFav();
  }, []);

  async function toggleFavorite(songId: string) {
    const isFav = favoriteSongs.includes(songId);
    const action = isFav ? "remove" : "add";
    const res = await fetch("/api/profile/favorites", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ songId, action })
    });
    if (!res.ok) return;
    const data = await res.json();
    setFavoriteSongs(data.favoriteSongs.map((id: string) => String(id)));
  }

  function handleGenreClick(g: string | null) {
    setSelectedGenre(g);
    loadSongs(g);
  }

  return (
    <div className="min-h-screen">
      <Navbar />

      <main className="max-w-5xl mx-auto px-4 py-6 space-y-6">
        <section>
          <h1 className="text-2xl font-bold mb-1">Catálogo de músicas</h1>
          <p className="text-sm text-slate-400 mb-4">
            Todas as músicas cadastradas com prévias do Spotify quando
            disponíveis.
          </p>

          <div className="flex flex-wrap gap-2 mb-4">
            <GenrePill
              label="Todos"
              selected={selectedGenre === null}
              onClick={() => handleGenreClick(null)}
            />
            {ALL_GENRES.map((g) => (
              <GenrePill
                key={g}
                label={g}
                selected={selectedGenre === g}
                onClick={() => handleGenreClick(g)}
              />
            ))}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {songs.map((song) => (
              <SongCard
                key={song._id}
                id={song._id}
                title={song.title}
                artist={song.artist}
                genres={song.genres}
                previewUrl={song.previewUrl}
                isFavorite={favoriteSongs.includes(song._id)}
                onToggleFavorite={() => toggleFavorite(song._id)}
              />
            ))}
          </div>

          {songs.length === 0 && (
            <p className="text-sm text-slate-400">
              Nenhuma música encontrada. Rode o script `npm run spotify:seed` para
              popular o banco com prévias do Spotify.
            </p>
          )}
        </section>
      </main>
    </div>
  );
}
