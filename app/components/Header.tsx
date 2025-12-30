'use client';

import Image from "next/image";
import { useEffect, useState } from "react";

export default function Header() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  return (
    <header className="w-full relative overflow-hidden min-h-[60vh] flex items-center" style={{ backgroundColor: '#1a1a2e' }}>
      {/* Simple Background Image with Overlay */}
      <div className="absolute inset-0 w-full h-full">
        <Image
          src="/PRCT-Banner.jpg"
          alt="banner"
          fill
          className="object-cover opacity-30"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-b from-[#1a1a2e]/50 via-[#1a1a2e]/40 to-[#1a1a2e]"></div>
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-6xl mx-auto px-6 sm:px-8 lg:px-12 py-16 md:py-24">
        <div className="max-w-3xl">
          {/* Main Title */}
          <div className="mb-6">
            <h1 
              className={`text-3xl md:text-4xl lg:text-5xl font-bold text-white leading-snug transition-all duration-500 ${
                isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
              }`}
            >
              Kıbrıs&apos;ta teknolojik uygulamalarla{" "}
              <span className="text-[#06b6d4]">hayatı kolaylaştır</span>
            </h1>
          </div>

          {/* Description */}
          <div 
            className={`max-w-xl transition-all duration-500 delay-150 ${
              isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
            }`}
          >
            <p className="text-base md:text-lg text-white/70 leading-relaxed">
              Fırsatlar, indirimler, etkinlik biletleri ve daha fazlası. 
              Tek üyelikle tüm platformlara eriş.
            </p>
          </div>
        </div>
      </div>
    </header>
  );
}
