import { format } from 'date-fns-jalali';

/**
 * Format a Date object or ISO string to Jalali date string.
 * Example: '1402/05/24'
 */
export function formatJalaliDate(date: Date | string | number, formatStr: string = 'yyyy/MM/dd'): string {
  if (!date) return '';
  const d = new Date(date);
  return format(d, formatStr);
}

/**
 * Format a Date object or ISO string to a full Persian DateTime string.
 * Example: '۲۴ مرداد ۱۴۰۲، ساعت ۱۵:۳۰'
 */
export function formatJalaliDateTime(date: Date | string | number): string {
  if (!date) return '';
  const d = new Date(date);
  return format(d, 'd MMMM yyyy، ساعت HH:mm');
}
