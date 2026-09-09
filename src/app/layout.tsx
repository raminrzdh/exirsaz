import type { Metadata } from "next";
import Script from "next/script";
import { Toaster } from "react-hot-toast";
import { LOCATIONS } from "@/lib/constants/locations";
import "./globals.css";
import { Geist } from "next/font/google";
import { cn } from "@/lib/utils";

const geist = Geist({subsets:['latin'],variable:'--font-sans'});

export const metadata: Metadata = {
  title: "Exirsaz - Next-Gen E-commerce",
  description: "High-performance, RTL-native Persian e-commerce platform",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="fa"
      dir="rtl"
      className={cn("font-estedad h-full antialiased", "font-sans", geist.variable)}
    >
      <body className="min-h-full flex flex-col font-estedad bg-slate-50 text-slate-900">
        <Script
          id="static-locations"
          dangerouslySetInnerHTML={{
            __html: `window.__LOCATIONS__ = ${JSON.stringify(LOCATIONS)};`,
          }}
        />
        {/* Google Tag Manager (noscript) can be added here if needed */}
        
        {/* Google Tag Manager Script (Non-blocking) */}
        <Script
          id="gtm-script"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `
              (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
              new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
              j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
              'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
              })(window,document,'script','dataLayer','GTM-XXXXXXX');
            `,
          }}
        />
        <Toaster 
          position="bottom-center" 
          toastOptions={{
            duration: 4000,
            style: {
              fontFamily: 'inherit',
              fontSize: '14px',
              padding: '12px 20px',
              borderRadius: '999px',
            },
          }} 
        />
        {children}
      </body>
    </html>
  );
}
