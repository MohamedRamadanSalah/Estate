'use client';

import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { Heart, Bed, Bath, Maximize, MapPin, Sparkles, TrendingUp } from 'lucide-react';
import { useTilt } from '@/hooks/useTilt';
import { useFavoritesStore } from '@/stores/useFavoritesStore';
import { useState } from 'react';

interface PropertyCardProps {
  property: {
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
  };
}

export default function PropertyCard({ property }: PropertyCardProps) {
  const img = property.images[0] || 'https://placehold.co/400x300/0A0F1E/C9A84C?text=عقار';
  const price = Number(property.totalPrice).toLocaleString('ar-EG');
  const area = Number(property.totalArea).toLocaleString('ar-EG');
  const { ref, handleMouseMove, handleMouseLeave } = useTilt(8);
  const toggleFavorite = useFavoritesStore((s) => s.toggleFavorite);
  const isFavorite = useFavoritesStore((s) => s.isFavorite(property.unitCode));
  const [heartBurst, setHeartBurst] = useState(false);

  const handleFav = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    toggleFavorite(property.unitCode);
    if (!isFavorite) {
      setHeartBurst(true);
      setTimeout(() => setHeartBurst(false), 600);
    }
  };

  const isNew = (() => {
    return true; // All visible cards are "new" for visual appeal
  })();

  const statusColor =
    property.status === 'متاحة للبيع'
      ? 'bg-success text-white'
      : property.status === 'محجوزة'
        ? 'bg-orange-500 text-white'
        : property.status === 'قيد التطوير'
          ? 'bg-blue-500 text-white'
          : 'bg-gray-500 text-white';

  return (
    <Link href={`/properties/${property.unitCode}`}>
      <div
        ref={ref}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        className="card-tilt"
        style={{ transition: 'transform 0.2s ease-out' }}
      >
        <article className="group rounded-2xl overflow-hidden bg-white shadow-lg hover:shadow-2xl border border-gray-100 hover:border-gold/30 transition-all duration-500">
          {/* Image Section */}
          <div className="relative h-52 bg-gray-200 overflow-hidden">
            <Image
              src={img}
              alt={property.projectName}
              fill
              className="object-cover transition-transform duration-700 group-hover:scale-110"
              sizes="(max-width: 768px) 100vw, 33vw"
              unoptimized
            />
            {/* Gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-navy/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

            {/* Badges */}
            <div className="absolute top-3 right-3 flex flex-col gap-2">
              <span className="px-2.5 py-1 bg-navy/80 backdrop-blur-sm text-gold text-[10px] font-bold rounded-lg border border-gold/20">
                {property.unitCode}
              </span>
              {isNew && (
                <motion.span
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="flex items-center gap-1 px-2 py-0.5 bg-gold text-navy text-[10px] font-bold rounded-lg"
                >
                  <Sparkles className="w-3 h-3" />
                  جديد
                </motion.span>
              )}
            </div>

            {/* Status */}
            <span className={`absolute top-3 left-3 px-2.5 py-1 text-[10px] font-bold rounded-lg ${statusColor}`}>
              {property.status}
            </span>

            {/* Heart button */}
            <button
              onClick={handleFav}
              className="absolute bottom-3 left-3 w-9 h-9 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center transition-all duration-300 hover:scale-110"
            >
              <motion.div animate={heartBurst ? { scale: [1, 1.4, 1] } : {}} transition={{ duration: 0.3 }}>
                <Heart
                  className={`w-4 h-4 transition-colors ${
                    isFavorite ? 'text-red-500 fill-red-500' : 'text-gray-400'
                  }`}
                />
              </motion.div>
              {heartBurst && (
                <motion.div
                  initial={{ scale: 0, opacity: 1 }}
                  animate={{ scale: 2.5, opacity: 0 }}
                  transition={{ duration: 0.5 }}
                  className="absolute inset-0 rounded-full border-2 border-red-400"
                />
              )}
            </button>

            {/* Property type tag */}
            <span className="absolute bottom-3 right-3 px-2.5 py-1 bg-white/90 backdrop-blur-sm text-navy text-[10px] font-semibold rounded-lg">
              {property.propertyType}
            </span>
          </div>

          {/* Content */}
          <div className="p-4">
            <div className="flex items-center gap-1.5 text-gray-400 mb-1.5">
              <MapPin className="w-3 h-3" />
              <p className="text-xs">{property.governorate.nameAr} - {property.city.nameAr}</p>
            </div>

            <h3 className="font-bold text-navy text-sm leading-snug line-clamp-1 group-hover:text-gold transition-colors">
              {property.projectName}
            </h3>

            <div className="flex items-center gap-1.5 mt-2">
              <TrendingUp className="w-3.5 h-3.5 text-gold" />
              <p className="text-gold font-bold text-base">{price}</p>
              <span className="text-[10px] text-gray-400">جنيه مصري</span>
            </div>

            <div className="flex items-center gap-4 mt-3 pt-3 border-t border-gray-100">
              <span className="flex items-center gap-1.5 text-xs text-gray-500">
                <Bed className="w-3.5 h-3.5" />
                {property.bedroomsCount} غرف
              </span>
              <span className="flex items-center gap-1.5 text-xs text-gray-500">
                <Bath className="w-3.5 h-3.5" />
                {property.bathroomsCount} حمام
              </span>
              <span className="flex items-center gap-1.5 text-xs text-gray-500">
                <Maximize className="w-3.5 h-3.5" />
                {area} م²
              </span>
            </div>
          </div>
        </article>
      </div>
    </Link>
  );
}
