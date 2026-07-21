'use server';

import { prisma } from '@/lib/db/prisma';

export async function getSalesReport(filter: 'today' | 'week' | 'month' | 'year' | 'all') {
  let startDate = new Date();
  
  if (filter === 'today') {
    startDate.setHours(0, 0, 0, 0);
  } else if (filter === 'week') {
    startDate.setDate(startDate.getDate() - 7);
  } else if (filter === 'month') {
    startDate.setMonth(startDate.getMonth() - 1);
  } else if (filter === 'year') {
    startDate.setFullYear(startDate.getFullYear() - 1);
  } else {
    startDate = new Date(0); // all time
  }

  const dateFilter = { gte: startDate };

  const orders = await prisma.order.findMany({
    where: {
      createdAt: dateFilter,
    },
    include: {
      user: { select: { firstName: true, lastName: true, phoneNumber: true } },
    },
    orderBy: { createdAt: 'desc' }
  });

  const paidOrders = orders.filter(o => o.paymentStatus === 'PAID');
  
  const totalRevenue = paidOrders.reduce((sum, order) => sum + order.totalAmount, 0);
  const totalOrders = orders.length;
  const successfulOrders = paidOrders.length;
  
  const averageOrderValue = successfulOrders > 0 ? totalRevenue / successfulOrders : 0;

  return {
    totalRevenue,
    totalOrders,
    successfulOrders,
    averageOrderValue,
    recentOrders: orders.slice(0, 20) // send only latest 20 for the table
  };
}
