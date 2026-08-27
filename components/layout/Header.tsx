'use client';

import { useState, useEffect, useRef } from 'react';
import Link           from 'next/link';
import Image          from 'next/image';
import { usePathname } from 'next/navigation';
import { useSelector } from 'react-redux';
import { RootState }  from '@/store';
import { LiveSearchBar } from '@/components/search/LiveSearchBar';

const NAV = [
  { label: 'Fridges',          href: '/products?category=KITCHEN&subcategory=fridges'          },
  { label: 'Washing Machines', href: '/products?category=KITCHEN&subcategory=washing-machines' },
  { label: 'Water Dispensers', href: '/products?category=KITCHEN&subcategory=water-dispensers' },
  { label: 'Hobs & Hoods',     href: '/products?category=KITCHEN&subcategory=built-in'         },
  { label: 'Smart TVs',        href: '/products?category=AUDIO_TV'                             },
  { label: 'Smartphones',      href: '/products?category=SMARTPHONES'                          },
  { label: 'Laptops',          href: '/products?category=LAPTOPS'                              },
  { label: 'All Products',     href: '/products'                                               },
];

function CustomerCareButton() {
  const [open, setOpen] = useState(false);
  return (
    <>
      <button onClick={() => setOpen(v => !v)} aria-label="Customer Care"
        className="fixed bottom-5 left-5 sm:bottom-6 sm:left-6 z-[60] w-12 h-12 sm:w-14 sm:h-14 rounded-full flex items-center justify-center shadow-2xl transition-transform hover:scale-105 active:scale-95 group"
        style={{ background: '#25D366', boxShadow: '0 4px 24px rgba(37,211,102,0.45)' }}>
        <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
        </svg>
      </button>
      {open && (
        <>
          <div className="fixed inset-0 z-[59] bg-black/40 backdrop-blur-xs" onClick={() => setOpen(false)}/>
          <div className="fixed bottom-20 sm:bottom-24 left-4 sm:left-6 z-[60] w-[calc(100vw-2rem)] sm:w-88 bg-white rounded-3xl shadow-2xl overflow-hidden border border-gray-100 animate-fade-up">
            <div className="px-5 py-4 flex items-center justify-between bg-[#0C0F17] text-white border-b border-white/10">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-[#25D366] flex items-center justify-center shadow-md">
                  <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                  </svg>
                </div>
                <div>
                  <p className="text-white font-bold text-sm">Need Help or Placing an Order?</p>
                  <p className="text-white/70 text-[11px]">Smartech Kenya Concierge</p>
                </div>
              </div>
              <button onClick={() => setOpen(false)} className="text-white/70 hover:text-white transition-colors p-1.5 rounded-lg hover:bg-white/10">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12"/>
                </svg>
              </button>
            </div>
            
            <div className="p-4 space-y-2.5 bg-gray-50">
              {/* WhatsApp Option */}
              <a
                href="https://wa.me/254746722417?text=Hello%20Smartech%20Kenya%2C%20I%20want%20to%20inquire%20about%20your%20products"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 p-3 rounded-2xl bg-[#25D366] text-white font-bold text-sm shadow-md hover:bg-[#20BD5A] transition-all"
              >
                <svg className="w-5 h-5 shrink-0" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                </svg>
                <div className="flex-1 text-left">
                  <p className="leading-tight">Chat on WhatsApp</p>
                  <p className="text-[11px] font-normal opacity-90">+254 746 722 417 (Instant Reply)</p>
                </div>
              </a>

              {/* TikTok Option */}
              <a
                href="https://tiktok.com/@smartechkenya"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 p-3 rounded-2xl bg-[#000000] text-white font-bold text-sm shadow-md hover:bg-[#1A1A1A] transition-all border border-white/10"
              >
                <svg className="w-5 h-5 shrink-0 text-[#25F4EE]" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-2.88 2.5 2.89 2.89 0 01-2.89-2.89 2.89 2.89 0 012.89-2.89c.28 0 .54.04.79.1V9.01a6.33 6.33 0 00-.79-.05 6.34 6.34 0 00-6.34 6.34 6.34 6.34 0 006.34 6.34 6.34 6.34 0 006.33-6.34V8.69a8.24 8.24 0 004.84 1.56V6.78a4.85 4.85 0 01-1.07-.09z"/>
                </svg>
                <div className="flex-1 text-left">
                  <p className="leading-tight">Follow on TikTok</p>
                  <p className="text-[11px] font-normal text-gray-300">@smartechkenya (Product Videos)</p>
                </div>
              </a>

              {/* Email Option */}
              <a
                href="mailto:smartechkenya01@gmail.com"
                className="flex items-center gap-3 p-3 rounded-2xl bg-white border border-gray-200 text-gray-800 font-bold text-sm shadow-xs hover:border-[#F97316] transition-all"
              >
                <svg className="w-5 h-5 shrink-0 text-[#F97316]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/>
                </svg>
                <div className="flex-1 text-left">
                  <p className="leading-tight">Email Support</p>
                  <p className="text-[11px] font-normal text-gray-500">smartechkenya01@gmail.com</p>
                </div>
              </a>
            </div>
          </div>
        </>
      )}
    </>
  );
}

export function Header() {
  const pathname  = usePathname();
  const cartItems = useSelector((s: RootState) => s.cart?.items ?? []);
  const cartCount = cartItems.reduce((n: number, i: any) => n + (i.quantity ?? 1), 0);

  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const searchRef = useRef<HTMLInputElement>(null);

  useEffect(() => { setMobileOpen(false); }, [pathname]);
  useEffect(() => { if (searchOpen) setTimeout(() => searchRef.current?.focus(), 50); }, [searchOpen]);

  useEffect(() => {
    const fn = (e: KeyboardEvent) => {
      if (e.key === 'Escape') { setSearchOpen(false); setMobileOpen(false); }
    };
    window.addEventListener('keydown', fn);
    return () => window.removeEventListener('keydown', fn);
  }, []);

  if (pathname?.startsWith('/admin')) {
    return null;
  }

  return (
    <>
      {/* ── TOP INFO & SOCIAL BAR (Highly Visible WhatsApp, TikTok, Email) ── */}
      <div className="bg-[#0A0D14] text-white text-[11px] py-2 px-4 sm:px-6 border-b border-white/10">
        <div className="max-w-[1440px] 2xl:max-w-[1600px] mx-auto flex items-center justify-between flex-wrap gap-x-4 gap-y-1.5">
          {/* Location */}
          <div className="flex items-center gap-1.5 text-gray-300">
            <svg className="w-3.5 h-3.5 shrink-0 text-[#F97316]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/>
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/>
            </svg>
            <span className="truncate">Gaberone Plaza, 4th Floor, Shop A13 — Nairobi</span>
          </div>

          {/* Social Channels: WhatsApp, TikTok, Instagram, Email */}
          <div className="flex items-center gap-2 sm:gap-2.5 ml-auto">
            {/* WhatsApp */}
            <a
              href="https://wa.me/254746722417?text=Hi%20Smartech%20Kenya%2C%20I%20want%20to%20order"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="WhatsApp"
              title="Chat on WhatsApp (+254 746 722 417)"
              className="w-7 h-7 rounded-full flex items-center justify-center font-bold text-white bg-[#25D366] hover:bg-[#20BD5A] shadow-xs transition-all hover:scale-110 active:scale-95"
            >
              <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
              </svg>
            </a>

            {/* TikTok */}
            <a
              href="https://tiktok.com/@smartechkenya"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="TikTok"
              title="TikTok (@smartechkenya)"
              className="w-7 h-7 rounded-full flex items-center justify-center text-gray-200 hover:text-white bg-white/10 hover:bg-white/20 border border-white/10 transition-all hover:scale-110 active:scale-95"
            >
              <svg className="w-3.5 h-3.5 text-[#25F4EE] fill-current" viewBox="0 0 24 24">
                <path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-2.88 2.5 2.89 2.89 0 01-2.89-2.89 2.89 2.89 0 012.89-2.89c.28 0 .54.04.79.1V9.01a6.33 6.33 0 00-.79-.05 6.34 6.34 0 00-6.34 6.34 6.34 6.34 0 006.34 6.34 6.34 6.34 0 006.33-6.34V8.69a8.24 8.24 0 004.84 1.56V6.78a4.85 4.85 0 01-1.07-.09z"/>
              </svg>
            </a>

            {/* Instagram */}
            <a
              href="https://instagram.com/smartechkenya"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Instagram"
              title="Instagram (@smartechkenya)"
              className="w-7 h-7 rounded-full flex items-center justify-center text-white bg-[#E1306C] hover:bg-[#C13584] shadow-xs transition-all hover:scale-110 active:scale-95"
            >
              <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/>
              </svg>
            </a>

            {/* Email */}
            <a
              href="mailto:smartechkenya01@gmail.com"
              aria-label="Email"
              title="Email Support (smartechkenya01@gmail.com)"
              className="w-7 h-7 rounded-full flex items-center justify-center text-white bg-[#F97316] hover:bg-[#EA580C] shadow-xs transition-all hover:scale-110 active:scale-95"
            >
              <svg className="w-3.5 h-3.5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/>
              </svg>
            </a>
          </div>
        </div>
      </div>

      <CustomerCareButton />

      {/* ── MAIN HEADER — always solid white ───────────────────────────── */}
      <header className="sticky top-0 z-50 bg-white border-b border-gray-100 shadow-[0_1px_12px_rgba(0,0,0,0.06)]">

        <div className="max-w-[1440px] 2xl:max-w-[1600px] mx-auto px-4 sm:px-6 flex items-center gap-3 sm:gap-4 h-[60px] sm:h-[64px]">

          {/* Logo */}
          <Link href="/" className="shrink-0 flex items-center">
            <Image src="/logo.png" alt="Smartech Kenya" width={140} height={40} priority
              className="object-contain h-8 sm:h-9 w-auto"/>
          </Link>

          {/* Desktop search */}
          <div className="hidden md:flex flex-1 max-w-xl mx-auto px-2">
            <LiveSearchBar />
          </div>

          {/* Right actions */}
          <div className="flex items-center gap-1.5 ml-auto md:ml-0">

            {/* Mobile search */}
            <button onClick={() => setSearchOpen(!searchOpen)}
              className="md:hidden p-2.5 rounded-xl text-gray-600 hover:bg-gray-100 transition-colors">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
              </svg>
            </button>

            {/* TikTok link - desktop */}
            <a
              href="https://tiktok.com/@smartechkenya"
              target="_blank"
              rel="noopener noreferrer"
              className="hidden lg:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold text-black bg-gray-100 hover:bg-gray-200 transition-all"
              title="Watch on TikTok"
            >
              <svg className="w-3.5 h-3.5 text-black" fill="currentColor" viewBox="0 0 24 24">
                <path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-2.88 2.5 2.89 2.89 0 01-2.89-2.89 2.89 2.89 0 012.89-2.89c.28 0 .54.04.79.1V9.01a6.33 6.33 0 00-.79-.05 6.34 6.34 0 00-6.34 6.34 6.34 6.34 0 006.34 6.34 6.34 6.34 0 006.33-6.34V8.69a8.24 8.24 0 004.84 1.56V6.78a4.85 4.85 0 01-1.07-.09z"/>
              </svg>
              <span>TikTok</span>
            </a>

            {/* WhatsApp — desktop */}
            <a href="https://wa.me/254746722417?text=Hi%20Smartech%20Kenya%2C%20I%20want%20to%20order"
              target="_blank" rel="noopener noreferrer"
              className="hidden md:inline-flex items-center gap-2 px-3.5 sm:px-4 py-2 rounded-xl text-xs font-bold
                         text-white bg-[#25D366] hover:bg-[#20BD5A] shadow-sm transition-all hover:scale-102 active:scale-98">
              <svg className="w-4 h-4 fill-currentColor" viewBox="0 0 24 24">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
              </svg>
              <span>Order on WhatsApp</span>
            </a>

            {/* Cart with live badge */}
            <Link href="/cart" className="relative p-2.5 rounded-xl text-gray-600 hover:bg-gray-100 transition-colors">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"/>
              </svg>
              {cartCount > 0 && (
                <span className="absolute top-1 right-1 min-w-[18px] h-[18px] px-1 rounded-full text-[9px] font-bold
                                 flex items-center justify-center text-white"
                  style={{background:'#F97316'}}>
                  {cartCount > 9 ? '9+' : cartCount}
                </span>
              )}
            </Link>

            {/* Mobile menu */}
            <button onClick={() => setMobileOpen(!mobileOpen)}
              className="lg:hidden p-2.5 rounded-xl text-gray-600 hover:bg-gray-100 transition-colors ml-0.5">
              {mobileOpen
                ? <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M6 18L18 6M6 6l12 12"/>
                  </svg>
                : <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 6h16M4 12h16M4 18h16"/>
                  </svg>
              }
            </button>
          </div>
        </div>

        {/* Desktop category strip */}
        <div className="hidden lg:block border-t border-gray-100 bg-white/95 backdrop-blur-sm">
          <div className="max-w-[1440px] 2xl:max-w-[1600px] mx-auto px-6 py-2 flex items-center justify-between gap-4">
            <div className="flex items-center gap-2 overflow-x-auto hide-scrollbar flex-1">
              {NAV.map(n => (
                <Link
                  key={n.href}
                  href={n.href}
                  className="flex-shrink-0 px-3.5 py-1.5 rounded-full text-[12px] font-semibold text-gray-600 hover:text-gray-950 hover:bg-gray-100 transition-all duration-200"
                >
                  {n.label}
                </Link>
              ))}
            </div>

            <div className="flex items-center gap-3 shrink-0 pl-2">
              <div className="h-4 w-px bg-gray-200" />
              <Link
                href="/products?isFeatured=true"
                className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-[12px] font-bold text-orange-600 bg-orange-50 hover:bg-orange-100 border border-orange-200/70 transition-all duration-200"
              >
                <span>🔥</span>
                <span>Special Offers</span>
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile search overlay */}
      {searchOpen && (
        <div className="fixed inset-0 z-[55] flex items-start justify-center pt-[90px] px-4 md:hidden"
          onClick={() => setSearchOpen(false)}>
          <div className="absolute inset-0 bg-black/60 backdrop-blur-md"/>
          <div className="relative w-full max-w-md bg-white p-3 rounded-2xl shadow-2xl" onClick={e => e.stopPropagation()}>
            <LiveSearchBar autoFocus isMobileModal onClose={() => setSearchOpen(false)} />
          </div>
        </div>
      )}

      {/* Mobile drawer */}
      {mobileOpen && (
        <div className="fixed inset-0 z-40 lg:hidden" onClick={() => setMobileOpen(false)}>
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm"/>
          <nav className="absolute top-[calc(62px+36px)] inset-x-0 bg-white border-b border-gray-100 shadow-2xl
                          overflow-y-auto max-h-[calc(100vh-98px)]"
            onClick={e => e.stopPropagation()}>
            <div className="px-5 py-3 border-b border-gray-100">
              <LiveSearchBar placeholder="Search products, brands…" onClose={() => setMobileOpen(false)} />
            </div>
            <div className="py-2">
              {NAV.map(n => (
                <Link key={n.href} href={n.href} onClick={() => setMobileOpen(false)}
                  className="flex items-center justify-between px-5 py-3.5 text-sm font-semibold text-gray-700
                             hover:bg-gray-50 transition-colors border-b border-gray-100 last:border-0">
                  <span>{n.label}</span>
                  <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5l7 7-7 7"/>
                  </svg>
                </Link>
              ))}
              <Link href="/products?isFeatured=true" onClick={() => setMobileOpen(false)}
                className="flex items-center justify-between px-5 py-3.5 text-sm font-bold border-b border-gray-100
                           hover:bg-gray-50 text-orange-500">
                🔥 Deals
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5l7 7-7 7"/>
                </svg>
              </Link>
            </div>
            
            {/* Direct Connect in Mobile Drawer: WhatsApp, TikTok, Instagram, Email */}
            <div className="p-4 space-y-2.5 bg-gray-50 border-t border-gray-100">
              <p className="text-[10px] font-bold uppercase tracking-wider text-gray-400 px-1">Connect Directly</p>
              
              <div className="grid grid-cols-4 gap-2">
                <a href="https://wa.me/254746722417?text=Hi%20Smartech%20Kenya%2C%20I%20want%20to%20order"
                  target="_blank" rel="noopener noreferrer" aria-label="WhatsApp" title="WhatsApp"
                  className="flex items-center justify-center h-12 rounded-xl text-white shadow-sm bg-[#25D366] hover:bg-[#20BD5A] transition-all">
                  <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                  </svg>
                </a>

                <a href="https://tiktok.com/@smartechkenya"
                  target="_blank" rel="noopener noreferrer" aria-label="TikTok" title="TikTok"
                  className="flex items-center justify-center h-12 rounded-xl text-white bg-black hover:bg-gray-900 transition-all border border-white/10">
                  <svg className="w-5 h-5 text-[#25F4EE]" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-2.88 2.5 2.89 2.89 0 01-2.89-2.89 2.89 2.89 0 012.89-2.89c.28 0 .54.04.79.1V9.01a6.33 6.33 0 00-.79-.05 6.34 6.34 0 00-6.34 6.34 6.34 6.34 0 006.34 6.34 6.34 6.34 0 006.33-6.34V8.69a8.24 8.24 0 004.84 1.56V6.78a4.85 4.85 0 01-1.07-.09z"/>
                  </svg>
                </a>

                <a href="https://instagram.com/smartechkenya"
                  target="_blank" rel="noopener noreferrer" aria-label="Instagram" title="Instagram"
                  className="flex items-center justify-center h-12 rounded-xl text-white bg-[#E1306C] hover:bg-[#C13584] transition-all">
                  <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/>
                  </svg>
                </a>

                <a href="mailto:smartechkenya01@gmail.com" aria-label="Email" title="Email"
                  className="flex items-center justify-center h-12 rounded-xl text-white bg-[#F97316] hover:bg-[#EA580C] transition-all">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/>
                  </svg>
                </a>
              </div>

              <Link href="/cart" onClick={() => setMobileOpen(false)}
                className="flex items-center justify-center gap-2 w-full py-3 rounded-xl text-sm font-semibold
                           text-gray-700 border border-gray-200 bg-white hover:bg-gray-100 transition-all">
                🛒 View Cart {cartCount > 0 && `(${cartCount})`}
              </Link>
            </div>
          </nav>
        </div>
      )}
    </>
  );
}
