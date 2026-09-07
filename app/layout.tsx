import type { Metadata } from "next";
import { Fraunces, Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";

const fraunces = Fraunces({
  variable: "--font-fraunces",
  subsets: ["latin"],
  preload: false,
});

const plusJakartaSans = Plus_Jakarta_Sans({
  variable: "--font-jakarta-sans",
  subsets: ["latin"],
  preload: false,
});

export const metadata: Metadata = {
  title: "POPMI KTP - Sistem Layanan Terpadu Temiang Pesisir",
  description: "Sistem Administrasi dan Posko Pengaduan Kecamatan Temiang Pesisir, Kabupaten Lingga.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id">
      <body
        className={`${fraunces.variable} ${plusJakartaSans.variable} antialiased text-teks bg-krem min-h-screen`}
      >
        {children}
      </body>
    </html>
  );
}
