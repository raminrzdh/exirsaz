import { prisma } from '@/lib/db/prisma';
import CustomersClient from './CustomersClient';

export default async function CRMPage() {
  const customers = await prisma.user.findMany({
    where: {
      roleId: null
    },
    include: {
      orders: {
        select: {
          id: true,
          totalAmount: true,
          status: true
        }
      }
    },
    orderBy: { createdAt: 'desc' }
  });

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">مشتریان (CRM)</h1>
        <p className="text-slate-500 mt-1">مدیریت مشتریان فروشگاه، آمار خریدها و تاریخچه سفارشات</p>
      </div>

      <CustomersClient initialCustomers={customers} />
    </div>
  );
}
