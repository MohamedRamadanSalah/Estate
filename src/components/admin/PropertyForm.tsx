'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import {
  Upload,
  X,
  Loader2,
  GripVertical,
  ImageIcon,
} from 'lucide-react';
import {
  PROPERTY_TYPES,
  ACCOMMODATION_TYPES,
  PAYMENT_METHODS,
  STATUS_OPTIONS,
  FINISHING_STATUS,
  FURNISHED_OPTIONS,
} from '@/types';

interface PropertyFormProps {
  property?: {
    unitCode: string;
    governorateId: number;
    cityId: number;
    district: string;
    locationLat: number | null;
    locationLng: number | null;
    projectName: string;
    developerId: number;
    developer: { nameAr: string };
    propertyType: string;
    accommodationType: string;
    totalArea: { toString: () => string };
    pricePerSqm: { toString: () => string };
    totalPrice: { toString: () => string };
    paymentMethod: string;
    installmentDetails: string | null;
    bedroomsCount: number;
    bathroomsCount: number;
    livingRoomsCount: number | null;
    floorNumber: number | null;
    totalFloors: number | null;
    hasSwimmingPool: boolean;
    hasGarden: boolean;
    isFurnished: string;
    hasAirConditioning: boolean;
    finishingStatus: string | null;
    status: string;
    marketingDescription: string;
    images: string[];
    videoUrl: string | null;
    extraFeatures: string[];
  };
}

