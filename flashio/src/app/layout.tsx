import type { Metadata, Viewport } from "next";
import { Londrina_Shadow, Londrina_Solid, Mansalva } from "next/font/google";
import "./globals.css";
import { RenderFlash } from "@/lib/show-flash";
import Header from "@/components/sections/header";

const londrinaShadow = Londrina_Shadow({
  variable: "--font-londrina-shadow",
  weight: ["400"],
});

const londrinaSolid = Londrina_Solid({
  variable: "--font-londrina-solid",
  weight: ["400"],
});

export const metadata: Metadata = {
  title: "Flashio",
  description: "The easy way to flashcard",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" style={{ background: "var(--ray-color)" }}>
      <body
        className={`${londrinaShadow.variable} ${londrinaSolid.variable} antialiased `}
        style={{ background: "var(--ray-color)" }}
      >
        {children}
        <RenderFlash />
      </body>
    </html>
  );
}
