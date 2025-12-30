'use client';

import { useState, useRef, useEffect } from 'react';
import { usePathname } from 'next/navigation';

interface NavbarProps {
  user: {
    fullName?: string;
    email?: string;
    role?: string | null;
  } | null;
  isAdmin: boolean;
  onMenuClick: () => void;
  onLogout: () => void;
}

export default function Navbar({ user, isAdmin, onMenuClick, onLogout }: NavbarProps) {
  const pathname = usePathname();
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const getPageTitle = () => {
    if (pathname === '/panel') return 'Dashboard';
    if (pathname === '/panel/users') return 'Kullanıcılar';
    if (pathname === '/panel/mail') return 'Mail Sistemi';
    return '';
  };

  // Dropdown dışına tıklanınca kapat
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setUserDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = () => {
    setUserDropdownOpen(false);
    onLogout();
  };

  return (
    <header className="sticky top-0 z-30 h-14 bg-white/80 backdrop-blur-md border-b border-gray-200/60 px-4 flex items-center justify-between">
      {/* Mobile menu button */}
      <button onClick={onMenuClick} className="lg:hidden p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
        </svg>
      </button>

      {/* Page Title */}
      <h1 className="text-sm font-semibold text-gray-800 hidden lg:block">
        {getPageTitle()}
      </h1>

      {/* Spacer for mobile */}
      <div className="lg:hidden flex-1" />

      {/* User Dropdown */}
      <div className="relative" ref={dropdownRef}>
        <button
          onClick={() => setUserDropdownOpen(!userDropdownOpen)}
          className={`flex items-center gap-2 px-3 py-1.5 rounded-xl transition-all duration-200 ${
            userDropdownOpen ? 'bg-gray-100' : 'hover:bg-gray-50'
          }`}
        >
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#2b2973] to-[#4a3f9f] flex items-center justify-center text-white text-sm font-medium shadow-sm">
            {user?.fullName?.charAt(0) || user?.email?.charAt(0)?.toUpperCase()}
          </div>
          <div className="hidden sm:block text-left">
            <p className="text-sm font-medium text-gray-800">{user?.fullName || 'Kullanıcı'}</p>
            <p className="text-xs text-gray-500">{isAdmin ? 'Admin' : 'Operatör'}</p>
          </div>
          <svg className={`w-4 h-4 text-gray-400 transition-transform duration-200 ${userDropdownOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </button>

        {/* Dropdown Menu */}
        {userDropdownOpen && (
          <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-lg border border-gray-100 py-2 z-50 animate-in fade-in slide-in-from-top-2 duration-200">
            <div className="px-4 py-3 border-b border-gray-100">
              <p className="text-sm font-medium text-gray-900 truncate">{user?.fullName || 'Kullanıcı'}</p>
              <p className="text-xs text-gray-500 truncate">{user?.email}</p>
              <span className={`inline-flex mt-2 px-2 py-0.5 rounded-full text-xs font-medium ${
                isAdmin ? 'bg-amber-100 text-amber-700' : 'bg-blue-100 text-blue-700'
              }`}>
                {isAdmin ? 'Admin' : 'Operatör'}
              </span>
            </div>
            <div className="py-1">
              <button 
                onClick={handleLogout} 
                className="flex items-center gap-3 w-full px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition-colors"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                </svg>
                Çıkış Yap
              </button>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
