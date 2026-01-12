'use client';

import Image from "next/image";
import { useState } from "react";

interface ServiceCardProps {
  title: string;
  image: string;
  description: string;
  websiteUrl?: string;
  accentColor?: string;
  index?: number;
  imageScale?: number; // Logo boyutu için (varsayılan 1)
  socialLinks?: {
    facebook?: string;
    instagram?: string;
    twitter?: string;
    youtube?: string;
    tiktok?: string;
  };
}

export default function ServiceCard({
  title,
  image,
  description,
  websiteUrl,
  socialLinks,
  accentColor = "#06b6d4",
  imageScale = 1,
}: ServiceCardProps) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div 
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="group relative"
    >
      {/* Phone Frame */}
      <div 
        className="relative mx-auto transition-transform duration-300 hover:-translate-y-2"
        style={{ 
          width: '280px',
          height: '560px',
        }}
      >
        {/* Phone Glow */}
        <div 
          className="absolute -inset-4 rounded-[50px] opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-2xl pointer-events-none"
          style={{ background: `radial-gradient(circle, ${accentColor}30, transparent 70%)` }}
        ></div>

        {/* Phone Body */}
        <div 
          className="relative w-full h-full rounded-[45px] p-2"
          style={{ 
            background: 'linear-gradient(145deg, #2a2a3a, #1a1a28)',
            boxShadow: isHovered 
              ? `0 50px 100px -20px rgba(0,0,0,0.8), 0 0 60px ${accentColor}20, inset 0 1px 0 rgba(255,255,255,0.1)` 
              : '0 30px 60px -15px rgba(0,0,0,0.6), inset 0 1px 0 rgba(255,255,255,0.05)',
            border: '1px solid rgba(255,255,255,0.1)',
          }}
        >
          {/* Phone Notch */}
          <div className="absolute top-4 left-1/2 -translate-x-1/2 z-20 w-28 h-7 bg-black rounded-full flex items-center justify-center pointer-events-none">
            <div className="w-2 h-2 rounded-full bg-gray-800"></div>
          </div>

          {/* Phone Screen */}
          <div 
            className="relative w-full h-full rounded-[38px] overflow-hidden"
            style={{ background: '#000000' }}
          >
            {/* App Image */}
            <div className="relative h-40 w-full mt-8 overflow-hidden pointer-events-none flex items-center justify-center">
              <Image
                src={image}
                alt={title}
                fill
                className="object-contain p-8 transition-transform duration-700 group-hover:scale-110 brightness-0 invert"
                style={{ transform: `scale(${imageScale})` }}
              />
              
              <div className="absolute inset-0 bg-gradient-to-t from-[#000000] via-transparent to-transparent"></div>
            </div>

            {/* App Content */}
            <div className="relative p-5 flex flex-col" style={{ height: 'calc(100% - 192px)' }}>
              <h3 
                className="text-xl font-bold text-white mb-2"
                style={{ textShadow: isHovered ? `0 0 20px ${accentColor}50` : 'none' }}
              >
                {title}
              </h3>
              
              <p className="text-white/60 text-sm leading-relaxed mb-4 flex-grow">
                {description}
              </p>

              {/* Buttons */}
              <div className="flex gap-2 mb-4">
                <a 
                  href={websiteUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 py-2.5 rounded-xl text-xs font-semibold text-white text-center transition-all duration-300 cursor-pointer hover:opacity-80"
                  style={{ 
                    background: `linear-gradient(135deg, ${accentColor}, ${accentColor}aa)`,
                    boxShadow: isHovered ? `0 10px 30px ${accentColor}40` : 'none',
                  }}
                >
                  Siteye Git
                </a>
                <a 
                  href={websiteUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 py-2.5 rounded-xl text-xs font-semibold text-center transition-all duration-300 border cursor-pointer hover:opacity-80"
                  style={{ 
                    borderColor: `${accentColor}50`,
                    color: accentColor,
                    background: `${accentColor}10`,
                  }}
                >
                  İndir
                </a>
              </div>

              {/* Social Icons */}
              <div className="flex justify-center gap-2 pt-3 border-t border-white/10">
                {socialLinks?.instagram && (
                  <a href={socialLinks.instagram} target="_blank" rel="noopener noreferrer"
                    className="w-9 h-9 rounded-xl bg-white/5 flex items-center justify-center text-white/40 hover:text-pink-400 hover:bg-pink-400/20 hover:scale-110 transition-all duration-200 cursor-pointer">
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/></svg>
                  </a>
                )}
                {socialLinks?.facebook && (
                  <a href={socialLinks.facebook} target="_blank" rel="noopener noreferrer"
                    className="w-9 h-9 rounded-xl bg-white/5 flex items-center justify-center text-white/40 hover:text-blue-400 hover:bg-blue-400/20 hover:scale-110 transition-all duration-200 cursor-pointer">
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
                  </a>
                )}
                {socialLinks?.twitter && (
                  <a href={socialLinks.twitter} target="_blank" rel="noopener noreferrer"
                    className="w-9 h-9 rounded-xl bg-white/5 flex items-center justify-center text-white/40 hover:text-sky-400 hover:bg-sky-400/20 hover:scale-110 transition-all duration-200 cursor-pointer">
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
                  </a>
                )}
                {socialLinks?.youtube && (
                  <a href={socialLinks.youtube} target="_blank" rel="noopener noreferrer"
                    className="w-9 h-9 rounded-xl bg-white/5 flex items-center justify-center text-white/40 hover:text-red-500 hover:bg-red-500/20 hover:scale-110 transition-all duration-200 cursor-pointer">
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/></svg>
                  </a>
                )}
                {socialLinks?.tiktok && (
                  <a href={socialLinks.tiktok} target="_blank" rel="noopener noreferrer"
                    className="w-9 h-9 rounded-xl bg-white/5 flex items-center justify-center text-white/40 hover:text-white hover:bg-white/20 hover:scale-110 transition-all duration-200 cursor-pointer">
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z"/></svg>
                  </a>
                )}
              </div>
            </div>

            <div className="absolute bottom-2 left-1/2 -translate-x-1/2 w-32 h-1 bg-white/30 rounded-full pointer-events-none"></div>
          </div>
        </div>

        <div 
          className="absolute -bottom-20 left-1/2 -translate-x-1/2 w-48 h-20 opacity-20 blur-xl pointer-events-none"
          style={{ background: `radial-gradient(ellipse, ${accentColor}50, transparent)` }}
        ></div>
      </div>
    </div>
  );
}
