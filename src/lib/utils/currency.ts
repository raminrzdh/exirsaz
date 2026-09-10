/**
 * Convert a number to a Persian localized string with thousand separators.
 * Example: 150000 -> "۱۵۰,۰۰۰"
 */
export function formatPersianNumber(num: number | string): string {
  if (num === null || num === undefined) return '';
  const numStr = num.toString();
  
  // Use Intl.NumberFormat for thousand separators and Persian digits
  return new Intl.NumberFormat('fa-IR').format(Number(numStr));
}

/**
 * Format a price in Tomans.
 * Example: 150000 -> "۱۵۰,۰۰۰ تومان"
 */
export function formatToman(price: number | string): string {
  return `${formatPersianNumber(price)} تومان`;
}

/**
 * Replace English digits with Persian digits in a string.
 */
export function toPersianDigits(str: string | number | undefined | null): string {
  if (str === undefined || str === null) return '';
  const persianDigits = ['۰', '۱', '۲', '۳', '۴', '۵', '۶', '۷', '۸', '۹'];
  return String(str).replace(/\d/g, (w) => persianDigits[parseInt(w, 10)]);
}

/**
 * Convert Persian and Arabic digits to English digits and strip all non-numeric characters.
 */
export function extractDigits(str: string | number | undefined | null): string {
  if (str === undefined || str === null) return '';
  const value = String(str);
  
  // Convert Persian and Arabic digits to English
  const englishStr = value
    .replace(/[\u0660-\u0669]/g, c => String.fromCharCode(c.charCodeAt(0) - 0x0660 + 48))
    .replace(/[\u06f0-\u06f9]/g, c => String.fromCharCode(c.charCodeAt(0) - 0x06f0 + 48));
    
  // Keep only digits
  return englishStr.replace(/\D/g, '');
}
