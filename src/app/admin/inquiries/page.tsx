import { Metadata } from 'next';
import { prisma } from '@/lib/db/prisma';
import { InquiryTableClient } from './InquiryTableClient';

export const metadata: Metadata = {
  title: 'مدیریت درخواست‌های استعلام | اکسیرساز شمال',
};

export default async function AdminInquiriesPage() {
  const inquiries = await prisma.inquiryRequest.findMany({
    orderBy: { createdAt: 'desc' },
    include: {
      product: { select: { name: true } },
      agency: { select: { name: true, city: true, province: true } },
    }
  });

  const formattedInquiries = inquiries.map(inq => ({
    id: inq.id,
    customerName: inq.customerName,
    customerPhone: inq.customerPhone,
    description: inq.description || '',
    productName: inq.productName,
    agencyName: inq.agency ? `${inq.agency.name} (${inq.agency.province} - ${inq.agency.city})` : 'فروش مستقیم',
    status: inq.status,
    createdAt: inq.createdAt.toISOString()
  }));

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-slate-900">درخواست‌های استعلام</h1>
        <p className="text-slate-500 mt-2">مدیریت و پیگیری فرم‌های ثبت شده توسط مشتریان</p>
      </div>
      
      <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
        <InquiryTableClient initialData={formattedInquiries} />
      </div>
    </div>
  );
}
