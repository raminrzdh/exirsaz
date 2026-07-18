const fs = require('fs');

const files = [
  "src/components/admin/PostForm.tsx",
  "src/components/admin/MediaPickerModal.tsx",
  "src/components/storefront/ProductPurchaseAction.tsx",
  "src/components/storefront/ProductCardClient.tsx",
  "src/app/(storefront)/checkout/CheckoutClient.tsx",
  "src/components/storefront/MapPicker.tsx",
  "src/app/admin/media/MediaLibraryClient.tsx",
  "src/app/admin/agencies/AgencyFormModal.tsx",
  "src/app/admin/products/ProductFormClient.tsx",
  "src/app/admin/settings/geo-rules/GeoRulesClient.tsx",
  "src/components/storefront/LocationGateModal.tsx"
];

for (const file of files) {
  if (!fs.existsSync(file)) continue;
  let content = fs.readFileSync(file, 'utf8');

  if (content.includes('alert(')) {
    if (!content.includes('react-hot-toast')) {
       const importStatement = "import { toast } from 'react-hot-toast';\n";
       const lines = content.split('\n');
       let lastImportIndex = -1;
       for (let i = 0; i < lines.length; i++) {
          if (lines[i].startsWith('import ')) lastImportIndex = i;
       }
       if (lastImportIndex !== -1) {
          lines.splice(lastImportIndex + 1, 0, importStatement);
          content = lines.join('\n');
       } else {
          content = importStatement + content;
       }
    }
    
    // Success replaces
    content = content.replace(/alert\('محصول به سبد خرید اضافه شد!'\)/g, "toast.success('محصول به سبد خرید اضافه شد!')");
    content = content.replace(/alert\((status === 'published' \? 'تغییرات با موفقیت منتشر شد!' : 'تغییرات به عنوان پیش‌نویس ذخیره شد\.')\)/g, "toast.success($1)");
    content = content.replace(/alert\((status === 'published' \? 'مقاله با موفقیت منتشر شد!' : 'مقاله به عنوان پیش‌نویس ذخیره شد\.')\)/g, "toast.success($1)");
    content = content.replace(/alert\('انتقال به درگاه پرداخت در حال پیاده‌سازی است\.\.\.'\)/g, "toast.success('انتقال به درگاه پرداخت در حال پیاده‌سازی است...')");
    
    // Everything else
    content = content.replace(/alert\(/g, "toast.error(");
    
    fs.writeFileSync(file, content, 'utf8');
    console.log(`Replaced alerts in ${file}`);
  }
}
