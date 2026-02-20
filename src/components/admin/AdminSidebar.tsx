'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import {
  LayoutDashboard,
  Building2,
  PlusCircle,
  MapPin,
  Users,
  Settings,
  LogOut,
  ChevronLeft,
  Menu,
  X,
} from 'lucide-react';

export default function AdminSidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const [open, setOpen] = useState(false);

  // Close sidebar on route change (mobile)
  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  // Prevent body scroll when sidebar is open on mobile
  useEffect(() => {
    if (open) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [open]);

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

  const sidebarContent = (
    <>
      {/* Logo / Brand */}
      <div className="p-5 lg:p-6 border-b border-white/10 flex items-center justify-between">
        <Link href="/admin/dashboard" className="flex items-center gap-3">
          <div className="w-9 h-9 lg:w-10 lg:h-10 bg-gold/20 rounded-xl flex items-center justify-center">
            <Building2 className="w-4 h-4 lg:w-5 lg:h-5 text-gold" />
          </div>
          <div>
            <h1 className="text-base lg:text-lg font-bold text-gold">عقارك</h1>
            <p className="text-[10px] text-cream/50 -mt-0.5">لوحة التحكم</p>
          </div>
        </Link>
        {/* Close button - mobile only */}
        <button
          onClick={() => setOpen(false)}
          className="lg:hidden w-8 h-8 flex items-center justify-center rounded-lg text-cream/60 hover:text-cream hover:bg-white/10 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
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
    </>
  );

  return (
    <>
      {/* Mobile top bar */}
      <div className="lg:hidden fixed top-0 right-0 left-0 z-40 bg-navy text-cream flex items-center justify-between px-4 py-3 shadow-lg">
        <Link href="/admin/dashboard" className="flex items-center gap-2">
          <div className="w-8 h-8 bg-gold/20 rounded-lg flex items-center justify-center">
            <Building2 className="w-4 h-4 text-gold" />
          </div>
          <span className="text-sm font-bold text-gold">عقارك</span>
        </Link>
        <button
          onClick={() => setOpen(true)}
          className="w-9 h-9 flex items-center justify-center rounded-lg hover:bg-white/10 transition-colors"
        >
          <Menu className="w-5 h-5" />
        </button>
      </div>

      {/* Mobile backdrop */}
      {open && (
        <div
          className="lg:hidden fixed inset-0 z-40 bg-black/50 backdrop-blur-sm"
          onClick={() => setOpen(false)}
        />
      )}

      {/* Sidebar - mobile drawer */}
      <aside
        className={`
          fixed top-0 right-0 bottom-0 z-50 w-72 bg-gradient-to-b from-navy to-navy-800 text-cream flex flex-col shadow-2xl border-l border-gold/10
          transition-transform duration-300 ease-in-out
          lg:relative lg:translate-x-0 lg:z-auto
          ${open ? 'translate-x-0' : 'translate-x-full lg:translate-x-0'}
        `}
      >
        {sidebarContent}
      </aside>
    </>
  );
}
