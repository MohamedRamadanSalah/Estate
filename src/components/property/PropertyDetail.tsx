'use client';

import { useState } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import {
  MapPin, Bed, Bath, Maximize, Building2, ChevronLeft, ChevronRight,
  Home, Users, Layers, Droplets, Trees, Wind, Sofa, CreditCard,
  Paintbrush, Hash, Share2, Heart, Tag, Sparkles, Play,
} from 'lucide-react';
import MapView from './MapView';
import InstallmentCalculator from './InstallmentCalculator';
import WhatsAppButton from './WhatsAppButton';
import Lightbox from '@/components/ui/Lightbox';
import { useFavoritesStore } from '@/stores/useFavoritesStore';

interface PropertyDetailProps {
  property: {
    id: number;
    unitCode: string;
    projectName: string;
    district: string;
    totalPrice: { toString: () => string };
    totalArea: { toString: () => string };
    pricePerSqm: { toString: () => string };
    bedroomsCount: number;
    bathroomsCount: number;
    livingRoomsCount: number | null;
    floorNumber: number | null;
    totalFloors: number | null;
    hasSwimmingPool: boolean;
    hasGarden: boolean;
    isFurnished: string;
    hasAirConditioning: boolean;
    propertyType: string;
    accommodationType: string;
    status: string;
    paymentMethod: string;
    installmentDetails: string | null;
    finishingStatus: string | null;
    marketingDescription: string;
    images: string[];
    videoUrl: string | null;
    extraFeatures: string[];
    locationLat: number | null;
    locationLng: number | null;
    governorate: { nameAr: string };
    city: { nameAr: string };
    developer: { nameAr: string };
  };
}

const statusColors: Record<string, string> = {
  'متاحة للبيع': 'bg-emerald-500',
  'محجوزة': 'bg-amber-500',
  'مباعة': 'bg-red-500',
};

