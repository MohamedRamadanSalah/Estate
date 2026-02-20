'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, Search, Heart, Phone } from 'lucide-react';
import { motion } from 'framer-motion';
import { useFavoritesStore } from '@/stores/useFavoritesStore';

const tabs = [
  { href: '/', label: 'الرئيسية', icon: Home },
  { href: '/properties', label: 'بحث', icon: Search },
  { href: '/favorites', label: 'المفضلة', icon: Heart },
  { href: '/contact', label: 'تواصل', icon: Phone },
];

export default function MobileTabBar() {
  const pathname = usePathname();
  const favoriteCount = useFavoritesStore((s) => s.favorites.length);

  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 z-50 glass border-t border-gold/10">
      <div className="flex items-center justify-around h-16">
        {tabs.map((tab) => {
          const isActive =
            tab.href === '/'
              ? pathname === '/'
              : pathname.startsWith(tab.href);

          return (
            <Link
              key={tab.href}
              href={tab.href}
              className="relative flex flex-col items-center gap-0.5 py-2 px-3"
            >
              {isActive && (
                <motion.div
                  layoutId="tab-indicator"
                  className="absolute -top-0.5 w-8 h-0.5 bg-gold rounded-full"
                  transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                />
              )}
              <div className="relative">
                <tab.icon
                  className={`w-5 h-5 transition-colors ${
                    isActive ? 'text-gold' : 'text-cream/50'
                  }`}
                />
                {tab.href === '/favorites' && favoriteCount > 0 && (
                  <span className="absolute -top-1.5 -left-1.5 w-4 h-4 bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                    {favoriteCount > 9 ? '9+' : favoriteCount}
                  </span>
                )}
              </div>
              <span
                className={`text-[10px] font-medium transition-colors ${
                  isActive ? 'text-gold' : 'text-cream/50'
                }`}
              >
                {tab.label}
              </span>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
