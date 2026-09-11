import { fetchGeoRulesData } from './actions';
import { GeoRulesClient } from './GeoRulesClient';

export const metadata = {
  title: 'قوانین فروش منطقه‌ای | پنل ادمین',
};

export default async function GeoRulesPage() {
  const { settings, categories } = await fetchGeoRulesData();

  return (
    <div className="flex flex-col gap-6 max-w-4xl mx-auto">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 tracking-tight">قوانین فروش منطقه‌ای (نمایندگی‌ها)</h1>
          <p className="text-slate-500 text-sm mt-1">مدیریت رفتار فروشگاه در قبال نمایندگان، فعال/غیرفعال‌سازی سیستم و کنترل دسته‌بندی‌ها</p>
        </div>
      </div>
      
      <GeoRulesClient initialSettings={settings} initialCategories={categories} />
    </div>
  );
}
