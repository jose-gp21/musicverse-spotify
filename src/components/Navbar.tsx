"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const [userName, setUserName] = useState<string | null>(null);

  useEffect(() => {
    async function fetchMe() {
      const res = await fetch("/api/auth/me");
      if (res.ok) {
        const data = await res.json();
        setUserName(data.user?.name ?? null);
      } else {
        setUserName(null);
      }
    }
    fetchMe();
  }, []);

  async function handleLogout() {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/login");
  }

  const linkClass = (path: string) =>
    "px-3 py-1 rounded-full text-sm " +
    (pathname.startsWith(path)
      ? "bg-slate-100 text-slate-900"
      : "text-slate-200 hover:bg-slate-800");

  return (
    <header className="border-b border-slate-800 bg-slate-950/70 backdrop-blur sticky top-0 z-20">
      <div className="max-w-5xl mx-auto flex items-center justify-between py-3 px-4">
        <Link href="/dashboard" className="font-bold tracking-tight text-lg">
          MusicVerse
        </Link>

        <nav className="flex items-center gap-2">
          <Link href="/dashboard" className={linkClass("/dashboard")}>
            Início
          </Link>
          <Link href="/songs" className={linkClass("/songs")}>
            Músicas
          </Link>
        </nav>

        <div className="flex items-center gap-3">
          {userName && (
            <span className="text-sm text-slate-300">
              Olá, <span className="font-semibold">{userName}</span>
            </span>
          )}
          <button
            onClick={handleLogout}
            className="text-sm px-3 py-1 rounded-full border border-slate-700 hover:bg-slate-800"
          >
            Sair
          </button>
        </div>
      </div>
    </header>
  );
}
