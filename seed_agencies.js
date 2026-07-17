const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function seedAgencies() {
  console.log('Fetching provinces and categories...');
  
  const provinces = await prisma.province.findMany({
    include: { cities: true }
  });

  const categories = await prisma.category.findMany({
    where: {
      name: {
        in: ['توری سایبان', 'توری سایبان مونوتیپ']
      }
    }
  });

  if (categories.length === 0) {
    console.error('Categories not found!');
    return;
  }

  console.log(`Found ${provinces.length} provinces and ${categories.length} categories.`);
  console.log('Creating agencies...');

  let createdCount = 0;

  for (const province of provinces) {
    const agencyName = `نمایندگی استان ${province.name}`;
    
    // Check if agency already exists to avoid duplicates
    const existing = await prisma.agency.findFirst({
      where: { name: agencyName }
    });

    if (existing) {
      console.log(`Agency ${agencyName} already exists, skipping...`);
      continue;
    }

    const cityIds = province.cities.map(c => ({ id: c.id }));

    const agency = await prisma.agency.create({
      data: {
        name: agencyName,
        phone: '02100000000', // Placeholder phone
        address: `دفتر مرکزی فروش استان ${province.name}`,
        isActive: true,
        cities: {
          connect: cityIds
        }
      }
    });

    for (const cat of categories) {
      await prisma.productAgencyExclusion.create({
        data: {
          agencyId: agency.id,
          categoryId: cat.id
        }
      });
    }

    createdCount++;
  }

  console.log(`Successfully created ${createdCount} agencies.`);
}

seedAgencies()
  .catch(e => console.error(e))
  .finally(() => prisma.$disconnect());
