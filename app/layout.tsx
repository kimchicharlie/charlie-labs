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
    "Full-stack developer building web products with TypeScript, React and Node.js.",
  openGraph: {
    title: "Charlie Henin — Full-Stack Developer",
    description:
      "Full-stack developer building web products with TypeScript, React and Node.js.",
    url: "https://www.charliehenin.com",
  },
};

interface RootLayoutProps {
  children: React.ReactNode;
}

const RootLayout = ({ children }: RootLayoutProps): React.JSX.Element => {
  return (
    <html lang={Language.EN} className="scroll-smooth">
      <body
        className={`${inter.className} flex min-h-screen flex-col bg-white text-gray-900 antialiased print:block`}
      >
        <LanguageProvider>
          <Navigation />
          <main className="flex flex-1 flex-col print:block">{children}</main>
        </LanguageProvider>
      </body>
    </html>
  );
};

export default RootLayout;
