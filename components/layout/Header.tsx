'use client';

import { useState, useEffect, useRef } from 'react';
import Link           from 'next/link';
import Image          from 'next/image';
import { usePathname } from 'next/navigation';
import { useSelector } from 'react-redux';
import { RootState }  from '@/store';

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
        className="fixed bottom-6 left-6 z-[60] w-14 h-14 rounded-full flex items-center justify-center shadow-xl transition-transform hover:scale-105 active:scale-95"
        style={{ background: '#F97316', boxShadow: '0 4px 24px rgba(249,115,22,0.45)' }}>
        <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
            d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"/>
        </svg>
      </button>
      {open && (
        <>
          <div className="fixed inset-0 z-[59]" onClick={() => setOpen(false)}/>
          <div className="fixed bottom-24 left-6 z-[60] w-72 bg-white rounded-2xl shadow-2xl overflow-hidden">
            <div className="px-5 py-4 flex items-center justify-between" style={{ background: '#F97316' }}>
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-white/20 flex items-center justify-center">
                  <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                      d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"/>
                  </svg>
                </div>
                <div>
                  <p className="text-white font-bold text-sm">Customer Care</p>
                  <p className="text-white/75 text-[11px]">Smartech Kenya</p>
                </div>
              </div>
              <button onClick={() => setOpen(false)} className="text-white/70 hover:text-white transition-colors">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12"/>
                </svg>
              </button>
            </div>
            <div className="px-5 py-5 text-center">
              <p className="text-gray-500 text-sm mb-4 leading-relaxed">
                Want to make an enquiry? Reach out and our team will guide you to the ideal choice.
              </p>
              <a href="tel:+254746722417"
                className="flex items-center justify-center gap-2 w-full py-3 rounded-xl text-white font-bold text-sm hover:opacity-90 transition-opacity"
                style={{ background: '#F97316' }}>
                +254 746 722 417
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

  return (
    <>
      {/* ── TOP INFO BAR ────────────────────────────────────────────────── */}
      <div className="bg-gray-50 border-b border-gray-200 text-[11px] text-gray-500 py-1.5 px-4">
        <div className="max-w-[1320px] mx-auto flex items-center justify-between flex-wrap gap-x-4 gap-y-0.5">
          <div className="flex items-center gap-1.5">
            <svg className="w-3 h-3 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" style={{color:'#F97316'}}>
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/>
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/>
            </svg>
            <span>Gaberone Plaza, 4th Floor, Shop A13 — Nairobi</span>
          </div>
          <div className="flex items-center gap-5">
            <span>Mon–Sat 8am–7pm</span>
            <a href="tel:+254746722417"
              className="flex items-center gap-1.5 font-semibold hover:opacity-75 transition-opacity"
              style={{color:'#F97316'}}>
              <svg className="w-3 h-3 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                  d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"/>
              </svg>
              +254 746 722 417
            </a>
          </div>
        </div>
      </div>

      <CustomerCareButton />

      {/* ── MAIN HEADER — always solid white ───────────────────────────── */}
      <header className="sticky top-0 z-50 bg-white border-b border-gray-100 shadow-[0_1px_12px_rgba(0,0,0,0.06)]">

        <div className="max-w-[1320px] mx-auto px-5 flex items-center gap-4 h-[62px]">

          {/* Logo */}
          <Link href="/" className="shrink-0 flex items-center">
            <Image src="/logo.png" alt="Smartech Kenya" width={140} height={40} priority
              className="object-contain h-9 w-auto"/>
          </Link>

          {/* Desktop search */}
          <div className="hidden md:flex flex-1 max-w-lg mx-auto">
            <form action="/products" method="GET" className="relative w-full">
              <svg className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none"
                fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
              </svg>
              <input type="text" name="search" placeholder="Search products, brands…"
                className="w-full pl-10 pr-4 py-2.5 rounded-full text-sm bg-gray-100 border border-gray-200
                           text-gray-800 placeholder-gray-400 focus:bg-white focus:border-orange-300
                           focus:shadow-sm outline-none transition-all duration-200"/>
            </form>
          </div>

          {/* Right actions */}
          <div className="flex items-center gap-0.5 ml-auto md:ml-0">

            {/* Mobile search */}
            <button onClick={() => setSearchOpen(!searchOpen)}
              className="md:hidden p-2.5 rounded-xl text-gray-600 hover:bg-gray-100 transition-colors">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
              </svg>
            </button>

            {/* WhatsApp — desktop */}
            <a href="https://wa.me/254746722417?text=Hi%20Smartech%20Kenya%2C%20I%20want%20to%20order"
              target="_blank" rel="noopener noreferrer"
              className="hidden xl:inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold
                         text-white transition-all hover:opacity-90"
              style={{background:'#25D366'}}>
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
              </svg>
              Order via WhatsApp
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
        <div className="hidden lg:block border-t border-gray-100">
          <div className="max-w-[1320px] mx-auto px-5 flex items-center overflow-x-auto hide-scrollbar">
            {NAV.map(n => (
              <Link key={n.href} href={n.href}
                className="flex-shrink-0 px-4 py-2.5 text-[11.5px] font-semibold tracking-wide whitespace-nowrap
                           transition-all text-gray-500 hover:text-gray-900 relative
                           after:absolute after:bottom-0 after:left-0 after:right-0 after:h-[2px]
                           after:bg-transparent after:transition-colors
                           hover:after:bg-gray-400">
                {n.label}
              </Link>
            ))}
            <div className="flex-1"/>
            <Link href="/products?isFeatured=true"
              className="flex-shrink-0 px-4 py-2.5 text-[11.5px] font-bold tracking-wide transition-all
                         border-b-2 border-transparent text-orange-500 hover:text-orange-600 hover:border-orange-400">
              🔥 Deals
            </Link>
          </div>
        </div>
      </header>

      {/* Mobile search overlay */}
      {searchOpen && (
        <div className="fixed inset-0 z-[55] flex items-start justify-center pt-[100px] px-4 md:hidden"
          onClick={() => setSearchOpen(false)}>
          <div className="absolute inset-0 bg-black/60 backdrop-blur-md"/>
          <div className="relative w-full max-w-md" onClick={e => e.stopPropagation()}>
            <form action="/products" method="GET" className="flex items-center gap-3 bg-white rounded-2xl shadow-2xl px-5 py-4">
              <svg className="w-5 h-5 text-gray-400 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
              </svg>
              <input ref={searchRef} type="text" name="search"
                placeholder="Search products, brands…"
                className="flex-1 text-gray-800 text-base outline-none placeholder-gray-400 bg-transparent"/>
            </form>
          </div>
        </div>
      )}

      {/* Mobile drawer */}
      {mobileOpen && (
        <div className="fixed inset-0 z-40 lg:hidden" onClick={() => setMobileOpen(false)}>
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm"/>
          <nav className="absolute top-[calc(62px+30px)] inset-x-0 bg-white border-b border-gray-100 shadow-2xl
                          overflow-y-auto max-h-[calc(100vh-92px)]"
            onClick={e => e.stopPropagation()}>
            <div className="px-5 py-3 border-b border-gray-100">
              <form action="/products" method="GET" className="relative">
                <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none"
                  fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
                </svg>
                <input type="text" name="search"
                  placeholder="Search products…"
                  className="w-full pl-9 pr-4 py-2.5 rounded-xl bg-gray-100 text-sm text-gray-800 placeholder-gray-400 outline-none"/>
              </form>
            </div>
            <div className="py-2">
              {NAV.map(n => (
                <Link key={n.href} href={n.href} onClick={() => setMobileOpen(false)}
                  className="flex items-center justify-between px-5 py-3.5 text-sm font-semibold text-gray-700
                             hover:bg-gray-50 transition-colors border-b border-gray-100 last:border-0">
                  {n.label}
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
            <div className="p-5 space-y-3 border-t border-gray-100">
              <a href="https://wa.me/254746722417?text=Hi%20Smartech%20Kenya%2C%20I%20want%20to%20order"
                target="_blank" rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 w-full py-3.5 rounded-xl text-white text-sm font-bold"
                style={{background:'#25D366'}}>
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                </svg>
                Order via WhatsApp
              </a>
              <Link href="/cart" onClick={() => setMobileOpen(false)}
                className="flex items-center justify-center gap-2 w-full py-3 rounded-xl text-sm font-semibold
                           text-gray-700 border border-gray-200 hover:bg-gray-50 transition-all">
                🛒 View Cart {cartCount > 0 && `(${cartCount})`}
              </Link>
            </div>
          </nav>
        </div>
      )}
    </>
  );
}
