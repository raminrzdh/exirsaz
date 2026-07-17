'use server';

import { revalidatePath } from 'next/cache';
import { prisma } from '@/lib/db/prisma';

export async function fetchGeoRulesData() {
  let settings = await prisma.storeSettings.findFirst();
  if (!settings) {
    settings = await prisma.storeSettings.create({ data: { agencyRoutingEnabled: true } });
  }
  const categories = await prisma.category.findMany();
  
  return { 
    settings: { agencyRoutingEnabled: settings.agencyRoutingEnabled }, 
    categories: categories.map(c => ({ name: c.name, isAgencyRouted: c.isAgencyRouted }))
  };
}

export async function saveGlobalRoutingSetting(enabled: boolean) {
  const settings = await prisma.storeSettings.findFirst();
  if (settings) {
    await prisma.storeSettings.update({
      where: { id: settings.id },
      data: { agencyRoutingEnabled: enabled }
    });
  } else {
    await prisma.storeSettings.create({ data: { agencyRoutingEnabled: enabled } });
  }
  revalidatePath('/admin/settings/geo-rules');
  revalidatePath('/products');
  return { success: true };
}

export async function toggleCategoryRouting(categoryName: string, enabled: boolean) {
  const category = await prisma.category.findFirst({ where: { name: categoryName } });
  if (category) {
    await prisma.category.update({
      where: { id: category.id },
      data: { isAgencyRouted: enabled }
    });
  }
  revalidatePath('/admin/settings/geo-rules');
  revalidatePath('/products');
  return { success: true };
}
