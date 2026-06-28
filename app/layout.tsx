import type { Metadata } from "next";
import { Inter, Geist } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import "./globals.css";
import { cn } from "@/lib/utils";

const geist = Geist({subsets:['latin'],variable:'--font-sans'});


// Full continuous weight axis (100..900). Requesting the whole range costs
// essentially the same as a narrow one, and we render arbitrary in-between
// weights, so we take all of it.
const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: "variable",
});

export const metadata: Metadata = {
  title: "Semph",
  description:
    "Renders plain text with variable font weights assigned per-word by semantic importance.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={cn("h-full", "antialiased", inter.variable, "font-sans", geist.variable)}>
      <body className="min-h-full flex flex-col">
        {children}
        <Analytics />
      </body>
    </html>
  );
}
