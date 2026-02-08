"use client";
import { useSearchParams, useRouter } from "next/navigation";
import { Suspense, useState, FormEvent } from "react";

function FormContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  
  // استلام البيانات من الرابط
  const country = searchParams.get("country") || "";
  const pkg = searchParams.get("package") || "";
  const price = searchParams.get("price") || "";
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const formData = new FormData(e.currentTarget);
    const formValues = {
      fullName: formData.get("fullName") as string,
      whatsappNumber: formData.get("whatsappNumber") as string,
      city: formData.get("city") as string,
      proposedNovelTitle: formData.get("proposedNovelTitle") as string,
      whyWriteNovel: formData.get("whyWriteNovel") as string,
      voiceMessagePreferred: formData.get("voice") as string,
      country,
      packageName: pkg,
      price,
    };

    try {
      const response = await fetch("/api/orders", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formValues),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Failed to submit order");
      }

      const data = await response.json();
      // Redirect to payment page with order ID
      router.push(`/payment?orderId=${data.orderId}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : "حدث خطأ أثناء إرسال الطلب");
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen p-6 bg-emerald-950 flex justify-center items-center">
      <div className="w-full max-w-2xl bg-emerald-900 p-8 rounded-2xl border border-emerald-800 shadow-xl">
        <h2 className="text-2xl font-bold text-gold mb-2">أكمل بيانات الحجز</h2>
        <p className="text-emerald-200 mb-6 text-sm">الباقة المختارة: {pkg}</p>

        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div className="p-3 bg-red-900/50 border border-red-700 rounded text-red-200 text-sm">
              {error}
            </div>
          )}
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm mb-1 text-emerald-100">الاسم الكامل</label>
              <input required name="fullName" type="text" className="w-full p-3 rounded bg-emerald-800 border border-emerald-700 focus:border-gold outline-none" />
            </div>
            <div>
              <label className="block text-sm mb-1 text-emerald-100">رقم الواتساب</label>
              <input required name="whatsappNumber" type="tel" dir="ltr" placeholder="+212..." className="w-full p-3 rounded bg-emerald-800 border border-emerald-700 focus:border-gold outline-none text-right" />
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
              <input required name="city" type="text" className="w-full p-3 rounded bg-emerald-800 border border-emerald-700 focus:border-gold outline-none" />
            </div>
          </div>

          <div>
            <label className="block text-sm mb-1 text-emerald-100">عنوان الرواية المقترح</label>
            <input name="proposedNovelTitle" type="text" className="w-full p-3 rounded bg-emerald-800 border border-emerald-700 focus:border-gold outline-none" />
          </div>

          <div>
            <label className="block text-sm mb-1 text-emerald-100">لماذا ترغبون في كتابة هذه الرواية؟</label>
            <textarea name="whyWriteNovel" className="w-full p-3 rounded bg-emerald-800 border border-emerald-700 focus:border-gold outline-none h-24"></textarea>
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