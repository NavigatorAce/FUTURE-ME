import type { Metadata } from "next";
import { Inter, Cormorant_Garamond } from "next/font/google";
import "./globals.css";
import { AppNav } from "@/components/layout/AppNav";

const inter = Inter({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const cormorant = Cormorant_Garamond({
  variable: "--font-display",
  weight: ["400", "600"],
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Branch Self — Explore who you might become",
  description:
    "Talk to different future versions of yourself across parallel life branches. A reflective experience for self-exploration and decision support.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body
        className={`${inter.variable} ${cormorant.variable} font-sans bg-background text-foreground`}
      >
        <AppNav />
        <main className="min-h-screen">{children}</main>
      </body>
    </html>
  );
}
