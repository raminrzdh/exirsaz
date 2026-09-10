'use client';

import { useState } from 'react';
import { updateInquiryStatus } from './actions';
import toast from 'react-hot-toast';

interface InquiryData {
  id: string;
  customerName: string;
  customerPhone: string;
  description: string;
  productName: string;
  agencyName: string;
  status: string;
  createdAt: string;
}

export function InquiryTableClient({ initialData }: { initialData: InquiryData[] }) {
  const [data, setData] = useState<InquiryData[]>(initialData);

  const handleStatusChange = async (id: string, newStatus: string) => {
    const res = await updateInquiryStatus(id, newStatus);
    if (res.success) {
      setData(prev => prev.map(item => item.id === id ? { ...item, status: newStatus } : item));
      toast.success('وضعیت با موفقیت تغییر کرد');
    } else {
      toast.error('خطا در تغییر وضعیت');
    }
  };

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm text-right">
        <thead className="bg-slate-50 text-slate-600 border-b border-slate-200">
          <tr>
            <th className="px-6 py-4 font-medium">تاریخ ثبت</th>
            <th className="px-6 py-4 font-medium">نام مشتری</th>
            <th className="px-6 py-4 font-medium">شماره موبایل</th>
            <th className="px-6 py-4 font-medium">محصول</th>
            <th className="px-6 py-4 font-medium">نمایندگی</th>
            <th className="px-6 py-4 font-medium">توضیحات</th>
            <th className="px-6 py-4 font-medium">وضعیت</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100">
          {data.length === 0 ? (
            <tr>
              <td colSpan={7} className="px-6 py-8 text-center text-slate-500">هیچ درخواستی ثبت نشده است</td>
            </tr>
          ) : (
            data.map(item => (
              <tr key={item.id} className="hover:bg-slate-50/50 transition-colors">
                <td className="px-6 py-4 text-slate-500 whitespace-nowrap" dir="ltr">
                  {new Date(item.createdAt).toLocaleDateString('fa-IR', {
                    year: 'numeric',
                    month: '2-digit',
                    day: '2-digit',
                    hour: '2-digit',
                    minute: '2-digit'
                  })}
                </td>
                <td className="px-6 py-4 font-medium text-slate-900">{item.customerName}</td>
                <td className="px-6 py-4 text-slate-700 font-mono" dir="ltr">{item.customerPhone}</td>
                <td className="px-6 py-4 text-indigo-600 font-medium">{item.productName}</td>
                <td className="px-6 py-4 text-slate-600">{item.agencyName}</td>
                <td className="px-6 py-4 text-slate-500 max-w-xs truncate" title={item.description}>{item.description || '-'}</td>
                <td className="px-6 py-4">
                  <select
                    value={item.status}
                    onChange={(e) => handleStatusChange(item.id, e.target.value)}
                    className={`text-xs font-medium rounded-full px-3 py-1 border outline-none cursor-pointer transition-colors ${
                      item.status === 'PENDING' ? 'bg-amber-50 text-amber-700 border-amber-200 hover:bg-amber-100' :
                      item.status === 'CONTACTED' ? 'bg-blue-50 text-blue-700 border-blue-200 hover:bg-blue-100' :
                      item.status === 'CLOSED' ? 'bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100' :
                      'bg-slate-50 text-slate-700 border-slate-200'
                    }`}
                  >
                    <option value="PENDING">در حال بررسی</option>
                    <option value="CONTACTED">تماس گرفته شد</option>
                    <option value="CLOSED">بسته شده</option>
                  </select>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
