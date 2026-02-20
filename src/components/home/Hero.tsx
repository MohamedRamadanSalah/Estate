'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect } from 'react';
import SearchBar from '@/components/home/SearchBar';
import { Building2, MapPin, Users } from 'lucide-react';

interface HeroProps {
  stats: {
    totalUnits: number;
    governorsCount: number;
    developersCount: number;
  };
}

const headlines = [
  'اعثر على عقارك المثالي',
  'اكتشف فيلات فاخرة',
  'استثمر في أفضل المواقع',
  'شقق بأفضل الأسعار',
];

export default function Hero({ stats }: HeroProps) {
  const [headlineIndex, setHeadlineIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setHeadlineIndex((prev) => (prev + 1) % headlines.length);
    }, 3500);
    return () => clearInterval(timer);
  }, []);

  return (
    <section className="relative min-h-[85vh] md:min-h-[90vh] flex items-center overflow-hidden">
      {/* Background with Ken Burns */}
      <div className="absolute inset-0 bg-navy-700">
        <div className="absolute inset-0 ken-burns bg-[url('https://placehold.co/1920x1080/0A0F1E/0A0F1E')] bg-cover bg-center" />
        <div className="absolute inset-0 bg-gradient-to-b from-navy-700/50 via-navy-700/70 to-navy-700" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(201,168,76,0.08)_0%,transparent_70%)]" />
      </div>

      {/* Animated decorative elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          animate={{ y: [0, -20, 0], rotate: [0, 5, 0] }}
          transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute top-20 right-10 w-64 h-64 bg-gold/5 rounded-full blur-3xl"
        />
        <motion.div
          animate={{ y: [0, 20, 0], rotate: [0, -5, 0] }}
          transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute bottom-20 left-10 w-96 h-96 bg-copper/5 rounded-full blur-3xl"
        />
      </div>

      {/* Content */}
      <div className="relative w-full max-w-7xl mx-auto px-4 py-16 md:py-24">
        <div className="text-center">
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.6 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gold/10 border border-gold/20 mb-6"
          >
            <span className="w-2 h-2 rounded-full bg-gold animate-pulse" />
            <span className="text-gold text-xs font-medium">المنصة العقارية الأولى في مصر</span>
          </motion.div>

          {/* Typewriter headline */}
          <div className="h-[80px] sm:h-[100px] md:h-[120px] flex items-center justify-center mb-4">
            <AnimatePresence mode="wait">
              <motion.h1
                key={headlineIndex}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -30 }}
                transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                className="text-3xl sm:text-5xl md:text-7xl font-extrabold text-cream leading-tight"
              >
                {headlines[headlineIndex].split(' ').map((word, i) => (
                  <motion.span
                    key={i}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.1, duration: 0.4 }}
                    className="inline-block mx-1"
                  >
                    {word === headlines[headlineIndex].split(' ').at(-1) ? (
                      <span className="bg-gradient-to-l from-gold-300 via-gold to-copper bg-clip-text text-transparent">
                        {word}
                      </span>
                    ) : (
                      word
                    )}
                  </motion.span>
                ))}
              </motion.h1>
            </AnimatePresence>
          </div>

          {/* Subtitle */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.6 }}
            className="text-sm sm:text-lg md:text-xl text-cream/60 mb-8 md:mb-12 max-w-2xl mx-auto leading-relaxed"
          >
            شقق، فيلات، أرضي واستثمارات في أفضل المواقع — القاهرة، الجيزة، الإسكندرية والساحل الشمالي
          </motion.p>

          {/* Search Bar */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.6 }}
          >
            <SearchBar />
          </motion.div>

          {/* Floating Stats */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8, duration: 0.6 }}
            className="mt-12 md:mt-16 grid grid-cols-3 gap-3 md:gap-6 max-w-2xl mx-auto"
          >
            <StatCard icon={Building2} value={stats.totalUnits} label="وحدة عقارية" delay={0} />
            <StatCard icon={MapPin} value={stats.governorsCount} label="محافظة" delay={0.1} />
            <StatCard icon={Users} value={stats.developersCount} label="مطور عقاري" delay={0.2} />
          </motion.div>
        </div>
      </div>

      {/* Bottom gradient */}
      <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-cream to-transparent" />
    </section>
  );
}

function StatCard({
  icon: Icon,
  value,
  label,
  delay,
}: {
  icon: React.ElementType;
  value: number;
  label: string;
  delay: number;
}) {
  const [count, setCount] = useState(0);
  const [started, setStarted] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setStarted(true), (delay + 1) * 1000);
    return () => clearTimeout(timer);
  }, [delay]);

  useEffect(() => {
    if (!started) return;
    const duration = 1500;
    const startTime = Date.now();
    const timer = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 4);
      setCount(Math.round(eased * value));
      if (progress >= 1) clearInterval(timer);
    }, 16);
    return () => clearInterval(timer);
  }, [started, value]);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: delay + 0.8, duration: 0.5 }}
      className="glass rounded-2xl p-3 md:p-5 text-center hover:bg-white/10 transition-colors group"
    >
      <Icon className="w-5 h-5 md:w-6 md:h-6 text-gold mx-auto mb-2 group-hover:scale-110 transition-transform" />
      <p className="text-xl md:text-3xl font-bold text-cream">
        {count.toLocaleString('ar-EG')}+
      </p>
      <p className="text-[10px] md:text-xs text-cream/50 mt-1">{label}</p>
    </motion.div>
  );
}
