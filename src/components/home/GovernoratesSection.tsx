'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { useInView } from '@/hooks/useInView';
import { MapPin, ChevronLeft, Building2 } from 'lucide-react';

interface Governorate {
  id: number;
  nameAr: string;
  slug: string;
  _count: { properties: number };
}

const govGradients: Record<string, string> = {
  cairo: 'from-amber-500/10 to-amber-600/5',
  giza: 'from-emerald-500/10 to-emerald-600/5',
  alexandria: 'from-blue-500/10 to-blue-600/5',
  matrouh: 'from-cyan-500/10 to-cyan-600/5',
};

const govIcons: Record<string, string> = {
  cairo: '🏛️',
  giza: '🔺',
  alexandria: '🌊',
  matrouh: '🏖️',
};

export default function GovernoratesSection({ governorates }: { governorates: Governorate[] }) {
  const { ref, inView } = useInView({ threshold: 0.1 });

  return (
    <section className="py-16 md:py-24" ref={ref}>
      <div className="max-w-7xl mx-auto px-4">
        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-10 md:mb-14"
        >
          <span className="inline-flex items-center gap-2 text-gold text-xs font-semibold mb-3">
            <MapPin className="w-3.5 h-3.5" />
            استكشف المناطق
          </span>
          <h2 className="text-2xl md:text-4xl font-extrabold text-navy">
            تصفح حسب المحافظة
          </h2>
          <p className="text-gray-500 text-sm mt-3 max-w-lg mx-auto">
            اكتشف أفضل العقارات في المحافظات الرئيسية في مصر
          </p>
        </motion.div>

        {/* Governorate cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
          {governorates.map((gov, i) => (
            <motion.div
              key={gov.id}
              initial={{ opacity: 0, y: 30 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: i * 0.1, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
            >
              <Link
                href={`/governorate/${gov.slug}`}
                className={`group block relative p-5 md:p-8 rounded-2xl bg-gradient-to-br ${govGradients[gov.slug] || 'from-gold/10 to-gold/5'} border border-gray-200/60 hover:border-gold/40 hover:shadow-xl hover:shadow-gold/5 transition-all duration-500 overflow-hidden`}
              >
                {/* Background decoration */}
                <div className="absolute top-3 left-3 text-3xl md:text-4xl opacity-20 group-hover:opacity-40 transition-opacity">
                  {govIcons[gov.slug] || '🏠'}
                </div>

                <div className="relative">
                  <p className="text-lg md:text-xl font-bold text-navy group-hover:text-gold transition-colors">
                    {gov.nameAr}
                  </p>
                  <div className="flex items-center gap-1.5 mt-2 text-xs text-gray-500">
                    <Building2 className="w-3 h-3" />
                    <span>{gov._count.properties} وحدة</span>
                  </div>
                  <div className="flex items-center gap-1 mt-4 text-gold text-xs font-medium opacity-0 group-hover:opacity-100 transition-opacity">
                    تصفح العقارات
                    <ChevronLeft className="w-3 h-3" />
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
