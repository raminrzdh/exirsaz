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

  const foundReps = agencies.filter(agency => {
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

  if (foundReps.length > 0) {
    return foundReps.map(foundRep => ({
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
      locationCoordinates: foundRep.locationCoordinates,
      slug: foundRep.slug
    }));
  }
  
  return null;
}

export async function recordLeadEvent(agencyId: string, type: string, productId?: string) {
  await prisma.leadEvent.create({
    data: {
      agencyId,
      productId: productId || null,
      type: type
    }
  });
  return { success: true };
}

export async function submitInquiry(data: {
  customerName: string;
  customerPhone: string;
  description?: string;
  productName: string;
  productId?: string;
  agencyId?: string;
}) {
  try {
    await prisma.inquiryRequest.create({
      data: {
        customerName: data.customerName,
        customerPhone: data.customerPhone,
        description: data.description,
        productName: data.productName,
        productId: data.productId,
        agencyId: data.agencyId,
        status: 'PENDING'
      }
    });
    return { success: true };
  } catch (error) {
    console.error('Failed to submit inquiry:', error);
    return { success: false, error: 'Failed to submit inquiry' };
  }
}
