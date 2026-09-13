import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[80vh] bg-paper px-4 font-sans selection:bg-mist">
      <div className="bg-snow border border-cloud rounded-cards p-[48px] md:p-[80px] flex flex-col items-center text-center max-w-[800px] w-full">
        {/* Accent Badge */}
        <span className="inline-flex items-center px-3 py-1 rounded-badges bg-ember text-snow text-[13px] font-medium mb-8 leading-none">
          خطای ۴۰۴
        </span>
        
        {/* Giant Number */}
        <h1 className="text-[80px] md:text-[140px] font-semibold text-obsidian leading-none mb-6">
          ۴۰۴
        </h1>
        
        {/* Title */}
        <h2 className="text-[24px] md:text-[32px] font-semibold text-obsidian mb-4">
          مسیر رو اشتباه اومدید!
        </h2>
        
        {/* Description */}
        <p className="text-[15px] md:text-[18px] text-steel mb-[48px] leading-[1.6] max-w-md font-normal">
          صفحه‌ای که به دنبال آن هستید حذف شده، نام آن تغییر کرده و یا از ابتدا وجود نداشته است.
        </p>
        
        {/* Action */}
        <Link href="/">
          <Button className="h-[52px] rounded-buttons px-8 bg-obsidian text-snow font-normal text-[15px] shadow-subtle hover:bg-black transition-colors flex items-center gap-3">
            <span>بازگشت به صفحه اصلی</span>
            <ArrowLeft className="w-5 h-5" />
          </Button>
        </Link>
      </div>
    </div>
  );
}
