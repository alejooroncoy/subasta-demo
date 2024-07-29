import type { Metadata } from "next";
import Header from "@/sections/Header";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Create Next App",
  description: "Generated by create next app",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className={inter.className.concat(" flex min-h-dvh flex-col")}>
        <Header />
        {children}
      </body>
    </html>
  );
}
