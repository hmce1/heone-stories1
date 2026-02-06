"use client";
import { useSearchParams, useRouter } from "next/navigation";
import { Suspense, useState, FormEvent } from "react";

function FormContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  
  // استلام البيانات من الرابط
  const country = searchParams.get("country") || "";
  const pkg = searchParams.get("package") || "";
  
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    // محاكاة عملية الدفع (تأخير بسيط)
    setTimeout(() => {
      router.push("/success");
    }, 2000);
  };

  return (
    <div className="min-h-screen p-6 bg-emerald-950 flex justify-center items-center">
      <div className="w-full max-w-2xl bg-emerald-900 p-8 rounded-2xl border border-emerald-800 shadow-xl">
        <h2 className="text-2xl font-bold text-gold mb-2">أكمل بيانات الحجز</h2>
        <p className="text-emerald-200 mb-6 text-sm">الباقة المختارة: {pkg}</p>

        <form onSubmit={handleSubmit} className="space-y-4">
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm mb-1 text-emerald-100">الاسم الكامل</label>
              <input required type="text" className="w-full p-3 rounded bg-emerald-800 border border-emerald-700 focus:border-gold outline-none" />
            </div>
            <div>
              <label className="block text-sm mb-1 text-emerald-100">رقم الواتساب</label>
              <input required type="tel" dir="ltr" placeholder="+212..." className="w-full p-3 rounded bg-emerald-800 border border-emerald-700 focus:border-gold outline-none text-right" />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm mb-1 text-emerald-100">الدولة</label>
              {/* حقل معبأ مسبقاً وغير قابل للتعديل */}
              <input type="text" value={country} disabled className="w-full p-3 rounded bg-emerald-950/50 border border-emerald-800 text-gray-400 cursor-not-allowed" />
            </div>
            <div>
              <label className="block text-sm mb-1 text-emerald-100">المدينة</label>
              <input required type="text" className="w-full p-3 rounded bg-emerald-800 border border-emerald-700 focus:border-gold outline-none" />
            </div>
          </div>

          <div>
            <label className="block text-sm mb-1 text-emerald-100">عنوان الرواية المقترح</label>
            <input type="text" className="w-full p-3 rounded bg-emerald-800 border border-emerald-700 focus:border-gold outline-none" />
          </div>

          <div>
            <label className="block text-sm mb-1 text-emerald-100">لماذا ترغبون في كتابة هذه الرواية؟</label>
            <textarea className="w-full p-3 rounded bg-emerald-800 border border-emerald-700 focus:border-gold outline-none h-24"></textarea>
          </div>

          <div>
            <label className="block text-sm mb-2 text-emerald-100">هل ترغب في سرد قصتك عبر رسالة صوتية بالواتساب؟</label>
            <div className="flex gap-4">
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="radio" name="voice" value="yes" className="accent-gold w-4 h-4" />
                <span>نعم</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="radio" name="voice" value="no" defaultChecked className="accent-gold w-4 h-4" />
                <span>لا</span>
              </label>
            </div>
          </div>

          <button 
            type="submit" 
            disabled={loading}
            className="w-full mt-6 p-4 bg-gold text-emerald-950 font-bold text-lg rounded-lg hover:bg-yellow-500 transition disabled:opacity-70"
          >
            {loading ? "جاري التحويل للدفع..." : "إرسال والدفع"}
          </button>
        </form>
      </div>
    </div>
  );
}

export default function FormPage() {
  return (
    <Suspense fallback={<div className="text-white text-center mt-20">جاري التحميل...</div>}>
      <FormContent />
    </Suspense>
  );
}