'use client';

import { useState, useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import PropertyCard from '@/components/property/PropertyCard';

interface Props { initialGovernorate?: string; searchQuery?: string }

interface Property {
  id: number;
  unitCode: string;
  projectName: string;
  totalPrice: { toString: () => string };
  totalArea: { toString: () => string };
  bedroomsCount: number;
  bathroomsCount: number;
  propertyType: string;
  status: string;
  images: string[];
  governorate: { nameAr: string };
  city: { nameAr: string };
  developer: { nameAr: string };
}

export default function PropertiesList({ initialGovernorate, searchQuery }: Props = {}) {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  useEffect(() => {
    setLoading(true);
    const params = new URLSearchParams(searchParams);
    if (initialGovernorate) params.set('governorate', initialGovernorate);
    if (searchQuery) params.set('q', searchQuery);
    params.set('page', String(page));
    fetch(`/api/properties?${params.toString()}`)
      .then((r) => r.json())
      .then((data) => {
        setProperties(data.properties || []);
        setTotalPages(data.pagination?.totalPages || 1);
        setLoading(false);
      });
  }, [searchParams, page, initialGovernorate, searchQuery]);

  const handleSort = (sort: string) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set('sort', sort);
    const base = searchQuery
      ? '/search'
      : initialGovernorate
        ? `/governorate/${initialGovernorate}`
        : '/properties';
    router.push(`${base}?${params.toString()}`);
  };

  const currentSort = searchParams.get('sort') || 'newest';

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3 mb-5 md:mb-6">
        <select
          value={currentSort}
          onChange={(e) => handleSort(e.target.value)}
          className="w-full sm:w-auto px-4 py-2.5 rounded-lg border border-gray-200 text-sm"
        >
          <option value="newest">الأحدث</option>
          <option value="price_asc">السعر تصاعدياً</option>
          <option value="price_desc">السعر تنازلياً</option>
          <option value="area">المساحة</option>
        </select>
        <div className="flex gap-2 w-full sm:w-auto">
          <button
            onClick={() => setViewMode('grid')}
            className={`flex-1 sm:flex-none px-3 py-2 rounded text-sm ${viewMode === 'grid' ? 'bg-gold/20 text-gold' : 'border'}`}
          >
            شبكة
          </button>
          <button
            onClick={() => setViewMode('list')}
            className={`flex-1 sm:flex-none px-3 py-2 rounded text-sm ${viewMode === 'list' ? 'bg-gold/20 text-gold' : 'border'}`}
          >
            قائمة
          </button>
        </div>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="animate-pulse h-80 bg-gray-200 rounded-xl" />
          ))}
        </div>
      ) : properties.length === 0 ? (
        <p className="text-center text-gray py-16">لا توجد وحدات تطابق البحث</p>
      ) : (
        <>
          <div className={viewMode === 'grid' ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6' : 'flex flex-col gap-4'}>
            {properties.map((p) => (
              <PropertyCard key={p.id} property={p} />
            ))}
          </div>
          {totalPages > 1 && (
            <div className="flex justify-center items-center gap-2 mt-6 md:mt-8 flex-wrap">
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page <= 1}
                className="px-4 py-2 rounded border text-sm disabled:opacity-50"
              >
                السابق
              </button>
              <span className="px-3 py-2 text-sm">
                {page} / {totalPages}
              </span>
              <button
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={page >= totalPages}
                className="px-4 py-2 rounded border text-sm disabled:opacity-50"
              >
                التالي
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
