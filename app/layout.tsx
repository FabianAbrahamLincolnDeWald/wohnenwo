import "./globals.css";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import React from "react";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "WohnenWo",
  description: "Innenarchitektur mit Bewusstsein",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="de" className="h-full">
      <body className={`${inter.className} h-full antialiased bg-white text-slate-900`}>
        {children}
      </body>
    </html>
  );
}

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  // maximumScale: 1,       // optional – würde Pinch-Zoom verhindern (nicht immer empfehlenswert)
};
