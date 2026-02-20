import PropertyForm from '@/components/admin/PropertyForm';

export default function NewPropertyPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-navy">إضافة وحدة جديدة</h1>
        <p className="text-gray-400 mt-1">أدخل بيانات الوحدة العقارية</p>
      </div>
      <PropertyForm />
    </div>
  );
}
