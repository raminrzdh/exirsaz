import type { Metadata } from "next";
import { Vazirmatn } from "next/font/google";
import { Toaster } from "react-hot-toast";
import "./globals.css";

const vazirmatn = Vazirmatn({
  variable: "--font-vazirmatn",
  subsets: ["arabic", "latin"],
  display: "swap",
});

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
      className={`${vazirmatn.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col font-vazirmatn bg-slate-50 text-slate-900">
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
