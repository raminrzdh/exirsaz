import { getAgencies } from './actions';
import { AgencyTableClient } from './AgencyTableClient';
import { prisma } from '@/lib/db/prisma';

export const metadata = {
  title: 'مدیریت نمایندگی‌ها | پنل ادمین',
};

export default async function AgenciesPage() {
  const agencies = await getAgencies();
  const dbCategories = await prisma.category.findMany({ select: { name: true } });
  const allCategories = dbCategories.map(c => c.name);
  const dbProducts = await prisma.product.findMany({ select: { id: true, name: true } });
  const allProducts = dbProducts.map(p => ({ id: p.id, name: p.name }));
  const dbProvinces = await prisma.province.findMany({ include: { cities: true } });
  const allLocations: Record<string, string[]> = {};
  for (const prov of dbProvinces) {
    allLocations[prov.name] = prov.cities.map(c => c.name);
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 tracking-tight">مدیریت نمایندگی‌ها</h1>
          <p className="text-slate-500 text-sm mt-1">مدیریت لیست نمایندگی‌ها، شهرهای تحت پوشش و سیاست‌های ارجاعی</p>
        </div>
      </div>
      
      <AgencyTableClient initialAgencies={agencies} allCategories={allCategories} allProducts={allProducts} allLocations={allLocations} />
    </div>
  );
}
