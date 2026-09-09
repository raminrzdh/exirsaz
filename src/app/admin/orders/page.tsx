import Link from 'next/link';
import { Search, Eye, Filter, Download } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { prisma } from '@/lib/db/prisma';
import { formatToman, toPersianDigits } from '@/lib/utils/currency';
import { formatJalaliDate } from '@/lib/utils/date';

const MOCK_ORDERS = [
  { id: '1001', user: { firstName: 'علی', lastName: 'احمدی' }, totalAmount: 72500000, status: 'PROCESSING', createdAt: new Date(Date.now() - 1000 * 60 * 60 * 2) },
  { id: '1002', user: { firstName: 'مریم', lastName: 'حسینی' }, totalAmount: 450000, status: 'COMPLETED', createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24) },
  { id: '1003', user: { firstName: 'رضا', lastName: 'محمدی' }, totalAmount: 115000000, status: 'PENDING', createdAt: new Date(Date.now() - 1000 * 60 * 30) },
  { id: '1004', user: { firstName: 'سارا', lastName: 'کریمی' }, totalAmount: 21500000, status: 'CANCELLED', createdAt: new Date(Date.now() - 1000 * 60 * 60 * 48) },
];

async function getOrders() {
  try {
    return await prisma.order.findMany({
      include: { user: true },
      orderBy: { createdAt: 'desc' }
    });
  } catch (error) {
    return MOCK_ORDERS;
  }
}

const STATUS_MAP: Record<string, { label: string, color: string }> = {
  PENDING: { label: 'در انتظار پرداخت', color: 'bg-amber-100 text-amber-700' },
  PROCESSING: { label: 'در حال پردازش', color: 'bg-blue-100 text-blue-700' },
  COMPLETED: { label: 'تکمیل شده', color: 'bg-green-100 text-green-700' },
  CANCELLED: { label: 'لغو شده', color: 'bg-red-100 text-red-700' },
  REFUNDED: { label: 'مسترد شده', color: 'bg-slate-100 text-slate-700' },
};

export default async function AdminOrdersPage() {
  const orders = await getOrders();

  return (
    <div className="space-y-6 animate-stagger-item">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">سفارشات</h1>
          <p className="text-sm text-slate-500 mt-1">پیگیری و مدیریت سفارشات مشتریان.</p>
        </div>
        <Button variant="outline" className="gap-2 shrink-0 bg-white">
          <Download className="w-4 h-4" />
          خروجی اکسل
        </Button>
      </div>

      {/* Toolbar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex flex-col sm:flex-row gap-4 items-center justify-between">
        <div className="relative w-full sm:w-96">
          <input 
            type="text" 
            placeholder="جستجو بر اساس شماره سفارش یا نام مشتری..." 
            className="w-full h-10 ps-10 pe-4 rounded-lg bg-slate-50 border border-slate-200 text-sm focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none transition-colors"
          />
          <Search className="w-4 h-4 text-slate-400 absolute top-3 start-3" />
        </div>
        
        <div className="flex items-center gap-3 w-full sm:w-auto">
          <Button variant="outline" className="gap-2 text-slate-600 bg-slate-50 w-full sm:w-auto h-10">
            <Filter className="w-4 h-4" />
            فیلتر پیشرفته
          </Button>
          <select className="h-10 px-4 rounded-lg bg-slate-50 border border-slate-200 text-sm focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none flex-grow sm:flex-grow-0">
            <option value="">وضعیت سفارش</option>
            <option value="PENDING">در انتظار پرداخت</option>
            <option value="PROCESSING">در حال پردازش</option>
            <option value="COMPLETED">تکمیل شده</option>
          </select>
        </div>
      </div>

      {/* Orders Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-slate-600">
            <thead className="bg-slate-50 text-slate-700 border-b border-slate-200 text-start">
              <tr>
                <th className="px-6 py-4 font-semibold text-start">شماره سفارش</th>
                <th className="px-6 py-4 font-semibold text-start">مشتری</th>
                <th className="px-6 py-4 font-semibold text-start">تاریخ ثبت</th>
                <th className="px-6 py-4 font-semibold text-start">مبلغ کل</th>
                <th className="px-6 py-4 font-semibold text-start">وضعیت</th>
                <th className="px-6 py-4 font-semibold text-end">عملیات</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {orders.map((order) => {
                const statusInfo = STATUS_MAP[order.status] || STATUS_MAP.PENDING;
                
                return (
                  <tr key={order.id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="px-6 py-4 font-mono font-bold text-slate-900">
                      #{toPersianDigits(order.id)}
                    </td>
                    <td className="px-6 py-4 font-medium text-slate-900">
                      {order.user?.firstName} {order.user?.lastName}
                    </td>
                    <td className="px-6 py-4 text-slate-500">
                      {formatJalaliDate(order.createdAt, 'yyyy/MM/dd HH:mm')}
                    </td>
                    <td className="px-6 py-4 font-bold text-slate-900">
                      {formatToman(order.totalAmount)}
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-bold ${statusInfo.color}`}>
                        {statusInfo.label}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-end">
                        <Link href={`/admin/orders/${order.id}`}>
                          <Button variant="ghost" size="sm" className="gap-2 text-indigo-600 hover:text-indigo-700 hover:bg-indigo-50">
                            <Eye className="w-4 h-4" />
                            جزئیات
                          </Button>
                        </Link>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
