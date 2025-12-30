'use client';

import { useState, useEffect } from 'react';
import Link from "next/link";
import Image from "next/image";
import { useAuth } from "../context/AuthContext";
import LoginModal from "./LoginModal";

export default function Navbar() {
  const { user, isAuthenticated, logout, isLoading } = useAuth();
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <>
      <nav 
        className={`w-full fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          isScrolled 
            ? 'bg-[#0a0a14]/90 backdrop-blur-md py-3' 
            : 'bg-transparent py-5'
        }`}
      >
        <div className="max-w-6xl mx-auto px-6">
          <div className="flex items-center justify-between">
            <Link href="/" className="flex items-center">
              <Image
                src="/deneme.png"
                alt="PracticApp Logo"
                width={160}
                height={40}
                priority
                className="h-9 w-auto"
              />
            </Link>

            <div className="flex items-center gap-4">
              {isLoading ? (
                <div className="w-6 h-6 border-2 border-white/20 border-t-[#06b6d4] rounded-full animate-spin"></div>
              ) : isAuthenticated ? (
                <>
                  <Link href="/panel" className="text-white/70 hover:text-white text-sm font-medium transition-colors">
                    Panel
                  </Link>
                  <span className="text-white/20 hidden sm:inline">|</span>
                  <span className="text-white/50 text-sm hidden sm:inline">{user?.fullName || user?.email}</span>
                  <button onClick={logout} className="text-sm text-white/50 hover:text-red-400 transition-colors">Çıkış</button>
                </>
              ) : (
                <button
                  onClick={() => setIsLoginModalOpen(true)}
                  className="px-5 py-2 bg-[#2b2973] text-white text-sm font-medium rounded-lg hover:bg-[#3a3a8c] transition-all"
                >
                  Giriş Yap
                </button>
              )}
            </div>
          </div>
        </div>
      </nav>

      <LoginModal isOpen={isLoginModalOpen} onClose={() => setIsLoginModalOpen(false)} />
    </>
  );
}
