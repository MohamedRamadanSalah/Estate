import { prisma } from './prisma';
import { GOV_CODES, PROPERTY_TYPE_CODES, getCityCode } from './constants';

export async function generateUnitCode(
  governorateSlug: string,
  propertyTypeAr: string,
  cityNameAr: string
): Promise<string> {
  const govCode = GOV_CODES[governorateSlug] ?? 'XXX';
  const typeCode = PROPERTY_TYPE_CODES[propertyTypeAr] ?? 'OTH';
  const cityCode = getCityCode(cityNameAr);

  const now = new Date();
  const year = String(now.getFullYear()).slice(-2);
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const prefix = `${govCode}-${typeCode}-${cityCode}-${year}${month}`;

  const lastProperty = await prisma.property.findFirst({
    where: { unitCode: { startsWith: prefix } },
    orderBy: { unitCode: 'desc' },
  });

  let sequence = 1;
  if (lastProperty) {
    const parts = lastProperty.unitCode.split('-');
    const lastSeq = parseInt(parts[parts.length - 1], 10);
    sequence = (lastSeq || 0) + 1;
  }

  return `${prefix}-${String(sequence).padStart(4, '0')}`;
}
