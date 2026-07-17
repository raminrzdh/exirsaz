import { ProductFormClient } from '../../ProductFormClient';
import { prisma } from '@/lib/db/prisma';

export const metadata = {
  title: 'ویرایش محصول | پنل ادمین',
};

export default async function EditProductPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params;
  const dbAgencies = await prisma.agency.findMany({ select: { id: true, name: true } });
  const agencies = dbAgencies.map(a => ({ id: a.id, name: a.name }));
  const categories = await prisma.category.findMany({ select: { id: true, name: true } });
  
  const product = await prisma.product.findUnique({
    where: { id: resolvedParams.id },
    include: { 
      agencies: true,
      variants: {
        include: {
          attributes: {
            include: {
              attributeValue: {
                include: { attribute: true }
              }
            }
          }
        }
      }
    }
  });

  return <ProductFormClient agencies={agencies} categories={categories} isEdit={true} initialData={product} />;
}
