const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const agencies = [
  {
    slug: 'آذربایجان-شرقی',
    name: 'آذربایجان شرقی (تبریز)',
    company: 'شرکت توزیع پلاستیک تبریز',
    manager: 'آقای رضایی',
    phone: '۰۴۱-۳۲۲۲۲۲۲',
    mobile: '۰۹۱۴۱۱۱۱۱۱۱',
    address: 'تبریز، خیابان امام، مجتمع تجاری اطلس',
    image: 'https://exirsaz.com/wp-content/uploads/2023/04/توری-سایبان-80-درصد.jpg',
    description: 'نمایندگی رسمی محصولات اکسیرساز شمال در استان آذربایجان شرقی با بیش از ۱۰ سال سابقه درخشان در تامین نیازهای کشاورزان و گلخانه‌داران منطقه.'
  },
  {
    slug: 'اردبیل',
    name: 'اردبیل',
    company: 'پخش کشاورزی سبلان',
    manager: 'آقای حسینی',
    phone: '۰۴۵-۳۳۳۳۳۳۳',
    mobile: '۰۹۱۴۲۲۲۲۲۲۲',
    address: 'اردبیل، بلوار کشاورز',
    image: 'https://exirsaz.com/wp-content/uploads/2023/02/توری-سایبان-شید-گلخانه.jpg',
    description: 'بزرگترین مرکز پخش انواع توری سایبان و کیسه راشل در استان اردبیل.'
  },
  {
    slug: 'اصفهان',
    name: 'اصفهان',
    company: 'تجهیزات گلخانه‌ای زاینده‌رود',
    manager: 'آقای محمدی',
    phone: '۰۳۱-۳۴۴۴۴۴۴',
    mobile: '۰۹۱۳۳۳۳۳۳۳۳',
    address: 'اصفهان، شهرک صنعتی دولت آباد',
    image: 'https://exirsaz.com/wp-content/uploads/2023/04/توری-سایبان-80-درصد.jpg',
    description: 'ارائه دهنده راهکارهای نوین سایبان و پوشش گلخانه در قلب ایران.'
  },
  {
    slug: 'البرز',
    name: 'البرز (کرج)',
    company: 'البرز پلاست',
    manager: 'آقای کریمی',
    phone: '۰۲۶-۳۵۵۵۵۵۵',
    mobile: '۰۹۱۲۴۴۴۴۴۴۴',
    address: 'کرج، جاده قزلحصار',
    image: 'https://exirsaz.com/wp-content/uploads/2023/02/توری-سایبان-شید-گلخانه.jpg',
    description: 'نماینده انحصاری محصولات بسته بندی و ساختمانی در استان البرز.'
  },
  {
    slug: 'بوشهر',
    name: 'بوشهر',
    company: 'نخل خلیج فارس',
    manager: 'آقای دشتی',
    phone: '۰۷۷-۳۶۶۶۶۶۶',
    mobile: '۰۹۱۷۵۵۵۵۵۵۵',
    address: 'بوشهر، خیابان مطهری',
    image: 'https://exirsaz.com/wp-content/uploads/2023/04/توری-سایبان-80-درصد.jpg',
    description: 'تامین کننده کیسه خرما و محصولات پلیمری کشاورزی جنوب کشور.'
  },
  {
    slug: 'تهران',
    name: 'تهران',
    company: 'بازرگانی اکسیر پایتخت',
    manager: 'آقای احمدی',
    phone: '۰۲۱-۳۷۷۷۷۷۷',
    mobile: '۰۹۱۲۶۶۶۶۶۶۶',
    address: 'تهران، بازار آهن شادآباد',
    image: 'https://exirsaz.com/wp-content/uploads/2023/02/توری-سایبان-شید-گلخانه.jpg',
    description: 'مرکز اصلی پخش توری‌های ایمنی ساختمان و سایبان در استان تهران.'
  },
  {
    slug: 'خراسان-جنوبی',
    name: 'خراسان جنوبی (بیرجند)',
    company: 'کویر پلاست',
    manager: 'آقای قاینی',
    phone: '۰۵۶-۳۸۸۸۸۸۸',
    mobile: '۰۹۱۵۷۷۷۷۷۷۷',
    address: 'بیرجند، شهرک صنعتی',
    image: 'https://exirsaz.com/wp-content/uploads/2023/04/توری-سایبان-80-درصد.jpg',
    description: 'تامین کننده توری‌های زرشک و محصولات کشاورزی خراسان جنوبی.'
  },
  {
    slug: 'مشهد',
    name: 'خراسان رضوی (مشهد)',
    company: 'پخش طوس',
    manager: 'آقای علوی',
    phone: '۰۵۱-۳۹۹۹۹۹۹',
    mobile: '۰۹۱۵۸۸۸۸۸۸۸',
    address: 'مشهد، بلوار کشاورز',
    image: 'https://exirsaz.com/wp-content/uploads/2023/02/توری-سایبان-شید-گلخانه.jpg',
    description: 'بزرگترین نماینده محصولات پلیمری و بسته‌بندی در شرق کشور.'
  },
  {
    slug: 'فارس',
    name: 'فارس (شیراز)',
    company: 'پارس پلاستیک',
    manager: 'آقای شیرازی',
    phone: '۰۷۱-۳۱۱۱۱۱۱',
    mobile: '۰۹۱۷۹۹۹۹۹۹۹',
    address: 'شیراز، شهرک صنعتی بزرگ شیراز',
    image: 'https://exirsaz.com/wp-content/uploads/2023/04/توری-سایبان-80-درصد.jpg',
    description: 'نمایندگی معتبر اکسیرساز شمال در استان فارس برای محصولات مرکبات.'
  },
  {
    slug: 'گیلان',
    name: 'گیلان (رشت)',
    company: 'کاسپین پلاست',
    manager: 'آقای گیلانی',
    phone: '۰۱۳-۳۲۲۲۲۲۲',
    mobile: '۰۹۱۱۱۱۱۱۱۱۱',
    address: 'رشت، جاده انزلی',
    image: 'https://exirsaz.com/wp-content/uploads/2023/02/توری-سایبان-شید-گلخانه.jpg',
    description: 'پخش عمده توری‌های ایمنی و راشل در استان سرسبز گیلان.'
  },
  {
    slug: 'هرمزگان',
    name: 'هرمزگان (بندرعباس)',
    company: 'پخش جنوب',
    manager: 'آقای بندری',
    phone: '۰۷۶-۳۳۳۳۳۳۳',
    mobile: '۰۹۱۷۲۲۲۲۲۲۲',
    address: 'بندرعباس، بلوار پاسداران',
    image: 'https://exirsaz.com/wp-content/uploads/2023/04/توری-سایبان-80-درصد.jpg',
    description: 'نماینده فعال جنوب کشور برای توری‌های ضدتبخیر استخر و کیسه خرما.'
  },
  {
    slug: 'یزد',
    name: 'یزد',
    company: 'یزد پلاست',
    manager: 'آقای یزدی',
    phone: '۰۳۵-۳۴۴۴۴۴۴',
    mobile: '۰۹۱۳۴۴۴۴۴۴۴',
    address: 'یزد، شهرک صنعتی یزد',
    image: 'https://exirsaz.com/wp-content/uploads/2023/02/توری-سایبان-شید-گلخانه.jpg',
    description: 'نماینده فروش انواع توری سایبان و محصولات کشاورزی در استان یزد.'
  }
];

async function main() {
  console.log("Emptying old agencies that don't have slugs (or all)...");
  await prisma.agency.deleteMany({});
  console.log("Seeding 12 agencies...");

  for (const agency of agencies) {
    await prisma.agency.create({
      data: agency
    });
  }

  console.log("Successfully seeded 12 agencies.");
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
