import { NextRequest, NextResponse } from 'next/server';
import { getAdminFromCookie } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { generateUnitCode } from '@/lib/unit-code';
import { Decimal } from '@prisma/client/runtime/library';

export async function POST(request: NextRequest) {
  const admin = await getAdminFromCookie();
  if (!admin) return NextResponse.json({ error: 'غير مصرح' }, { status: 401 });

  try {
    const body = await request.json();
    const governorate = await prisma.governorate.findUnique({
      where: { id: body.governorateId },
    });
    const city = await prisma.city.findUnique({
      where: { id: body.cityId },
    });
    if (!governorate || !city) {
      return NextResponse.json({ error: 'المحافظة أو المدينة غير صحيحة' }, { status: 400 });
    }

    const unitCode = await generateUnitCode(
      governorate.slug,
      body.propertyType,
      city.nameAr
    );

    let developer;
    if (body.developerId) {
      developer = await prisma.developer.findUnique({ where: { id: body.developerId } });
    }
    if (!developer) {
      const slug = (body.developerName || 'مطور').replace(/\s+/g, '-').replace(/[^\w\u0600-\u06FF-]/g, '').toLowerCase();
      developer = await prisma.developer.upsert({
        where: { slug },
        create: { nameAr: body.developerName || 'مطور', slug },
        update: { nameAr: body.developerName },
      });
    }

    const property = await prisma.property.create({
      data: {
        unitCode,
        governorateId: body.governorateId,
        cityId: body.cityId,
        district: body.district,
        locationLat: body.locationLat ? parseFloat(body.locationLat) : null,
        locationLng: body.locationLng ? parseFloat(body.locationLng) : null,
        projectName: body.projectName,
        developerId: developer.id,
        propertyType: body.propertyType,
        accommodationType: body.accommodationType,
        totalArea: new Decimal(body.totalArea),
        pricePerSqm: new Decimal(body.pricePerSqm),
        totalPrice: new Decimal(body.totalPrice),
        paymentMethod: body.paymentMethod,
        installmentDetails: body.installmentDetails || null,
        bedroomsCount: parseInt(body.bedroomsCount),
        bathroomsCount: parseInt(body.bathroomsCount),
        livingRoomsCount: body.livingRoomsCount ? parseInt(body.livingRoomsCount) : null,
        floorNumber: body.floorNumber ? parseInt(body.floorNumber) : null,
        totalFloors: body.totalFloors ? parseInt(body.totalFloors) : null,
        hasSwimmingPool: body.hasSwimmingPool === true || body.hasSwimmingPool === 'true',
        hasGarden: body.hasGarden === true || body.hasGarden === 'true',
        isFurnished: body.isFurnished,
        hasAirConditioning: body.hasAirConditioning === true || body.hasAirConditioning === 'true',
        finishingStatus: body.finishingStatus || null,
        status: body.status,
        marketingDescription: body.marketingDescription,
        images: Array.isArray(body.images) ? body.images : [],
        videoUrl: body.videoUrl || null,
        extraFeatures: Array.isArray(body.extraFeatures) ? body.extraFeatures : [],
      },
    });

    return NextResponse.json(property);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'فشل إنشاء الوحدة' }, { status: 500 });
  }
}
