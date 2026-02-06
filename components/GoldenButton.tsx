import React from 'react';

interface ButtonProps {
  text: string;
  onClick?: () => void;
  className?: string;
  disabled?: boolean;
  type?: "button" | "submit" | "reset";
}

const GoldenButton: React.FC<ButtonProps> = ({ text, onClick, className = "", disabled = false, type = "button" }) => {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`
        relative group
        /* 1. الحجم والشكل */
        min-w-[280px] md:min-w-[320px]  /* عرض أكبر يشبه الصورة */
        py-4 md:py-5                   /* ارتفاع أكبر (Chunky) */
        rounded-full                   /* حواف دائرية كاملة */
        
        /* 2. التدرج اللوني المعدني (السر هنا) */
        /* تدرج من الأعلى للأسفل: فاتح -> غامق -> فاتح (لمحاكاة الاسطوانة الذهبية) */
        bg-[linear-gradient(180deg,#FCD34D_0%,#B45309_50%,#FCD34D_100%)]
        hover:bg-[linear-gradient(180deg,#FFE175_0%,#D97706_50%,#FFE175_100%)] /* تفتيح عند الماوس */
        
        /* 3. الخط والنص */
        text-black 
        font-black       /* أسمك درجة خط متاحة */
        text-2xl md:text-3xl /* حجم خط كبير وواضح */
        tracking-wide    /* تباعد بسيط بين الحروف */
        
        /* 4. الظلال والحدود */
        shadow-[0_4px_10px_rgba(0,0,0,0.3)] /* ظل ناعم للعمق */
        border-t border-yellow-200/50       /* لمعة خفيفة جداً في الحافة العلوية */
        
        /* 5. الحركة */
        transform hover:scale-105 active:scale-95
        transition-all duration-300 ease-out
        
        /* 6. حالات التعطيل */
        disabled:opacity-70 disabled:grayscale disabled:cursor-not-allowed
        
        ${className}
      `}
    >
      {/* طبقة إضافية للمعان (اختيارية) */}
      <span className="absolute inset-0 rounded-full bg-gradient-to-b from-white/20 to-transparent opacity-50 pointer-events-none"></span>
      
      <span className="relative z-10 drop-shadow-sm">{text}</span>
    </button>
  );
};

export default GoldenButton;