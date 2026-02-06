"use client";
import { useSearchParams, useRouter } from "next/navigation";
import { Suspense } from "react";
import { Check, ArrowLeft, ArrowRight } from "lucide-react";

function PackagesContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const country = searchParams.get("country") || "المغرب";
  const isMorocco = country === "المغرب";

  const selectPackage = (pkgName: string, price: string) => {
    router.push(`/form?country=${country}&package=${pkgName}&price=${price}`);
  };

  const PackageCard = ({ title, price, features, bgClass, btnClass, onClick, popular = false }: any) => (
    // هنا قمنا بتحديد عرض ثابت للبطاقة (min-w) لضمان عدم انكماشها في الهاتف
    <div className="flex flex-col group min-w-[85vw] md:min-w-0 snap-center">
      {/* رأس البطاقة */}
      <div className={`relative p-6 md:p-8 rounded-3xl h-40 md:h-48 flex flex-col justify-between transition-transform duration-300 group-hover:-translate-y-2 ${bgClass}`}>
        {popular && (
          <span className="absolute top-4 right-4 bg-white/20 backdrop-blur-md text-white text-[10px] md:text-xs px-2 py-1 rounded-full border border-white/30 font-bold">
            الأكثر طلباً
          </span>
        )}
        <h3 className="text-xl md:text-2xl font-bold text-white">{title}</h3>
        <div className="text-white">
            <span className="text-2xl md:text-3xl font-bold">{price}</span>
            <span className="text-xs md:text-sm opacity-80 mr-1">/ للرواية</span>
        </div>
      </div>

      {/* الزر */}
      <button 
        onClick={onClick}
        className={`w-full py-3 md:py-4 mt-4 md:mt-6 rounded-full font-bold text-base md:text-lg shadow-lg active:scale-95 transition-transform ${btnClass}`}
      >
        اختر الباقة
      </button>

      {/* المميزات */}
      <div className="mt-6 space-y-3 pr-2">
        {features.map((feat: string, i: number) => (
          <div key={i} className="flex items-start gap-2 text-emerald-100/90 text-sm">
            <Check className="w-4 h-4 md:w-5 md:h-5 text-gold shrink-0 mt-0.5" /> 
            <span>{feat}</span>
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 md:p-8 w-full bg-emerald-950/80 backdrop-blur-sm">
      
      <div className="text-center mb-8 animate-fade-in">
        <h2 className="text-2xl md:text-4xl font-bold text-gold mb-2">
          {isMorocco ? "اختر باقتك المفضلة" : `أهلاً بك يا كاتبنا من ${country}`}
        </h2>
        <p className="text-emerald-200 text-sm md:text-base">
          اسحب لليسار لرؤية باقي الباقات
        </p>
      </div>

      {/* هنا السحر في التصميم:
        1. flex: لترتيب العناصر بجانب بعضها.
        2. overflow-x-auto: للسماح بالسحب الأفقي على الجوال.
        3. snap-x: لكي تتوقف الشاشة عند كل باقة بالضبط (Magnet effect).
        4. md:grid: على الكمبيوتر تتحول لشبكة عادية بدون سحب.
      */}
      <div className="
        flex gap-4 overflow-x-auto snap-x snap-mandatory w-full px-4 pb-8 
        md:grid md:grid-cols-3 md:gap-8 md:overflow-visible md:w-full md:max-w-6xl md:pb-0
        scrollbar-hide
      ">
        
        {isMorocco ? (
          <>
            {/* 1. النسخة الرقمية */}
            <PackageCard 
              title="النسخة الرقمية"
              price="50 DH"
              bgClass="bg-emerald-800/80 border border-emerald-700"
              btnClass="bg-emerald-950 text-white border border-emerald-800"
              onClick={() => selectPackage("النسخة الرقمية", "50")}
              features={[
                "ملف PDF عالي الجودة",
                "تصميم غلاف إلكتروني",
                "تسليم فوري عبر الواتساب"
              ]}
            />

            {/* 2. الغلاف الفاخر */}
            <PackageCard 
              title="الغلاف الفاخر"
              price="150 DH"
              bgClass="bg-gradient-to-br from-emerald-600 to-teal-800 shadow-xl"
              btnClass="bg-white text-emerald-950"
              onClick={() => selectPackage("الغلاف الفاخر", "150")}
              features={[
                "نسخة مطبوعة (Paperback)",
                "غلاف بملمس مخملي (Matte)",
                "ورق كريمي مريح للعين",
                "توصيل سريع لباب المنزل"
              ]}
            />

            {/* 3. الصندوق الأسود */}
            <PackageCard 
              title="الصندوق الأسود VIP"
              price="250 DH"
              popular={true}
              bgClass="bg-gradient-to-br from-yellow-600 via-yellow-500 to-yellow-700 border border-white/20"
              btnClass="bg-black text-gold border border-gold/20"
              onClick={() => selectPackage("الصندوق الأسود", "250")}
              features={[
                "صندوق هدايا أسود فاخر",
                "بطاقة إهداء مخصصة",
                "أكسسوارات وهدايا إضافية",
                "شحن مجاني لجميع المدن"
              ]}
            />
          </>
        ) : (
          /* دولي */
          <div className="w-full flex justify-center md:col-span-3">
             <div className="max-w-md w-full">
                <PackageCard 
                    title="النسخة الدولية"
                    price="10 USD"
                    bgClass="bg-gradient-to-br from-blue-600 to-indigo-800"
                    btnClass="bg-white text-blue-900"
                    onClick={() => selectPackage("النسخة الرقمية (دولي)", "10 USD")}
                    features={[
                    "نسخة إلكترونية (PDF)",
                    "إمكانية الطباعة في بلدك",
                    "نعمل على توفير الشحن قريباً"
                    ]}
                />
             </div>
          </div>
        )}

      </div>
      
      {/* مؤشر توضيحي للجوال فقط يظهر أسفل الباقات */}
      {isMorocco && (
        <div className="flex gap-2 mt-4 md:hidden">
            <div className="w-2 h-2 rounded-full bg-white/50"></div>
            <div className="w-2 h-2 rounded-full bg-white"></div>
            <div className="w-2 h-2 rounded-full bg-white/50"></div>
        </div>
      )}

    </div>
  );
}

export default function PackagesPage() {
  return (
    <Suspense fallback={<div className="text-white text-center mt-20">جاري التحميل...</div>}>
      <PackagesContent />
    </Suspense>
  );
}