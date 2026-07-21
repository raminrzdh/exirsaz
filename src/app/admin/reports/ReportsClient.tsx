'use client';

import { useState, useEffect } from 'react';
import { getSalesReport } from './actions';
import { LineChart, DollarSign, ShoppingCart, TrendingUp, Calendar, CheckCircle, Clock, XCircle } from 'lucide-react';

const formatCurrency = (num: number) => {
  return new Intl.NumberFormat('fa-IR').format(num) + ' تومان';
};

const formatDate = (dateString: Date) => {
  return new Intl.DateTimeFormat('fa-IR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  }).format(new Date(dateString));
};

const getStatusBadge = (status: string) => {
  switch (status) {
    case 'PENDING':
      return <span className="px-2 py-1 bg-amber-100 text-amber-700 text-xs rounded-full font-medium">در انتظار</span>;
    case 'PROCESSING':
      return <span className="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded-full font-medium">در حال پردازش</span>;
    case 'SHIPPED':
      return <span className="px-2 py-1 bg-purple-100 text-purple-700 text-xs rounded-full font-medium">ارسال شده</span>;
    case 'DELIVERED':
      return <span className="px-2 py-1 bg-emerald-100 text-emerald-700 text-xs rounded-full font-medium">تحویل شده</span>;
    case 'CANCELLED':
      return <span className="px-2 py-1 bg-rose-100 text-rose-700 text-xs rounded-full font-medium">لغو شده</span>;
    default:
      return <span className="px-2 py-1 bg-slate-100 text-slate-700 text-xs rounded-full font-medium">{status}</span>;
  }
};

const getPaymentBadge = (status: string) => {
  switch (status) {
    case 'PAID':
      return <span className="flex items-center gap-1 text-emerald-600 font-medium text-xs"><CheckCircle className="w-3.5 h-3.5"/> موفق</span>;
    case 'UNPAID':
      return <span className="flex items-center gap-1 text-amber-600 font-medium text-xs"><Clock className="w-3.5 h-3.5"/> پرداخت نشده</span>;
    case 'REFUNDED':
      return <span className="flex items-center gap-1 text-rose-600 font-medium text-xs"><XCircle className="w-3.5 h-3.5"/> مسترد شده</span>;
    default:
      return <span>{status}</span>;
  }
};

export function ReportsClient({ initialData }: { initialData: any }) {
  const [filter, setFilter] = useState<'today' | 'week' | 'month' | 'year' | 'all'>('month');
  const [data, setData] = useState(initialData);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    let isMounted = true;
    const fetchData = async () => {
      setIsLoading(true);
      const result = await getSalesReport(filter);
      if (isMounted) {
        setData(result);
        setIsLoading(false);
      }
    };
    // skip first mount since we have initialData
    if (filter !== 'month') {
      fetchData();
    } else {
       // if they switch back to month
       fetchData();
    }
    return () => { isMounted = false; };
  }, [filter]);

  return (
    <div className="space-y-6 animate-fade-in">
      
      {/* Filters */}
      <div className="bg-white p-2 rounded-xl border border-slate-200 inline-flex shadow-sm">
        <button 
          onClick={() => setFilter('today')} 
          className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${filter === 'today' ? 'bg-indigo-50 text-indigo-700' : 'text-slate-600 hover:bg-slate-50'}`}
        >
          امروز
        </button>
        <button 
          onClick={() => setFilter('week')} 
          className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${filter === 'week' ? 'bg-indigo-50 text-indigo-700' : 'text-slate-600 hover:bg-slate-50'}`}
        >
          ۷ روز گذشته
        </button>
        <button 
          onClick={() => setFilter('month')} 
          className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${filter === 'month' ? 'bg-indigo-50 text-indigo-700' : 'text-slate-600 hover:bg-slate-50'}`}
        >
          ۳۰ روز گذشته
        </button>
        <button 
          onClick={() => setFilter('year')} 
          className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${filter === 'year' ? 'bg-indigo-50 text-indigo-700' : 'text-slate-600 hover:bg-slate-50'}`}
        >
          امسال
        </button>
        <button 
          onClick={() => setFilter('all')} 
          className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${filter === 'all' ? 'bg-indigo-50 text-indigo-700' : 'text-slate-600 hover:bg-slate-50'}`}
        >
          کل زمان‌ها
        </button>
      </div>

      {/* KPI Cards */}
      <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 transition-opacity duration-300 ${isLoading ? 'opacity-50' : 'opacity-100'}`}>
        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm relative overflow-hidden">
          <div className="absolute -left-6 -bottom-6 w-24 h-24 bg-emerald-50 rounded-full opacity-50"></div>
          <div className="flex justify-between items-start mb-4 relative">
            <div>
              <p className="text-slate-500 text-sm font-semibold mb-1">درآمد کل (موفق)</p>
              <h3 className="text-2xl font-bold text-slate-800">{formatCurrency(data.totalRevenue)}</h3>
            </div>
            <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-600 flex items-center justify-center">
              <DollarSign className="w-5 h-5" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm relative overflow-hidden">
          <div className="absolute -left-6 -bottom-6 w-24 h-24 bg-indigo-50 rounded-full opacity-50"></div>
          <div className="flex justify-between items-start mb-4 relative">
            <div>
              <p className="text-slate-500 text-sm font-semibold mb-1">کل سفارشات</p>
              <h3 className="text-2xl font-bold text-slate-800">{data.totalOrders} <span className="text-sm font-normal text-slate-500">سفارش</span></h3>
            </div>
            <div className="w-10 h-10 rounded-xl bg-indigo-100 text-indigo-600 flex items-center justify-center">
              <ShoppingCart className="w-5 h-5" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm relative overflow-hidden">
          <div className="absolute -left-6 -bottom-6 w-24 h-24 bg-blue-50 rounded-full opacity-50"></div>
          <div className="flex justify-between items-start mb-4 relative">
            <div>
              <p className="text-slate-500 text-sm font-semibold mb-1">سفارشات موفق</p>
              <h3 className="text-2xl font-bold text-slate-800">{data.successfulOrders} <span className="text-sm font-normal text-slate-500">پرداخت شده</span></h3>
            </div>
            <div className="w-10 h-10 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center">
              <CheckCircle className="w-5 h-5" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm relative overflow-hidden">
          <div className="absolute -left-6 -bottom-6 w-24 h-24 bg-amber-50 rounded-full opacity-50"></div>
          <div className="flex justify-between items-start mb-4 relative">
            <div>
              <p className="text-slate-500 text-sm font-semibold mb-1">میانگین ارزش سفارش</p>
              <h3 className="text-2xl font-bold text-slate-800">{formatCurrency(data.averageOrderValue)}</h3>
            </div>
            <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-600 flex items-center justify-center">
              <TrendingUp className="w-5 h-5" />
            </div>
          </div>
        </div>
      </div>

      {/* Recent Orders List */}
      <div className={`bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden transition-opacity duration-300 ${isLoading ? 'opacity-50' : 'opacity-100'}`}>
        <div className="p-6 border-b border-slate-100 flex justify-between items-center">
          <h2 className="text-lg font-bold text-slate-800">آخرین سفارشات این بازه</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-right">
            <thead className="bg-slate-50 text-slate-600 font-semibold border-b border-slate-200">
              <tr>
                <th className="p-4">شماره سفارش</th>
                <th className="p-4">مشتری</th>
                <th className="p-4">تاریخ</th>
                <th className="p-4">مبلغ (تومان)</th>
                <th className="p-4">وضعیت پرداخت</th>
                <th className="p-4">وضعیت سفارش</th>
              </tr>
            </thead>
            <tbody>
              {data.recentOrders.map((order: any) => (
                <tr key={order.id} className="border-b border-slate-100 hover:bg-slate-50/50">
                  <td className="p-4 font-mono font-medium text-slate-700">{order.orderNumber}</td>
                  <td className="p-4">
                    {order.user ? `${order.user.firstName || ''} ${order.user.lastName || ''}` : (order.guestPhone || 'مهمان')}
                  </td>
                  <td className="p-4 text-slate-500 font-mono text-xs">{formatDate(order.createdAt)}</td>
                  <td className="p-4 font-mono font-medium text-slate-800">{formatCurrency(order.totalAmount).replace(' تومان', '')}</td>
                  <td className="p-4">{getPaymentBadge(order.paymentStatus)}</td>
                  <td className="p-4">{getStatusBadge(order.status)}</td>
                </tr>
              ))}
              {data.recentOrders.length === 0 && (
                <tr>
                  <td colSpan={6} className="p-8 text-center text-slate-500">هیچ سفارشی در این بازه زمانی یافت نشد.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
      
    </div>
  );
}
