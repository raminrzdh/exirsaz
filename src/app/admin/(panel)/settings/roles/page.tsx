import { getRolesAndPermissions } from './actions';
import RolesClient from './RolesClient';

export default async function RolesPage() {
  const { roles, permissions } = await getRolesAndPermissions();

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">مدیریت نقش‌ها و دسترسی‌ها</h1>
        <p className="text-slate-500 mt-1">سطوح دسترسی مدیران و همکاران را تعریف کنید</p>
      </div>

      <RolesClient initialRoles={roles} permissions={permissions} />
    </div>
  );
}
