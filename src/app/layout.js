import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "QuickBite - Food Delivery",
  description: "Your favorite food delivered fast",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" data-theme="quickbite"> 
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-base-bg text-secondary`}
      >
        <Header />
        <main className="w-full min-h-screen bg-base-bg">
          {children}
        </main>
      </body>
    </html>
  );
}
