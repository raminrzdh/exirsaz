import Link from 'next/link';
import { 
  LayoutDashboard, 
  ShoppingBag, 
  Users, 
  Settings,
  FileText,
  LogOut,
  ChevronRight,
  Package,
  Tags,
  Store,
  BarChart3,
  ShieldAlert,
  Bell,
  ListTree,
  SlidersHorizontal,
  LineChart
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { logoutAction } from './login/actions';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex h-screen bg-slate-50 overflow-hidden">
      
      {/* Sidebar */}
      <aside className="w-64 bg-slate-900 text-white shrink-0 hidden md:flex flex-col">
        <div className="h-16 flex items-center px-6 border-b border-white/10">
          <Link href="/admin" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-indigo-500 rounded-lg flex items-center justify-center font-bold text-xl">
              E
            </div>
            <span className="font-bold text-lg tracking-tight">پنل مدیریت</span>
          </Link>
        </div>
        
        <nav className="flex-1 overflow-y-auto py-6 px-4 space-y-1">
          <Accordion className="w-full space-y-1" defaultValue={['catalog', 'sales']}>
            
            {/* Category 1: Dashboard */}
            <div className="space-y-1 pb-2">
              <Link href="/admin" className="flex items-center gap-3 px-4 py-3 rounded-lg bg-primary text-primary-foreground font-medium">
                <LayoutDashboard className="w-5 h-5" />
                داشبورد
              </Link>
            </div>

            {/* Category 2: Catalog */}
            <AccordionItem value="catalog" className="border-none">
              <AccordionTrigger className="px-4 py-3 rounded-lg text-slate-300 hover:bg-white/5 hover:text-white hover:no-underline font-medium text-sm">
                <div className="flex items-center gap-3">
                  <Package className="w-5 h-5" />
                  مدیریت کاتالوگ
                </div>
              </AccordionTrigger>
              <AccordionContent className="pt-1 pb-1">
                <div className="space-y-1 ps-8">
                  <Link href="/admin/products" className="flex items-center gap-3 px-4 py-2.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/5 transition-colors">
                    همه محصولات
                  </Link>
                  <Link href="/admin/products/categories" className="flex items-center gap-3 px-4 py-2.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/5 transition-colors">
                    دسته‌بندی‌ها
                  </Link>
                  <Link href="/admin/products/features" className="flex items-center gap-3 px-4 py-2.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/5 transition-colors">
                    ویژگی‌ها و متغیرها
                  </Link>
                </div>
              </AccordionContent>
            </AccordionItem>

            {/* Category 3: Sales */}
            <AccordionItem value="sales" className="border-none">
              <AccordionTrigger className="px-4 py-3 rounded-lg text-slate-300 hover:bg-white/5 hover:text-white hover:no-underline font-medium text-sm">
                <div className="flex items-center gap-3">
                  <ShoppingBag className="w-5 h-5" />
                  فروش و نمایندگان
                </div>
              </AccordionTrigger>
              <AccordionContent className="pt-1 pb-1">
                <div className="space-y-1 ps-8">
                  <Link href="/admin/orders" className="flex items-center gap-3 px-4 py-2.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/5 transition-colors">
                    مدیریت سفارشات
                  </Link>
                  <Link href="/admin/agencies" className="flex items-center gap-3 px-4 py-2.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/5 transition-colors">
                    نمایندگی‌ها
                  </Link>
                  <Link href="/admin/settings/geo-rules" className="flex items-center gap-3 px-4 py-2.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/5 transition-colors">
                    قوانین فروش منطقه‌ای
                  </Link>
                  <Link href="/admin/inquiries" className="flex items-center gap-3 px-4 py-2.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/5 transition-colors">
                    درخواست‌های استعلام
                  </Link>
                </div>
              </AccordionContent>
            </AccordionItem>

            {/* Category 4: Content */}
            <AccordionItem value="content" className="border-none">
              <AccordionTrigger className="px-4 py-3 rounded-lg text-slate-300 hover:bg-white/5 hover:text-white hover:no-underline font-medium text-sm">
                <div className="flex items-center gap-3">
                  <FileText className="w-5 h-5" />
                  محتوا و رسانه
                </div>
              </AccordionTrigger>
              <AccordionContent className="pt-1 pb-1">
                <div className="space-y-1 ps-8">
                  <Link href="/admin/posts" className="flex items-center gap-3 px-4 py-2.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/5 transition-colors">
                    مقالات و سئو
                  </Link>
                  <Link href="/admin/posts/categories" className="flex items-center gap-3 px-4 py-2.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/5 transition-colors">
                    دسته‌بندی مقالات
                  </Link>
                  <Link href="/admin/media" className="flex items-center gap-3 px-4 py-2.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/5 transition-colors">
                    مدیریت رسانه‌ها
                  </Link>
                </div>
              </AccordionContent>
            </AccordionItem>

            {/* Category 5: Settings */}
            <AccordionItem value="settings" className="border-none">
              <AccordionTrigger className="px-4 py-3 rounded-lg text-slate-300 hover:bg-white/5 hover:text-white hover:no-underline font-medium text-sm">
                <div className="flex items-center gap-3">
                  <Settings className="w-5 h-5" />
                  پیکربندی سیستم
                </div>
              </AccordionTrigger>
              <AccordionContent className="pt-1 pb-1">
                <div className="space-y-1 ps-8">
                  <Link href="/admin/users" className="flex items-center gap-3 px-4 py-2.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/5 transition-colors">
                    کاربران سیستم
                  </Link>
                  <Link href="/admin/settings" className="flex items-center gap-3 px-4 py-2.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/5 transition-colors">
                    تنظیمات عمومی
                  </Link>
                </div>
              </AccordionContent>
            </AccordionItem>

            {/* Standalone: Analytics/Reports */}
            <div className="pt-2">
              <Link href="/admin/reports" className="flex items-center gap-3 px-4 py-3 rounded-lg text-slate-300 hover:bg-white/5 hover:text-white transition-colors text-sm font-medium">
                <LineChart className="w-5 h-5 text-emerald-400" />
                گزارشات فروش
              </Link>
              <Link href="/admin/analytics" className="flex items-center gap-3 px-4 py-3 rounded-lg text-slate-300 hover:bg-white/5 hover:text-white transition-colors text-sm font-medium">
                <BarChart3 className="w-5 h-5 text-blue-400" />
                آمار ارجاعات
              </Link>
            </div>
          </Accordion>
        </nav>
        
        <div className="p-4 border-t border-white/10">
          <form action={logoutAction}>
            <button type="submit" className="flex items-center gap-3 px-4 py-3 rounded-lg w-full text-slate-300 hover:bg-red-500/10 hover:text-red-400 transition-colors">
              <LogOut className="w-5 h-5" />
              خروج
            </button>
          </form>
        </div>
      </aside>

      {/* Main Content area */}
      <div className="flex-1 flex flex-col h-screen overflow-hidden">
        
        {/* Top Header */}
        <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-8 shrink-0">
          <h1 className="text-xl font-bold text-slate-800">داشبورد مدیریت</h1>
          <div className="flex items-center gap-4">
            <button className="relative p-2 text-slate-400 hover:text-slate-600 transition-colors">
              <Bell className="w-6 h-6" />
              <span className="absolute top-1 end-1 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-white"></span>
            </button>
            <div className="flex items-center gap-3 ps-4 border-s border-slate-200">
              <div className="text-end hidden sm:block">
                <div className="text-sm font-bold text-slate-900">مدیر سیستم</div>
                <div className="text-xs text-slate-500">ادمین</div>
              </div>
              <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 font-bold">
                M
              </div>
            </div>
          </div>
        </header>
        
        {/* Page Content */}
        <main className="flex-1 overflow-y-auto p-8 bg-slate-50">
          {children}
        </main>
      </div>
    </div>
  );
}
