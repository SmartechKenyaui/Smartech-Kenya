import Link from 'next/link';
import Image from 'next/image';
import { CATEGORIES } from '@/constants/categories';

export function Footer() {
  const year = new Date().getFullYear();

  const SOCIAL = [
    {
      name: 'WhatsApp', href: 'https://wa.me/254746722417',
      d: 'M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z',
    },
    {
      name: 'Instagram', href: 'https://instagram.com/smartechkenya',
      d: 'M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z',
    },
    {
      name: 'TikTok', href: 'https://tiktok.com/@smartechkenya',
      d: 'M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-2.88 2.5 2.89 2.89 0 01-2.89-2.89 2.89 2.89 0 012.89-2.89c.28 0 .54.04.79.1V9.01a6.33 6.33 0 00-.79-.05 6.34 6.34 0 00-6.34 6.34 6.34 6.34 0 006.34 6.34 6.34 6.34 0 006.33-6.34V8.69a8.24 8.24 0 004.84 1.56V6.78a4.85 4.85 0 01-1.07-.09z',
    },
  ];

  return (
    <footer style={{ background: '#F8F9FA' }} className="border-t-4 border-orange-500">
      <div className="max-w-[1320px] mx-auto px-6 pt-14 pb-8">

        {/* ── Top CTA strip ──────────────────────────────────────────────── */}
        <div className="rounded-2xl mb-14 px-8 py-7 flex flex-col sm:flex-row items-center justify-between gap-5"
          style={{ background: '#111111' }}>
          <div>
            <p className="text-white font-bold text-lg leading-snug">Ready to upgrade your home?</p>
            <p className="text-gray-400 text-sm mt-1">Talk to us on WhatsApp — orders placed in minutes.</p>
          </div>
          <a href="https://wa.me/254746722417?text=Hi%20Smartech%20Kenya%2C%20I%20want%20to%20order"
            target="_blank" rel="noopener noreferrer"
            className="flex-shrink-0 inline-flex items-center gap-2 px-6 py-3 rounded-xl font-bold text-sm text-white hover:opacity-90 transition-opacity"
            style={{ background: '#F97316' }}>
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
            </svg>
            WhatsApp Us Now
          </a>
        </div>

        {/* ── Main grid ──────────────────────────────────────────────────── */}
        <div className="grid grid-cols-2 lg:grid-cols-5 gap-10 mb-12">

          {/* Brand */}
          <div className="col-span-2">
            <Link href="/" className="inline-block mb-5">
              <Image src="/logo.png" alt="Smartech Kenya" width={140} height={38} className="object-contain"/>
            </Link>
            <p className="text-gray-500 text-sm leading-relaxed mb-6 max-w-xs">
              Premium electronics and home appliances for the modern Kenyan home.
              Genuine products, fast delivery across Nairobi.
            </p>
            <div className="space-y-3 mb-6">
              <a href="https://wa.me/254746722417" target="_blank" rel="noopener noreferrer"
                className="flex items-center gap-2.5 text-gray-600 hover:text-orange-500 transition-colors text-sm font-medium">
                <svg className="w-4 h-4 shrink-0 text-orange-500" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                </svg>
                +254 746 722 417
              </a>
              <a href="mailto:smartechkenya01@gmail.com"
                className="flex items-center gap-2.5 text-gray-600 hover:text-orange-500 transition-colors text-sm">
                <svg className="w-4 h-4 shrink-0 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/>
                </svg>
                smartechkenya01@gmail.com
              </a>
              <div className="flex items-center gap-2.5 text-gray-600 text-sm">
                <svg className="w-4 h-4 shrink-0 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/>
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/>
                </svg>
                Gaberone Plaza, 4th Floor, Shop A13, Nairobi
              </div>
            </div>
            <div className="flex gap-2">
              {SOCIAL.map(s => (
                <a key={s.name} href={s.href} target="_blank" rel="noopener noreferrer" aria-label={s.name}
                  className="w-9 h-9 rounded-lg border border-gray-200 bg-white flex items-center justify-center text-gray-500 hover:text-orange-500 hover:border-orange-300 transition-all shadow-sm">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d={s.d}/></svg>
                </a>
              ))}
            </div>
          </div>

          {/* Shop */}
          <div>
            <h4 className="text-gray-900 text-[11px] font-bold tracking-[0.14em] uppercase mb-5 flex items-center gap-2">
              <span className="w-4 h-0.5 bg-orange-500 rounded-full"/>
              Shop
            </h4>
            <ul className="space-y-3">
              {CATEGORIES.flatMap(c =>
                c.subcategories.slice(0, 4).map(sub => ({
                  label: sub.name,
                  href: `/products?category=${c.enum}&subcategory=${sub.slug}`,
                }))
              ).slice(0, 8).map(({ label, href }) => (
                <li key={label}>
                  <Link href={href} className="text-gray-500 hover:text-gray-900 text-sm transition-colors hover:translate-x-0.5 inline-block">
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Customer Service */}
          <div>
            <h4 className="text-gray-900 text-[11px] font-bold tracking-[0.14em] uppercase mb-5 flex items-center gap-2">
              <span className="w-4 h-0.5 bg-orange-500 rounded-full"/>
              Support
            </h4>
            <ul className="space-y-3">
              {[
                { label: 'Track Order',      href: '/track-order' },
                { label: 'Contact Us',       href: '/contact' },
                { label: 'WhatsApp Support', href: 'https://wa.me/254746722417' },
                { label: 'Wishlist',         href: '/wishlist' },
              ].map(({ label, href }) => (
                <li key={label}>
                  <Link href={href} className="text-gray-500 hover:text-gray-900 text-sm transition-colors inline-block">
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Trust + Legal */}
          <div>
            <h4 className="text-gray-900 text-[11px] font-bold tracking-[0.14em] uppercase mb-5 flex items-center gap-2">
              <span className="w-4 h-0.5 bg-orange-500 rounded-full"/>
              Legal
            </h4>
            <ul className="space-y-3 mb-7">
              {[
                { label: 'Privacy Policy', href: '/privacy' },
                { label: 'Terms of Use',   href: '/terms'   },
              ].map(({ label, href }) => (
                <li key={label}>
                  <Link href={href} className="text-gray-500 hover:text-gray-900 text-sm transition-colors inline-block">
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
            <div className="space-y-2">
              {['Genuine products guaranteed', 'Same-day Nairobi delivery', 'Next-day nationwide'].map(t => (
                <div key={t} className="flex items-center gap-2 text-gray-600 text-xs">
                  <svg className="w-3.5 h-3.5 shrink-0 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7"/>
                  </svg>
                  {t}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ── Bottom bar ─────────────────────────────────────────────────── */}
        <div className="pt-6 border-t border-gray-200 flex flex-col sm:flex-row justify-between items-center gap-3">
          <span className="text-gray-400 text-xs">
            &copy; {year} Smartech Kenya. All rights reserved.
          </span>
          <div className="flex gap-5">
            <Link href="/privacy" className="text-gray-400 text-xs hover:text-gray-700 transition-colors">Privacy</Link>
            <Link href="/terms"   className="text-gray-400 text-xs hover:text-gray-700 transition-colors">Terms</Link>
            <Link href="/contact" className="text-gray-400 text-xs hover:text-gray-700 transition-colors">Contact</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
