import { TrendingUp, Users, ShoppingBag, DollarSign } from 'lucide-react';
import { formatToman, toPersianDigits } from '@/lib/utils/currency';

const STATS = [
  { label: 'درآمد کل', value: formatToman(1245000000), change: '+12.5%', icon: DollarSign, color: 'text-green-600', bg: 'bg-green-100' },
  { label: 'سفارشات جدید', value: toPersianDigits('145'), change: '+5.2%', icon: ShoppingBag, color: 'text-indigo-600', bg: 'bg-indigo-100' },
  { label: 'کاربران فعال', value: toPersianDigits('2,845'), change: '+18.1%', icon: Users, color: 'text-blue-600', bg: 'bg-blue-100' },
  { label: 'نرخ تبدیل', value: toPersianDigits('3.2%'), change: '-1.4%', icon: TrendingUp, color: 'text-amber-600', bg: 'bg-amber-100' },
];

export default function AdminDashboard() {
  return (
    <div className="space-y-6 animate-stagger-item">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {STATS.map((stat, idx) => (
          <div key={idx} className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm flex items-center justify-between">
            <div>
              <div className="text-sm font-medium text-slate-500 mb-1">{stat.label}</div>
              <div className="text-2xl font-bold text-slate-900">{stat.value}</div>
              <div className={`text-xs mt-2 font-medium ${stat.change.startsWith('+') ? 'text-green-600' : 'text-red-500'}`}>
                {toPersianDigits(stat.change)} از ماه گذشته
              </div>
            </div>
            <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${stat.bg} ${stat.color}`}>
              <stat.icon className="w-6 h-6" />
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Chart Area Mock */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-200 shadow-sm p-6 min-h-[400px]">
          <h2 className="text-lg font-bold text-slate-900 mb-6">نمودار فروش (۳۰ روز اخیر)</h2>
          <div className="w-full h-[300px] flex items-center justify-center bg-slate-50 rounded-xl border border-dashed border-slate-200 text-slate-400">
            نمودار خطی فروش در اینجا قرار می‌گیرد (مثلاً با Recharts)
          </div>
        </div>

        {/* Recent Orders */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
          <h2 className="text-lg font-bold text-slate-900 mb-6">سفارشات اخیر</h2>
          <div className="space-y-4">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="flex items-center justify-between p-3 hover:bg-slate-50 rounded-lg transition-colors border border-transparent hover:border-slate-100">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-indigo-50 flex items-center justify-center text-indigo-600 font-bold text-xs">
                    #{toPersianDigits(String(1000 + i))}
                  </div>
                  <div>
                    <div className="text-sm font-bold text-slate-900">علی احمدی</div>
                    <div className="text-xs text-slate-500">{toPersianDigits('2')} دقیقه پیش</div>
                  </div>
                </div>
                <div className="text-sm font-bold text-slate-900">
                  {formatToman(4500000)}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
