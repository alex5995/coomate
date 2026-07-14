import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Opening Lab · Trainer di repertorio",
  description: "Allenati sulla Caro-Kann con il Nero e sul Jobava London con il Bianco.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="it">
      <body>{children}</body>
    </html>
  );
}
