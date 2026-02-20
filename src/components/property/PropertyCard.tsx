import Link from 'next/link';
import Image from 'next/image';

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
  const img = property.images[0] || 'https://placehold.co/400x300/FAF8F5/C9A84C?text=عقار';
  const price = Number(property.totalPrice).toLocaleString('ar-EG');
  const area = Number(property.totalArea).toLocaleString('ar-EG');

  return (
    <Link href={`/properties/${property.unitCode}`}>
      <article className="group rounded-xl overflow-hidden bg-white shadow-lg hover:shadow-xl border border-gray-100 hover:border-gold/50 transition-all">
        <div className="relative h-48 bg-gray-200 overflow-hidden">
          <Image
            src={img}
            alt={property.projectName}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-300"
            sizes="(max-width: 768px) 100vw, 33vw"
            unoptimized
          />
          <span className="absolute top-2 right-2 px-2 py-1 bg-gold text-navy text-xs font-bold rounded">
            {property.unitCode}
          </span>
          {property.status === 'متاحة للبيع' && (
            <span className="absolute top-2 left-2 px-2 py-1 bg-success text-white text-xs rounded">
              متاحة
            </span>
          )}
        </div>
        <div className="p-4">
          <p className="text-sm text-gray">{property.governorate.nameAr} - {property.city.nameAr}</p>
          <h3 className="font-semibold text-navy mt-1">{property.projectName}</h3>
          <p className="text-gold font-bold mt-2">{price} جنيه مصري</p>
          <div className="flex gap-4 mt-2 text-sm text-gray">
            <span>{property.bedroomsCount} غرف</span>
            <span>{property.bathroomsCount} حمام</span>
            <span>{area} م²</span>
          </div>
        </div>
      </article>
    </Link>
  );
}
