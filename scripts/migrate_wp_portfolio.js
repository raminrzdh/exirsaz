const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// Example legacy data template that would normally be parsed from a CSV or JSON export
const legacyWPData = {
  parentProduct: {
    title: 'توری سایبان',
    slug: 'tori-sayeban',
    longContent: '<h2>معرفی توری سایبان</h2><p>متن سئو شده طولانی از صفحه پورتفولیو قدیمی وردپرس...</p>',
    shortDesc: 'بهترین توری سایبان برای گلخانه‌ها',
    price: 150000,
    stock: 100,
    images: '["https://exirsaz.com/wp-content/uploads/2023/04/توری-سایبان-80-درصد.jpg"]',
    salesType: 'DIRECT_SALE',
    categoryId: null // You would map this to the real Category ID
  },
  comments: [
    {
      authorName: 'علی محمدی',
      content: 'من این توری رو برای حیاط خونمون گرفتم واقعا عالی بود خنک میکنه.',
      rating: 5,
      createdAt: new Date('2023-05-12T10:00:00Z'),
      isApproved: true
    },
    {
      authorName: 'رضا',
      content: 'نصبش چطوریه؟',
      rating: 4,
      createdAt: new Date('2023-06-01T14:30:00Z'),
      isApproved: true
    }
  ],
  attributes: [
    { name: 'رنگ', values: ['سبز تیره', 'خاکی', 'سفید'] },
    { name: 'ابعاد', values: ['3x5 متر', '4x6 متر', '2x10 متر'] }
  ],
  variants: [
    {
      sku: 'TORI-GR-3X5',
      price: 150000,
      stock: 10,
      attributes: { 'رنگ': 'سبز تیره', 'ابعاد': '3x5 متر' }
    },
    {
      sku: 'TORI-GR-4X6',
      price: 240000,
      stock: 5,
      attributes: { 'رنگ': 'سبز تیره', 'ابعاد': '4x6 متر' }
    }
  ]
};

async function runMigration() {
  console.log('Starting WP Migration...');

  // 1. Create or Find the Parent Product
  let product = await prisma.product.findUnique({
    where: { slug: legacyWPData.parentProduct.slug }
  });

  if (!product) {
    product = await prisma.product.create({
      data: {
        name: legacyWPData.parentProduct.title,
        slug: legacyWPData.parentProduct.slug,
        longContent: legacyWPData.parentProduct.longContent,
        shortDesc: legacyWPData.parentProduct.shortDesc,
        price: legacyWPData.parentProduct.price,
        stock: legacyWPData.parentProduct.stock,
        images: legacyWPData.parentProduct.images,
        salesType: legacyWPData.parentProduct.salesType
      }
    });
    console.log(`Created parent product: ${product.name}`);
  } else {
    product = await prisma.product.update({
      where: { id: product.id },
      data: {
        longContent: legacyWPData.parentProduct.longContent,
      }
    });
    console.log(`Updated parent product: ${product.name}`);
  }

  // 2. Migrate Comments
  for (const commentData of legacyWPData.comments) {
    await prisma.comment.create({
      data: {
        productId: product.id,
        authorName: commentData.authorName,
        content: commentData.content,
        rating: commentData.rating,
        createdAt: commentData.createdAt,
        isApproved: commentData.isApproved
      }
    });
  }
  console.log(`Migrated ${legacyWPData.comments.length} comments.`);

  // 3. Create Attributes and Values
  const attrValueIds = {}; // { 'رنگ': { 'سبز تیره': 'cuid...' } }

  for (const attrData of legacyWPData.attributes) {
    let dbAttr = await prisma.attribute.findUnique({
      where: { name: attrData.name }
    });
    if (!dbAttr) {
      dbAttr = await prisma.attribute.create({ data: { name: attrData.name } });
    }

    attrValueIds[attrData.name] = {};

    for (const val of attrData.values) {
      let dbAttrVal = await prisma.attributeValue.findUnique({
        where: {
          attributeId_value: { attributeId: dbAttr.id, value: val }
        }
      });
      if (!dbAttrVal) {
        dbAttrVal = await prisma.attributeValue.create({
          data: { attributeId: dbAttr.id, value: val }
        });
      }
      attrValueIds[attrData.name][val] = dbAttrVal.id;
    }

    // Link attribute to product
    await prisma.productAttribute.upsert({
      where: {
        productId_attributeId: { productId: product.id, attributeId: dbAttr.id }
      },
      update: {},
      create: { productId: product.id, attributeId: dbAttr.id }
    });
  }

  // 4. Migrate Variants
  for (const variantData of legacyWPData.variants) {
    const variant = await prisma.productVariant.upsert({
      where: { sku: variantData.sku },
      update: { price: variantData.price, stock: variantData.stock },
      create: {
        productId: product.id,
        sku: variantData.sku,
        price: variantData.price,
        stock: variantData.stock
      }
    });

    // Link variant to its attribute values
    for (const [attrName, valName] of Object.entries(variantData.attributes)) {
      const valId = attrValueIds[attrName][valName];
      if (valId) {
        await prisma.productVariantAttribute.upsert({
          where: {
            variantId_attributeValueId: { variantId: variant.id, attributeValueId: valId }
          },
          update: {},
          create: { variantId: variant.id, attributeValueId: valId }
        });
      }
    }
  }
  console.log(`Migrated ${legacyWPData.variants.length} variants.`);

  console.log('Migration completed successfully!');
}

runMigration().catch(console.error).finally(() => prisma.$disconnect());
