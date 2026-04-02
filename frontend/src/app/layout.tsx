import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./global.css";

import Header from "@/components/Header";
import Footer from "@/components/Footer";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Taiwanese Alumni Network",
  description: "Alumni platform",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`
          ${geistSans.variable}
          ${geistMono.variable}
          antialiased
          min-h-screen
        `}
        style={{
          background:
            "linear-gradient(140deg, #FDF7F3 0%,  #EDE1D9 35%, #F4E1D4 65%, #E8D0C1 100%)",
          backgroundAttachment: "fixed",
        }}
      >
        <Header />
        <main>{children}</main>
        <Footer />
      </body>
    </html>
  );
}
