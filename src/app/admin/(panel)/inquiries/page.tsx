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
      agency: { 
        select: { 
          name: true, 
          cities: {
            select: { name: true, province: { select: { name: true } } }
          }
        } 
      },
    }
  });

  const formattedInquiries = inquiries.map(inq => {
    let agencyInfo = 'فروش مستقیم';
    if (inq.agency) {
      const cityNames = inq.agency.cities.map(c => `${c.province.name} - ${c.name}`).join('، ');
      agencyInfo = `${inq.agency.name} ${cityNames ? `(${cityNames})` : ''}`;
    }

    return {
      id: inq.id,
      customerName: inq.customerName,
      customerPhone: inq.customerPhone,
      description: inq.description || '',
      productName: inq.productName,
      agencyName: agencyInfo,
      status: inq.status,
      createdAt: inq.createdAt.toISOString()
    };
  });

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
