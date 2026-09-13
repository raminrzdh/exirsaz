import type { Metadata } from "next";
import Script from "next/script";
import { Toaster } from "sonner";
import { LOCATIONS } from "@/lib/constants/locations";
import "./globals.css";
import { cn } from "@/lib/utils";
import { prisma } from "@/lib/db/prisma";

export async function generateMetadata(): Promise<Metadata> {
  const settings = await prisma.storeSettings.findFirst();
  const title = settings?.siteName ? `${settings.siteName} - فروشگاه آنلاین` : "Exirsaz - Next-Gen E-commerce";
  const description = settings?.siteDescription || "High-performance, RTL-native Persian e-commerce platform";
  const url = "https://exirsaz.com";

  return {
    metadataBase: new URL(url),
    title: title,
    description: description,
    icons: settings?.faviconUrl ? {
      icon: settings.faviconUrl,
    } : undefined,
    alternates: {
      canonical: url,
    },
    openGraph: {
      title,
      description,
      url,
      siteName: settings?.siteName || "Exirsaz",
      locale: "fa_IR",
      type: "website",
      images: [
        {
          url: "https://exirsaz.com/wp-content/uploads/2023/02/توری-سایبان-شید-گلخانه.jpg", // Using a fallback image for OG
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: ["https://exirsaz.com/wp-content/uploads/2023/02/توری-سایبان-شید-گلخانه.jpg"],
    },
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
