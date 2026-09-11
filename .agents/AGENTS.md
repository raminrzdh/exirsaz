
## Persian Digits Rule
- As a strict rule, ALL numbers displayed in the UI must be in Persian digits. Use the `toPersianDigits` utility function from `@/lib/utils/currency` or equivalent to convert English numbers to Persian before rendering them in the view. Do not use CSS-only solutions for this as they might not be fully supported. Keep inputs logic with English digits but displayed as Persian if possible.

## Admin Panel Responsiveness
- As a strict rule, ALL content and pages built for the admin panel must be optimized and responsive for mobile and tablet devices. Ensure tables use `overflow-x-auto` or hide non-critical columns on small screens, and layouts collapse properly.
