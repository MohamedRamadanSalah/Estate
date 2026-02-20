'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart, Trash2, Building2 } from 'lucide-react';
import Link from 'next/link';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import MobileTabBar from '@/components/layout/MobileTabBar';
import PropertyCard from '@/components/property/PropertyCard';
import ScrollProgress from '@/components/ui/ScrollProgress';
import CustomCursor from '@/components/ui/CustomCursor';
import ToastProvider from '@/components/ui/ToastProvider';
import { PropertyCardSkeleton } from '@/components/ui/Skeletons';
import { useFavoritesStore } from '@/stores/useFavoritesStore';

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

export default function FavoritesPage() {
  const { favorites, clearAll } = useFavoritesStore();
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (favorites.length === 0) {
      setProperties([]);
      setLoading(false);
      return;
    }

    // Fetch each favorite property
    Promise.all(
      favorites.map((code) =>
        fetch(`/api/properties/${code}`)
          .then((r) => (r.ok ? r.json() : null))
          .catch(() => null)
      )
    ).then((results) => {
      setProperties(results.filter(Boolean));
      setLoading(false);
    });
  }, [favorites]);

  return (
    <div className="min-h-screen flex flex-col bg-cream">
      <ScrollProgress />
      <CustomCursor />
      <ToastProvider />
      <Navbar />
      <main className="flex-1 pt-24 pb-8">
        <div className="max-w-7xl mx-auto px-4">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8"
          >
            <div>
              <h1 className="text-3xl md:text-4xl font-bold font-playfair text-navy mb-2 flex items-center gap-3">
                <Heart className="w-8 h-8 text-red-500 fill-red-500" />
                المفضلة
              </h1>
              <p className="text-gray-500 text-sm">
                {favorites.length > 0
                  ? `${favorites.length} عقار في قائمة المفضلة`
                  : 'لا توجد عقارات في المفضلة بعد'}
              </p>
            </div>
            {favorites.length > 0 && (
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={clearAll}
                className="flex items-center gap-2 px-4 py-2.5 text-sm text-red-500 border border-red-200 rounded-xl hover:bg-red-50 transition-colors"
              >
                <Trash2 className="w-4 h-4" />
                مسح الكل
              </motion.button>
            )}
          </motion.div>

          {/* Content */}
          <AnimatePresence mode="wait">
            {loading ? (
              <motion.div
                key="loading"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
              >
                {[1, 2, 3].map((i) => (
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
                <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Building2 className="w-10 h-10 text-gray-300" />
                </div>
                <h3 className="text-lg font-bold text-navy mb-2">قائمة المفضلة فارغة</h3>
                <p className="text-sm text-gray-500 mb-6 max-w-sm mx-auto">
                  اضغط على أيقونة القلب في أي عقار لإضافته إلى قائمة المفضلة
                </p>
                <Link href="/properties">
                  <motion.span
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="inline-flex items-center gap-2 px-6 py-3 btn-gold-shimmer text-navy font-bold rounded-xl text-sm"
                  >
                    تصفح العقارات
                  </motion.span>
                </Link>
              </motion.div>
            ) : (
              <motion.div
                key="results"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
              >
                {properties.map((p, i) => (
                  <motion.div
                    key={p.id}
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.08 }}
                  >
                    <PropertyCard property={p} />
                  </motion.div>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </main>
      <Footer />
      <MobileTabBar />
    </div>
  );
}
