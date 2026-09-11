import Link from 'next/link';
import { Settings, Map, Shield } from 'lucide-react';

export default function SettingsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col md:flex-row gap-6 p-6 max-w-7xl mx-auto h-[calc(100vh-4rem)]">
      {/* Settings Sidebar */}
      <aside className="w-full md:w-64 shrink-0 space-y-2">
        <h2 className="text-lg font-bold mb-4 px-2">پیکربندی سیستم</h2>
        
        <Link 
          href="/admin/settings" 
          className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors hover:bg-slate-100 text-slate-700 hover:text-slate-900"
        >
          <Settings className="w-4 h-4" />
          تنظیمات عمومی
        </Link>
        
        <Link 
          href="/admin/settings/roles" 
          className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors hover:bg-slate-100 text-slate-700 hover:text-slate-900"
        >
          <Shield className="w-4 h-4" />
          نقش‌ها و دسترسی‌ها
        </Link>
        
        <Link 
          href="/admin/settings/geo-rules" 
          className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors hover:bg-slate-100 text-slate-700 hover:text-slate-900"
        >
          <Map className="w-4 h-4" />
          قوانین جغرافیایی (Geo)
        </Link>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 min-w-0 bg-white rounded-xl border border-slate-200 shadow-sm overflow-y-auto">
        {children}
      </main>
    </div>
  );
}
