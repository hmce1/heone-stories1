"use client";
import { useSearchParams } from "next/navigation";
import { Suspense, useEffect, useState } from "react";
import { CheckCircle, MessageCircle, Phone, Loader2 } from "lucide-react";
import Link from "next/link";

function ContactConfirmationContent() {
  const searchParams = useSearchParams();
  const orderId = searchParams.get("orderId") || "";
  const [order, setOrder] = useState<any>(null);
  const [loading, setLoading] = useState(!!orderId);

  useEffect(() => {
    if (orderId) {
      fetchOrder();
    } else {
      setLoading(false);
    }
  }, [orderId]);

  const fetchOrder = async () => {
    try {
      const response = await fetch(`/api/orders/${orderId}`);
      if (response.ok) {
        const data = await response.json();
        setOrder(data);
      }
    } catch (error) {
      console.error("Failed to fetch order:", error);
    } finally {
      setLoading(false);
    }
  };

  const whatsappNumber = "212604410102";

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-emerald-950 text-center">
        <Loader2 className="w-12 h-12 text-gold animate-spin mb-4" />
        <p className="text-gold">جاري التحميل...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-emerald-950 text-center">
      <div className="bg-emerald-900 p-8 rounded-3xl border border-gold/30 max-w-lg shadow-2xl">
        {/* أيقونة علامة الصح الكبيرة */}
        <div className="w-20 h-20 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-6 text-green-400">
          <CheckCircle size={48} />
        </div>

        <h1 className="text-3xl font-bold text-white mb-4">تم تأكيد طلبك بنجاح!</h1>

        {order && (
          <div className="mb-6 p-4 bg-emerald-800/50 rounded-lg text-right">
            <p className="text-emerald-200 text-sm mb-2">
              <span className="text-emerald-300">رقم الطلب:</span> {order.id.slice(0, 8)}...
            </p>
            <p className="text-emerald-200 text-sm">
              <span className="text-emerald-300">الباقة:</span> {order.packageName} - {order.price} {order.currency}
            </p>
          </div>
        )}

        <div className="bg-emerald-800/30 p-6 rounded-lg mb-6 border border-emerald-700">
          <Phone className="w-12 h-12 text-gold mx-auto mb-4" />
          <p className="text-emerald-100 mb-4 leading-relaxed text-lg">
            سنتواصل معك قريباً عبر الواتساب لتأكيد تفاصيل الدفع والبدء في كتابة روايتك
          </p>
          <p className="text-emerald-200 text-sm">
            يرجى التأكد من أن رقم الواتساب صحيح ومتاح للتواصل
          </p>
        </div>

        {/* زر الواتساب المباشر */}
        <Link
          href={`https://wa.me/${whatsappNumber}`}
          target="_blank"
          className="flex items-center justify-center gap-3 w-full p-4 bg-[#25D366] text-white font-bold rounded-xl hover:bg-[#20bd5a] transition shadow-lg mb-4"
        >
          <MessageCircle size={24} />
          <span>ابدأ المحادثة الآن</span>
        </Link>

        <Link href="/" className="block mt-4 text-sm text-emerald-400 hover:text-gold underline">
          العودة للصفحة الرئيسية
        </Link>
      </div>
    </div>
  );
}

export default function ContactConfirmationPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-emerald-950 text-center">
        <Loader2 className="w-12 h-12 text-gold animate-spin mb-4" />
        <p className="text-gold">جاري التحميل...</p>
      </div>
    }>
      <ContactConfirmationContent />
    </Suspense>
  );
}
