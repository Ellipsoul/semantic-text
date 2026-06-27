import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

// Full continuous weight axis (100..900). Requesting the whole range costs
// essentially the same as a narrow one, and we render arbitrary in-between
// weights, so we take all of it.
const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: "variable",
});

export const metadata: Metadata = {
  title: "Semantic Emphasis",
  description:
    "Renders plain text with variable font weights assigned per-word by semantic importance.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
