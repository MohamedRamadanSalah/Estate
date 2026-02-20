import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = Math.min(parseInt(searchParams.get('limit') || '12'), 50);
    const skip = (page - 1) * limit;
    const q = searchParams.get('q') || '';
    const governorate = searchParams.get('governorate') || '';
    const cityId = searchParams.get('cityId') || '';
    const propertyType = searchParams.get('type') || '';
    const minPrice = searchParams.get('minPrice') || '';
    const maxPrice = searchParams.get('maxPrice') || '';
    const minArea = searchParams.get('minArea') || '';
    const maxArea = searchParams.get('maxArea') || '';
    const hasPool = searchParams.get('hasPool') || '';
    const hasGarden = searchParams.get('hasGarden') || '';
    const sort = searchParams.get('sort') || 'newest';

    const where: Record<string, unknown> = {};

    if (q) {
      where.OR = [
        { unitCode: { contains: q, mode: 'insensitive' } },
        { projectName: { contains: q, mode: 'insensitive' } },
        { district: { contains: q, mode: 'insensitive' } },
        { marketingDescription: { contains: q, mode: 'insensitive' } },
        {
          developer: {
            nameAr: { contains: q, mode: 'insensitive' },
          },
        },
      ];
    }

    if (governorate) {
      where.governorate = { slug: governorate };
    }
    if (cityId) where.cityId = parseInt(cityId);
    if (propertyType) where.propertyType = propertyType;
    if (minPrice || maxPrice) {
      where.totalPrice = {};
      if (minPrice) (where.totalPrice as Record<string, number>).gte = parseFloat(minPrice);
      if (maxPrice) (where.totalPrice as Record<string, number>).lte = parseFloat(maxPrice);
    }
    if (minArea || maxArea) {
      where.totalArea = {};
      if (minArea) (where.totalArea as Record<string, number>).gte = parseFloat(minArea);
      if (maxArea) (where.totalArea as Record<string, number>).lte = parseFloat(maxArea);
    }
    if (hasPool === 'true') where.hasSwimmingPool = true;
    if (hasPool === 'false') where.hasSwimmingPool = false;
    if (hasGarden === 'true') where.hasGarden = true;
    if (hasGarden === 'false') where.hasGarden = false;

    const orderBy: Record<string, string> =
      sort === 'price_asc'
        ? { totalPrice: 'asc' }
        : sort === 'price_desc'
          ? { totalPrice: 'desc' }
          : sort === 'area'
            ? { totalArea: 'desc' }
            : { createdAt: 'desc' };

    const [properties, total] = await Promise.all([
      prisma.property.findMany({
        where,
        include: { governorate: true, city: true, developer: true },
        orderBy,
        skip,
        take: limit,
      }),
      prisma.property.count({ where }),
    ]);

    return NextResponse.json({
      properties,
      pagination: { page, limit, total, totalPages: Math.ceil(total / limit) },
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'خطأ في جلب البيانات' }, { status: 500 });
  }
}
