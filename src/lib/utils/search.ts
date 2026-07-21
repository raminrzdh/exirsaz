export function normalizePersianText(text: string): string {
  if (!text) return '';
  return text
    .replace(/ي/g, 'ی')
    .replace(/ك/g, 'ک')
    .replace(/ة/g, 'ه')
    .replace(/\u200C/g, ' ') // Replace zero-width non-joiner with space for broader matching
    .toLowerCase()
    .trim();
}
