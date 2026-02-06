import Link from "next/link";
import { CheckCircle, MessageCircle } from "lucide-react"; // استبدلنا الأيقونة القديمة بهاتين

export default function SuccessPage() {
  // رقم الواتساب الخاص بالشركة
  const whatsappNumber = "212600000000"; 

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-emerald-950 text-center">
      <div className="bg-emerald-900 p-8 rounded-3xl border border-gold/30 max-w-lg shadow-2xl">
        {/* أيقونة علامة الصح الكبيرة */}
        <div className="w-20 h-20 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-6 text-green-400">
            <CheckCircle size={48} />
        </div>
        
        <h1 className="text-3xl font-bold text-white mb-4">تم الدفع بنجاح!</h1>
        
        <p className="text-emerald-100 mb-8 leading-relaxed">
          شكراً لثقتكم بنا. لتتبع طلبكم وكتابة روايتكم خطوة بخطوة، سيتم التواصل معكم عبر الواتساب الآن.
        </p>

        {/* زر الواتساب المباشر */}
        <Link 
          href={`https://wa.me/${212604410102}`}
          target="_blank"
          className="flex items-center justify-center gap-3 w-full p-4 bg-[#25D366] text-white font-bold rounded-xl hover:bg-[#20bd5a] transition shadow-lg"
        >
          <span>ابدأ المحادثة الآن</span>
          {/* أيقونة الرسالة */}
          <MessageCircle size={24} />
        </Link>
        
        <Link href="/" className="block mt-6 text-sm text-emerald-400 hover:text-gold underline">
          العودة للصفحة الرئيسية
        </Link>
      </div>
    </div>
  );
}