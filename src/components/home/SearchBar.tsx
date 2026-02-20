'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

interface Governorate {
  id: number;
  nameAr: string;
  slug: string;
}

export default function SearchBar() {
  const router = useRouter();
  const [query, setQuery] = useState('');
  const [governorate, setGovernorate] = useState('');
  const [type, setType] = useState('');
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
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
    if (minPrice) params.set('minPrice', minPrice);
    if (maxPrice) params.set('maxPrice', maxPrice);
    router.push(`/properties?${params.toString()}`);
  };

  return (
    <form onSubmit={handleSearch} className="bg-white rounded-xl shadow-xl p-4 md:p-6 max-w-4xl mx-auto">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="كود الوحدة أو المنطقة..."
          className="px-4 py-3 rounded-lg border border-gray-200 text-navy"
        />
        <select
          value={governorate}
          onChange={(e) => setGovernorate(e.target.value)}
          className="px-4 py-3 rounded-lg border border-gray-200 text-navy"
        >
          <option value="">المحافظة</option>
          {governorates.map((g) => (
            <option key={g.id} value={g.slug}>{g.nameAr}</option>
          ))}
        </select>
        <select
          value={type}
          onChange={(e) => setType(e.target.value)}
          className="px-4 py-3 rounded-lg border border-gray-200 text-navy"
        >
          <option value="">نوع العقار</option>
          <option value="شقة">شقة</option>
          <option value="فيلا">فيلا</option>
          <option value="دوبلكس">دوبلكس</option>
          <option value="شاليه">شاليه</option>
        </select>
        <input
          type="number"
          value={minPrice}
          onChange={(e) => setMinPrice(e.target.value)}
          placeholder="أقل سعر (EGP)"
          className="px-4 py-3 rounded-lg border border-gray-200 text-navy"
        />
        <input
          type="number"
          value={maxPrice}
          onChange={(e) => setMaxPrice(e.target.value)}
          placeholder="أعلى سعر (EGP)"
          className="px-4 py-3 rounded-lg border border-gray-200 text-navy"
        />
      </div>
      <button
        type="submit"
        className="mt-4 w-full md:w-auto px-8 py-3 bg-gold text-navy font-semibold rounded-lg hover:bg-copper transition-colors"
      >
        بحث
      </button>
    </form>
  );
}
