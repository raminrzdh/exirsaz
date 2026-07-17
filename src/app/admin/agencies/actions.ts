'use server';

import { revalidatePath } from 'next/cache';
import { prisma } from '@/lib/db/prisma';

export async function getAgencies() {
  const agencies = await prisma.agency.findMany({
    include: {
      cities: {
        include: { province: true }
      },
      products: true,
      productExclusions: {
        include: { category: true }
      }
    }
  });

  return agencies.map(a => ({
    id: a.id,
    name: a.name,
    phone: a.phone || '',
    address: a.address || '',
    cities: a.cities.map(c => ({ province: c.province.name, city: c.name })), // Assuming simple mapping, actual DB might need joins
    categories: a.productExclusions.map(e => e.category?.name).filter(Boolean) as string[],
    products: a.products.map(p => p.id),
    isActive: a.isActive
  }));
}

export async function createAgency(data: any) {
  // First ensure provinces and cities exist, then get their IDs
  const cityConnections = [];
  if (data.cities && Array.isArray(data.cities)) {
    for (const location of data.cities) {
      if (!location.province || !location.city) continue;
      
      const province = await prisma.province.upsert({
        where: { name: location.province },
        update: {},
        create: { name: location.province }
      });
      
      const city = await prisma.city.upsert({
        where: { name_provinceId: { name: location.city, provinceId: province.id } },
        update: {},
        create: { name: location.city, provinceId: province.id }
      });
      
      cityConnections.push({ id: city.id });
    }
  }

  const agency = await prisma.agency.create({
    data: {
      name: data.name,
      phone: data.phone,
      address: data.address,
      isActive: data.isActive,
      products: {
        connect: data.products?.map((id: string) => ({ id })) || []
      },
      cities: {
        connect: cityConnections
      }
    }
  });

  if (data.categories && Array.isArray(data.categories)) {
    for (const catName of data.categories) {
      const cat = await prisma.category.findFirst({ where: { name: catName } });
      if (cat) {
        await prisma.productAgencyExclusion.create({
          data: {
            agencyId: agency.id,
            categoryId: cat.id
          }
        });
      }
    }
  }

  const completeAgency = await prisma.agency.findUniqueOrThrow({
    where: { id: agency.id },
    include: {
      cities: {
        include: { province: true }
      },
      products: true,
      productExclusions: {
        include: { category: true }
      }
    }
  });
  
  revalidatePath('/admin/agencies');
  return { 
    success: true, 
    agency: {
      id: completeAgency.id,
      name: completeAgency.name,
      phone: completeAgency.phone || '',
      address: completeAgency.address || '',
      cities: completeAgency.cities.map(c => ({ province: c.province.name, city: c.name })),
      categories: completeAgency.productExclusions.map(e => e.category?.name).filter(Boolean) as string[],
      products: completeAgency.products.map(p => p.id),
      isActive: completeAgency.isActive
    }
  };
}

export async function updateAgency(id: string, data: any) {
  const cityConnections = [];
  if (data.cities && Array.isArray(data.cities)) {
    for (const location of data.cities) {
      if (!location.province || !location.city) continue;
      
      const province = await prisma.province.upsert({
        where: { name: location.province },
        update: {},
        create: { name: location.province }
      });
      
      const city = await prisma.city.upsert({
        where: { name_provinceId: { name: location.city, provinceId: province.id } },
        update: {},
        create: { name: location.city, provinceId: province.id }
      });
      
      cityConnections.push({ id: city.id });
    }
  }

  const agency = await prisma.agency.update({
    where: { id },
    data: {
      name: data.name,
      phone: data.phone,
      address: data.address,
      isActive: data.isActive,
      products: {
        set: data.products?.map((id: string) => ({ id })) || []
      },
      cities: {
        set: cityConnections
      }
    }
  });

  if (data.categories && Array.isArray(data.categories)) {
    await prisma.productAgencyExclusion.deleteMany({
      where: { agencyId: agency.id }
    });
    for (const catName of data.categories) {
      const cat = await prisma.category.findFirst({ where: { name: catName } });
      if (cat) {
        await prisma.productAgencyExclusion.create({
          data: {
            agencyId: agency.id,
            categoryId: cat.id
          }
        });
      }
    }
  }

  const completeAgency = await prisma.agency.findUniqueOrThrow({
    where: { id: agency.id },
    include: {
      cities: {
        include: { province: true }
      },
      products: true,
      productExclusions: {
        include: { category: true }
      }
    }
  });

  revalidatePath('/admin/agencies');
  return { 
    success: true, 
    agency: {
      id: completeAgency.id,
      name: completeAgency.name,
      phone: completeAgency.phone || '',
      address: completeAgency.address || '',
      cities: completeAgency.cities.map(c => ({ province: c.province.name, city: c.name })),
      categories: completeAgency.productExclusions.map(e => e.category?.name).filter(Boolean) as string[],
      products: completeAgency.products.map(p => p.id),
      isActive: completeAgency.isActive
    }
  };
}

export async function deleteAgency(id: string) {
  await prisma.agency.delete({ where: { id } });
  revalidatePath('/admin/agencies');
  return { success: true };
}
