'use client';

import Link from 'next/link';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';

export default function Navbar() {
  const [searchQuery, setSearchQuery] = useState('');
  const [menuOpen, setMenuOpen] = useState(false);
  const router = useRouter();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
    } else {
      router.push('/properties');
    }
  };

  const navLinks = [
    { href: '/', label: 'الرئيسية' },
    { href: '/properties', label: 'عرض الوحدات' },
    { href: '/contact', label: 'تواصل معنا' },
    { href: '/admin/login', label: 'تسجيل الدخول' },
  ];

  return (
    <nav className="sticky top-0 z-50 bg-navy/95 backdrop-blur-sm border-b border-gold/20">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-14 sm:h-16 gap-3">
          <Link href="/" className="flex items-center gap-2">
            <span className="text-xl sm:text-2xl font-extrabold text-gold">عقارك</span>
          </Link>

          <form onSubmit={handleSearch} className="hidden md:flex flex-1 max-w-xl mx-8">
            <input
              type="search"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="ابحث بكود الوحدة، المنطقة، المطور..."
              className="w-full px-4 py-2 rounded-r-lg border border-gold/30 bg-cream/10 text-cream placeholder-gray-400 focus:ring-2 focus:ring-gold focus:border-transparent"
            />
            <button
              type="submit"
              className="px-6 py-2 bg-gold text-navy font-semibold rounded-l-lg hover:bg-copper transition-colors"
            >
              بحث
            </button>
          </form>

          <div className="hidden md:flex items-center gap-6">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-cream/90 hover:text-gold transition-colors"
              >
                {link.label}
              </Link>
            ))}
          </div>

          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="md:hidden p-2 text-cream rounded-lg border border-gold/30"
            aria-label="فتح القائمة"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {menuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>

        <AnimatePresence>
          {menuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden py-4 border-t border-gold/20"
            >
              <form onSubmit={handleSearch} className="mb-4">
                <input
                  type="search"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="ابحث..."
                  className="w-full px-4 py-3 rounded-lg border border-gold/30 bg-cream/10 text-cream placeholder-gray-300"
                />
                <button type="submit" className="mt-2 w-full py-3 bg-gold text-navy rounded-lg font-semibold">
                  بحث
                </button>
              </form>
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMenuOpen(false)}
                  className="block py-2.5 text-cream/90 hover:text-gold"
                >
                  {link.label}
                </Link>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </nav>
  );
}
