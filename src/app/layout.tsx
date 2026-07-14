import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Opening Lab · Trainer di repertorio",
  description: "Allenati sul Jobava col Bianco e su Caro-Kann e Slav universale col Nero.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="it">
      <body>{children}</body>
    </html>
  );
}
