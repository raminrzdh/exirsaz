'use client';

import { useState, useMemo } from 'react';
import { PhoneCall, MessageCircle, BarChart2, CalendarDays } from 'lucide-react';

interface AnalyticsEvent {
  id: string;
  agencyId: string;
  agencyName: string;
  type: 'CALL' | 'WHATSAPP';
  createdAt: string;
}

interface AnalyticsClientProps {
  initialEvents: AnalyticsEvent[];
}

export function AnalyticsClient({ initialEvents }: AnalyticsClientProps) {
  const [filter, setFilter] = useState<'ALL' | 'TODAY' | 'WEEK' | 'MONTH'>('ALL');

  const filteredEvents = useMemo(() => {
    const now = new Date();
    return initialEvents.filter(e => {
      const date = new Date(e.createdAt);
      if (filter === 'ALL') return true;
      if (filter === 'TODAY') return date.toDateString() === now.toDateString();
      if (filter === 'WEEK') {
        const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        return date >= weekAgo;
      }
      if (filter === 'MONTH') {
        const monthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
        return date >= monthAgo;
      }
      return true;
    });
  }, [initialEvents, filter]);

  const totalCalls = filteredEvents.filter(e => e.type === 'CALL').length;
  const totalWhatsApp = filteredEvents.filter(e => e.type === 'WHATSAPP').length;
  const totalLeads = filteredEvents.length;

  const agencyStats = useMemo(() => {
    const stats: Record<string, { name: string, calls: number, whatsapp: number, total: number }> = {};
    filteredEvents.forEach(e => {
      if (!stats[e.agencyId]) {
        stats[e.agencyId] = { name: e.agencyName, calls: 0, whatsapp: 0, total: 0 };
      }
      if (e.type === 'CALL') stats[e.agencyId].calls++;
      if (e.type === 'WHATSAPP') stats[e.agencyId].whatsapp++;
      stats[e.agencyId].total++;
    });
    return Object.values(stats).sort((a, b) => b.total - a.total);
  }, [filteredEvents]);

  return (
    <div className="space-y-6">
      
      <div className="flex justify-end">
        <div className="inline-flex bg-white rounded-xl shadow-sm border border-slate-200 p-1">
          <button onClick={() => setFilter('TODAY')} className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${filter === 'TODAY' ? 'bg-indigo-50 text-indigo-700' : 'text-slate-600 hover:bg-slate-50'}`}>امروز</button>
          <button onClick={() => setFilter('WEEK')} className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${filter === 'WEEK' ? 'bg-indigo-50 text-indigo-700' : 'text-slate-600 hover:bg-slate-50'}`}>این هفته</button>
          <button onClick={() => setFilter('MONTH')} className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${filter === 'MONTH' ? 'bg-indigo-50 text-indigo-700' : 'text-slate-600 hover:bg-slate-50'}`}>این ماه</button>
          <button onClick={() => setFilter('ALL')} className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${filter === 'ALL' ? 'bg-indigo-50 text-indigo-700' : 'text-slate-600 hover:bg-slate-50'}`}>همه زمان‌ها</button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center shrink-0">
            <BarChart2 className="w-7 h-7" />
          </div>
          <div>
            <div className="text-sm font-medium text-slate-500 mb-1">کل ارجاعات (Lead)</div>
            <div className="text-3xl font-black text-slate-800">{totalLeads}</div>
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
            <MessageCircle className="w-7 h-7" />
          </div>
          <div>
            <div className="text-sm font-medium text-slate-500 mb-1">کلیک واتس‌اپ</div>
            <div className="text-3xl font-black text-slate-800">{totalWhatsApp}</div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
            <PhoneCall className="w-7 h-7" />
          </div>
          <div>
            <div className="text-sm font-medium text-slate-500 mb-1">کلیک تماس تلفنی</div>
            <div className="text-3xl font-black text-slate-800">{totalCalls}</div>
          </div>
        </div>
      </div>

      <div className="bg-white border border-slate-200 rounded-3xl shadow-sm overflow-hidden">
        <div className="p-6 border-b border-slate-100 bg-slate-50">
          <h3 className="font-bold text-slate-800">رتبه‌بندی نمایندگی‌ها بر اساس دریافت Lead</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-right">
            <thead className="bg-slate-50 text-slate-500 font-medium border-b border-slate-200">
              <tr>
                <th className="px-6 py-4">رتبه</th>
                <th className="px-6 py-4">نام نمایندگی</th>
                <th className="px-6 py-4">واتس‌اپ</th>
                <th className="px-6 py-4">تماس تلفنی</th>
                <th className="px-6 py-4">کل ارجاعات</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {agencyStats.map((stat, idx) => (
                <tr key={stat.name} className="hover:bg-slate-50/50">
                  <td className="px-6 py-4 font-bold text-slate-400">#{idx + 1}</td>
                  <td className="px-6 py-4 font-bold text-slate-800">{stat.name}</td>
                  <td className="px-6 py-4 text-slate-600">{stat.whatsapp}</td>
                  <td className="px-6 py-4 text-slate-600">{stat.calls}</td>
                  <td className="px-6 py-4 font-bold text-indigo-600">{stat.total}</td>
                </tr>
              ))}
              {agencyStats.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-slate-500">
                    در این بازه زمانی هیچ ارجاعی ثبت نشده است.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
