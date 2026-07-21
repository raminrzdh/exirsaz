'use server';

import { prisma } from '@/lib/db/prisma';

export async function getCrossSellProducts(cartProductIds: string[]) {
  if (!cartProductIds || cartProductIds.length === 0) return [];

  // A basic cross-sell algorithm: 
  // Fetch products that are NOT in the cart but share keywords or categories
  // For demonstration without an AI backend, we look for hardcoded companions or fallback to general accessories
  
  const inCartProducts = await prisma.product.findMany({
    where: { id: { in: cartProductIds } },
    select: { name: true, categoryId: true }
  });

  const cartNames = inCartProducts.map(p => p.name);
  const isShadeNet = cartNames.some(name => name.includes('توری') || name.includes('سایبان'));
  
  // Find cross-sells
  const crossSells = await prisma.product.findMany({
    where: {
      id: { notIn: cartProductIds },
      // Condition: If shade net in cart, suggest clips or related accessories
      // Fallback to random items if no specific logic matches
      ...(isShadeNet ? {
        OR: [
          { name: { contains: 'گیره' } },
          { name: { contains: 'لوازم جانبی' } }
        ]
      } : {})
    },
    take: 2,
    select: {
      id: true,
      name: true,
      price: true,
      salePrice: true,
    }
  });

  // If no specific match, just return some other popular products
  if (crossSells.length === 0) {
    return prisma.product.findMany({
      where: {
        id: { notIn: cartProductIds },
        price: { not: null }
      },
      take: 2,
      select: {
        id: true,
        name: true,
        price: true,
        salePrice: true,
      }
    });
  }

  return crossSells;
}
