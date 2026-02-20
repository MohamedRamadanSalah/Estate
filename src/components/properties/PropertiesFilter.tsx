'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

interface City {
  id: number;
  nameAr: string;
  slug: string;
}

interface Props {
  initialGovernorate?: string;
  cities?: City[];
}

export default function PropertiesFilter({ initialGovernorate, cities: initialCities }: Props = {}) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [governorates, setGovernorates] = useState<{ id: number; nameAr: string; slug: string; cities: City[] }[]>([]);
  const [cities, setCities] = useState<City[]>(initialCities || []);
  const [loading, setLoading] = useState(true);

  const governorateParam = searchParams.get('governorate') || initialGovernorate || '';
  const cityIdParam = searchParams.get('cityId') || '';

  useEffect(() => {
    fetch('/api/governorates')
      .then((r) => r.json())
      .then((data) => {
        setGovernorates(data);
        const gov = data.find((g: { slug: string }) => g.slug === governorateParam);
        setCities(initialCities || gov?.cities || []);
        setLoading(false);
      });
  }, [governorateParam, initialCities]);

  const handleGovernorateChange = (slug: string) => {
    const gov = governorates.find((g) => g.slug === slug);
    setCities(gov?.cities || []);
  };

  const handleApply = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const fd = new FormData(form);
    const params = new URLSearchParams();
    const q = searchParams.get('q');
    if (q) params.set('q', q);
    const gov = fd.get('governorate') as string;
    if (gov) params.set('governorate', gov);
    const city = fd.get('cityId') as string;
    if (city) params.set('cityId', city);
    const type = fd.get('type') as string;
    if (type) params.set('type', type);
    const minP = fd.get('minPrice') as string;
    if (minP) params.set('minPrice', minP);
    const maxP = fd.get('maxPrice') as string;
    if (maxP) params.set('maxPrice', maxP);
    const minA = fd.get('minArea') as string;
    if (minA) params.set('minArea', minA);
    const maxA = fd.get('maxArea') as string;
    if (maxA) params.set('maxArea', maxA);
    const pool = fd.get('hasPool') as string;
    if (pool) params.set('hasPool', pool);
    const garden = fd.get('hasGarden') as string;
    if (garden) params.set('hasGarden', garden);
    router.push(`/properties?${params.toString()}`);
  };

  if (loading) return <div className="animate-pulse h-64 bg-gray-200 rounded-xl" />;

  return (
    <form onSubmit={handleApply} className="bg-white rounded-xl shadow-lg p-4 space-y-4">
      <h3 className="font-bold text-navy">تصفية النتائج</h3>
      <div>
        <label className="block text-sm text-gray mb-1">المحافظة</label>
        <select
          name="governorate"
          defaultValue={governorateParam}
          onChange={(e) => handleGovernorateChange(e.target.value)}
          className="w-full px-3 py-2 rounded-lg border border-gray-200"
        >
          <option value="">الكل</option>
          {governorates.map((g) => (
            <option key={g.id} value={g.slug}>{g.nameAr}</option>
          ))}
        </select>
      </div>
      <div>
        <label className="block text-sm text-gray mb-1">المدينة</label>
        <select name="cityId" defaultValue={cityIdParam} className="w-full px-3 py-2 rounded-lg border border-gray-200">
          <option value="">الكل</option>
          {cities.map((c) => (
            <option key={c.id} value={c.id}>{c.nameAr}</option>
          ))}
        </select>
      </div>
      <div>
        <label className="block text-sm text-gray mb-1">نوع العقار</label>
        <select name="type" defaultValue={searchParams.get('type') || ''} className="w-full px-3 py-2 rounded-lg border border-gray-200">
          <option value="">الكل</option>
          <option value="شقة">شقة</option>
          <option value="فيلا">فيلا</option>
          <option value="دوبلكس">دوبلكس</option>
          <option value="بنتهاوس">بنتهاوس</option>
          <option value="شاليه">شاليه</option>
          <option value="أرض">أرض</option>
        </select>
      </div>
      <div>
        <label className="block text-sm text-gray mb-1">أقل سعر (EGP)</label>
        <input type="number" name="minPrice" defaultValue={searchParams.get('minPrice') || ''} placeholder="0" className="w-full px-3 py-2 rounded-lg border border-gray-200" />
      </div>
      <div>
        <label className="block text-sm text-gray mb-1">أعلى سعر (EGP)</label>
        <input type="number" name="maxPrice" defaultValue={searchParams.get('maxPrice') || ''} placeholder="0" className="w-full px-3 py-2 rounded-lg border border-gray-200" />
      </div>
      <div>
        <label className="block text-sm text-gray mb-1">أقل مساحة (م²)</label>
        <input type="number" name="minArea" defaultValue={searchParams.get('minArea') || ''} placeholder="0" className="w-full px-3 py-2 rounded-lg border border-gray-200" />
      </div>
      <div>
        <label className="block text-sm text-gray mb-1">أعلى مساحة (م²)</label>
        <input type="number" name="maxArea" defaultValue={searchParams.get('maxArea') || ''} placeholder="0" className="w-full px-3 py-2 rounded-lg border border-gray-200" />
      </div>
      <div>
        <label className="block text-sm text-gray mb-1">حمام سباحة</label>
        <select name="hasPool" defaultValue={searchParams.get('hasPool') || ''} className="w-full px-3 py-2 rounded-lg border border-gray-200">
          <option value="">الكل</option>
          <option value="true">نعم</option>
          <option value="false">لا</option>
        </select>
      </div>
      <div>
        <label className="block text-sm text-gray mb-1">حديقة خاصة</label>
        <select name="hasGarden" defaultValue={searchParams.get('hasGarden') || ''} className="w-full px-3 py-2 rounded-lg border border-gray-200">
          <option value="">الكل</option>
          <option value="true">نعم</option>
          <option value="false">لا</option>
        </select>
      </div>
      <button type="submit" className="w-full py-2 bg-gold text-navy font-semibold rounded-lg hover:bg-copper">
        تطبيق التصفية
      </button>
    </form>
  );
}
