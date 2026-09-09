"use client";

import { Printer } from 'lucide-react';
import { Button } from '@/components/ui/button';

export function PrintButton() {
  return (
    <Button 
      variant="outline" 
      className="gap-2 text-slate-700 bg-white"
      onClick={() => window.print()}
    >
      <Printer className="w-4 h-4" />
      چاپ فاکتور
    </Button>
  );
}
