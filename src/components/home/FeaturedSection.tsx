'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { useInView } from '@/hooks/useInView';
import { ArrowLeft, Sparkles } from 'lucide-react';
import PropertyCard from '@/components/property/PropertyCard';

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
}

export default function FeaturedSection({ properties }: { properties: Property[] }) {
  const { ref, inView } = useInView({ threshold: 0.05 });

  return (
    <section className="py-16 md:py-24 bg-gradient-to-b from-cream to-white" ref={ref}>
      <div className="max-w-7xl mx-auto px-4">
        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="flex flex-col md:flex-row justify-between items-start md:items-end mb-10 md:mb-14 gap-4"
        >
          <div>
            <span className="inline-flex items-center gap-2 text-gold text-xs font-semibold mb-3">
              <Sparkles className="w-3.5 h-3.5" />
              أحدث العروض
            </span>
            <h2 className="text-2xl md:text-4xl font-extrabold text-navy">
              أحدث الوحدات
            </h2>
            <p className="text-gray-500 text-sm mt-2 max-w-md">
              اكتشف أحدث الوحدات العقارية المتاحة للبيع في أفضل المناطق
            </p>
          </div>
          <Link
            href="/properties"
            className="group inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-navy text-cream text-sm font-semibold hover:bg-gold hover:text-navy transition-all duration-300"
          >
            عرض الكل
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          </Link>
        </motion.div>

        {/* Properties grid */}
        {properties.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {properties.map((p, i) => (
              <motion.div
                key={p.id}
                initial={{ opacity: 0, y: 40 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ delay: i * 0.1, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
              >
                <PropertyCard property={p} />
              </motion.div>
            ))}
          </div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={inView ? { opacity: 1 } : {}}
            className="text-center py-20"
          >
            <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-gold/10 flex items-center justify-center">
              <Sparkles className="w-8 h-8 text-gold" />
            </div>
            <p className="text-gray-500 text-lg">لا توجد وحدات حالياً</p>
            <p className="text-gray-400 text-sm mt-2">قريباً عقارات جديدة!</p>
          </motion.div>
        )}
      </div>
    </section>
  );
}
