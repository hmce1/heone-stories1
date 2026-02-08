"use client";
import { useSearchParams, useRouter } from "next/navigation";
import { Suspense, useState, useEffect } from "react";
import { CreditCard, Loader2, CheckCircle, AlertCircle, Building2, Globe } from "lucide-react";
import Link from "next/link";
import PayPalButton from "@/components/PayPalButton";

interface Order {
  id: string;
  fullName: string;
  whatsappNumber: string;
  country: string;
  city: string;
  packageName: string;
  price: string;
  currency: string;
  status: string;
}

function PaymentContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const orderId = searchParams.get("orderId") || "";

  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState("");

  const isMorocco = order?.country === "المغرب";

  useEffect(() => {
    if (orderId) {
      fetchOrder();
    } else {
      setError("رقم الطلب غير موجود");
      setLoading(false);
    }
  }, [orderId]);

  const fetchOrder = async () => {
    try {
      const response = await fetch(`/api/orders/${orderId}`);
      if (!response.ok) {
        throw new Error("فشل في تحميل بيانات الطلب");
      }
      const data = await response.json();
      setOrder(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "حدث خطأ أثناء تحميل الطلب");
    } finally {
      setLoading(false);
    }
  };

  const handleBankTransfer = async () => {
    setProcessing(true);
    setError("");

    try {
      // Update order status and payment method
      const response = await fetch(`/api/orders/${orderId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          status: "PROCESSING",
          paymentMethod: "bank_transfer",
        }),
      });

      if (!response.ok) {
        throw new Error("فشل في تحديث حالة الطلب");
      }

      // Redirect to contact confirmation page
      router.push(`/contact-confirmation?orderId=${orderId}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : "حدث خطأ أثناء معالجة الطلب");
      setProcessing(false);
    }
  };

  const handlePayPalSuccess = async () => {
    // PayPal success is handled in the PayPalButton component
    // Redirect to success page
    router.push(`/success?orderId=${orderId}`);
  };

  const handlePayPalError = (errorMessage: string) => {
    setError(errorMessage);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-emerald-950 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 text-gold animate-spin mx-auto mb-4" />
          <p className="text-gold">جاري تحميل بيانات الطلب...</p>
        </div>
      </div>
    );
  }

  if (error && !order) {
    return (
      <div className="min-h-screen bg-emerald-950 flex items-center justify-center p-6">
        <div className="bg-emerald-900 p-8 rounded-2xl border border-emerald-800 shadow-xl max-w-md w-full text-center">
          <AlertCircle className="w-16 h-16 text-red-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gold mb-4">خطأ</h2>
          <p className="text-emerald-200 mb-6">{error}</p>
          <Link
            href="/"
            className="inline-block px-6 py-3 bg-gold text-emerald-950 font-bold rounded-lg hover:bg-yellow-500 transition"
          >
            العودة للصفحة الرئيسية
          </Link>
        </div>
      </div>
    );
  }

  if (!order) {
    return null;
  }

  return (
    <div className="min-h-screen bg-emerald-950 p-6 flex items-center justify-center">
      <div className="w-full max-w-2xl bg-emerald-900 p-8 rounded-2xl border border-emerald-800 shadow-xl">
        <div className="flex items-center gap-3 mb-6">
          <CreditCard className="w-8 h-8 text-gold" />
          <h2 className="text-2xl font-bold text-gold">صفحة الدفع</h2>
        </div>

        {/* Order Summary */}
        <div className="bg-emerald-800/50 p-6 rounded-lg mb-6 border border-emerald-700">
          <h3 className="text-lg font-bold text-gold mb-4">ملخص الطلب</h3>
          <div className="space-y-3 text-sm">
            <div className="flex justify-between">
              <span className="text-emerald-300">الاسم:</span>
              <span className="text-emerald-100 font-medium">{order.fullName}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-emerald-300">الباقة:</span>
              <span className="text-emerald-100 font-medium">{order.packageName}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-emerald-300">المدينة:</span>
              <span className="text-emerald-100 font-medium">{order.city}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-emerald-300">الدولة:</span>
              <span className="text-emerald-100 font-medium">{order.country}</span>
            </div>
            <div className="border-t border-emerald-700 pt-3 mt-3">
              <div className="flex justify-between items-center">
                <span className="text-lg font-bold text-gold">المبلغ الإجمالي:</span>
                <span className="text-2xl font-bold text-gold">
                  {order.price} {order.currency}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Payment Methods */}
        <div className="mb-6">
          <h3 className="text-lg font-bold text-gold mb-4">اختر طريقة الدفع</h3>

          {isMorocco ? (
            /* Morocco - Bank Transfer */
            <div className="space-y-4">
              <div className="bg-emerald-800/50 p-6 rounded-lg border border-emerald-700">
                <div className="flex items-start gap-4 mb-4">
                  <Building2 className="w-6 h-6 text-gold mt-1" />
                  <div className="flex-1">
                    <h4 className="text-emerald-100 font-bold text-lg mb-2">التحويل البنكي</h4>
                    <p className="text-emerald-300 text-sm mb-4">
                      قم بالتحويل إلى الحساب البنكي التالي:
                    </p>
                    <div className="bg-emerald-950/50 p-4 rounded border border-emerald-800 space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-emerald-300">اسم البنك:</span>
                        <span className="text-emerald-100 font-medium">[اسم البنك]</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-emerald-300">رقم الحساب:</span>
                        <span className="text-emerald-100 font-medium">[رقم الحساب]</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-emerald-300">IBAN:</span>
                        <span className="text-emerald-100 font-medium">[IBAN]</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-emerald-300">المبلغ:</span>
                        <span className="text-gold font-bold">{order.price} {order.currency}</span>
                      </div>
                    </div>
                    <p className="text-emerald-300 text-xs mt-4">
                      بعد إتمام التحويل، سيتم التواصل معك عبر الواتساب لتأكيد الدفع
                    </p>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            /* International - PayPal */
            <div className="space-y-4">
              <div className="bg-emerald-800/50 p-6 rounded-lg border border-emerald-700">
                <div className="flex items-start gap-4 mb-4">
                  <Globe className="w-6 h-6 text-gold mt-1" />
                  <div className="flex-1">
                    <h4 className="text-emerald-100 font-bold text-lg mb-2">الدفع عبر PayPal</h4>
                    <p className="text-emerald-300 text-sm mb-4">
                      يمكنك الدفع باستخدام PayPal أو بطاقة الائتمان/الخصم
                    </p>
                    <PayPalButton
                      amount={order.price}
                      currency={order.currency}
                      orderId={orderId}
                      onSuccess={handlePayPalSuccess}
                      onError={handlePayPalError}
                    />
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-900/50 border border-red-700 rounded-lg text-red-200 text-sm">
            {error}
          </div>
        )}

        {/* Action Buttons */}
        {isMorocco && (
          <div className="flex gap-4">
            <button
              onClick={handleBankTransfer}
              disabled={processing}
              className="flex-1 flex items-center justify-center gap-2 p-4 bg-gold text-emerald-950 font-bold text-lg rounded-lg hover:bg-yellow-500 transition disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {processing ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  جاري المعالجة...
                </>
              ) : (
                <>
                  <CheckCircle className="w-5 h-5" />
                  تأكيد التحويل البنكي
                </>
              )}
            </button>
            <Link
              href="/"
              className="px-6 py-4 bg-emerald-800 border border-emerald-700 text-emerald-100 font-medium rounded-lg hover:bg-emerald-700 transition"
            >
              إلغاء
            </Link>
          </div>
        )}

        {!isMorocco && (
          <div className="flex justify-end">
            <Link
              href="/"
              className="px-6 py-4 bg-emerald-800 border border-emerald-700 text-emerald-100 font-medium rounded-lg hover:bg-emerald-700 transition"
            >
              إلغاء
            </Link>
          </div>
        )}

        <p className="text-center text-emerald-300 text-xs mt-6">
          بالضغط على "تأكيد"، أنت توافق على شروط وأحكام الخدمة
        </p>
      </div>
    </div>
  );
}

export default function PaymentPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-emerald-950 flex items-center justify-center">
        <div className="text-gold">جاري التحميل...</div>
      </div>
    }>
      <PaymentContent />
    </Suspense>
  );
}
