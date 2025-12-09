"use client";

type Props = {
  label: string;
  selected?: boolean;
  onClick?: () => void;
};

export default function GenrePill({ label, selected, onClick }: Props) {
  return (
    <button
      onClick={onClick}
      className={
        "px-3 py-1 rounded-full text-xs font-medium border transition " +
        (selected
          ? "bg-emerald-500 text-slate-900 border-emerald-400"
          : "border-slate-600 text-slate-200 hover:bg-slate-800")
      }
    >
      {label}
    </button>
  );
}
