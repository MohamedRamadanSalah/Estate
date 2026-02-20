import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const governorateId = request.nextUrl.searchParams.get('governorateId');
    const governorateSlug = request.nextUrl.searchParams.get('governorate');

    if (governorateId) {
      const cities = await prisma.city.findMany({
        where: { governorateId: parseInt(governorateId), isActive: true },
        orderBy: { sortOrder: 'asc' },
      });
      return NextResponse.json(cities);
    }

    if (governorateSlug) {
      const gov = await prisma.governorate.findUnique({
        where: { slug: governorateSlug },
      });
      if (!gov) return NextResponse.json([]);
      const cities = await prisma.city.findMany({
        where: { governorateId: gov.id, isActive: true },
        orderBy: { sortOrder: 'asc' },
      });
      return NextResponse.json(cities);
    }

    return NextResponse.json([]);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'خطأ في جلب المدن' }, { status: 500 });
  }
}
