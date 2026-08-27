import Link   from 'next/link';
import { listProducts } from '@/lib/cloudinary';
import { ProductCard }  from '@/components/product/ProductCard';
import { LiveHeroSlider } from '@/components/home/LiveHeroSlider';
import type { Metadata } from 'next';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title:       'Smartech Kenya — Premium Tech & Home Appliances Nairobi',
  description: "Kenya's curated destination for electronics and home appliances. MIKA, Hisense, Samsung, HP. Fast Nairobi delivery.",
};

const SOCIAL = [
  {
    name: 'WhatsApp',
    href: 'https://wa.me/254746722417?text=Hi%20Smartech%20Kenya%2C%20I%20want%20to%20inquire%20about%20products',
    color: 'bg-[#25D366] hover:bg-[#20BD5A] text-white',
    icon: (
      <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
      </svg>
    ),
  },
  {
    name: 'TikTok',
    href: 'https://tiktok.com/@smartechkenya',
    color: 'bg-black hover:bg-neutral-800 text-white border border-white/20',
    icon: (
      <svg className="w-5 h-5 text-[#25F4EE] fill-current" viewBox="0 0 24 24">
        <path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-2.88 2.5 2.89 2.89 0 01-2.89-2.89 2.89 2.89 0 012.89-2.89c.28 0 .54.04.79.1V9.01a6.33 6.33 0 00-.79-.05 6.34 6.34 0 00-6.34 6.34 6.34 6.34 0 006.34 6.34 6.34 6.34 0 006.33-6.34V8.69a8.24 8.24 0 004.84 1.56V6.78a4.85 4.85 0 01-1.07-.09z"/>
      </svg>
    ),
  },
  {
    name: 'Email',
    href: 'mailto:smartechkenya01@gmail.com',
    color: 'bg-[#F97316] hover:bg-[#EA580C] text-white',
    icon: (
      <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/>
      </svg>
    ),
  },
  {
    name: 'Instagram',
    href: 'https://instagram.com/smartechkenya',
    color: 'bg-[#E1306C] hover:bg-[#C13584] text-white',
    icon: (
      <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
        <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/>
      </svg>
    ),
  },
];

export default async function HomePage() {
  const [featured, latest, kitchen] = await Promise.all([
    listProducts({ featured: true, limit: 8 }),
    listProducts({ limit: 4 }),
    listProducts({ category: 'KITCHEN', limit: 4 }),
  ]);

  return (
    <div className="bg-cream">

      {/* ══ LIVE 4K HERO BANNER SLIDER ═════════════════════════════════════ */}
      <LiveHeroSlider />

      {/* ══ FEATURED ════════════════════════════════════════════════════════ */}
      {featured.length > 0 && (
        <section className="py-10 sm:py-14 px-4 sm:px-6 lg:px-8 bg-white">
          <div className="max-w-[1440px] 2xl:max-w-[1600px] mx-auto">
            <SectionHeader label="Hand-picked" title="Featured Products" href="/products" cta="View all"/>
            <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 2xl:grid-cols-5 gap-3 sm:gap-4 lg:gap-5">
              {featured.map(p => <ProductCard key={p.id} product={p as any}/>)}
            </div>
          </div>
        </section>
      )}



      {/* ══ KITCHEN ═════════════════════════════════════════════════════════ */}
      {kitchen.length > 0 && (
        <section className="py-12 sm:py-16 px-4 sm:px-6 lg:px-8 bg-ink">
          <div className="max-w-[1440px] 2xl:max-w-[1600px] mx-auto">
            <SectionHeader label="Mika · Hisense · Ramtons" title="Home Appliances" href="/products?category=KITCHEN" cta="View all" dark/>
            <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 2xl:grid-cols-5 gap-3 sm:gap-4 lg:gap-5">
              {kitchen.map(p => <ProductCard key={p.id} product={p as any}/>)}
            </div>
          </div>
        </section>
      )}

      {/* ══ NEW ARRIVALS ════════════════════════════════════════════════════ */}
      {latest.length > 0 && (
        <section className="py-12 sm:py-16 px-4 sm:px-6 lg:px-8 bg-cream-warm/30">
          <div className="max-w-[1440px] 2xl:max-w-[1600px] mx-auto">
            <SectionHeader label="Just In" title="New Arrivals" href="/products" cta="View all new"/>
            <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 2xl:grid-cols-5 gap-3 sm:gap-4 lg:gap-5">
              {latest.map(p => <ProductCard key={p.id} product={p as any}/>)}
            </div>
          </div>
        </section>
      )}





      {/* ══ NEWSLETTER ══════════════════════════════════════════════════════ */}
      <section className="py-16 sm:py-20 px-4 sm:px-6 lg:px-8 bg-ink">
        <div className="max-w-[1440px] 2xl:max-w-[1600px] mx-auto grid md:grid-cols-2 gap-10 sm:gap-12 lg:gap-20 items-center">
          <div>
            <p className="text-[9.5px] font-bold tracking-[0.18em] uppercase mb-4" style={{ color: '#D9A050' }}>Stay ahead</p>
            <h2 className="font-display text-cream mb-4" style={{ fontSize: 'clamp(1.9rem,3.8vw,3rem)', fontWeight: 600 }}>Get the best deals first</h2>
            <p className="text-sm sm:text-base leading-relaxed max-w-[400px]" style={{ color: 'rgba(255,255,255,0.60)' }}>New arrivals, exclusive offers and appliance news — no spam.</p>
            <div className="flex flex-wrap items-center gap-3 mt-6 sm:mt-8">
              {SOCIAL.map(s => (
                <a
                  key={s.name}
                  href={s.href}
                  target={s.href.startsWith('mailto') ? undefined : '_blank'}
                  rel={s.href.startsWith('mailto') ? undefined : 'noopener noreferrer'}
                  aria-label={s.name}
                  title={s.name}
                  className={`w-11 h-11 rounded-2xl flex items-center justify-center transition-all duration-200 hover:scale-110 active:scale-95 shadow-md ${s.color}`}
                >
                  {s.icon}
                </a>
              ))}
            </div>
          </div>
          <div>
            <form className="flex flex-col sm:flex-row gap-2.5 mb-3">
              <input type="email" placeholder="your@email.com" required className="input-dark flex-1"/>
              <button type="submit" className="btn px-6 py-3.5 rounded-full bg-white text-ink hover:bg-cream text-sm font-semibold shrink-0 whitespace-nowrap">Subscribe</button>
            </form>
            <p className="text-xs" style={{ color: 'rgba(255,255,255,0.30)' }}>Unsubscribe any time.</p>
          </div>
        </div>
      </section>

    </div>
  );
}

function SectionHeader({ label, title, href, cta, dark = false }: { label: string; title: string; href: string; cta: string; dark?: boolean }) {
  return (
    <div className="flex items-end justify-between mb-8 sm:mb-10">
      <div>
        <p className="text-[9.5px] font-bold tracking-[0.16em] uppercase mb-2" style={{ color: dark ? '#D9A050' : '#8B5A1A' }}>{label}</p>
        <h2 className={`font-display ${dark ? 'text-cream' : 'text-ink'}`} style={{ fontSize: 'clamp(1.65rem,3vw,2.5rem)', fontWeight: 600 }}>{title}</h2>
      </div>
      <Link href={href}
        className={['inline-flex items-center gap-1.5 text-xs sm:text-sm font-semibold transition-colors', dark ? 'text-cream/50 hover:text-cream' : 'text-ink/50 hover:text-ink'].join(' ')}>
        {cta}
        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3"/>
        </svg>
      </Link>
    </div>
  );
}
