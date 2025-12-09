"use client";

type SongCardProps = {
  id: string;
  title: string;
  artist: string;
  genres: string[];
  previewUrl?: string;
  isFavorite?: boolean;
  onToggleFavorite?: () => void;
};

export default function SongCard({
  title,
  artist,
  genres,
  previewUrl,
  isFavorite,
  onToggleFavorite
}: SongCardProps) {
  return (
    <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-4 flex flex-col gap-3">
      <div className="flex justify-between items-start gap-2">
        <div>
          <h3 className="font-semibold text-sm">{title}</h3>
          <p className="text-xs text-slate-400">{artist}</p>
        </div>
        <button
          onClick={onToggleFavorite}
          className={
            "text-xs px-2 py-1 rounded-full border " +
            (isFavorite
              ? "border-emerald-400 text-emerald-300"
              : "border-slate-600 text-slate-200 hover:bg-slate-800")
          }
        >
          {isFavorite ? "Favorita" : "Favoritar"}
        </button>
      </div>

      <div className="flex flex-wrap gap-1">
        {genres.map((g) => (
          <span
            key={g}
            className="text-[10px] px-2 py-0.5 rounded-full bg-slate-800 text-slate-300"
          >
            {g}
          </span>
        ))}
      </div>

      {previewUrl ? (
        <audio
          controls
          src={previewUrl}
          className="w-full mt-1"
        >
          Seu navegador não suporta o elemento de áudio.
        </audio>
      ) : (
        <p className="text-[10px] text-slate-500">
          Esta faixa não possui prévia disponível no Spotify.
        </p>
      )}
    </div>
  );
}
