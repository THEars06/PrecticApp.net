'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../context/AuthContext';
import Sidebar from './components/Sidebar';
import Navbar from './components/Navbar';

export default function PanelLayout({ children }: { children: React.ReactNode }) {
  const { user, isAuthenticated, isLoading, logout } = useAuth();
  const router = useRouter();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push('/');
    }
  }, [isLoading, isAuthenticated, router]);

  // Rol kontrolü - sadece admin ve operator girebilir
  useEffect(() => {
    if (!isLoading && user && !user.role) {
      // Rolü olmayan kullanıcıyı çıkar
      logout();
    }
  }, [isLoading, user, logout]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="w-8 h-8 border-2 border-gray-200 border-t-[#2b2973] rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!isAuthenticated || !user?.role) return null;

  const isAdmin = user?.role === 'admin';

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Sidebar */}
      <Sidebar
        collapsed={sidebarCollapsed}
        setCollapsed={setSidebarCollapsed}
        mobileOpen={mobileMenuOpen}
        setMobileOpen={setMobileMenuOpen}
        isAdmin={isAdmin}
      />

      {/* Main Content */}
      <div className={`transition-all duration-300 ${sidebarCollapsed ? 'lg:pl-16' : 'lg:pl-60'}`}>
        {/* Top Navbar */}
        <Navbar
          user={user}
          isAdmin={isAdmin}
          onMenuClick={() => setMobileMenuOpen(true)}
          onLogout={logout}
        />

        {/* Page Content */}
        <main className="p-4 lg:p-6">
          {children}
        </main>
      </div>
    </div>
  );
}
