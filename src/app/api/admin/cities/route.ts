import { NextRequest, NextResponse } from 'next/server';
import { getAdminFromCookie } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import slugify from 'slugify';

export async function POST(request: NextRequest) {
  const admin = await getAdminFromCookie();
  if (!admin) return NextResponse.json({ error: 'غير مصرح' }, { status: 401 });

  try {
    const { nameAr, governorateId } = await request.json();

    if (!nameAr || !governorateId) {
      return NextResponse.json({ error: 'اسم المدينة والمحافظة مطلوبان' }, { status: 400 });
    }

    const governorate = await prisma.governorate.findUnique({
      where: { id: governorateId },
    });
    if (!governorate) {
      return NextResponse.json({ error: 'المحافظة غير موجودة' }, { status: 404 });
    }

    const slug = slugify(nameAr, { lower: true, strict: false })
      .replace(/[^\w\u0600-\u06FF-]/g, '')
      || nameAr.replace(/\s+/g, '-');

    const lastCity = await prisma.city.findFirst({
      where: { governorateId },
      orderBy: { sortOrder: 'desc' },
    });
    const sortOrder = (lastCity?.sortOrder ?? -1) + 1;

    const city = await prisma.city.create({
      data: {
        nameAr,
        slug,
        governorateId,
        sortOrder,
      },
    });

    return NextResponse.json(city);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'فشل إنشاء المدينة' }, { status: 500 });
  }
}
