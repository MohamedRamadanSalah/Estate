import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const governoratesWithCities = [
  {
    nameAr: 'القاهرة',
    slug: 'cairo',
    sortOrder: 1,
    cities: [
      'مدينة نصر',
      'المعادي',
      'الزمالك',
      'مصر الجديدة',
      'التجمع الخامس',
      'الشروق',
      'بدر',
      'العبور',
      'المقطم',
      'عين شمس',
      'شبرا',
      'الدقي',
      'القطامية',
      'المعادي الجديدة',
      'الزيتون',
      'حدائق القبة',
      'النزهة',
      'مدينة السلام',
      'المطرية',
      'الوايلي',
      'الدراسة',
      'بولاق',
      'السيدة زينب',
      'الساحل',
      'روض الفرج',
    ],
  },
  {
    nameAr: 'الجيزة',
    slug: 'giza',
    sortOrder: 2,
    cities: [
      'الشيخ زايد',
      'أكتوبر',
      'حدائق الأهرام',
      'الدقي',
      'المهندسين',
      'فيصل',
      'إمبابة',
      'الهرم',
      'العمرانية',
      'أوسيم',
      'كرداسة',
      '6 أكتوبر',
      'الحوامدية',
      'البدرشين',
      'الصف',
      'مدينة 6 أكتوبر',
    ],
  },
  {
    nameAr: 'الإسكندرية',
    slug: 'alexandria',
    sortOrder: 3,
    cities: [
      'المنتزه',
      'سيدي جابر',
      'العجمي',
      'الجمرك',
      'الرمل',
      'سموحة',
      'الإسكندرية الجديدة',
      'برج العرب',
      'المندرة',
      'فلمنج',
      'ستانلي',
      'سان استيفانو',
      'العصافرة',
      'محرم بك',
      'كرموز',
      'غيط العنب',
      'الأزاريطة',
      'اللبان',
    ],
  },
  {
    nameAr: 'مطروح',
    slug: 'matrouh',
    sortOrder: 4,
    cities: [
      'مرسى مطروح',
      'الحمام',
      'الضبعة',
      'سيدي براني',
      'السلوم',
      'رأس الحكمة',
      'الساحل الشمالي',
      'العلمين',
      'سيوة',
      'نجيلة',
      'العلمين الجديدة',
    ],
  },
];

async function main() {
  console.log('بدء استيراد المحافظات والمدن...');

  for (const gov of governoratesWithCities) {
    const governorate = await prisma.governorate.upsert({
      where: { slug: gov.slug },
      update: {},
      create: {
        nameAr: gov.nameAr,
        slug: gov.slug,
        sortOrder: gov.sortOrder,
      },
    });

    for (let i = 0; i < gov.cities.length; i++) {
      const cityName = gov.cities[i];
      const slug = cityName
        .toLowerCase()
        .replace(/\s+/g, '-')
        .replace(/[^\w\u0600-\u06FF-]/g, '');

      await prisma.city.upsert({
        where: {
          governorateId_slug: { governorateId: governorate.id, slug },
        },
        update: { nameAr: cityName, sortOrder: i },
        create: {
          nameAr: cityName,
          slug,
          governorateId: governorate.id,
          sortOrder: i,
        },
      });
    }
    console.log(`تم استيراد ${gov.nameAr}: ${gov.cities.length} مدينة`);
  }

  const adminEmail = process.env.ADMIN_EMAIL ?? 'admin@example.com';
  const adminPassword = process.env.ADMIN_PASSWORD ?? 'admin123';
  const bcrypt = await import('bcryptjs');
  const hashFn = bcrypt.default?.hash ?? bcrypt.hash;
  const hashedPassword = await hashFn(adminPassword, 10);

  await prisma.admin.upsert({
    where: { email: adminEmail },
    update: {},
    create: {
      email: adminEmail,
      password: hashedPassword,
      nameAr: 'مدير النظام',
    },
  });

  console.log('تم إنشاء المسؤول الافتراضي');
  console.log('انتهى الاستيراد بنجاح.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
