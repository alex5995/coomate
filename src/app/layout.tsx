import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "CooMate · Chess Opening Trainer",
  description: "Train the Jobava London as White and the Caro-Kann or Universal Slav as Black.",
  icons: { icon: "/coomate-tab-icon.png", apple: "/coomate-tab-icon.png" },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
