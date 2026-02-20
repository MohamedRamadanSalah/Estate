import { NextRequest, NextResponse } from 'next/server';
import { getAdminFromCookie } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { Decimal } from '@prisma/client/runtime/library';

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ unitCode: string }> }
) {
  const admin = await getAdminFromCookie();
  if (!admin) return NextResponse.json({ error: 'غير مصرح' }, { status: 401 });

  const { unitCode } = await params;
  const property = await prisma.property.findUnique({
    where: { unitCode: unitCode.toUpperCase() },
    include: { governorate: true, city: true, developer: true },
  });
  if (!property) return NextResponse.json({ error: 'غير موجود' }, { status: 404 });
  return NextResponse.json(property);
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ unitCode: string }> }
) {
  const admin = await getAdminFromCookie();
  if (!admin) return NextResponse.json({ error: 'غير مصرح' }, { status: 401 });

  const { unitCode } = await params;
  const body = await request.json();

  const updateData: Record<string, unknown> = {
    district: body.district,
    locationLat: body.locationLat ? parseFloat(body.locationLat) : null,
    locationLng: body.locationLng ? parseFloat(body.locationLng) : null,
    projectName: body.projectName,
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
  };

  if (body.developerName) {
    const slug = (body.developerName || 'مطور').replace(/\s+/g, '-').replace(/[^\w\u0600-\u06FF-]/g, '').toLowerCase();
    const developer = await prisma.developer.upsert({
      where: { slug },
      create: {
        nameAr: body.developerName,
        slug,
      },
      update: { nameAr: body.developerName },
    });
    updateData.developerId = developer.id;
  }

  const property = await prisma.property.update({
    where: { unitCode: unitCode.toUpperCase() },
    data: updateData,
  });
  return NextResponse.json(property);
}

export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ unitCode: string }> }
) {
  const admin = await getAdminFromCookie();
  if (!admin) return NextResponse.json({ error: 'غير مصرح' }, { status: 401 });

  const { unitCode } = await params;
  await prisma.property.delete({
    where: { unitCode: unitCode.toUpperCase() },
  });
  return NextResponse.json({ success: true });
}
