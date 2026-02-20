'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
  LayoutDashboard,
  Building2,
  PlusCircle,
  MapPin,
  Users,
  Settings,
  LogOut,
  ChevronLeft,
} from 'lucide-react';

export default function AdminSidebar() {
  const pathname = usePathname();
  const router = useRouter();

  const handleLogout = async () => {
    await fetch('/api/admin/logout', { method: 'POST' });
    router.push('/admin/login');
    router.refresh();
  };

  const links = [
    { href: '/admin/dashboard', label: 'لوحة التحكم', icon: LayoutDashboard },
    { href: '/admin/properties', label: 'إدارة الوحدات', icon: Building2 },
    { href: '/admin/properties/new', label: 'إضافة وحدة', icon: PlusCircle },
    { href: '/admin/cities', label: 'إدارة المدن', icon: MapPin },
    { href: '/admin/developers', label: 'إدارة المطورين', icon: Users },
    { href: '/admin/settings', label: 'الإعدادات', icon: Settings },
  ];

  const isActive = (link: { href: string }) =>
    pathname === link.href || pathname.startsWith(link.href + '/');

  return (
    <aside className="w-72 bg-gradient-to-b from-navy to-navy-800 text-cream flex flex-col shadow-2xl border-l border-gold/10">
      {/* Logo / Brand */}
      <div className="p-6 border-b border-white/10">
        <Link href="/admin/dashboard" className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gold/20 rounded-xl flex items-center justify-center">
            <Building2 className="w-5 h-5 text-gold" />
          </div>
          <div>
            <h1 className="text-lg font-bold text-gold">عقارك</h1>
            <p className="text-[10px] text-cream/50 -mt-0.5">لوحة التحكم</p>
          </div>
        </Link>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-4 space-y-1">
        <p className="text-[10px] uppercase text-cream/30 font-semibold tracking-wider px-4 mb-3">القائمة الرئيسية</p>
        {links.map((link) => {
          const Icon = link.icon;
          const active = isActive(link);
          return (
            <Link
              key={link.href}
              href={link.href}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm transition-all duration-200 group ${
                active
                  ? 'bg-gold/15 text-gold shadow-lg shadow-gold/5 border border-gold/20'
                  : 'hover:bg-white/5 text-cream/70 hover:text-cream border border-transparent'
              }`}
            >
              <Icon className={`w-5 h-5 transition-colors ${active ? 'text-gold' : 'text-cream/40 group-hover:text-cream/70'}`} />
              <span className="flex-1">{link.label}</span>
              {active && <ChevronLeft className="w-4 h-4 text-gold/50" />}
            </Link>
          );
        })}
      </nav>

      {/* Logout */}
      <div className="p-4 border-t border-white/10">
        <button
          onClick={handleLogout}
          className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl border border-red-500/30 text-red-400 hover:bg-red-500/10 hover:border-red-500/50 transition-all duration-200 text-sm"
        >
          <LogOut className="w-4 h-4" />
          تسجيل الخروج
        </button>
      </div>
    </aside>
  );
}
