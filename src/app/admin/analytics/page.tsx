import { prisma } from '@/lib/db/prisma';
import { AnalyticsClient } from './AnalyticsClient';

export const metadata = {
  title: 'آمار ارجاعات | پنل ادمین',
};

export default async function AnalyticsPage() {
  const events = await prisma.leadEvent.findMany({
    include: { agency: true },
    orderBy: { createdAt: 'desc' }
  });

  const data = events.map(e => ({
    id: e.id,
    agencyId: e.agencyId,
    type: e.type,
    createdAt: e.createdAt.toISOString(),
    agencyName: e.agency?.name || 'نمایندگی نامشخص',
  }));

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 tracking-tight">آمار ارجاعات (Lead Tracker)</h1>
          <p className="text-slate-500 text-sm mt-1">گزارش کلیک روی دکمه‌های تماس و واتس‌اپ نمایندگی‌ها</p>
        </div>
      </div>
      
      <AnalyticsClient initialEvents={data} />
    </div>
  );
}
