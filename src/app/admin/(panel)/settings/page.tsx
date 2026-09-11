import { getGeneralSettings } from './actions';
import GeneralSettingsClient from './GeneralSettingsClient';

export default async function SettingsPage() {
  const settings = await getGeneralSettings();

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">تنظیمات عمومی</h1>
        <p className="text-slate-500 mt-1">پیکربندی پایه سیستم و فروشگاه</p>
      </div>

      <GeneralSettingsClient initialData={settings} />
    </div>
  );
}
