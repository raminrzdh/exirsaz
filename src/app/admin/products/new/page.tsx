import { ProductFormClient } from '../ProductFormClient';
import { prisma } from '@/lib/db/prisma';

export const metadata = {
  title: 'افزودن محصول جدید | پنل ادمین',
};

export default async function NewProductPage() {
  const dbAgencies = await prisma.agency.findMany({ select: { id: true, name: true } });
  const agencies = dbAgencies.map(a => ({ id: a.id, name: a.name }));
  const categories = await prisma.category.findMany({ select: { id: true, name: true } });
  
  return <ProductFormClient agencies={agencies} categories={categories} />;
}
