import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Caro Lab · Trainer Caro-Kann",
  description: "Allenati sulle linee principali della difesa Caro-Kann giocando sempre con il Nero.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="it">
      <body>{children}</body>
    </html>
  );
}