export default function PropertyDetail({ property }: PropertyDetailProps) {
  const [currentImage, setCurrentImage] = useState(0);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const { isFavorite, toggleFavorite } = useFavoritesStore();
  const images = property.images?.length ? property.images : ['https://placehold.co/800x500/FAF8F5/C9A84C?text=عقار'];
  const totalPrice = Number(property.totalPrice);
  const pricePerSqm = Number(property.pricePerSqm);
  const totalArea = Number(property.totalArea);
  const favorited = isFavorite(property.unitCode);

  const handleShare = async () => {
    try {
      await navigator.share({
        title: property.projectName,
        text: `${property.projectName} - ${totalPrice.toLocaleString('ar-EG')} جنيه`,
        url: window.location.href,
      });
    } catch {
      navigator.clipboard.writeText(window.location.href);
    }
  };

  const nextImage = () => setCurrentImage((i) => (i + 1) % images.length);
  const prevImage = () => setCurrentImage((i) => (i - 1 + images.length) % images.length);

  const quickSpecs = [
    { icon: Bed, label: 'غرف', value: property.bedroomsCount },
    { icon: Bath, label: 'حمامات', value: property.bathroomsCount },
    { icon: Maximize, label: 'مساحة', value: `${totalArea.toLocaleString('ar-EG')} م²` },
    { icon: Layers, label: 'الطابق', value: property.floorNumber ?? '-' },
  ];

  const amenities = [
    { icon: Droplets, label: 'حمام سباحة', active: property.hasSwimmingPool },
    { icon: Trees, label: 'حديقة خاصة', active: property.hasGarden },
    { icon: Wind, label: 'تكييف مركزي', active: property.hasAirConditioning },
    { icon: Sofa, label: property.isFurnished, active: property.isFurnished !== 'بدون تأثيث' },
  ];

  const detailSpecs = [
    { icon: Hash, label: 'كود الوحدة', value: property.unitCode },
    { icon: MapPin, label: 'المحافظة', value: property.governorate?.nameAr },
    { icon: MapPin, label: 'المدينة', value: property.city?.nameAr },
    { icon: MapPin, label: 'المنطقة', value: property.district },
    { icon: Building2, label: 'المشروع', value: property.projectName },
    { icon: Users, label: 'المطور', value: property.developer?.nameAr },
    { icon: Home, label: 'نوع العقار', value: property.propertyType },
    { icon: Tag, label: 'نوع الإقامة', value: property.accommodationType },
    { icon: CreditCard, label: 'طريقة السداد', value: property.paymentMethod },
    { icon: Paintbrush, label: 'التشطيب', value: property.finishingStatus ?? '-' },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4">
      {/* Gallery Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="mb-8"
      >
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-3 rounded-2xl overflow-hidden">
          {/* Main image */}
          <div
            className="lg:col-span-3 relative h-72 sm:h-96 lg:h-[500px] cursor-pointer group"
            onClick={() => setLightboxOpen(true)}
          >
            <AnimatePresence mode="wait">
              <motion.div
                key={currentImage}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="absolute inset-0"
              >
                <Image
                  src={images[currentImage]}
                  alt={property.projectName}
                  fill
                  className="object-cover"
                  priority
                  unoptimized={images[currentImage]?.startsWith('/')}
                />
              </motion.div>
            </AnimatePresence>

            {/* Gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-navy/60 via-transparent to-transparent" />

            {/* Nav arrows */}
            {images.length > 1 && (
              <>
                <button
                  onClick={(e) => { e.stopPropagation(); nextImage(); }}
                  className="absolute left-3 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/90 backdrop-blur rounded-full flex items-center justify-center shadow-lg opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <ChevronLeft className="w-5 h-5 text-navy" />
                </button>
                <button
                  onClick={(e) => { e.stopPropagation(); prevImage(); }}
                  className="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/90 backdrop-blur rounded-full flex items-center justify-center shadow-lg opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <ChevronRight className="w-5 h-5 text-navy" />
                </button>
              </>
            )}

            {/* Top badges */}
            <div className="absolute top-4 right-4 flex gap-2">
              <span className="px-3 py-1.5 bg-gradient-to-r from-gold to-copper text-navy font-bold rounded-lg text-sm shadow-lg">
                {property.unitCode}
              </span>
              <span className={`px-3 py-1.5 text-white font-semibold rounded-lg text-sm shadow-lg ${statusColors[property.status] || 'bg-gray-500'}`}>
                {property.status}
              </span>
            </div>

            {/* Action buttons */}
            <div className="absolute top-4 left-4 flex gap-2">
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={(e) => { e.stopPropagation(); toggleFavorite(property.unitCode); }}
                className="w-10 h-10 bg-white/90 backdrop-blur rounded-full flex items-center justify-center shadow-lg"
              >
                <Heart className={`w-5 h-5 transition-colors ${favorited ? 'fill-red-500 text-red-500' : 'text-navy'}`} />
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={(e) => { e.stopPropagation(); handleShare(); }}
                className="w-10 h-10 bg-white/90 backdrop-blur rounded-full flex items-center justify-center shadow-lg"
              >
                <Share2 className="w-5 h-5 text-navy" />
              </motion.button>
            </div>

            {/* Image counter */}
            <div className="absolute bottom-4 left-4 px-3 py-1.5 bg-navy/70 backdrop-blur text-white text-sm rounded-lg">
              {currentImage + 1} / {images.length}
            </div>

            {/* Bottom price on mobile */}
            <div className="absolute bottom-4 right-4 lg:hidden">
              <p className="text-2xl font-bold text-white drop-shadow-lg">
                {totalPrice.toLocaleString('ar-EG')} <span className="text-base">جنيه</span>
              </p>
            </div>
          </div>

          {/* Side thumbnails (desktop) */}
          <div className="hidden lg:flex lg:flex-col gap-3 max-h-[500px] overflow-y-auto hide-scrollbar">
            {images.slice(0, 5).map((img, i) => (
              <button
                key={i}
                onClick={() => setCurrentImage(i)}
                className={`relative h-[calc(100%/5-12px)] min-h-[88px] rounded-xl overflow-hidden border-2 transition-all ${
                  i === currentImage ? 'border-gold ring-2 ring-gold/30' : 'border-transparent opacity-70 hover:opacity-100'
                }`}
              >
                <Image src={img} alt="" fill className="object-cover" unoptimized />
                {i === 4 && images.length > 5 && (
                  <div className="absolute inset-0 bg-navy/70 flex items-center justify-center text-white font-bold text-lg">
                    +{images.length - 5}
                  </div>
                )}
              </button>
            ))}
            {property.videoUrl && (
              <a
                href={property.videoUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 h-20 bg-navy/10 rounded-xl text-navy font-semibold text-sm hover:bg-navy/20 transition-colors"
              >
                <Play className="w-5 h-5" />
                فيديو
              </a>
            )}
          </div>
        </div>

        {/* Mobile thumbnails */}
        {images.length > 1 && (
          <div className="flex gap-2 mt-3 overflow-x-auto pb-2 lg:hidden hide-scrollbar">
            {images.map((img, i) => (
              <button
                key={i}
                onClick={() => setCurrentImage(i)}
                className={`relative w-16 h-16 shrink-0 rounded-lg overflow-hidden border-2 transition-all ${
                  i === currentImage ? 'border-gold' : 'border-transparent opacity-70'
                }`}
              >
                <Image src={img} alt="" fill className="object-cover" unoptimized />
              </button>
            ))}
          </div>
        )}
      </motion.div>

      {/* Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main content */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="lg:col-span-2 space-y-8"
        >
          {/* Quick specs */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {quickSpecs.map((spec) => (
              <div
                key={spec.label}
                className="bg-white rounded-2xl p-4 text-center shadow-sm border border-gray-100"
              >
                <spec.icon className="w-5 h-5 text-gold mx-auto mb-2" />
                <p className="text-lg font-bold text-navy">{String(spec.value)}</p>
                <p className="text-xs text-gray-500">{spec.label}</p>
              </div>
            ))}
          </div>

          {/* Description */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            <h2 className="text-xl font-bold font-playfair text-navy mb-4 flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-gold" />
              الوصف التسويقي
            </h2>
            <p className="text-gray-600 leading-relaxed whitespace-pre-line text-sm">
              {property.marketingDescription}
            </p>
          </div>

          {/* Amenities */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            <h2 className="text-xl font-bold font-playfair text-navy mb-4">المرافق والمميزات</h2>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {amenities.map((a) => (
                <div
                  key={a.label}
                  className={`flex items-center gap-2 p-3 rounded-xl text-sm ${
                    a.active
                      ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                      : 'bg-gray-50 text-gray-400 border border-gray-100'
                  }`}
                >
                  <a.icon className="w-4 h-4 shrink-0" />
                  {a.label}
                </div>
              ))}
            </div>
          </div>

          {/* Extra features */}
          {property.extraFeatures && property.extraFeatures.length > 0 && (
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
              <h2 className="text-xl font-bold font-playfair text-navy mb-4">مميزات إضافية</h2>
              <div className="flex flex-wrap gap-2">
                {property.extraFeatures.map((f, i) => (
                  <span
                    key={i}
                    className="px-3 py-1.5 bg-gradient-to-r from-gold/10 to-copper/10 text-navy rounded-full text-sm border border-gold/20"
                  >
                    {f}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Detailed specs */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            <h2 className="text-xl font-bold font-playfair text-navy mb-4">تفاصيل الوحدة</h2>
            <dl className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {detailSpecs.map((s) => (
                <div
                  key={s.label}
                  className="flex items-center justify-between gap-3 p-3 bg-cream/50 rounded-xl"
                >
                  <dt className="flex items-center gap-2 text-sm text-gray-500">
                    <s.icon className="w-4 h-4 text-gold shrink-0" />
                    {s.label}
                  </dt>
                  <dd className="font-semibold text-sm text-navy">{String(s.value)}</dd>
                </div>
              ))}
            </dl>
          </div>

          {/* Map */}
          {property.locationLat && property.locationLng && (
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
              <h2 className="text-xl font-bold font-playfair text-navy mb-4 flex items-center gap-2">
                <MapPin className="w-5 h-5 text-gold" />
                الموقع على الخريطة
              </h2>
              <div className="rounded-xl overflow-hidden">
                <MapView lat={property.locationLat} lng={property.locationLng} />
              </div>
            </div>
          )}

          {/* Installment Calculator */}
          {property.paymentMethod?.includes('تقسيط') && (
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
              <InstallmentCalculator totalPrice={totalPrice} />
            </div>
          )}
        </motion.div>

        {/* Sidebar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="lg:sticky lg:top-24 lg:self-start"
        >
          <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
            <div className="mb-4">
              <span className="inline-block px-2.5 py-1 bg-gold/10 text-gold text-xs font-semibold rounded-full mb-2">
                {property.propertyType}
              </span>
              <h1 className="text-2xl font-bold font-playfair text-navy mb-1">
                {property.projectName}
              </h1>
              <p className="text-sm text-gray-500 flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5" />
                {property.governorate?.nameAr} - {property.city?.nameAr}
              </p>
            </div>

            <div className="bg-gradient-to-r from-gold/5 to-copper/5 rounded-xl p-4 mb-4 border border-gold/10">
              <p className="text-2xl font-bold text-navy">
                {totalPrice.toLocaleString('ar-EG')}
                <span className="text-sm font-normal text-gray-500 mr-1">جنيه مصري</span>
              </p>
              <p className="text-xs text-gray-500 mt-1">
                سعر المتر: {pricePerSqm.toLocaleString('ar-EG')} جنيه / م²
              </p>
            </div>

            {property.installmentDetails && (
              <div className="bg-emerald-50 rounded-xl p-3 mb-4 border border-emerald-200">
                <p className="text-xs text-emerald-700 flex items-center gap-1.5">
                  <CreditCard className="w-3.5 h-3.5" />
                  {property.installmentDetails}
                </p>
              </div>
            )}

            <WhatsAppButton unitCode={property.unitCode} projectName={property.projectName} />

            <div className="mt-5 pt-5 border-t border-gray-100">
              <p className="text-xs text-gray-400 mb-2 flex items-center gap-1">
                <Building2 className="w-3.5 h-3.5" />
                المطور العقاري
              </p>
              <p className="font-semibold text-navy">{property.developer?.nameAr}</p>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Lightbox */}
      {lightboxOpen && (
        <Lightbox
          images={images}
          initialIndex={currentImage}
          onClose={() => setLightboxOpen(false)}
        />
      )}
    </div>
  );
}
