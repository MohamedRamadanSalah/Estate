import { Settings } from 'lucide-react';

export default function AdminSettingsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-navy">الإعدادات</h1>
        <p className="text-gray-400 mt-1">إعدادات الموقع العامة</p>
      </div>
      <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8 max-w-2xl">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 bg-gold/10 rounded-xl flex items-center justify-center">
            <Settings className="w-5 h-5 text-gold" />
          </div>
          <h2 className="text-lg font-bold text-navy">إعدادات عامة</h2>
        </div>
        <p className="text-gray-400 text-sm leading-relaxed">يمكن إضافة إعدادات الموقع هنا مثل رقم الواتساب، شعار الموقع، بيانات التواصل، وغيرها من الإعدادات.</p>
      </div>
    </div>
  );
}
