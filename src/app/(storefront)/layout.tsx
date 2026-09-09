import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { BottomNav } from "@/components/layout/BottomNav";
import { CartProvider } from "@/lib/store/CartContext";
import { prisma } from "@/lib/db/prisma";
import { PageViewTracker } from "@/components/storefront/PageViewTracker";

export default async function StorefrontLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const categories = await prisma.category.findMany({
    select: { id: true, name: true, slug: true },
    take: 20
  });

  return (
    <CartProvider>
      <PageViewTracker />
      <Navbar categories={categories} />
      <main className="flex-grow flex flex-col pb-16 md:pb-0">{children}</main>
      <Footer />
      <BottomNav />
    </CartProvider>
  );
}
