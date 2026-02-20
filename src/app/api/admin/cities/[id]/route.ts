import { NextRequest, NextResponse } from 'next/server';
import { getAdminFromCookie } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const admin = await getAdminFromCookie();
  if (!admin) return NextResponse.json({ error: 'غير مصرح' }, { status: 401 });

  const { id } = await params;
  const { isActive, sortOrder } = await request.json();

  const updateData: { isActive?: boolean; sortOrder?: number } = {};
  if (typeof isActive === 'boolean') updateData.isActive = isActive;
  if (typeof sortOrder === 'number') updateData.sortOrder = sortOrder;

  const city = await prisma.city.update({
    where: { id: parseInt(id) },
    data: updateData,
  });
  return NextResponse.json(city);
}
