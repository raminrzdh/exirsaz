'use client';

import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ShoppingBag, ArrowUpRight } from 'lucide-react';
import Link from 'next/link';

export default function CustomersClient({ initialCustomers }: { initialCustomers: any[] }) {
  const [customers] = useState(initialCustomers);

  const calculateTotalSpent = (orders: any[]) => {
    // In a real scenario, you might filter by PAID or DELIVERED status.
    // For now, we sum all orders assuming they are valid for lifetime value.
    return orders.reduce((sum, order) => sum + (order.totalAmount || 0), 0);
  };

  return (
    <Card>
      <CardContent className="p-0 overflow-x-auto">
        <Table className="min-w-[800px]">
          <TableHeader>
            <TableRow>
              <TableHead>نام مشتری</TableHead>
              <TableHead>شماره موبایل</TableHead>
              <TableHead>تاریخ ثبت نام</TableHead>
              <TableHead className="text-center">تعداد سفارشات</TableHead>
              <TableHead>مجموع خرید</TableHead>
              <TableHead className="text-end">عملیات</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {customers.map((customer) => (
              <TableRow key={customer.id}>
                <TableCell className="font-medium">
                  {customer.firstName || customer.lastName 
                    ? `${customer.firstName || ''} ${customer.lastName || ''}`
                    : <span className="text-muted-foreground text-sm">کاربر ناشناس</span>}
                </TableCell>
                <TableCell className="font-mono text-left" dir="ltr">{customer.phoneNumber}</TableCell>
                <TableCell className="text-sm text-muted-foreground">
                  {new Date(customer.createdAt).toLocaleDateString('fa-IR')}
                </TableCell>
                <TableCell className="text-center">
                  <Badge variant="secondary" className="px-2 font-mono">
                    {customer.orders?.length || 0}
                  </Badge>
                </TableCell>
                <TableCell>
                  <span className="font-medium">
                    {calculateTotalSpent(customer.orders).toLocaleString('fa-IR')}
                  </span>
                  <span className="text-xs text-muted-foreground ms-1">تومان</span>
                </TableCell>
                <TableCell className="text-end">
                  <Link href={`/admin/orders?userId=${customer.id}`}>
                    <Button variant="ghost" size="sm" className="gap-2 text-indigo-600 hover:text-indigo-700 hover:bg-indigo-50">
                      <ShoppingBag className="w-4 h-4" />
                      سفارشات
                      <ArrowUpRight className="w-3 h-3 opacity-50" />
                    </Button>
                  </Link>
                </TableCell>
              </TableRow>
            ))}
            {customers.length === 0 && (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-10 text-muted-foreground">
                  مشتری یافت نشد
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
