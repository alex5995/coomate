import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "CooMate · Chess Opening Trainer",
  description: "Train the Catalan as White and the Sicilian Dragon or Grünfeld as Black.",
  icons: { icon: "/coomate-tab-icon.png", apple: "/coomate-tab-icon.png" },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
