import { CheckoutClient } from './CheckoutClient';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'تسویه حساب | اکسیرساز',
};

export default function CheckoutPage() {
  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="text-3xl font-black text-slate-800 mb-8 text-center sm:text-start">تسویه حساب</h1>
      <CheckoutClient />
    </div>
  );
}
