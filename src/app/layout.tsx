import type { Metadata } from 'next';
import { Cairo, Playfair_Display, Inter } from 'next/font/google';
import './globals.css';

const cairo = Cairo({
  subsets: ['arabic', 'latin'],
  variable: '--font-cairo',
});

const playfair = Playfair_Display({
  subsets: ['latin'],
  variable: '--font-playfair',
  weight: ['400', '500', '600', '700', '800', '900'],
});

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
});

export const metadata: Metadata = {
  title: 'عقارك | عقارات مصر - شقق، فيلات، أرضي',
  description:
    'منصة عقارية متكاملة للبحث عن العقارات في مصر - القاهرة، الجيزة، الإسكندرية، الساحل الشمالي',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ar" dir="rtl" className={`${cairo.variable} ${playfair.variable} ${inter.variable}`}>
      <body className="font-cairo bg-cream text-navy antialiased">{children}</body>
    </html>
  );
}
