const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const products = [
  { name: 'توری سایبان (شید گلخانه)', slug: 'greenhouse-shade-net' },
  { name: 'توری سایبان دامداری‌ها', slug: 'livestock-shade-net' },
  { name: 'توری سایبان پارکینگ', slug: 'parking-shade-net' },
  { name: 'جلوگیری از آفتاب سوختگی', slug: 'sunburn-protection-net' },
  { name: 'توری پوشش استخر', slug: 'pool-cover-net' },
  { name: 'کیسه محافظ خرما', slug: 'date-protection-bag' },
  { name: 'بسته‌بندی پرتقال', slug: 'orange-packaging-net' },
  { name: 'کیسه توری راشل', slug: 'raschel-mesh-bag' },
  { name: 'بسته‌بندی علوفه', slug: 'forage-packaging-net' },
  { name: 'بسته‌بندی کلم', slug: 'cabbage-packaging-net' },
  { name: 'توری حصاری', slug: 'fence-net' },
  { name: 'توری ضد پرنده', slug: 'anti-bird-net' },
  { name: 'توری جمع‌آوری محصول', slug: 'harvest-collection-net' },
  { name: 'توری ضد تگرگ', slug: 'anti-hail-net' },
  { name: 'توری ایمنی ساختمان', slug: 'safety-net' },
  { name: 'گیره نصب سایبان', slug: 'shade-net-clips' }
];

async function main() {
  console.log('Seeding base products...');
  for (const p of products) {
    const exists = await prisma.product.findUnique({ where: { slug: p.slug } });
    if (!exists) {
      await prisma.product.create({
        data: {
          name: p.name,
          slug: p.slug,
          description: p.name + ' با کیفیت عالی',
          shortDesc: 'محصول با کیفیت پلیمری',
          price: 100000,
          stock: 100,
          type: 'SIMPLE',
          salesType: 'DIRECT_SALE',
          images: '[]'
        }
      });
      console.log(`Created: ${p.slug}`);
    } else {
      console.log(`Already exists: ${p.slug}`);
    }
  }
  console.log('Done!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
