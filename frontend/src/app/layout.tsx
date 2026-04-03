import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./global.css";
import Script from 'next/script'


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
  <html lang="en" suppressHydrationWarning>
    <body className="antialiased">
      <main
        className={`
          ${geistSans.variable} 
          ${geistMono.variable} 
          antialiased 
          min-h-screen 
          bg-linear-to-b 
          from-[#FDF7F3] 
          via-[#F4E1D4] 
          to-[#E8D0C1] 
          text-neutral-800
        `}
      >
        <Script 
          src="https://accounts.google.com/gsi/client" 
          strategy="beforeInteractive" 
        />
        {children}
      </main>
    </body>
  </html>
);
}
