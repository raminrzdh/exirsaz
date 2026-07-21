'use server';

import { prisma } from '@/lib/db/prisma';
import { normalizePersianText } from '@/lib/utils/search';

export async function searchStore(rawQuery: string) {
  const query = normalizePersianText(rawQuery);
  
  if (!query || query.length < 2) {
    return { products: [], categories: [] };
  }

  // Tokenize the query for multiple word matching (simple AND logic approximation)
  // For SQLite, we can just use the full string or split into basic keywords
  // Using Prisma OR/AND for multiple fields
  
  const products = await prisma.product.findMany({
    where: {
      OR: [
        { name: { contains: query } },
        { description: { contains: query } },
        { shortDesc: { contains: query } },
      ],
    },
    take: 10,
    select: {
      id: true,
      name: true,
      slug: true,
      price: true,
      salePrice: true,
      category: {
        select: {
          name: true,
        },
      },
    },
  });

  const categories = await prisma.category.findMany({
    where: {
      OR: [
        { name: { contains: query } },
        { description: { contains: query } },
      ],
    },
    take: 5,
    select: {
      id: true,
      name: true,
      slug: true,
    },
  });

  return {
    products,
    categories,
  };
}
