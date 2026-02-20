'use client';

import { useState } from 'react';
import Image from 'next/image';
import MapView from './MapView';
import InstallmentCalculator from './InstallmentCalculator';
import WhatsAppButton from './WhatsAppButton';

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

export default function PropertyDetail({ property }: PropertyDetailProps) {
  const [currentImage, setCurrentImage] = useState(0);
  const images = property.images?.length ? property.images : ['https://placehold.co/800x500/FAF8F5/C9A84C?text=عقار'];
  const totalPrice = Number(property.totalPrice);
  const pricePerSqm = Number(property.pricePerSqm);
  const totalArea = Number(property.totalArea);

  const specs = [
    { label: 'كود الوحدة', value: property.unitCode },
    { label: 'المحافظة', value: property.governorate?.nameAr },
    { label: 'المدينة', value: property.city?.nameAr },
    { label: 'المنطقة', value: property.district },
    { label: 'المشروع', value: property.projectName },
    { label: 'المطور', value: property.developer?.nameAr },
    { label: 'نوع العقار', value: property.propertyType },
    { label: 'نوع الإقامة', value: property.accommodationType },
    { label: 'الحالة', value: property.status },
    { label: 'المساحة', value: `${totalArea.toLocaleString('ar-EG')} م²` },
    { label: 'سعر المتر', value: `${pricePerSqm.toLocaleString('ar-EG')} جنيه` },
    { label: 'عدد الغرف', value: property.bedroomsCount },
    { label: 'عدد الحمامات', value: property.bathroomsCount },
    { label: 'عدد الصالات', value: property.livingRoomsCount ?? '-' },
    { label: 'الطابق', value: property.floorNumber ?? '-' },
    { label: 'حمام سباحة', value: property.hasSwimmingPool ? 'نعم' : 'لا' },
    { label: 'حديقة خاصة', value: property.hasGarden ? 'نعم' : 'لا' },
    { label: 'التأثيث', value: property.isFurnished },
    { label: 'تكييف', value: property.hasAirConditioning ? 'نعم' : 'لا' },
    { label: 'طريقة السداد', value: property.paymentMethod },
    { label: 'التشطيب', value: property.finishingStatus ?? '-' },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="order-2 lg:order-1 lg:col-span-2">
          <div className="rounded-xl overflow-hidden bg-gray-200 mb-4">
            <div className="relative h-64 sm:h-80 md:h-96">
              <Image
                src={images[currentImage]}
                alt={property.projectName}
                fill
                className="object-cover"
                priority
                unoptimized={images[currentImage]?.startsWith('/')}
              />
              <span className="absolute top-4 right-4 px-4 py-2 bg-gold text-navy font-bold rounded-lg">
                {property.unitCode}
              </span>
              {property.status === 'متاحة للبيع' && (
                <span className="absolute top-4 left-4 px-3 py-1 bg-success text-white rounded">
                  متاحة للبيع
                </span>
              )}
            </div>
          </div>
          {images.length > 1 && (
            <div className="flex gap-2 overflow-x-auto pb-2">
              {images.map((img, i) => (
                <button
                  key={i}
                  onClick={() => setCurrentImage(i)}
                  className={`relative w-20 h-20 shrink-0 rounded-lg overflow-hidden border-2 ${
                    i === currentImage ? 'border-gold' : 'border-transparent'
                  }`}
                >
                  <Image src={img} alt="" fill className="object-cover" unoptimized />
                </button>
              ))}
            </div>
          )}

          <div className="mt-6 md:mt-8">
            <h2 className="text-xl md:text-2xl font-bold text-navy mb-3 md:mb-4">الوصف التسويقي</h2>
            <p className="text-gray leading-relaxed whitespace-pre-line">{property.marketingDescription}</p>
          </div>

          {property.extraFeatures && property.extraFeatures.length > 0 && (
            <div className="mt-6 md:mt-8">
              <h2 className="text-xl font-bold text-navy mb-3">مميزات إضافية</h2>
              <div className="flex flex-wrap gap-2">
                {property.extraFeatures.map((f, i) => (
                  <span key={i} className="px-3 py-1 bg-gold/20 text-navy rounded-full text-sm">
                    {f}
                  </span>
                ))}
              </div>
            </div>
          )}

          {property.locationLat && property.locationLng && (
            <div className="mt-6 md:mt-8">
              <h2 className="text-xl font-bold text-navy mb-3">الموقع على الخريطة</h2>
              <MapView lat={property.locationLat} lng={property.locationLng} />
            </div>
          )}

          {property.paymentMethod?.includes('تقسيط') && (
            <div className="mt-6 md:mt-8">
              <InstallmentCalculator totalPrice={totalPrice} />
            </div>
          )}
        </div>

        <div className="order-1 lg:order-2">
          <div className="bg-white rounded-xl shadow-lg p-4 md:p-6 lg:sticky lg:top-24">
            <h1 className="text-xl md:text-2xl font-bold text-navy mb-2">{property.projectName}</h1>
            <p className="text-gray">{property.governorate?.nameAr} - {property.city?.nameAr}</p>
            <p className="text-xl md:text-2xl font-bold text-gold mt-4">
              {totalPrice.toLocaleString('ar-EG')} جنيه مصري
            </p>
            <p className="text-sm text-gray mt-1">
              {pricePerSqm.toLocaleString('ar-EG')} جنيه / م²
            </p>
            {property.installmentDetails && (
              <p className="text-sm text-gray mt-2">{property.installmentDetails}</p>
            )}
            <WhatsAppButton unitCode={property.unitCode} projectName={property.projectName} />
            <div className="mt-5 md:mt-6 border-t pt-5 md:pt-6">
              <h3 className="font-semibold text-navy mb-3">مواصفات الوحدة</h3>
              <dl className="space-y-2 text-sm">
                {specs.map((s) => (
                  <div key={s.label} className="flex justify-between gap-3">
                    <dt className="text-gray">{s.label}</dt>
                    <dd className="font-medium">{String(s.value)}</dd>
                  </div>
                ))}
              </dl>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
