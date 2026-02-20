import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ unitCode: string }> }
) {
  try {
    const { unitCode } = await params;
    const property = await prisma.property.findUnique({
      where: { unitCode: unitCode.toUpperCase() },
      include: { governorate: true, city: true, developer: true },
    });
    if (!property) {
      return NextResponse.json({ error: 'الوحدة غير موجودة' }, { status: 404 });
    }
    return NextResponse.json(property);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'خطأ في جلب البيانات' }, { status: 500 });
  }
}
