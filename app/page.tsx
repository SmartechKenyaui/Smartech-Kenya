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
  { href: 'https://wa.me/254746722417',          label: 'WhatsApp'  },
  { href: 'https://instagram.com/smartechkenya', label: 'Instagram' },
  { href: 'https://tiktok.com/@smartechkenya',   label: 'TikTok'    },
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
            <div className="flex gap-5 mt-6 sm:mt-8">
              {SOCIAL.map(s => (
                <a key={s.label} href={s.href} target="_blank" rel="noopener noreferrer"
                  className="text-xs sm:text-sm font-semibold tracking-wide text-cream/40 hover:text-cream/85 transition-colors">{s.label}</a>
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
