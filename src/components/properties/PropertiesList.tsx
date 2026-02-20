'use client';

import { useState, useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { Grid3X3, List, ChevronDown, ChevronLeft, ChevronRight, Search, Building2 } from 'lucide-react';
import PropertyCard from '@/components/property/PropertyCard';
import { PropertyCardSkeleton } from '@/components/ui/Skeletons';

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
  const [totalCount, setTotalCount] = useState(0);
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
        setTotalCount(data.pagination?.total || 0);
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

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.08 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
  };

  return (
    <div>
      {/* Toolbar */}
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3 mb-6">
        <div className="flex items-center gap-3">
          {!loading && (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-sm text-gray-500"
            >
              <span className="font-bold text-navy">{totalCount}</span> نتيجة
            </motion.p>
          )}
          <div className="relative">
            <select
              value={currentSort}
              onChange={(e) => handleSort(e.target.value)}
              className="appearance-none px-4 py-2.5 pr-10 rounded-xl border border-gray-200 text-sm bg-white focus:ring-2 focus:ring-gold/30 focus:border-gold/30 transition-all cursor-pointer"
            >
              <option value="newest">الأحدث</option>
              <option value="price_asc">السعر: الأقل أولاً</option>
              <option value="price_desc">السعر: الأعلى أولاً</option>
              <option value="area">المساحة</option>
            </select>
            <ChevronDown className="absolute top-1/2 left-3 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
          </div>
        </div>

        <div className="flex bg-gray-100 rounded-xl p-1 w-fit">
          <button
            onClick={() => setViewMode('grid')}
            className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm transition-all ${
              viewMode === 'grid'
                ? 'bg-white shadow-sm text-gold font-semibold'
                : 'text-gray-500 hover:text-navy'
            }`}
          >
            <Grid3X3 className="w-4 h-4" />
            شبكة
          </button>
          <button
            onClick={() => setViewMode('list')}
            className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm transition-all ${
              viewMode === 'list'
                ? 'bg-white shadow-sm text-gold font-semibold'
                : 'text-gray-500 hover:text-navy'
            }`}
          >
            <List className="w-4 h-4" />
            قائمة
          </button>
        </div>
      </div>

      {/* Content */}
      <AnimatePresence mode="wait">
        {loading ? (
          <motion.div
            key="loading"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6"
          >
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <PropertyCardSkeleton key={i} />
            ))}
          </motion.div>
        ) : properties.length === 0 ? (
          <motion.div
            key="empty"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            className="text-center py-20"
          >
            <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-5">
              <Building2 className="w-8 h-8 text-gray-300" />
            </div>
            <h3 className="text-lg font-bold text-navy mb-2">لا توجد نتائج</h3>
            <p className="text-sm text-gray-500 mb-5 max-w-sm mx-auto">
              لم نجد عقارات تطابق معايير البحث الخاصة بك. حاول تعديل الفلاتر
            </p>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => router.push('/properties')}
              className="inline-flex items-center gap-2 px-6 py-3 btn-gold-shimmer text-navy font-bold rounded-xl text-sm"
            >
              <Search className="w-4 h-4" />
              عرض كل العقارات
            </motion.button>
          </motion.div>
        ) : (
          <motion.div
            key="results"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className={
              viewMode === 'grid'
                ? 'grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6'
                : 'flex flex-col gap-5'
            }
          >
            {properties.map((p) => (
              <motion.div key={p.id} variants={itemVariants}>
                <PropertyCard property={p} />
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Pagination */}
      {!loading && totalPages > 1 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="flex justify-center items-center gap-2 mt-10"
        >
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => { setPage((p) => Math.max(1, p - 1)); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
            disabled={page <= 1}
            className="flex items-center gap-1 px-4 py-2.5 rounded-xl border border-gray-200 text-sm hover:border-gold hover:text-gold transition-colors disabled:opacity-40 disabled:hover:border-gray-200 disabled:hover:text-inherit"
          >
            <ChevronRight className="w-4 h-4" />
            السابق
          </motion.button>

          <div className="flex items-center gap-1">
            {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
              let pageNum: number;
              if (totalPages <= 5) {
                pageNum = i + 1;
              } else if (page <= 3) {
                pageNum = i + 1;
              } else if (page >= totalPages - 2) {
                pageNum = totalPages - 4 + i;
              } else {
                pageNum = page - 2 + i;
              }
              return (
                <button
                  key={pageNum}
                  onClick={() => { setPage(pageNum); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                  className={`w-10 h-10 rounded-xl text-sm font-semibold transition-all ${
                    page === pageNum
                      ? 'bg-gradient-to-br from-gold to-copper text-navy shadow-lg'
                      : 'hover:bg-gray-100 text-gray-500'
                  }`}
                >
                  {pageNum}
                </button>
              );
            })}
          </div>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => { setPage((p) => Math.min(totalPages, p + 1)); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
            disabled={page >= totalPages}
            className="flex items-center gap-1 px-4 py-2.5 rounded-xl border border-gray-200 text-sm hover:border-gold hover:text-gold transition-colors disabled:opacity-40 disabled:hover:border-gray-200 disabled:hover:text-inherit"
          >
            التالي
            <ChevronLeft className="w-4 h-4" />
          </motion.button>
        </motion.div>
      )}
    </div>
  );
}
