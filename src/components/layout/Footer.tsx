'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { useInView } from '@/hooks/useInView';
import {
  MapPin,
  Phone,
  MessageCircle,
  Building2,
  ChevronLeft,
  Heart,
} from 'lucide-react';

export default function Footer() {
  const whatsappNumber = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || '201234567890';
  const { ref, inView } = useInView({ threshold: 0.1 });

  const browseLinks = [
    { href: '/properties', label: 'كل الوحدات' },
    { href: '/governorate/cairo', label: 'القاهرة' },
    { href: '/governorate/giza', label: 'الجيزة' },
    { href: '/governorate/alexandria', label: 'الإسكندرية' },
    { href: '/governorate/matrouh', label: 'مطروح' },
  ];

  const quickLinks = [
    { href: '/developers', label: 'المطورون العقاريون' },
    { href: '/contact', label: 'تواصل معنا' },
    { href: '/admin/login', label: 'لوحة التحكم' },
  ];

  return (
    <footer ref={ref} className="bg-navy-700 text-cream mt-0 pb-20 md:pb-0">
      {/* Decorative top */}
      <div className="h-1 bg-gradient-to-l from-gold/0 via-gold to-gold/0" />

      <div className="max-w-7xl mx-auto px-4 py-14">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="grid grid-cols-1 md:grid-cols-4 gap-10"
        >
          {/* Brand */}
          <div>
            <span className="text-3xl font-extrabold bg-gradient-to-l from-gold-300 via-gold to-copper bg-clip-text text-transparent">
              عقارك
            </span>
            <p className="text-cream/60 text-sm mt-4 leading-relaxed">
              منصة عقارية رائدة في مصر لمساعدتك في إيجاد العقار المناسب في القاهرة،
              الجيزة، الإسكندرية والساحل الشمالي.
            </p>
            <div className="flex items-center gap-3 mt-6">
              <a
                href={`https://wa.me/${whatsappNumber}`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-lg bg-success/10 flex items-center justify-center text-success hover:bg-success hover:text-white transition-all duration-300"
              >
                <MessageCircle className="w-5 h-5" />
              </a>
              <a
                href={`tel:${whatsappNumber}`}
                className="w-10 h-10 rounded-lg bg-gold/10 flex items-center justify-center text-gold hover:bg-gold hover:text-navy transition-all duration-300"
              >
                <Phone className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Browse */}
          <div>
            <h4 className="text-sm font-bold text-gold mb-4 flex items-center gap-2">
              <MapPin className="w-4 h-4" />
              تصفح المناطق
            </h4>
            <ul className="space-y-2.5">
              {browseLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="group flex items-center gap-2 text-cream/60 hover:text-gold transition-colors text-sm"
                  >
                    <ChevronLeft className="w-3 h-3 text-gold/40 group-hover:text-gold transition-colors" />
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-sm font-bold text-gold mb-4 flex items-center gap-2">
              <Building2 className="w-4 h-4" />
              روابط سريعة
            </h4>
            <ul className="space-y-2.5">
              {quickLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="group flex items-center gap-2 text-cream/60 hover:text-gold transition-colors text-sm"
                  >
                    <ChevronLeft className="w-3 h-3 text-gold/40 group-hover:text-gold transition-colors" />
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-sm font-bold text-gold mb-4 flex items-center gap-2">
              <Phone className="w-4 h-4" />
              تواصل معنا
            </h4>
            <p className="text-cream/60 text-sm mb-4">
              نسعد بمساعدتك في العثور على عقارك المثالي. تواصل معنا عبر واتساب أو اتصل بنا مباشرة.
            </p>
            <a
              href={`https://wa.me/${whatsappNumber}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-success/10 text-success rounded-xl hover:bg-success hover:text-white transition-all duration-300 text-sm font-semibold"
            >
              <MessageCircle className="w-4 h-4" />
              واتساب
            </a>
          </div>
        </motion.div>

        {/* Bottom */}
        <div className="border-t border-cream/10 mt-10 pt-8 flex flex-col md:flex-row items-center justify-between gap-3 text-cream/40 text-xs">
          <p>© {new Date().getFullYear()} عقارك. جميع الحقوق محفوظة.</p>
          <p className="flex items-center gap-1.5">
            صنع بـ <Heart className="w-3 h-3 text-red-400 fill-red-400" /> في مصر
          </p>
        </div>
      </div>
    </footer>
  );
}
