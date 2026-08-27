'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import Link from 'next/link';
import Image from 'next/image';

export interface BannerSlide {
  id: string;
  categoryTag: string;
  badge: string;
  badgeAccent: string;
  title: string;
  titleHighlight: string;
  subtitle: string;
  image: string;
  primaryCtaText: string;
  primaryCtaLink: string;
  whatsappMessage: string;
  features: string[];
  tabLabel?: string;
}

/**
 * Curated Promotional Showcase Banners
 * -------------------------------------
 * High-conversion hero slides highlighting Smartech Kenya's core product categories.
 * Each slide features tailored marketing copy, category highlights, direct collection
 * links, and pre-formatted WhatsApp concierge inquiry triggers for instant ordering.
 */
const NAVBAR_SLIDES: BannerSlide[] = [
  {
    id: 'slide-fridges',
    categoryTag: "KENYA'S #1 REFRIGERATION DESTINATION",
    badge: 'ENERGY-SAVING INVERTER',
    badgeAccent: '#F97316',
    title: 'Smart Inverter Cooling & Frost-Free Luxury Fridges',
    titleHighlight: 'Frost-Free Luxury',
    subtitle: 'Keep food fresh up to 3X longer with multi-air flow frost-free refrigerators from Mika, Ramtons, Hisense & Samsung. Low energy consumption with up to 10-year compressor warranty.',
    image: 'https://images.unsplash.com/photo-1571175443880-49e1d25b2bc5?w=2160&q=95&auto=format&fit=crop',
    primaryCtaText: 'Shop Fridges & Freezers',
    primaryCtaLink: '/products?category=KITCHEN',
    whatsappMessage: 'Hello Smartech Kenya, I am interested in purchasing a smart refrigerator. Please share prices and available models.',
    features: ['Multi-Air Flow Cooling', '10-Year Inverter Warranty', 'Pay on Delivery'],
    tabLabel: 'Fridges',
  },
  {
    id: 'slide-smart-tvs',
    categoryTag: 'CINEMATIC HOME ENTERTAINMENT',
    badge: '4K OLED & QLED DISPLAYS',
    badgeAccent: '#38BDF8',
    title: 'Immerse in True 4K OLED, QLED & Dolby Acoustics',
    titleHighlight: 'True 4K OLED',
    subtitle: 'Transform your living room into a theater with ultra-deep blacks, infinite HDR contrast, and Dolby Audio from Samsung, Sony, LG & Hisense with official warranty.',
    image: 'https://images.unsplash.com/photo-1593784991095-a205069470b6?w=2160&q=95&auto=format&fit=crop',
    primaryCtaText: 'Shop 4K Smart TVs',
    primaryCtaLink: '/products?category=AUDIO_TV',
    whatsappMessage: 'Hello Smartech Kenya, I want to inquire about 4K Smart TVs and Soundbars with same-day Nairobi delivery.',
    features: ['Calibrated 4K HDR10+ Panels', '2-Year Official Warranty', 'Same-Day Dispatch'],
    tabLabel: 'Smart TVs',
  },
  {
    id: 'slide-laptops',
    categoryTag: 'PREMIUM COMPUTING & TECH',
    badge: 'SPEED & PERFORMANCE',
    badgeAccent: '#10B981',
    title: 'Power Your Ambition with Next-Gen High-Speed Laptops',
    titleHighlight: 'Next-Gen High-Speed',
    subtitle: 'Engineered for programmers, designers, university students, and business leaders. Brand new sealed Apple MacBooks, HP, Dell XPS, Lenovo ThinkPad & Asus.',
    image: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=2160&q=95&auto=format&fit=crop',
    primaryCtaText: 'Shop Laptops & Tech',
    primaryCtaLink: '/products?category=LAPTOPS',
    whatsappMessage: 'Hello Smartech Kenya, I would like to get laptop recommendations and current prices.',
    features: ['High-Speed NVMe SSD', '100% Brand New Sealed', 'Express Nairobi Delivery'],
    tabLabel: 'Laptops',
  },
  {
    id: 'slide-washing-machines',
    categoryTag: 'INTELLIGENT LAUNDRY & FABRIC CARE',
    badge: 'ECO-STEAM HYGIENE',
    badgeAccent: '#D9A050',
    title: 'Gentle on Fabrics, Relentless on Stains with AI Steam Wash',
    titleHighlight: 'AI Steam Wash',
    subtitle: 'Whisper-quiet direct-drive inverter motors, allergen-destroying steam cycles, and rapid 15-minute quick washes. Delivered & installed anywhere in Nairobi.',
    image: 'https://images.unsplash.com/photo-1626806787461-102c1bfaaea1?w=2160&q=95&auto=format&fit=crop',
    primaryCtaText: 'Shop Washing Machines',
    primaryCtaLink: '/products?category=KITCHEN',
    whatsappMessage: 'Hello Smartech Kenya, I am looking for a reliable front-load or top-load washing machine.',
    features: ['Hygiene Steam Wash Care', '10-Year Inverter Warranty', 'White-Glove Delivery'],
    tabLabel: 'Washing Machines',
  },
];

const AUTO_PLAY_INTERVAL = 5500;

