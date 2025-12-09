import type { ReactNode } from "react";
import "./globals.css";

export const metadata = {
  title: "MusicVerse Spotify",
  description: "Plataforma de músicas com prévias do Spotify"
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="pt-BR">
      <body className="min-h-screen bg-gradient-to-b from-slate-950 to-slate-900 text-slate-50">
        {children}
      </body>
    </html>
  );
}
