import type { Metadata } from "next";
import { Bebas_Neue, Syne, JetBrains_Mono } from "next/font/google";

import "./globals.css";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { Providers } from "./providers";
import { ourFileRouter } from "./api/uploadthing/core";
import { extractRouterConfig } from "uploadthing/server";
import { NextSSRPlugin } from "@uploadthing/react/next-ssr-plugin";
//

const bebas = Bebas_Neue({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-bebas",
  display: "swap",
});

const syne = Syne({
  subsets: ["latin"],
  variable: "--font-syne",
  display: "swap",
});

const jetbrains = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
  display: "swap",
});

export const metadata: Metadata = {
  title: "DigiMart — Marketplace de Produtos Digitais",
  description:
    "Marketplace de produtos digitais para criadores moçambicanos. Venda e compre eBooks, templates, cursos e mais.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="pt"
      className={`${bebas.variable} ${syne.variable} ${jetbrains.variable}`}
    >
      <body className="font-syne min-h-screen flex flex-col antialiased">
        <NextSSRPlugin routerConfig={extractRouterConfig(ourFileRouter)} />

        <Providers>
          <Navbar />
          <main className="flex-1">{children}</main>
          <Footer />
        </Providers>
      </body>
    </html>
  );
}
