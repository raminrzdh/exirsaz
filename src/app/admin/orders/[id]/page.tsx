import Link from 'next/link';
import { ArrowRight, Package, Truck, CreditCard, User } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { PrintButton } from '@/components/ui/PrintButton';
import { formatToman, toPersianDigits } from '@/lib/utils/currency';
import { formatJalaliDateTime } from '@/lib/utils/date';

export default async function OrderDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params;
  
  // Mock data for order details
  const order = {
    id: resolvedParams.id,
    createdAt: new Date(),
    status: 'PROCESSING',
    paymentStatus: 'PAID',
    totalAmount: 68550000,
    shippingCost: 50000,
    discount: 0,
    user: {
      firstName: 'علی',
      lastName: 'احمدی',
      phone: '۰۹۱۲۳۴۵۶۷۸۹',
      email: 'ali@example.com'
    },
    shippingAddress: 'تهران، خیابان ولیعصر، کوچه نصر، پلاک ۱۲، واحد ۴',
    items: [
      { id: '1', productName: 'گوشی موبایل سامسونگ Galaxy S24 Ultra', price: 68500000, quantity: 1, sku: 'SAMSUNG-S24U' }
    ]
  };

  return (
    <div className="space-y-6 animate-stagger-item">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="flex items-center gap-4">
          <Link href="/admin/orders" className="print:hidden">
            <Button variant="ghost" className="w-10 h-10 p-0 rounded-full text-slate-500 hover:bg-slate-200">
              <ArrowRight className="w-5 h-5" />
            </Button>
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-slate-900">سفارش #{toPersianDigits(order.id)}</h1>
            <p className="text-sm text-slate-500 mt-1">{formatJalaliDateTime(order.createdAt)}</p>
          </div>
        </div>
        <div className="flex items-center gap-3 print:hidden">
          <PrintButton />
          <select className="h-10 px-4 rounded-lg bg-indigo-50 border border-indigo-200 text-indigo-700 text-sm font-bold focus:border-indigo-500 outline-none">
            <option value="PENDING">در انتظار پرداخت</option>
            <option value="PROCESSING" selected>در حال پردازش</option>
            <option value="COMPLETED">تکمیل شده (ارسال شد)</option>
            <option value="CANCELLED">لغو شده</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Main Details */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Order Items */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
            <h2 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
              <Package className="w-5 h-5 text-indigo-600" />
              اقلام سفارش
            </h2>
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-slate-600">
                <thead className="bg-slate-50 border-y border-slate-100 text-start">
                  <tr>
                    <th className="py-3 px-4 font-semibold">محصول</th>
                    <th className="py-3 px-4 font-semibold text-center">تعداد</th>
                    <th className="py-3 px-4 font-semibold text-end">قیمت واحد</th>
                    <th className="py-3 px-4 font-semibold text-end">مجموع</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {order.items.map((item) => (
                    <tr key={item.id}>
                      <td className="py-4 px-4">
                        <div className="font-medium text-slate-900">{item.productName}</div>
                        <div className="text-xs text-slate-500 font-mono mt-1">{item.sku}</div>
                      </td>
                      <td className="py-4 px-4 text-center">{toPersianDigits(item.quantity.toString())}</td>
                      <td className="py-4 px-4 text-end">{formatToman(item.price)}</td>
                      <td className="py-4 px-4 text-end font-bold text-slate-900">{formatToman(item.price * item.quantity)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            
            <div className="border-t border-slate-200 mt-4 pt-4 space-y-3">
              <div className="flex justify-between text-sm text-slate-600">
                <span>مبلغ کل محصولات:</span>
                <span>{formatToman(order.totalAmount - order.shippingCost + order.discount)}</span>
              </div>
              <div className="flex justify-between text-sm text-slate-600">
                <span>هزینه ارسال:</span>
                <span>{formatToman(order.shippingCost)}</span>
              </div>
              <div className="flex justify-between text-sm text-red-500">
                <span>تخفیف:</span>
                <span>{formatToman(order.discount)}</span>
              </div>
              <div className="flex justify-between text-lg font-bold text-slate-900 pt-2 border-t border-slate-100">
                <span>مبلغ نهایی:</span>
                <span>{formatToman(order.totalAmount)}</span>
              </div>
            </div>
          </div>
          
        </div>

        {/* Right Column - Side Info */}
        <div className="space-y-6">
          
          {/* Customer Info */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
            <h2 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
              <User className="w-5 h-5 text-indigo-600" />
              اطلاعات مشتری
            </h2>
            <div className="space-y-4 text-sm">
              <div>
                <div className="text-slate-500 text-xs mb-1">نام و نام خانوادگی</div>
                <div className="font-medium text-slate-900">{order.user.firstName} {order.user.lastName}</div>
              </div>
              <div>
                <div className="text-slate-500 text-xs mb-1">شماره تماس</div>
                <div className="font-medium text-slate-900">{order.user.phone}</div>
              </div>
              <div>
                <div className="text-slate-500 text-xs mb-1">ایمیل</div>
                <div className="font-medium text-slate-900">{order.user.email}</div>
              </div>
            </div>
          </div>

          {/* Shipping Info */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
            <h2 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
              <Truck className="w-5 h-5 text-indigo-600" />
              اطلاعات ارسال
            </h2>
            <div className="space-y-4 text-sm">
              <div>
                <div className="text-slate-500 text-xs mb-1">آدرس پستی</div>
                <div className="font-medium text-slate-900 leading-relaxed">{order.shippingAddress}</div>
              </div>
            </div>
          </div>
          
          {/* Payment Info */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
            <h2 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
              <CreditCard className="w-5 h-5 text-indigo-600" />
              وضعیت پرداخت
            </h2>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center text-green-600">
                <CreditCard className="w-5 h-5" />
              </div>
              <div>
                <div className="font-bold text-slate-900">پرداخت موفق (زرین‌پال)</div>
                <div className="text-xs text-slate-500">کد رهگیری: 1248912837</div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
