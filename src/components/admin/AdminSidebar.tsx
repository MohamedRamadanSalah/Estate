'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';

export default function AdminSidebar() {
  const pathname = usePathname();
  const router = useRouter();

  const handleLogout = async () => {
    await fetch('/api/admin/logout', { method: 'POST' });
    router.push('/admin/login');
    router.refresh();
  };

  const links = [
    { href: '/admin/dashboard', label: 'لوحة التحكم' },
    { href: '/admin/properties', label: 'إدارة الوحدات' },
    { href: '/admin/properties/new', label: 'إضافة وحدة' },
    { href: '/admin/cities', label: 'إدارة المدن' },
    { href: '/admin/developers', label: 'إدارة المطورين' },
    { href: '/admin/settings', label: 'الإعدادات' },
  ];

  const isActive = (link: { href: string }) =>
    pathname === link.href || pathname.startsWith(link.href + '/');

  return (
    <aside className="w-64 bg-navy text-cream flex flex-col">
      <div className="p-6">
        <Link href="/admin/dashboard" className="text-xl font-bold text-gold">عقارك - لوحة التحكم</Link>
      </div>
      <nav className="flex-1 px-4 space-y-1">
        {links.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className={`block px-4 py-3 rounded-lg ${
              isActive(link) ? 'bg-gold/20 text-gold' : 'hover:bg-white/10'
            }`}
          >
            {link.label}
          </Link>
        ))}
      </nav>
      <div className="p-4">
        <button
          onClick={handleLogout}
          className="w-full px-4 py-2 rounded-lg border border-cream/30 hover:bg-white/10"
        >
          تسجيل الخروج
        </button>
      </div>
    </aside>
  );
}
