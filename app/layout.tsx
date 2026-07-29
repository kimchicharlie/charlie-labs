import type { Metadata } from "next";
import { Inter } from "next/font/google";
import React from "react";
import "./globals.css";
import { LanguageProvider } from "@/shared/i18n";
import Navigation from "@/shared/ui/Navigation";
import { Language } from "@/shared/types/language";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Charlie Henin",
  description:
    "Senior full-stack developer building web products with TypeScript, React and Node.js.",
  openGraph: {
    title: "Charlie Henin — Senior Full-Stack Developer",
    description:
      "Senior full-stack developer building web products with TypeScript, React and Node.js.",
    url: "https://www.charliehenin.com",
  },
};

interface RootLayoutProps {
  children: React.ReactNode;
}

const RootLayout = ({ children }: RootLayoutProps): React.JSX.Element => {
  return (
    <html lang={Language.EN} className="scroll-smooth">
      <body className={`${inter.className} bg-white text-gray-900 antialiased`}>
        <LanguageProvider>
          <Navigation />
          <main className="min-h-screen">{children}</main>
        </LanguageProvider>
      </body>
    </html>
  );
};

export default RootLayout;
