"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import Link from "next/link";
import GenrePill from "@/components/GenrePill";

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

export default function RegisterPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [genres, setGenres] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  function toggleGenre(g: string) {
    setGenres((prev) =>
      prev.includes(g) ? prev.filter((x) => x !== g) : [...prev, g]
    );
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    const res = await fetch("/api/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email, password, favoriteGenres: genres })
    });

    if (!res.ok) {
      const data = await res.json();
      setError(data.error ?? "Erro ao cadastrar");
      setLoading(false);
      return;
    }

    router.push("/login");
  }

  return (
    <main className="flex min-h-screen items-center justify-center">
      <div className="w-full max-w-md bg-slate-900/70 border border-slate-800 rounded-2xl p-8 shadow-xl">
        <h1 className="text-2xl font-bold mb-2">Criar conta</h1>
        <p className="text-sm text-slate-400 mb-6">
          Escolha seus gêneros favoritos para personalizar as recomendações.
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-xs text-slate-300">Nome</label>
            <input
              className="mt-1 w-full rounded-lg border border-slate-700 bg-slate-950/60 px-3 py-2 text-sm"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>

          <div>
            <label className="text-xs text-slate-300">Email</label>
            <input
              className="mt-1 w-full rounded-lg border border-slate-700 bg-slate-950/60 px-3 py-2 text-sm"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div>
            <label className="text-xs text-slate-300">Senha</label>
            <input
              className="mt-1 w-full rounded-lg border border-slate-700 bg-slate-950/60 px-3 py-2 text-sm"
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <div>
            <p className="text-xs text-slate-300 mb-1">
              Gêneros favoritos (opcional)
            </p>
            <div className="flex flex-wrap gap-2">
              {ALL_GENRES.map((g) => (
                <GenrePill
                  key={g}
                  label={g}
                  selected={genres.includes(g)}
                  onClick={() => toggleGenre(g)}
                />
              ))}
            </div>
          </div>

          {error && (
            <p className="text-xs text-red-400 bg-red-950/40 border border-red-900 rounded-lg px-3 py-2">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-lg py-2 text-sm font-medium bg-emerald-500 text-slate-950 hover:bg-emerald-400 disabled:opacity-60"
          >
            {loading ? "Criando conta..." : "Cadastrar"}
          </button>
        </form>

        <p className="mt-4 text-xs text-slate-400">
          Já tem conta?{" "}
          <Link href="/login" className="text-emerald-400 hover:underline">
            Faça login
          </Link>
        </p>
      </div>
    </main>
  );
}
