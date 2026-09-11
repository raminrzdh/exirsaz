import type { Metadata } from "next";
import Script from "next/script";
import { Toaster } from "sonner";
import { LOCATIONS } from "@/lib/constants/locations";
import "./globals.css";
import { cn } from "@/lib/utils";
import { prisma } from "@/lib/db/prisma";

export async function generateMetadata(): Promise<Metadata> {
  const settings = await prisma.storeSettings.findFirst();
  return {
    title: settings?.siteName ? `${settings.siteName} - فروشگاه آنلاین` : "Exirsaz - Next-Gen E-commerce",
    description: settings?.siteDescription || "High-performance, RTL-native Persian e-commerce platform",
    icons: settings?.faviconUrl ? {
      icon: settings.faviconUrl,
    } : undefined,
  };
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  let settings = null;
  try {
    settings = await prisma.storeSettings.findFirst();
  } catch (e) {
    console.error("Error fetching global settings in layout:", e);
  }

  return (
    <html
      lang="fa"
      dir="rtl"
      className={cn("font-estedad h-full antialiased font-sans")}
    >
      <body className="min-h-full flex flex-col font-estedad bg-slate-50 text-slate-900">
        {settings?.customHeaderScripts && (
          <div style={{ display: 'none' }} dangerouslySetInnerHTML={{ __html: settings.customHeaderScripts }} />
        )}
        <Script
          id="static-locations"
          dangerouslySetInnerHTML={{
            __html: `window.__LOCATIONS__ = ${JSON.stringify(LOCATIONS)};`,
          }}
        />
        
        <Toaster position="top-center" richColors theme="light" dir="rtl" className="font-estedad" />
        {children}
      </body>
    </html>
  );
}
