'use server';

import { prisma } from '@/lib/db/prisma';

async function processAttributesAndVariants(productId: string, attributesData: any[], variantsData: any[]) {
  // 1. Process Attributes and AttributeValues
  const attrValueIds: Record<string, Record<string, string>> = {};

  // First, clear existing product attributes and variant mappings for clean update
  await prisma.productAttribute.deleteMany({ where: { productId } });
  
  // We cannot easily delete variants without losing order items, but for now we'll delete and recreate variants
  // In a real production system, you'd want to upsert or soft-delete variants to preserve order history.
  await prisma.productVariant.deleteMany({ where: { productId } });

  for (const attrData of attributesData) {
    let dbAttr = await prisma.attribute.findUnique({
      where: { name: attrData.name }
    });
    if (!dbAttr) {
      dbAttr = await prisma.attribute.create({ data: { name: attrData.name } });
    }

    attrValueIds[attrData.name] = {};

    for (const val of attrData.values) {
      const valStr = val.trim();
      if (!valStr) continue;

      let dbAttrVal = await prisma.attributeValue.findUnique({
        where: {
          attributeId_value: { attributeId: dbAttr.id, value: valStr }
        }
      });
      if (!dbAttrVal) {
        dbAttrVal = await prisma.attributeValue.create({
          data: { attributeId: dbAttr.id, value: valStr }
        });
      }
      attrValueIds[attrData.name][valStr] = dbAttrVal.id;
    }

    // Link attribute to product
    await prisma.productAttribute.create({
      data: { productId, attributeId: dbAttr.id }
    });
  }

  // 2. Process Variants
  for (const variantData of variantsData) {
    const variant = await prisma.productVariant.create({
      data: {
        productId,
        sku: variantData.sku || undefined,
        price: parseInt(variantData.price) || 0,
        stock: parseInt(variantData.stock) || 0,
        image: variantData.image || undefined,
      }
    });

    // Link variant to its attribute values
    for (const [attrName, valName] of Object.entries(variantData.attributes)) {
      const valStr = (valName as string).trim();
      const valId = attrValueIds[attrName]?.[valStr];
      if (valId) {
        await prisma.productVariantAttribute.create({
          data: { variantId: variant.id, attributeValueId: valId }
        });
      }
    }
  }
}

export async function createProduct(data: any) {
  try {
    const isVariable = data.type === 'VARIABLE';
    
    const product = await prisma.product.create({
      data: {
        name: data.name,
        slug: data.slug || data.name.replace(/\s+/g, '-').toLowerCase(),
        description: data.description,
        shortDesc: data.shortDesc,
        price: data.price ? parseInt(data.price) : null,
        salePrice: data.salePrice ? parseInt(data.salePrice) : null,
        stock: data.stock ? parseInt(data.stock) : 0,
        sku: data.sku || undefined,
        categoryId: data.categoryId || undefined,
        type: isVariable ? "VARIABLE" : "SIMPLE",
        salesType: data.salesType || "DIRECT_SALE",
        inquiryAction: data.salesType === 'INQUIRY' ? data.inquiryAction : null,
        salesTypeOverride: "USE_CATEGORY",
        images: data.images || "[]",
        features: data.features || "[]",
        agencies: data.agencies ? {
          connect: data.agencies.map((id: string) => ({ id }))
        } : undefined,
      }
    });

    if (isVariable && data.attributes && data.variants) {
      await processAttributesAndVariants(product.id, data.attributes, data.variants);
    }

    return { success: true, product };
  } catch (error: any) {
    console.error("Failed to create product:", error);
    return { success: false, error: error.message };
  }
}

export async function updateProduct(id: string, data: any) {
  try {
    const isVariable = data.type === 'VARIABLE';

    const product = await prisma.product.update({
      where: { id },
      data: {
        name: data.name,
        slug: data.slug,
        description: data.description,
        shortDesc: data.shortDesc,
        price: data.price ? parseInt(data.price) : null,
        salePrice: data.salePrice ? parseInt(data.salePrice) : null,
        stock: data.stock ? parseInt(data.stock) : 0,
        sku: data.sku || undefined,
        categoryId: data.categoryId || undefined,
        type: isVariable ? "VARIABLE" : "SIMPLE",
        salesType: data.salesType || "DIRECT_SALE",
        inquiryAction: data.salesType === 'INQUIRY' ? data.inquiryAction : null,
        images: data.images || "[]",
        features: data.features || "[]",
        agencies: data.agencies ? {
          set: data.agencies.map((agencyId: string) => ({ id: agencyId }))
        } : undefined,
      }
    });

    if (isVariable && data.attributes && data.variants) {
      await processAttributesAndVariants(product.id, data.attributes, data.variants);
    } else {
      // If changed to simple, cleanup variants
      await prisma.productAttribute.deleteMany({ where: { productId: id } });
      await prisma.productVariant.deleteMany({ where: { productId: id } });
    }

    return { success: true, product };
  } catch (error: any) {
    console.error("Failed to update product:", error);
    return { success: false, error: error.message };
  }
}
