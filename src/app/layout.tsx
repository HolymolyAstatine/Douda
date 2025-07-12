import type { Metadata } from "next";
import { Geist } from "next/font/google";
import "./globals.css";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import ReactQueryProvider from "@/components/ReactQueryProvider";

const geist = Geist({
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Douda",
  description: "도우다 - 학교생활을 더 쉽게",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <body className={`${geist.className} min-h-screen flex flex-col`}>
        <ReactQueryProvider>
          <Header />
          <main className="flex-1 p-5">
            {children}
          </main>
          <Footer />
        </ReactQueryProvider>
      </body>
    </html>
  );
}
