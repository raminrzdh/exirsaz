import { prisma } from '@/lib/db/prisma';
import { AnalyticsSeoDashboard } from './AnalyticsSeoDashboard';

export const metadata = {
  title: 'آمار ارجاعات | پنل ادمین',
};

export default async function AnalyticsPage() {
  // 1. Total Direct Sales (Orders)
  const paidOrders = await prisma.order.aggregate({
    where: { paymentStatus: 'PAID' },
    _sum: { totalAmount: true },
    _count: { id: true }
  });
  
  const totalRevenue = paidOrders._sum.totalAmount || 0;
  const orderCount = paidOrders._count.id || 0;

  // 2. Lead Events (Referrals to Agents)
  const leadEvents = await prisma.leadEvent.findMany({
    include: {
      agency: {
        include: { cities: true }
      }
    }
  });

  const totalLeads = leadEvents.length;
  
  // 3. Process City Analytics
  const cities = await prisma.city.findMany({
    include: { agencies: { select: { id: true } } }
  });

  const cityStatsMap = new Map();
  cities.forEach(city => {
    cityStatsMap.set(city.name, {
      city: city.name,
      status: city.agencies.length > 0 ? "has_agent" : "no_agent",
      searches: (city.agencies.length === 0 && city.name === 'شیراز') ? 2340 : Math.floor(Math.random() * 5000) + 500, // Search volume is mocked
      calls: 0,
      wa: 0
    });
  });

  leadEvents.forEach(event => {
    if (event.agency && event.agency.cities) {
      const primaryCity = event.agency.cities[0]?.name;
      if (primaryCity && cityStatsMap.has(primaryCity)) {
        const stats = cityStatsMap.get(primaryCity);
        if (event.type === 'CALL') stats.calls += 1;
        if (event.type === 'WHATSAPP') stats.wa += 1;
      }
    }
  });

  const cityAnalytics = Array.from(cityStatsMap.values()).sort((a, b) => b.searches - a.searches).slice(0, 10);

  const productViews = await prisma.funnelEvent.count({ where: { eventType: 'PRODUCT_VIEW' } });
  const addToCarts = await prisma.funnelEvent.count({ where: { eventType: 'add_to_cart' } });
  const checkouts = await prisma.funnelEvent.count({ where: { eventType: 'CHECKOUT_START' } });

  const realData = {
    totalRevenue,
    orderCount,
    totalLeads,
    cityAnalytics,
    funnel: {
      productViews,
      addToCarts,
      checkouts,
      purchases: orderCount,
    }
  };

  return (
    <div className="flex flex-col gap-6">
      <AnalyticsSeoDashboard realData={realData} />
    </div>
  );
}
