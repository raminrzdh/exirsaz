'use server';

import { prisma } from '@/lib/db/prisma';
import { revalidatePath } from 'next/cache';

export async function getGeneralSettings() {
  let settings = await prisma.storeSettings.findFirst();
  if (!settings) {
    settings = await prisma.storeSettings.create({ data: {} });
  }
  return settings;
}

export async function updateGeneralSettings(data: {
  siteName: string;
  siteDescription?: string;
  logoUrl?: string;
  faviconUrl?: string;
  supportPhone?: string;
  supportEmail?: string;
  whatsappNumber?: string;
  customHeaderScripts?: string;
}) {
  const settings = await prisma.storeSettings.findFirst();
  
  if (settings) {
    await prisma.storeSettings.update({
      where: { id: settings.id },
      data: {
        siteName: data.siteName,
        siteDescription: data.siteDescription,
        logoUrl: data.logoUrl,
        faviconUrl: data.faviconUrl,
        supportPhone: data.supportPhone,
        supportEmail: data.supportEmail,
        whatsappNumber: data.whatsappNumber,
        customHeaderScripts: data.customHeaderScripts
      }
    });
  } else {
    await prisma.storeSettings.create({
      data: {
        siteName: data.siteName,
        siteDescription: data.siteDescription,
        logoUrl: data.logoUrl,
        faviconUrl: data.faviconUrl,
        supportPhone: data.supportPhone,
        supportEmail: data.supportEmail,
        whatsappNumber: data.whatsappNumber,
        customHeaderScripts: data.customHeaderScripts
      }
    });
  }
  
  revalidatePath('/admin/settings');
  revalidatePath('/'); // Revalidate storefront to apply scripts
  return { success: true };
}