export default function PropertyForm({ property }: PropertyFormProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [governorates, setGovernorates] = useState<{ id: number; nameAr: string; slug: string; cities: { id: number; nameAr: string }[] }[]>([]);
  const [form, setForm] = useState({
    governorateId: property?.governorateId || '',
    cityId: property?.cityId || '',
    district: property?.district || '',
    locationLat: property?.locationLat?.toString() || '',
    locationLng: property?.locationLng?.toString() || '',
    projectName: property?.projectName || '',
    developerId: property?.developerId || '',
    developerName: property?.developer?.nameAr || '',
    propertyType: property?.propertyType || 'شقة',
    accommodationType: property?.accommodationType || 'سكن خاص',
    totalArea: property?.totalArea?.toString() || '',
    pricePerSqm: property?.pricePerSqm?.toString() || '',
    totalPrice: property?.totalPrice?.toString() || '',
    paymentMethod: property?.paymentMethod || 'كاش بالكامل',
    installmentDetails: property?.installmentDetails || '',
    bedroomsCount: property?.bedroomsCount || 1,
    bathroomsCount: property?.bathroomsCount || 1,
    livingRoomsCount: property?.livingRoomsCount || '',
    floorNumber: property?.floorNumber || '',
    totalFloors: property?.totalFloors || '',
    hasSwimmingPool: property?.hasSwimmingPool ?? false,
    hasGarden: property?.hasGarden ?? false,
    isFurnished: property?.isFurnished || 'غير مفروشة',
    hasAirConditioning: property?.hasAirConditioning ?? false,
    finishingStatus: property?.finishingStatus || '',
    status: property?.status || 'متاحة للبيع',
    marketingDescription: property?.marketingDescription || '',
    images: property?.images || [],
    videoUrl: property?.videoUrl || '',
    extraFeatures: property?.extraFeatures || [],
  });

  const cities = governorates.find((g) => g.id === Number(form.governorateId))?.cities || [];

  useEffect(() => {
    fetch('/api/governorates')
      .then((r) => r.json())
      .then((data) => {
        if (Array.isArray(data)) setGovernorates(data);
      })
      .catch(() => {
        console.error('Failed to fetch governorates');
      });
  }, []);

  useEffect(() => {
    if (form.totalArea && form.pricePerSqm) {
      const total = parseFloat(form.totalArea) * parseFloat(form.pricePerSqm);
      setForm((f) => ({ ...f, totalPrice: total.toFixed(0) }));
    }
  }, [form.totalArea, form.pricePerSqm]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const payload = {
        ...form,
        governorateId: Number(form.governorateId),
        cityId: Number(form.cityId),
        totalArea: parseFloat(form.totalArea),
        pricePerSqm: parseFloat(form.pricePerSqm),
        totalPrice: parseFloat(form.totalPrice),
        bedroomsCount: Number(form.bedroomsCount),
        bathroomsCount: Number(form.bathroomsCount),
        livingRoomsCount: form.livingRoomsCount ? Number(form.livingRoomsCount) : null,
        floorNumber: form.floorNumber ? Number(form.floorNumber) : null,
        totalFloors: form.totalFloors ? Number(form.totalFloors) : null,
        developerName: form.developerName || form.developerId,
      };
      const url = property ? `/api/admin/properties/${property.unitCode}` : '/api/admin/properties';
      const method = property ? 'PUT' : 'POST';
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error(await res.text());
      router.push('/admin/properties');
      router.refresh();
    } catch (err) {
      alert('فشل الحفظ: ' + String(err));
    } finally {
      setLoading(false);
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    setUploadingImages(true);
    try {
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const fd = new FormData();
        fd.append('file', file);
        const res = await fetch('/api/upload', { method: 'POST', body: fd });
        const data = await res.json();
        if (data.url) setForm((f) => ({ ...f, images: [...f.images, data.url] }));
      }
    } catch {
      alert('فشل رفع بعض الصور');
    } finally {
      setUploadingImages(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(true);
  };

  const handleDragLeave = () => setDragOver(false);

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    const files = e.dataTransfer.files;
    if (!files.length) return;
    setUploadingImages(true);
    try {
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        if (!file.type.startsWith('image/')) continue;
        const fd = new FormData();
        fd.append('file', file);
        const res = await fetch('/api/upload', { method: 'POST', body: fd });
        const data = await res.json();
        if (data.url) setForm((f) => ({ ...f, images: [...f.images, data.url] }));
      }
    } catch {
      alert('فشل رفع بعض الصور');
    } finally {
      setUploadingImages(false);
    }
  };

  const removeImage = (index: number) => {
    setForm((f) => ({ ...f, images: f.images.filter((_, j) => j !== index) }));
  };

  const moveImage = (from: number, to: number) => {
    setForm((f) => {
      const images = [...f.images];
      const [moved] = images.splice(from, 1);
      images.splice(to, 0, moved);
      return { ...f, images };
    });
  };

  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploadingImages, setUploadingImages] = useState(false);
  const [dragOver, setDragOver] = useState(false);

  const generateAI = async () => {
    const desc = `عقار ${form.propertyType} في ${form.projectName} بمنطقة ${form.district}. المساحة ${form.totalArea} م². ${form.bedroomsCount} غرف نوم و${form.bathroomsCount} حمام. ${form.hasSwimmingPool ? 'يوجد حمام سباحة.' : ''} ${form.hasGarden ? 'حديقة خاصة.' : ''} السعر ${form.totalPrice} جنيه مصري. فرصة استثمارية مميزة.`;
    setForm((f) => ({ ...f, marketingDescription: desc }));
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8 max-w-4xl">
      {property && (
        <p className="text-gray">كود الوحدة: <span className="font-mono font-bold">{property.unitCode}</span></p>
      )}
      <section className="bg-white rounded-xl shadow-lg p-6">
        <h2 className="text-xl font-bold text-navy mb-4">الموقع</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm mb-1">المحافظة *</label>
            <select
              value={form.governorateId}
              onChange={(e) => setForm({ ...form, governorateId: e.target.value, cityId: '' })}
              required
              disabled={!!property}
              className="w-full px-4 py-2 rounded-lg border disabled:opacity-60"
            >
              <option value="">اختر</option>
              {governorates.map((g) => (
                <option key={g.id} value={g.id}>{g.nameAr}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm mb-1">المدينة *</label>
            <select
              value={form.cityId}
              onChange={(e) => setForm({ ...form, cityId: e.target.value })}
              required
              disabled={!!property}
              className="w-full px-4 py-2 rounded-lg border disabled:opacity-60"
            >
              <option value="">اختر</option>
              {cities.map((c) => (
                <option key={c.id} value={c.id}>{c.nameAr}</option>
              ))}
            </select>
          </div>
          <div className="md:col-span-2">
            <label className="block text-sm mb-1">المنطقة / الحي *</label>
            <input
              value={form.district}
              onChange={(e) => setForm({ ...form, district: e.target.value })}
              required
              className="w-full px-4 py-2 rounded-lg border"
            />
          </div>
          <div>
            <label className="block text-sm mb-1">اسم المشروع / الكمبوند *</label>
            <input
              value={form.projectName}
              onChange={(e) => setForm({ ...form, projectName: e.target.value })}
              required
              className="w-full px-4 py-2 rounded-lg border"
            />
          </div>
          <div>
            <label className="block text-sm mb-1">اسم المطور *</label>
            <input
              value={form.developerName}
              onChange={(e) => setForm({ ...form, developerName: e.target.value })}
              required
              placeholder="أو اختر من القائمة"
              className="w-full px-4 py-2 rounded-lg border"
            />
          </div>
          <div>
            <label className="block text-sm mb-1">خط العرض</label>
            <input
              type="number"
              step="any"
              value={form.locationLat}
              onChange={(e) => setForm({ ...form, locationLat: e.target.value })}
              className="w-full px-4 py-2 rounded-lg border"
            />
          </div>
          <div>
            <label className="block text-sm mb-1">خط الطول</label>
            <input
              type="number"
              step="any"
              value={form.locationLng}
              onChange={(e) => setForm({ ...form, locationLng: e.target.value })}
              className="w-full px-4 py-2 rounded-lg border"
            />
          </div>
        </div>
      </section>

      <section className="bg-white rounded-xl shadow-lg p-6">
        <h2 className="text-xl font-bold text-navy mb-4">بيانات العقار</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm mb-1">نوع العقار *</label>
            <select
              value={form.propertyType}
              onChange={(e) => setForm({ ...form, propertyType: e.target.value })}
              required
              className="w-full px-4 py-2 rounded-lg border"
            >
              {PROPERTY_TYPES.map((t) => (
                <option key={t} value={t}>{t}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm mb-1">نوع الإقامة *</label>
            <select
              value={form.accommodationType}
              onChange={(e) => setForm({ ...form, accommodationType: e.target.value })}
              required
              className="w-full px-4 py-2 rounded-lg border"
            >
              {ACCOMMODATION_TYPES.map((t) => (
                <option key={t} value={t}>{t}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm mb-1">حالة الوحدة *</label>
            <select
              value={form.status}
              onChange={(e) => setForm({ ...form, status: e.target.value })}
              required
              className="w-full px-4 py-2 rounded-lg border"
            >
              {STATUS_OPTIONS.map((t) => (
                <option key={t} value={t}>{t}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm mb-1">الطابق</label>
            <input
              type="number"
              value={form.floorNumber}
              onChange={(e) => setForm({ ...form, floorNumber: e.target.value })}
              className="w-full px-4 py-2 rounded-lg border"
            />
          </div>
          <div>
            <label className="block text-sm mb-1">عدد الطوابق الكلية</label>
            <input
              type="number"
              value={form.totalFloors}
              onChange={(e) => setForm({ ...form, totalFloors: e.target.value })}
              className="w-full px-4 py-2 rounded-lg border"
            />
          </div>
        </div>
      </section>

      <section className="bg-white rounded-xl shadow-lg p-6">
        <h2 className="text-xl font-bold text-navy mb-4">المساحة والتسعير</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm mb-1">المساحة الكلية (م²) *</label>
            <input
              type="number"
              step="0.01"
              value={form.totalArea}
              onChange={(e) => setForm({ ...form, totalArea: e.target.value })}
              required
              className="w-full px-4 py-2 rounded-lg border"
            />
          </div>
          <div>
            <label className="block text-sm mb-1">سعر المتر (EGP) *</label>
            <input
              type="number"
              step="0.01"
              value={form.pricePerSqm}
              onChange={(e) => setForm({ ...form, pricePerSqm: e.target.value })}
              required
              className="w-full px-4 py-2 rounded-lg border"
            />
          </div>
          <div>
            <label className="block text-sm mb-1">السعر الإجمالي (EGP) *</label>
            <input
              type="number"
              step="0.01"
              value={form.totalPrice}
              onChange={(e) => setForm({ ...form, totalPrice: e.target.value })}
              required
              className="w-full px-4 py-2 rounded-lg border"
            />
          </div>
          <div>
            <label className="block text-sm mb-1">طريقة السداد *</label>
            <select
              value={form.paymentMethod}
              onChange={(e) => setForm({ ...form, paymentMethod: e.target.value })}
              required
              className="w-full px-4 py-2 rounded-lg border"
            >
              {PAYMENT_METHODS.map((t) => (
                <option key={t} value={t}>{t}</option>
              ))}
            </select>
          </div>
          <div className="md:col-span-2">
            <label className="block text-sm mb-1">تفاصيل التقسيط</label>
            <textarea
              value={form.installmentDetails}
              onChange={(e) => setForm({ ...form, installmentDetails: e.target.value })}
              rows={2}
              placeholder="مثال: مقدم 20% + 8 سنوات بدون فوائد"
              className="w-full px-4 py-2 rounded-lg border"
            />
          </div>
        </div>
      </section>

      <section className="bg-white rounded-xl shadow-lg p-6">
        <h2 className="text-xl font-bold text-navy mb-4">تفاصيل الوحدة</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm mb-1">عدد الغرف *</label>
            <input
              type="number"
              min={1}
              max={10}
              value={form.bedroomsCount}
              onChange={(e) => setForm({ ...form, bedroomsCount: Number(e.target.value) })}
              required
              className="w-full px-4 py-2 rounded-lg border"
            />
          </div>
          <div>
            <label className="block text-sm mb-1">عدد الحمامات *</label>
            <input
              type="number"
              min={1}
              max={6}
              value={form.bathroomsCount}
              onChange={(e) => setForm({ ...form, bathroomsCount: Number(e.target.value) })}
              required
              className="w-full px-4 py-2 rounded-lg border"
            />
          </div>
          <div>
            <label className="block text-sm mb-1">عدد الصالات</label>
            <input
              type="number"
              min={0}
              max={4}
              value={form.livingRoomsCount}
              onChange={(e) => setForm({ ...form, livingRoomsCount: e.target.value })}
              className="w-full px-4 py-2 rounded-lg border"
            />
          </div>
          <div>
            <label className="block text-sm mb-1">حالة التشطيب</label>
            <select
              value={form.finishingStatus}
              onChange={(e) => setForm({ ...form, finishingStatus: e.target.value })}
              className="w-full px-4 py-2 rounded-lg border"
            >
              <option value="">--</option>
              {FINISHING_STATUS.map((t) => (
                <option key={t} value={t}>{t}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm mb-1">التأثيث *</label>
            <select
              value={form.isFurnished}
              onChange={(e) => setForm({ ...form, isFurnished: e.target.value })}
              required
              className="w-full px-4 py-2 rounded-lg border"
            >
              {FURNISHED_OPTIONS.map((t) => (
                <option key={t} value={t}>{t}</option>
              ))}
            </select>
          </div>
          <div className="flex items-center gap-4">
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={form.hasSwimmingPool}
                onChange={(e) => setForm({ ...form, hasSwimmingPool: e.target.checked })}
              />
              حمام سباحة
            </label>
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={form.hasGarden}
                onChange={(e) => setForm({ ...form, hasGarden: e.target.checked })}
              />
              حديقة خاصة
            </label>
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={form.hasAirConditioning}
                onChange={(e) => setForm({ ...form, hasAirConditioning: e.target.checked })}
              />
              تكييف
            </label>
          </div>
        </div>
      </section>

      <section className="bg-white rounded-xl shadow-lg p-6">
        <h2 className="text-xl font-bold text-navy mb-4">الوصف والوسائط</h2>
        <div className="space-y-6">
          <div>
            <div className="flex justify-between items-center mb-2">
              <label className="block text-sm font-medium">الوصف التسويقي *</label>
              <button type="button" onClick={generateAI} className="text-sm text-gold hover:underline">
                توليد بالذكاء الاصطناعي
              </button>
            </div>
            <textarea
              value={form.marketingDescription}
              onChange={(e) => setForm({ ...form, marketingDescription: e.target.value })}
              required
              rows={6}
              className="w-full px-4 py-2 rounded-lg border"
            />
          </div>

          {/* Image Upload Section */}
          <div>
            <label className="block text-sm font-medium mb-2">الصور (1-20)</label>

            {/* Drop Zone */}
            <div
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
              className={`relative border-2 border-dashed rounded-2xl p-8 text-center cursor-pointer transition-all duration-200 ${
                dragOver
                  ? 'border-gold bg-gold/5 scale-[1.01]'
                  : 'border-gray-300 hover:border-gold/50 hover:bg-gray-50'
              }`}
            >
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                multiple
                onChange={handleImageUpload}
                className="hidden"
              />
              {uploadingImages ? (
                <div className="flex flex-col items-center gap-2">
                  <Loader2 className="w-10 h-10 text-gold animate-spin" />
                  <p className="text-sm text-gray-500">جاري رفع الصور...</p>
                </div>
              ) : (
                <div className="flex flex-col items-center gap-2">
                  <div className="w-14 h-14 bg-gold/10 rounded-2xl flex items-center justify-center">
                    <Upload className="w-7 h-7 text-gold" />
                  </div>
                  <p className="text-sm font-medium text-navy">اسحب الصور هنا أو اضغط للاختيار</p>
                  <p className="text-xs text-gray-400">PNG, JPG, WEBP — حتى 20 صورة</p>
                </div>
              )}
            </div>

            {/* Image Gallery */}
            {form.images.length > 0 && (
              <div className="mt-4">
                <div className="flex items-center justify-between mb-3">
                  <p className="text-sm text-gray-500">
                    <span className="font-bold text-navy">{form.images.length}</span> صورة مرفوعة
                  </p>
                  <p className="text-xs text-gray-400">الصورة الأولى هي الصورة الرئيسية</p>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
                  {form.images.map((url, i) => (
                    <div
                      key={i}
                      className={`group relative aspect-square rounded-xl overflow-hidden border-2 transition-all duration-200 ${
                        i === 0 ? 'border-gold shadow-lg ring-2 ring-gold/20' : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <Image
                        src={url}
                        alt={`صورة ${i + 1}`}
                        fill
                        className="object-cover"
                        sizes="(max-width: 768px) 50vw, 20vw"
                        unoptimized
                      />

                      {/* Main image badge */}
                      {i === 0 && (
                        <div className="absolute top-2 right-2 bg-gold text-navy text-[10px] font-bold px-2 py-0.5 rounded-md shadow">
                          الرئيسية
                        </div>
                      )}

                      {/* Hover overlay with actions */}
                      <div className="absolute inset-0 bg-navy/60 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center gap-2">
                        {/* Move buttons */}
                        {i > 0 && (
                          <button
                            type="button"
                            onClick={(e) => { e.stopPropagation(); moveImage(i, i - 1); }}
                            className="w-8 h-8 bg-white/90 rounded-lg flex items-center justify-center hover:bg-white transition-colors"
                            title="تقديم"
                          >
                            <GripVertical className="w-4 h-4 text-navy" />
                          </button>
                        )}
                        {/* Delete button */}
                        <button
                          type="button"
                          onClick={(e) => { e.stopPropagation(); removeImage(i); }}
                          className="w-8 h-8 bg-red-500 rounded-lg flex items-center justify-center hover:bg-red-600 transition-colors shadow"
                          title="حذف"
                        >
                          <X className="w-4 h-4 text-white" />
                        </button>
                      </div>

                      {/* Image number */}
                      <div className="absolute bottom-2 left-2 bg-navy/70 text-white text-[10px] font-bold w-5 h-5 rounded flex items-center justify-center">
                        {i + 1}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* No images placeholder */}
            {form.images.length === 0 && !uploadingImages && (
              <div className="mt-3 flex items-center gap-2 text-xs text-gray-400">
                <ImageIcon className="w-4 h-4" />
                <span>لم يتم رفع أي صور بعد</span>
              </div>
            )}
          </div>

          <div>
            <label className="block text-sm mb-1">رابط الفيديو</label>
            <input
              type="url"
              value={form.videoUrl}
              onChange={(e) => setForm({ ...form, videoUrl: e.target.value })}
              placeholder="YouTube أو Vimeo"
              className="w-full px-4 py-2 rounded-lg border"
            />
          </div>
          <div>
            <label className="block text-sm mb-1">مميزات إضافية (مفصولة بفاصلة)</label>
            <input
              value={(form.extraFeatures as string[]).join('، ')}
              onChange={(e) => setForm({ ...form, extraFeatures: e.target.value.split(/[،,]/).map((s) => s.trim()).filter(Boolean) })}
              placeholder="جراج، أمن 24 ساعة، مصعد..."
              className="w-full px-4 py-2 rounded-lg border"
            />
          </div>
        </div>
      </section>

      <button
        type="submit"
        disabled={loading}
        className="px-10 py-3.5 bg-gold text-navy font-bold rounded-xl hover:bg-copper disabled:opacity-50 shadow-lg hover:shadow-xl transition-all duration-200 text-base"
      >
        {loading ? (
          <span className="flex items-center gap-2">
            <Loader2 className="w-5 h-5 animate-spin" />
            جاري الحفظ...
          </span>
        ) : property ? 'تحديث الوحدة' : 'حفظ الوحدة'}
      </button>
    </form>
  );
}
