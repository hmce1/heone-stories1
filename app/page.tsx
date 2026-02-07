"use client";
import Image from "next/image";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Instagram, Facebook } from "lucide-react";
// استدعاء الزر الذهبي الذي أنشأته
import GoldenButton from "@/components/GoldenButton";

const arabCountries = [
  "المغرب", "السعودية", "مصر", "الإمارات", "الكويت", "قطر", "الأردن", "عمان", "البحرين", "الجزائر", "تونس","السودان","الصومال","العراق"
];

export default function Home() {
  const [selectedCountry, setSelectedCountry] = useState("");
  const router = useRouter();

  // --- هذا هو الكود الذي كان ناقصاً (handleStart) ---
  const handleStart = () => {
    if (selectedCountry) {
      router.push(`/packages?country=${selectedCountry}`);
    }
  };
  // --------------------------------------------------

  return (
    <main className="flex flex-col items-center min-h-screen p-6">
      
      <div className="flex-grow flex flex-col items-center justify-center w-full max-w-lg space-y-8 animate-fade-in">
        
        {/* اللوغو */}
        <div className="drop-shadow-2xl">
          <Image 
            src="/logo 1.png" 
            alt="HeOne Stories Logo" 
            width={280} 
            height={120} 
            className="object-contain"
          />
        </div>

        {/* النصوص والقائمة */}
        <div className="w-full text-center space-y-6 flex flex-col items-center">
          <h1 className="text-2xl md:text-3xl font-bold text-gold drop-shadow-md whitespace-nowrap">
            جاهزون لحجز صندوقكم السري؟
          </h1>

          <div className="space-y-6 w-full flex flex-col items-center">
             {/* 1. قائمة اختيار الدولة بتصميم ذهبي */}
            <div className="relative w-full max-w-xs">
                <select 
                value={selectedCountry}
                onChange={(e) => setSelectedCountry(e.target.value)}
                className="w-full py-3 px-6 rounded-full bg-gradient-to-r from-yellow-600 via-yellow-300 to-yellow-600 text-black font-bold text-xl shadow-lg appearance-none text-center cursor-pointer focus:outline-none focus:ring-2 focus:ring-yellow-400/50 focus:scale-100"
                >
                <option value="" disabled className="bg-white text-gray-500">اختر الدولة</option>
                {arabCountries.map((country) => (
                    <option key={country} value={country} className="bg-white text-black">{country}</option>
                ))}
                </select>
                {/* سهم القائمة */}
                <div className="absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none text-black/60">
                ▼
                </div>
            </div>

            {/* 2. الزر الذهبي (تم استدعاؤه هنا) */}
            <GoldenButton 
              text="انطلق" 
              onClick={handleStart} 
              disabled={!selectedCountry} 
              className="w-full max-w-xs"
            />
          </div>
        </div>
      </div>

      {/* الفوتر */}
      <footer className="w-full flex justify-center gap-8 text-gold/70 pt-10 pb-4 items-center">
        <a href="#" className="hover:text-gold hover:scale-110 transition"><Instagram size={28} /></a>
        <a href="#" className="hover:text-gold hover:scale-110 transition"><Facebook size={28} /></a>
        {/* أيقونات SVG للواتساب وتيك توك */}
        <a href="#" className="hover:text-gold hover:scale-110 transition">
            <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M3 21l1.65-3.8a9 9 0 1 1 3.4 2.9L3 21" />
            </svg>
        </a>
        <a href="#" className="hover:text-gold hover:scale-110 transition">
            <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M9 12a4 4 0 1 0 4 4V4a5 5 0 0 0 5 5" />
            </svg>
        </a>
      </footer>
    </main>
  );
}
