import type { Metadata } from "next";
import { Cairo, Inter } from "next/font/google"; // استدعاء خط عربي
import { Providers } from "@/components/providers";
import "./globals.css";

const inter = Inter({subsets:['latin'],variable:'--font-sans'});

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
    <html lang="ar" dir="rtl" className={inter.variable}>
      <body className={`${cairo.className} bg-[url('/background.jpg')] bg-cover bg-center bg-fixed min-h-screen text-white`}>
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}