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

export default function DashboardPage() {
  const [recommended, setRecommended] = useState<Song[]>([]);
  const [favoriteSongs, setFavoriteSongs] = useState<string[]>([]);
  const [genres, setGenres] = useState<string[]>([]);
  const [selectedGenre, setSelectedGenre] = useState<string | null>(null);

  useEffect(() => {
    async function fetchData() {
      const meRes = await fetch("/api/auth/me");
      if (!meRes.ok) return;
      const meData = await meRes.json();
      setFavoriteSongs(meData.user.favoriteSongs ?? []);
      setGenres(meData.user.favoriteGenres ?? []);

      const recRes = await fetch("/api/profile/recommend");
      if (!recRes.ok) return;
      const recData = await recRes.json();
      setRecommended(recData.songs ?? []);
    }
    fetchData();
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

  const visibleSongs = selectedGenre
    ? recommended.filter((s) => s.genres?.includes(selectedGenre))
    : recommended;

  return (
    <div className="min-h-screen">
      <Navbar />

      <main className="max-w-5xl mx-auto px-4 py-6 space-y-6">
        <section>
          <h1 className="text-2xl font-bold mb-1">Suas recomendações</h1>
          <p className="text-sm text-slate-400 mb-4">
            Baseadas nos seus gêneros favoritos e músicas curtidas. Clique no
            player para ouvir a prévia oficial do Spotify.
          </p>

          {genres.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-4">
              <GenrePill
                label="Todos"
                selected={selectedGenre === null}
                onClick={() => setSelectedGenre(null)}
              />
              {genres.map((g) => (
                <GenrePill
                  key={g}
                  label={g}
                  selected={selectedGenre === g}
                  onClick={() => setSelectedGenre(g)}
                />
              ))}
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {visibleSongs.map((song) => (
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

          {visibleSongs.length === 0 && (
            <p className="text-sm text-slate-400">
              Nenhuma recomendação ainda. Cadastre-se com gêneros marcados e
              peça para rodar o seed com Spotify.
            </p>
          )}
        </section>
      </main>
    </div>
  );
}
