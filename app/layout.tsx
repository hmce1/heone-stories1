import type { Metadata } from "next";
import { Cairo } from "next/font/google"; // استدعاء خط عربي
import "./globals.css";

const cairo = Cairo({ subsets: ["arabic"] });

export const metadata: Metadata = {
  title: "HeOne Stories | اصنع روايتك",
  description: "جاهزون لحجز صندوقكم السري؟",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ar" dir="rtl">
      <body className={`${cairo.className} bg-[url('/background.jpg')] bg-cover bg-center bg-fixed min-h-screen text-white`}>
        {children}
      </body>
    </html>
  );
}