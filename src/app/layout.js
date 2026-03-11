import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { CartProvider } from "@/contexts/CartContext";
import NextAuthProvider from "@/provider/NextAuthProvider"; // spelling fixed
import { LanguageProvider } from "@/contexts/LanguageProvider";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "QuickBite",
  description: "Food Delivery Platform",
};

export default function RootLayout({ children }) {
  return (
    <NextAuthProvider>
      <html lang="en">
        <body
          className={`${geistSans.variable} ${geistMono.variable} antialiased`}
        >
          <LanguageProvider>
            <CartProvider>
              <Header />
              <main className="max-w-[1380px] mx-auto min-h-[calc(100vh-395px)]">
                {children}
              </main>
              <Footer />
            </CartProvider>
          </LanguageProvider>
        </body>
      </html>
    </NextAuthProvider>
  );
}