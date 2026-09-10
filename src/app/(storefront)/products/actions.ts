'use server';

import { prisma } from '@/lib/db/prisma';

export async function checkRepresentative(province: string, city: string, category: string, productId?: string) {
  const settings = await prisma.storeSettings.findFirst();
  if (settings && !settings.agencyRoutingEnabled) return null;

  // We find agencies that cover the given province/city
  const agencies = await prisma.agency.findMany({
    where: {
      isActive: true,
      cities: {
        some: {
          province: { name: province },
          name: city
        }
      }
    },
    include: {
      products: true,
      productExclusions: {
        include: { category: true }
      }
    }
  });

  const foundRep = agencies.find(agency => {
    // 1. Explicit Product Match
    if (productId && agency.products && agency.products.some(p => p.id === productId)) {
      return true;
    }
    
    // 2. Category Match
    if (agency.productExclusions.length === 0 || agency.productExclusions.some(e => e.category?.name === category)) {
      return true;
    }
    
    return false;
  });

  if (foundRep) {
    return {
      id: foundRep.id,
      name: foundRep.name,
      phone: foundRep.phone,
      mobile: foundRep.mobile,
      province: province,
      city: city,
      hasWhatsapp: foundRep.hasWhatsapp,
      whatsappNumber: foundRep.whatsappNumber,
      hasBale: foundRep.hasBale,
      baleNumber: foundRep.baleNumber,
      hasPhoneCall: foundRep.hasPhoneCall,
      phoneCallNumber: foundRep.phoneCallNumber,
      hasRequestForm: foundRep.hasRequestForm,
      locationCoordinates: foundRep.locationCoordinates
    };
  }
  
  return null;
}

export async function recordLeadEvent(agencyId: string, type: string) {
  // We use string 'CALL' or 'WHATSAPP' mapping to Enum LeadEventType if it was available, 
  // but since prisma client failed to generate we pass string and let TS complain, or use the generated client later.
  await prisma.leadEvent.create({
    data: {
      agencyId,
      type: type as any
    }
  });
  return { success: true };
}
