'use client';

import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';

interface SidebarProps {
  collapsed: boolean;
  setCollapsed: (collapsed: boolean) => void;
  mobileOpen: boolean;
  setMobileOpen: (open: boolean) => void;
  isAdmin: boolean;
}

type MenuItem = { name: string; href: string; icon: string };

type MenuSection = {
  label?: string;
  items: MenuItem[];
};

export default function Sidebar({ collapsed, setCollapsed, mobileOpen, setMobileOpen, isAdmin }: SidebarProps) {
  const pathname = usePathname();

  const sections: MenuSection[] = [
    {
      items: [
        {
          name: 'Dashboard',
          href: '/panel',
          icon: 'M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6',
        },
        ...(isAdmin
          ? [
              {
                name: 'Kullanıcılar',
                href: '/panel/users',
                icon: 'M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z',
              },
            ]
          : []),
        {
          name: 'Mail Abonelikten Çıkanlar',
          href: '/panel/mail-unsubscribes',
          icon: 'M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636',
        },
      ],
    },
    {
      label: 'Mail',
      items: [
        {
          name: 'Mail Gönder',
          href: '/panel/mail',
          icon: 'M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z',
        },
        {
          name: 'Mail Şablonları',
          href: '/panel/templates',
          icon: 'M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6zM16 13a1 1 0 011-1h2a1 1 0 011 1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-6z',
        },
        {
          name: 'Mail Raporları',
          href: '/panel/mail-reports',
          icon: 'M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z',
        },
      ],
    },
    {
      label: 'SMS',
      items: [
        {
          name: 'SMS Gönder',
          href: '/panel/sms',
          icon: 'M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z',
        },
        {
          name: 'SMS Şablonları',
          href: '/panel/sms-templates',
          icon: 'M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z',
        },
        {
          name: 'SMS Raporları',
          href: '/panel/sms-reports',
          icon: 'M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z',
        },
        {
          name: 'Otomatik Bildirimler',
          href: '/panel/otomatik-bildirimler',
          icon: 'M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9',
        },
      ],
    },
  ];

  return (
    <>
      {mobileOpen && (
        <div className="fixed inset-0 bg-black/30 z-40 lg:hidden" onClick={() => setMobileOpen(false)} />
      )}

      <aside
        className={`fixed top-0 left-0 z-50 h-full bg-white/95 backdrop-blur-md border-r border-gray-200/60 transition-all duration-300 ${
          collapsed ? 'w-16' : 'w-60'
        } ${mobileOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0 shadow-sm`}
      >
        <div className="h-14 flex items-center justify-between px-3 border-b border-gray-100">
          <Link href="/" className="flex items-center">
            {collapsed ? (
              <div className="w-8 h-8 rounded bg-[#2b2973] flex items-center justify-center text-white font-bold text-sm">P</div>
            ) : (
              <Image src="/deneme.png" alt="Logo" width={120} height={32} className="h-8 w-auto" />
            )}
          </Link>
          <button
            onClick={() => setCollapsed(!collapsed)}
            className="hidden lg:flex p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded"
          >
            <svg className={`w-4 h-4 transition-transform ${collapsed ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 19l-7-7 7-7m8 14l-7-7 7-7" />
            </svg>
          </button>
          <button onClick={() => setMobileOpen(false)} className="lg:hidden p-1.5 text-gray-400 hover:text-gray-600">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <nav className="p-2 space-y-4 overflow-y-auto h-[calc(100%-3.5rem)]">
          {sections.map((section, sectionIndex) => (
            <div key={section.label || `top-${sectionIndex}`} className="space-y-1">
              {section.label && !collapsed ? (
                <div className="px-3 pt-1 pb-1 text-[11px] font-semibold uppercase tracking-wide text-gray-400">
                  {section.label}
                </div>
              ) : null}
              {section.label && collapsed ? <div className="mx-2 border-t border-gray-100" /> : null}
              {section.items.map((item) => {
                const isActive =
                  item.href === '/panel'
                    ? pathname === '/panel'
                    : pathname === item.href || pathname.startsWith(`${item.href}/`);
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                      isActive ? 'bg-[#2b2973] text-white' : 'text-gray-600 hover:bg-gray-100'
                    } ${collapsed ? 'justify-center' : ''}`}
                    title={collapsed ? item.name : ''}
                  >
                    <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d={item.icon} />
                    </svg>
                    {!collapsed && <span>{item.name}</span>}
                  </Link>
                );
              })}
            </div>
          ))}
        </nav>
      </aside>
    </>
  );
}
