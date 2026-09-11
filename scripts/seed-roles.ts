import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const PERMISSIONS = [
  { action: 'MANAGE_PRODUCTS', description: 'توانایی افزودن، ویرایش و حذف محصولات' },
  { action: 'MANAGE_ORDERS', description: 'مدیریت و تغییر وضعیت سفارشات' },
  { action: 'MANAGE_AGENCIES', description: 'تعریف و مدیریت نمایندگی‌ها و شعب' },
  { action: 'MANAGE_USERS', description: 'مدیریت نقش‌ها و سطوح دسترسی کاربران' },
  { action: 'MANAGE_SETTINGS', description: 'تغییر تنظیمات اصلی فروشگاه' },
  { action: 'VIEW_ANALYTICS', description: 'مشاهده آمار و گزارش‌های فروش' },
];

async function main() {
  console.log('Seeding permissions...');
  for (const perm of PERMISSIONS) {
    await prisma.permission.upsert({
      where: { action: perm.action },
      update: { description: perm.description },
      create: { action: perm.action, description: perm.description },
    });
  }

  console.log('Seeding SuperAdmin role...');
  const allPermissions = await prisma.permission.findMany();
  
  await prisma.role.upsert({
    where: { name: 'SuperAdmin' },
    update: {
      isSystem: true,
      description: 'مدیر کل (دسترسی کامل)',
      permissions: {
        set: allPermissions.map(p => ({ id: p.id }))
      }
    },
    create: {
      name: 'SuperAdmin',
      isSystem: true,
      description: 'مدیر کل (دسترسی کامل)',
      permissions: {
        connect: allPermissions.map(p => ({ id: p.id }))
      }
    }
  });

  console.log('Done!');
}

main()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
