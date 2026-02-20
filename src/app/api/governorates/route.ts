import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const governorates = await prisma.governorate.findMany({
      where: { isActive: true },
      orderBy: { sortOrder: 'asc' },
      include: { cities: { where: { isActive: true }, orderBy: { sortOrder: 'asc' } } },
    });
    return NextResponse.json(governorates);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'خطأ في جلب المحافظات' }, { status: 500 });
  }
}