export function LiveHeroSlider({ initialSlides }: { initialSlides?: BannerSlide[] }) {
  const slides = initialSlides && initialSlides.length > 0 ? initialSlides : NAVBAR_SLIDES;
  const [currentIndex, setCurrentIndex] = useState(0);
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [touchEnd, setTouchEnd] = useState<number | null>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const nextSlide = useCallback(() => {
    setCurrentIndex((prev) => (prev + 1) % slides.length);
  }, [slides.length]);

  const prevSlide = useCallback(() => {
    setCurrentIndex((prev) => (prev - 1 + slides.length) % slides.length);
  }, [slides.length]);

  const goToSlide = (idx: number) => {
    setCurrentIndex(idx);
  };

  // Continuous auto-play timer that resets cleanly on slide change
  useEffect(() => {
    timerRef.current = setInterval(nextSlide, AUTO_PLAY_INTERVAL);
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [nextSlide, currentIndex]);

  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStart(e.targetTouches[0].clientX);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const handleTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    const distance = touchStart - touchEnd;
    if (distance > 50) nextSlide();
    if (distance < -50) prevSlide();
    setTouchStart(null);
    setTouchEnd(null);
  };

  const current = slides[currentIndex];

  return (
    <section
      className="relative overflow-hidden bg-[#0F131C] select-none text-white"
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      aria-label="Promotional Showcase"
    >
      {/* ── 4K Background Images with Bright & Vivid Lighting ── */}
      <div className="absolute inset-0 z-0">
        {slides.map((slide, index) => {
          const isActive = index === currentIndex;
          return (
            <div
              key={slide.id}
              className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
                isActive ? 'opacity-100' : 'opacity-0 pointer-events-none'
              }`}
            >
              <Image
                src={slide.image}
                alt={slide.title}
                fill
                priority={index === 0}
                sizes="100vw"
                className={`object-cover object-center brightness-[1.08] contrast-[1.04] transform transition-transform duration-[8000ms] ease-out ${
                  isActive ? 'scale-105' : 'scale-100'
                }`}
              />
              {/* Brighter & Softer Gradient Shading for Maximum Image Clarity */}
              <div className="absolute inset-0 bg-gradient-to-r from-[#0C101A]/80 via-[#0C101A]/40 md:via-[#0C101A]/25 to-transparent" />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0C101A]/60 via-transparent to-black/10" />
            </div>
          );
        })}
      </div>

      {/* ── Ambient Radial Glow for High-End Brightness ── */}
      <div className="absolute top-1/4 left-1/4 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-[#F97316]/12 rounded-full blur-[140px] pointer-events-none z-0" />
      <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] bg-sky-400/10 rounded-full blur-[130px] pointer-events-none z-0" />

      {/* ── Foreground Content & Controls ── */}
      <div className="relative z-10 max-w-[1440px] 2xl:max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16 md:py-20 lg:py-24 min-h-[580px] md:min-h-[640px] lg:min-h-[680px] flex flex-col justify-between">
        
        {/* Top Meta Bar */}
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <span className="text-[10px] sm:text-xs font-bold tracking-[0.24em] uppercase text-white/80 bg-black/30 backdrop-blur-md px-3 py-1 rounded-full border border-white/10 shadow-sm">
              {current.categoryTag}
            </span>
          </div>

          {/* Minimal Slide Pagination Indicators */}
          <div className="flex items-center gap-2">
            {slides.map((slide, idx) => (
              <button
                key={slide.id}
                onClick={() => goToSlide(idx)}
                aria-label={`Go to slide ${idx + 1}`}
                className={`h-2 rounded-full transition-all duration-300 ${
                  idx === currentIndex
                    ? 'w-7 bg-white shadow-md'
                    : 'w-2 bg-white/40 hover:bg-white/70'
                }`}
              />
            ))}
          </div>
        </div>

        {/* Hero Narrative & Calls to Action */}
        <div className="max-w-2xl my-auto py-8">
          <h1
            key={`title-${currentIndex}`}
            className="font-display text-white tracking-tight leading-[1.06] mb-4 text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold animate-fadeIn drop-shadow-[0_2px_16px_rgba(0,0,0,0.65)]"
          >
            {current.title.split(current.titleHighlight)[0]}
            <span
              className="inline-block drop-shadow-[0_2px_12px_rgba(0,0,0,0.7)]"
              style={{ color: current.badgeAccent }}
            >
              {current.titleHighlight}
            </span>
            {current.title.split(current.titleHighlight)[1] || ''}
          </h1>

          <p
            key={`desc-${currentIndex}`}
            className="text-sm sm:text-base md:text-lg text-white/95 leading-relaxed mb-8 max-w-xl animate-fadeIn font-normal drop-shadow-[0_1px_8px_rgba(0,0,0,0.6)]"
            style={{ animationDelay: '100ms' }}
          >
            {current.subtitle}
          </p>

          {/* Action Buttons */}
          <div className="flex flex-wrap items-center gap-3.5 sm:gap-4">
            <Link
              href={current.primaryCtaLink}
              className="px-7 sm:px-8 py-3.5 sm:py-4 rounded-full text-sm font-bold shadow-2xl transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] flex items-center gap-2 group bg-white text-[#0A0A0A] hover:bg-white/95 ring-2 ring-white/20"
            >
              <span>{current.primaryCtaText}</span>
              <svg
                className="w-4 h-4 group-hover:translate-x-1 transition-transform"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </Link>

            <a
              href={`https://wa.me/254746722417?text=${encodeURIComponent(current.whatsappMessage)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="px-6 sm:px-7 py-3.5 sm:py-4 text-sm font-bold rounded-full bg-[#25D366] hover:bg-[#20BD5A] text-white shadow-xl hover:shadow-[#25D366]/30 transition-all duration-300 flex items-center gap-2.5 active:scale-[0.98] hover:scale-[1.02]"
            >
              <svg className="w-5 h-5 fill-current shrink-0" viewBox="0 0 24 24">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
              </svg>
              <span>Order via WhatsApp</span>
            </a>
          </div>
        </div>

      </div>

      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(8px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fadeIn {
          animation: fadeIn 0.45s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
      `}</style>
    </section>
  );
}
