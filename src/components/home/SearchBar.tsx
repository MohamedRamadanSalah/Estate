'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Search, ChevronDown } from 'lucide-react';
import { motion } from 'framer-motion';

interface Governorate {
  id: number;
  nameAr: string;
  slug: string;
}

const propertyTypes = [
  { value: '', label: 'نوع العقار' },
  { value: 'شقة', label: 'شقة' },
  { value: 'فيلا', label: 'فيلا' },
  { value: 'دوبلكس', label: 'دوبلكس' },
  { value: 'بنتهاوس', label: 'بنتهاوس' },
  { value: 'شاليه', label: 'شاليه' },
  { value: 'مكتب', label: 'مكتب' },
  { value: 'محل تجاري', label: 'محل تجاري' },
  { value: 'أرض', label: 'أرض' },
];

export default function SearchBar() {
  const router = useRouter();
  const [query, setQuery] = useState('');
  const [governorate, setGovernorate] = useState('');
  const [type, setType] = useState('');
  const [governorates, setGovernorates] = useState<Governorate[]>([]);

  useEffect(() => {
    fetch('/api/governorates')
      .then((r) => r.json())
      .then((data) => {
        if (Array.isArray(data)) setGovernorates(data);
      })
      .catch(() => {});
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (query) params.set('q', query);
    if (governorate) params.set('governorate', governorate);
    if (type) params.set('type', type);
    router.push(`/properties?${params.toString()}`);
  };

  const selectClasses =
    'appearance-none w-full px-4 py-3.5 rounded-xl bg-white border border-gray-200 text-navy text-sm focus:ring-2 focus:ring-gold/50 focus:border-gold/30 transition-all pr-10';

  return (
    <form onSubmit={handleSearch} className="glass-light rounded-2xl shadow-2xl shadow-navy/10 p-4 md:p-6 max-w-4xl mx-auto">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {/* Search input */}
        <div className="relative lg:col-span-1">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="كود الوحدة أو المنطقة..."
            className="w-full px-4 py-3.5 pr-11 rounded-xl bg-white border border-gray-200 text-navy text-sm focus:ring-2 focus:ring-gold/50 focus:border-gold/30 transition-all"
          />
          <Search className="absolute top-1/2 right-3.5 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
        </div>

        {/* Governorate */}
        <div className="relative">
          <select
            value={governorate}
            onChange={(e) => setGovernorate(e.target.value)}
            className={selectClasses}
          >
            <option value="">المحافظة</option>
            {governorates.map((g) => (
              <option key={g.id} value={g.slug}>{g.nameAr}</option>
            ))}
          </select>
          <ChevronDown className="absolute top-1/2 left-3 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
        </div>

        {/* Property Type */}
        <div className="relative">
          <select
            value={type}
            onChange={(e) => setType(e.target.value)}
            className={selectClasses}
          >
            {propertyTypes.map((t) => (
              <option key={t.value} value={t.value}>{t.label}</option>
            ))}
          </select>
          <ChevronDown className="absolute top-1/2 left-3 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
        </div>

        {/* Search button */}
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          type="submit"
          className="btn-gold-shimmer px-8 py-3.5 text-navy font-bold rounded-xl text-sm flex items-center justify-center gap-2"
        >
          <Search className="w-4 h-4" />
          بحث
        </motion.button>
      </div>
    </form>
  );
}
