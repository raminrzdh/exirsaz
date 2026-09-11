'use client';

import { useState, useMemo } from 'react';
import { updateInquiryStatus } from './actions';
import { toast } from 'sonner';
import { Search, Download } from 'lucide-react';

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
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');

  const filteredData = useMemo(() => {
    return data.filter(item => {
      const matchesSearch = 
        item.customerName.includes(searchQuery) || 
        item.customerPhone.includes(searchQuery) ||
        item.productName.includes(searchQuery) ||
        item.agencyName.includes(searchQuery);
      
      const matchesStatus = statusFilter === 'ALL' || item.status === statusFilter;
      
      return matchesSearch && matchesStatus;
    });
  }, [data, searchQuery, statusFilter]);

  const handleExportCSV = () => {
    if (filteredData.length === 0) {
      toast.error('داده‌ای برای خروجی گرفتن وجود ندارد');
      return;
    }
    
    // BOM for UTF-8 Excel support
    const BOM = '\uFEFF';
    const headers = ['تاریخ ثبت', 'ساعت ثبت', 'نام مشتری', 'شماره موبایل', 'محصول', 'نمایندگی', 'وضعیت', 'توضیحات'].join(',');
    
    const rows = filteredData.map(item => {
      const dateObj = new Date(item.createdAt);
      const dateStr = dateObj.toLocaleDateString('fa-IR');
      const timeStr = dateObj.toLocaleTimeString('fa-IR', { hour: '2-digit', minute: '2-digit' });
      
      const statusMap: Record<string, string> = {
        'PENDING': 'در حال بررسی',
        'CONTACTED': 'تماس گرفته شد',
        'CLOSED': 'بسته شده'
      };
      
      // Escape quotes and wrap in quotes for CSV
      const escapeCSV = (str: string) => `"${str.replace(/"/g, '""')}"`;
      
      return [
        escapeCSV(dateStr),
        escapeCSV(timeStr),
        escapeCSV(item.customerName),
        escapeCSV(item.customerPhone),
        escapeCSV(item.productName),
        escapeCSV(item.agencyName),
        escapeCSV(statusMap[item.status] || item.status),
        escapeCSV(item.description)
      ].join(',');
    });

    const csvContent = BOM + [headers, ...rows].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `inquiries_report_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

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
    <div className="flex flex-col">
      {/* Filters & Export Toolbar */}
      <div className="p-4 border-b border-slate-200 bg-white flex flex-col sm:flex-row items-center gap-4 justify-between">
        <div className="flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto">
          <div className="relative w-full sm:w-64">
            <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input 
              type="text" 
              placeholder="جستجو در نام، موبایل، محصول..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full h-10 pr-9 pl-4 rounded-xl border border-slate-200 focus:border-indigo-500 outline-none text-sm bg-slate-50 transition-colors"
            />
          </div>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="w-full sm:w-40 h-10 px-4 rounded-xl border border-slate-200 focus:border-indigo-500 outline-none text-sm bg-slate-50 transition-colors cursor-pointer"
          >
            <option value="ALL">همه وضعیت‌ها</option>
            <option value="PENDING">در حال بررسی</option>
            <option value="CONTACTED">تماس گرفته شد</option>
            <option value="CLOSED">بسته شده</option>
          </select>
        </div>
        
        <button 
          onClick={handleExportCSV}
          className="flex items-center justify-center gap-2 h-10 px-4 bg-emerald-50 text-emerald-600 hover:bg-emerald-100 border border-emerald-200 rounded-xl text-sm font-bold transition-colors w-full sm:w-auto shrink-0"
        >
          <Download className="w-4 h-4" />
          خروجی گزارش (CSV)
        </button>
      </div>

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
          {filteredData.length === 0 ? (
            <tr>
              <td colSpan={7} className="px-6 py-8 text-center text-slate-500">هیچ درخواستی با این مشخصات یافت نشد</td>
            </tr>
          ) : (
            filteredData.map(item => (
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
  </div>
  );
}
