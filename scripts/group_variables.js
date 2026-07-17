const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function run() {
  const allProducts = await prisma.product.findMany({
    where: { type: 'SIMPLE' },
    include: { category: true }
  });

  const parsedProducts = [];

  for (const product of allProducts) {
    let name = product.name;
    const attributes = {};

    // 1. Extract UV
    if (name.includes('UVدار')) {
      attributes['ویژگی'] = 'UVدار';
      name = name.replace(/UVدار/i, '').trim();
    } else if (name.includes('بدون UV')) {
      attributes['ویژگی'] = 'بدون UV';
      name = name.replace(/بدون UV/i, '').trim();
    }

    // 2. Extract Texture
    if (name.includes('مونوتیپ')) {
      attributes['بافت'] = 'مونوتیپ';
      name = name.replace(/مونوتیپ/i, '').trim();
    } else if (name.includes('ساده')) {
      attributes['بافت'] = 'ساده';
      name = name.replace(/ساده/i, '').trim();
    }

    // 3. Extract Weight
    const weightMatch = name.match(/(\d+GSM)/i);
    if (weightMatch) {
      attributes['وزن'] = weightMatch[1].toUpperCase();
      name = name.replace(weightMatch[0], '').trim();
    }

    // 4. Extract Size
    // Matches like 19×3 متر or 45x65 سانت or 600×1.2 متر
    const sizeMatch = name.match(/(\d+(?:\.\d+)?\s*[×xX]\s*\d+(?:\.\d+)?\s*(?:متر|سانت))/i);
    if (sizeMatch) {
      attributes['ابعاد'] = sizeMatch[1].replace(/x/i, '×');
      name = name.replace(sizeMatch[0], '').trim();
    }

    // 5. Extract Density
    const densityMatch = name.match(/(\d+\s*(?:درصد|%))/i);
    if (densityMatch) {
      attributes['تراکم'] = densityMatch[1];
      name = name.replace(densityMatch[0], '').trim();
    }

    // 6. Extract Color
    // Order matters, put longer colors first
    const colors = [
      'مشکی و سبز تیره', 'مشکی و بژ', 'سبز تیره', 'مشکی', 
      'سفید', 'سبز', 'بژ', 'توسی', 'قرمز', 'زرد', 'آبی', 
      'پرتقالی', 'بنفش', 'طلایی', 'نقره ای'
    ];
    for (const color of colors) {
      if (name.includes(color)) {
        attributes['رنگ'] = color;
        name = name.replace(new RegExp(color, 'g'), '').trim();
        break; // Only match one color
      }
    }

    // Clean up extra spaces and specific trailing things like "شبكه", "حلقه دار", "پانچ شده"
    let baseName = name.replace(/\s+/g, ' ').trim();
    
    // Additional cleanup for base name
    baseName = baseName.replace(/حلقه دار/g, '').replace(/پانچ شده/g, '').replace(/\/ساك/g, '').trim();
    // Some products are just "شبكه سايبان" instead of "توری سایبان", unify if possible, but for now we keep what remains
    
    // If baseName ends up empty somehow, use category name
    if (!baseName) baseName = product.category?.name || 'محصول متغیر';

    // Ensure we don't group completely unrelated things. 
    // Example baseName: "توری سایبان", "شبکه سایبان", "حصاری شبکه", "کیسه راشل"

    parsedProducts.push({
      originalProduct: product,
      baseName: baseName,
      attributes
    });
  }

  // Group by baseName
  const grouped = {};
  for (const item of parsedProducts) {
    if (!grouped[item.baseName]) {
      grouped[item.baseName] = [];
    }
    grouped[item.baseName].push(item);
  }

  // Generate missing attributes in DB
  const attrCache = {}; // { 'رنگ': dbAttrObj }
  const getAttrId = async (attrName) => {
    if (attrCache[attrName]) return attrCache[attrName].id;
    let dbAttr = await prisma.attribute.findUnique({ where: { name: attrName } });
    if (!dbAttr) dbAttr = await prisma.attribute.create({ data: { name: attrName } });
    attrCache[attrName] = dbAttr;
    return dbAttr.id;
  };

  const valCache = {}; // { 'رنگ:سفید': id }
  const getValId = async (attrId, attrName, valString) => {
    const key = `${attrName}:${valString}`;
    if (valCache[key]) return valCache[key];
    let dbVal = await prisma.attributeValue.findUnique({
      where: { attributeId_value: { attributeId: attrId, value: valString } }
    });
    if (!dbVal) dbVal = await prisma.attributeValue.create({ data: { attributeId: attrId, value: valString } });
    valCache[key] = dbVal.id;
    return dbVal.id;
  };

  console.log(`Found ${Object.keys(grouped).length} base products to create.`);

  for (const [baseName, items] of Object.entries(grouped)) {
    // 1. Create Parent Product
    const firstItem = items[0].originalProduct;
    let slug = baseName.replace(/\s+/g, '-').replace(/‌/g, '-').toLowerCase(); // replace zero-width joiner
    
    // Add random suffix to avoid slug conflict with deleted items (in case of sqlite ghost data) or duplicate names
    slug = slug + '-' + Math.floor(Math.random() * 10000);

    const parentProduct = await prisma.product.create({
      data: {
        name: baseName,
        slug,
        type: 'VARIABLE',
        salesType: firstItem.salesType,
        categoryId: firstItem.categoryId,
        images: firstItem.images,
        price: firstItem.price,
        stock: items.reduce((acc, curr) => acc + curr.originalProduct.stock, 0),
      }
    });

    console.log(`Created parent product: ${baseName} with ${items.length} variants.`);

    for (const item of items) {
      // If there are no attributes extracted, just add a dummy attribute so it's a valid variant?
      // Or we just add it anyway with empty attributes
      const attrIds = {};
      
      for (const [attrName, valString] of Object.entries(item.attributes)) {
        const attrId = await getAttrId(attrName);
        const valId = await getValId(attrId, attrName, valString);
        attrIds[attrId] = valId;

        // link attribute to product
        await prisma.productAttribute.upsert({
          where: { productId_attributeId: { productId: parentProduct.id, attributeId: attrId } },
          update: {},
          create: { productId: parentProduct.id, attributeId: attrId }
        });
      }

      // Create Variant
      const variant = await prisma.productVariant.create({
        data: {
          productId: parentProduct.id,
          sku: item.originalProduct.sku || `VAR-${Math.random().toString(36).substring(7).toUpperCase()}`,
          price: item.originalProduct.price || 0,
          stock: item.originalProduct.stock || 0,
        }
      });

      // Link Variant to Attribute Values
      for (const valId of Object.values(attrIds)) {
        await prisma.productVariantAttribute.create({
          data: { variantId: variant.id, attributeValueId: valId }
        });
      }

      // Delete the original simple product
      await prisma.product.delete({ where: { id: item.originalProduct.id } });
    }
  }

  console.log('Migration Complete!');
}

run().catch(console.error).finally(() => prisma.$disconnect());
