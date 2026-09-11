import { prisma } from '@/lib/db/prisma';
import UsersClient from './UsersClient';

export default async function UsersPage() {
  const users = await prisma.user.findMany({
    where: {
      roleId: { not: null }
    },
    include: {
      role: true
    },
    orderBy: { createdAt: 'desc' }
  });

  const roles = await prisma.role.findMany();

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">کاربران سیستم</h1>
        <p className="text-slate-500 mt-1">مدیریت کاربران، نمایندگان و اختصاص نقش‌ها</p>
      </div>

      <UsersClient initialUsers={users} roles={roles} />
    </div>
  );
}
