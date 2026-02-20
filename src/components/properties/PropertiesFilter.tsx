'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { motion } from 'framer-motion';
import { SlidersHorizontal, ChevronDown, X, Droplets, Trees } from 'lucide-react';

interface City {
  id: number;
  nameAr: string;
  slug: string;
}

interface Props {
  initialGovernorate?: string;
  cities?: City[];
}

const propertyTypes = [
  { value: '', label: 'الكل' },
  { value: 'شقة', label: 'شقة' },
  { value: 'فيلا', label: 'فيلا' },
  { value: 'دوبلكس', label: 'دوبلكس' },
  { value: 'بنتهاوس', label: 'بنتهاوس' },
  { value: 'شاليه', label: 'شاليه' },
  { value: 'مكتب', label: 'مكتب' },
  { value: 'محل تجاري', label: 'محل تجاري' },
  { value: 'أرض', label: 'أرض' },
];

export default function PropertiesFilter({ initialGovernorate, cities: initialCities }: Props = {}) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [governorates, setGovernorates] = useState<{ id: number; nameAr: string; slug: string; cities: City[] }[]>([]);
  const [cities, setCities] = useState<City[]>(initialCities || []);
  const [loading, setLoading] = useState(true);
  const [showMobileFilter, setShowMobileFilter] = useState(false);

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

  const activeFilters = Array.from(searchParams.entries()).filter(
    ([key]) => !['page', 'sort'].includes(key)
  );

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
    setShowMobileFilter(false);
  };

  const clearFilters = () => {
    router.push('/properties');
    setShowMobileFilter(false);
  };

  if (loading) {
    return (
      <div className="bg-white rounded-2xl shadow-lg p-5 space-y-4">
        <div className="skeleton h-5 w-28" />
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="space-y-1">
            <div className="skeleton h-3 w-20" />
            <div className="skeleton h-10 w-full rounded-lg" />
          </div>
        ))}
        <div className="skeleton h-10 w-full rounded-lg" />
      </div>
    );
  }

  const selectClasses =
    'appearance-none w-full px-3 py-2.5 rounded-xl border border-gray-200 text-sm bg-white focus:ring-2 focus:ring-gold/30 focus:border-gold/30 transition-all pr-10';

  const filterContent = (
    <form onSubmit={handleApply} className="space-y-4">
      {/* Active filter chips */}
      {activeFilters.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {activeFilters.map(([key, value]) => (
            <span
              key={key}
              className="inline-flex items-center gap-1 px-2.5 py-1 bg-gold/10 text-gold text-xs rounded-full border border-gold/20"
            >
              {value}
              <button
                type="button"
                onClick={() => {
                  const params = new URLSearchParams(searchParams.toString());
                  params.delete(key);
                  router.push(`/properties?${params.toString()}`);
                }}
              >
                <X className="w-3 h-3" />
              </button>
            </span>
          ))}
          <button
            type="button"
            onClick={clearFilters}
            className="text-xs text-red-500 hover:text-red-600"
          >
            مسح الكل
          </button>
        </div>
      )}

      <div className="relative">
        <label className="block text-xs font-semibold text-navy mb-1.5">المحافظة</label>
        <select
          name="governorate"
          defaultValue={governorateParam}
          onChange={(e) => handleGovernorateChange(e.target.value)}
          className={selectClasses}
        >
          <option value="">الكل</option>
          {governorates.map((g) => (
            <option key={g.id} value={g.slug}>{g.nameAr}</option>
          ))}
        </select>
        <ChevronDown className="absolute bottom-3 left-3 w-4 h-4 text-gray-400 pointer-events-none" />
      </div>

      <div className="relative">
        <label className="block text-xs font-semibold text-navy mb-1.5">المدينة</label>
        <select name="cityId" defaultValue={cityIdParam} className={selectClasses}>
          <option value="">الكل</option>
          {cities.map((c) => (
            <option key={c.id} value={c.id}>{c.nameAr}</option>
          ))}
        </select>
        <ChevronDown className="absolute bottom-3 left-3 w-4 h-4 text-gray-400 pointer-events-none" />
      </div>

      <div className="relative">
        <label className="block text-xs font-semibold text-navy mb-1.5">نوع العقار</label>
        <select name="type" defaultValue={searchParams.get('type') || ''} className={selectClasses}>
          {propertyTypes.map((t) => (
            <option key={t.value} value={t.value}>{t.label}</option>
          ))}
        </select>
        <ChevronDown className="absolute bottom-3 left-3 w-4 h-4 text-gray-400 pointer-events-none" />
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-xs font-semibold text-navy mb-1.5">أقل سعر</label>
          <input
            type="number"
            name="minPrice"
            defaultValue={searchParams.get('minPrice') || ''}
            placeholder="0"
            className="w-full px-3 py-2.5 rounded-xl border border-gray-200 text-sm focus:ring-2 focus:ring-gold/30 focus:border-gold/30 transition-all"
          />
        </div>
        <div>
          <label className="block text-xs font-semibold text-navy mb-1.5">أعلى سعر</label>
          <input
            type="number"
            name="maxPrice"
            defaultValue={searchParams.get('maxPrice') || ''}
            placeholder="0"
            className="w-full px-3 py-2.5 rounded-xl border border-gray-200 text-sm focus:ring-2 focus:ring-gold/30 focus:border-gold/30 transition-all"
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-xs font-semibold text-navy mb-1.5">أقل مساحة (م²)</label>
          <input
            type="number"
            name="minArea"
            defaultValue={searchParams.get('minArea') || ''}
            placeholder="0"
            className="w-full px-3 py-2.5 rounded-xl border border-gray-200 text-sm focus:ring-2 focus:ring-gold/30 focus:border-gold/30 transition-all"
          />
        </div>
        <div>
          <label className="block text-xs font-semibold text-navy mb-1.5">أعلى مساحة (م²)</label>
          <input
            type="number"
            name="maxArea"
            defaultValue={searchParams.get('maxArea') || ''}
            placeholder="0"
            className="w-full px-3 py-2.5 rounded-xl border border-gray-200 text-sm focus:ring-2 focus:ring-gold/30 focus:border-gold/30 transition-all"
          />
        </div>
      </div>

      <div className="flex gap-3">
        <label className="flex items-center gap-2 text-xs text-navy cursor-pointer">
          <input
            type="checkbox"
            name="hasPool"
            value="true"
            defaultChecked={searchParams.get('hasPool') === 'true'}
            className="rounded border-gray-300 text-gold focus:ring-gold"
          />
          <Droplets className="w-3.5 h-3.5 text-blue-400" />
          حمام سباحة
        </label>
        <label className="flex items-center gap-2 text-xs text-navy cursor-pointer">
          <input
            type="checkbox"
            name="hasGarden"
            value="true"
            defaultChecked={searchParams.get('hasGarden') === 'true'}
            className="rounded border-gray-300 text-gold focus:ring-gold"
          />
          <Trees className="w-3.5 h-3.5 text-green-500" />
          حديقة
        </label>
      </div>

      <motion.button
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        type="submit"
        className="w-full py-3 btn-gold-shimmer text-navy font-bold rounded-xl text-sm"
      >
        تطبيق التصفية
      </motion.button>
    </form>
  );

  return (
    <>
      {/* Desktop filter */}
      <div className="hidden lg:block bg-white rounded-2xl shadow-lg p-5 border border-gray-100">
        <h3 className="font-bold text-navy mb-4 flex items-center gap-2">
          <SlidersHorizontal className="w-4 h-4 text-gold" />
          تصفية النتائج
        </h3>
        {filterContent}
      </div>

      {/* Mobile filter button */}
      <div className="lg:hidden">
        <button
          onClick={() => setShowMobileFilter(true)}
          className="w-full flex items-center justify-center gap-2 py-3 bg-white rounded-2xl shadow-lg border border-gray-100 text-sm font-semibold text-navy"
        >
          <SlidersHorizontal className="w-4 h-4 text-gold" />
          تصفية النتائج
          {activeFilters.length > 0 && (
            <span className="w-5 h-5 rounded-full bg-gold text-navy text-xs flex items-center justify-center font-bold">
              {activeFilters.length}
            </span>
          )}
        </button>
      </div>

      {/* Mobile filter modal */}
      {showMobileFilter && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="fixed inset-0 z-50 bg-black/50 lg:hidden"
          onClick={() => setShowMobileFilter(false)}
        >
          <motion.div
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            className="absolute bottom-0 left-0 right-0 bg-white rounded-t-3xl p-5 max-h-[85vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-5">
              <h3 className="font-bold text-navy flex items-center gap-2">
                <SlidersHorizontal className="w-4 h-4 text-gold" />
                تصفية النتائج
              </h3>
              <button onClick={() => setShowMobileFilter(false)}>
                <X className="w-5 h-5 text-gray-400" />
              </button>
            </div>
            {filterContent}
          </motion.div>
        </motion.div>
      )}
    </>
  );
}
