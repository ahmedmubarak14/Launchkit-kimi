import type { Metadata } from "next";
import { Inter, IBM_Plex_Sans_Arabic } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const ibmPlexSansArabic = IBM_Plex_Sans_Arabic({
  variable: "--font-ibm-plex-arabic",
  subsets: ["arabic"],
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "LaunchKit - Setup Your Store in Minutes with AI",
  description: "LaunchKit helps merchants set up their online stores through natural conversation with AI. AI creates categories, products, and marketing configuration automatically.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" dir="ltr">
      <body
        className={`${inter.variable} ${ibmPlexSansArabic.variable} antialiased font-sans`}
      >
        {children}
      </body>
    </html>
  );
}
