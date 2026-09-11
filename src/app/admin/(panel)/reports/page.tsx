import { getSalesReport } from './actions';
import { ReportsClient } from './ReportsClient';

export const metadata = {
  title: 'گزارشات و فروش | پنل ادمین',
};

export default async function ReportsPage() {
  const initialData = await getSalesReport('month');

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">گزارشات و فروش</h1>
        <p className="text-sm text-slate-500 mt-1">نمای کلی از عملکرد فروشگاه و وضعیت سفارشات</p>
      </div>

      <ReportsClient initialData={initialData} />
    </div>
  );
}
