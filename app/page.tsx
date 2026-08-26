import Image  from 'next/image';
import Link   from 'next/link';
import { listProducts } from '@/lib/cloudinary';
import { ProductCard }  from '@/components/product/ProductCard';
import { listHeroImages } from '@/lib/cloudinary';
import type { Metadata } from 'next';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title:       'Smartech Kenya — Premium Tech & Home Appliances Nairobi',
  description: "Kenya's curated destination for electronics and home appliances. MIKA, Hisense, Samsung, HP. Fast Nairobi delivery.",
};

const BRANDS = ['Mika','Hisense','Samsung','LG','Ramtons','HP','Von Hotpoint','Beko','Haier','TCL'];
const SOCIAL = [
  { href: 'https://wa.me/254746722417',          label: 'WhatsApp'  },
  { href: 'https://instagram.com/smartechkenya', label: 'Instagram' },
  { href: 'https://tiktok.com/@smartechkenya',   label: 'TikTok'    },
];

export default async function HomePage() {
  const [featured, latest, kitchen, heroImages] = await Promise.all([
    listProducts({ featured: true, limit: 8 }),
    listProducts({ limit: 4 }),
    listProducts({ category: 'KITCHEN', limit: 4 }),
    listHeroImages(),
  ]);

  // Fallback hero images if none uploaded to Cloudinary yet
  const HERO_IMAGES = heroImages.length > 0 ? heroImages : [
    { src: 'https://images.unsplash.com/photo-1584568694244-14fbdf83bd30?w=700&q=80', alt: 'Kitchen Appliances' },
    { src: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=700&q=80', alt: 'Smart Home' },
    { src: 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=700&q=80', alt: 'Laptops & Tech' },
    { src: 'https://images.unsplash.com/photo-1509281373149-e957c6296406?w=700&q=80', alt: 'Televisions' },
  ];

  return (
    <div className="bg-cream">

      {/* ══ HERO ════════════════════════════════════════════════════════════ */}
      <section className="relative overflow-hidden bg-ink">
        <div className="max-w-[1320px] mx-auto px-6 grid lg:grid-cols-2 gap-0 items-center min-h-[46vh] lg:min-h-[52vh]">
          <div className="pt-8 pb-10 lg:pt-10 lg:pb-12 lg:pr-12 z-10 relative">
            <div className="inline-flex items-center gap-2 mb-4 px-3 py-1.5 rounded-full border border-white/[0.12] bg-white/[0.05]">
              <span className="w-1.5 h-1.5 rounded-full bg-[#F97316]"/>
              <p className="text-[10px] font-bold tracking-[0.22em] uppercase text-white/50">Nairobi&apos;s Appliance Store</p>
            </div>
            <h1 className="font-display text-white tracking-tight mb-4"
              style={{ fontSize: 'clamp(1.9rem,3.4vw,3.1rem)', fontWeight: 700, lineHeight: 1.08 }}>
              Elevating Every Home,<br/>
              <span style={{ color: '#F97316' }}>One Appliance</span><br/>
              at a Time.
            </h1>
            <p className="text-[14px] leading-relaxed mb-6 max-w-[400px]" style={{ color: 'rgba(255,255,255,0.60)' }}>
              Premium home appliances and electronics, curated for the modern Kenyan home. Delivered fast across Nairobi.
            </p>
            <div className="flex flex-wrap gap-3 mb-6">
              <Link href="/products" className="btn px-8 py-3.5 rounded-full text-sm font-semibold shadow-xl" style={{ background: '#F97316', color: '#fff' }}>
                Shop All Products
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3"/>
                </svg>
              </Link>
              <a href="https://wa.me/254746722417?text=Hi%20Smartech%20Kenya%2C%20I%20want%20to%20order"
                target="_blank" rel="noopener noreferrer" className="btn-outline-cream text-sm px-8 py-3.5">
                Order via WhatsApp
              </a>
            </div>
            <div className="flex flex-wrap gap-6 pt-8 border-t border-white/[0.10]">
              {['Genuine Products','Fast Nairobi Delivery','WhatsApp Support'].map(t => (
                <div key={t} className="flex items-center gap-2">
                  <svg className="w-3.5 h-3.5 shrink-0" style={{ color: '#F97316' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7"/>
                  </svg>
                  <span className="text-[11px] font-medium tracking-wide" style={{ color: 'rgba(255,255,255,0.55)' }}>{t}</span>
                </div>
              ))}
            </div>
          </div>
          <div className="hidden lg:grid grid-cols-2 grid-rows-2 gap-3 py-6 pl-4" style={{ height: '88vh' }}>
            {HERO_IMAGES.map((img, i) => (
              <div key={i} className="relative rounded-2xl overflow-hidden bg-white/5 group" style={{ minHeight: 0 }}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={img.src} alt={img.alt} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"/>
                <div className="absolute inset-0 rounded-2xl" style={{ background: 'linear-gradient(180deg, transparent 55%, rgba(0,0,0,0.40) 100%)' }}/>
              </div>
            ))}
          </div>
          <div className="lg:hidden -mx-6 pb-8 overflow-x-auto hide-scrollbar flex gap-3 px-6">
            {HERO_IMAGES.map((img, i) => (
              <div key={i} className="relative flex-shrink-0 rounded-xl overflow-hidden" style={{ width: '72vw', height: '200px' }}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={img.src} alt={img.alt} className="w-full h-full object-cover"/>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══ FEATURED ════════════════════════════════════════════════════════ */}
      {featured.length > 0 && (
        <section className="py-10 px-6 bg-white">
          <div className="max-w-[1320px] mx-auto">
            <SectionHeader label="Hand-picked" title="Featured Products" href="/products" cta="View all"/>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {featured.map(p => <ProductCard key={p.id} product={p as any}/>)}
            </div>
          </div>
        </section>
      )}

      {/* ══ PROMO BANNERS ═══════════════════════════════════════════════════ */}
      <section className="py-6 px-6 bg-cream-warm/40">
        <div className="max-w-[1320px] mx-auto grid md:grid-cols-2 gap-4">
          {[
            { label: 'Home Appliances', href: '/products?category=KITCHEN',     headline: 'Upgrade Your\nKitchen Today', sub: 'MIKA, Hisense, Ramtons & more', img: 'https://images.unsplash.com/photo-1584568694244-14fbdf83bd30?w=700&q=80' },
            { label: 'Tech Deals',      href: '/products?category=SMARTPHONES', headline: 'Latest Phones\n& Laptops',     sub: 'Samsung, HP and top brands',     img: 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=700&q=80' },
          ].map(b => (
            <Link key={b.label} href={b.href}
              className="group relative rounded-2xl overflow-hidden bg-ink flex items-center" style={{ minHeight: '200px' }}>
              <div className="absolute inset-0 dot-grid opacity-70"/>
              <div className="absolute right-0 top-0 bottom-0 w-[52%] hidden sm:block">
                <Image src={b.img} alt={b.label} fill sizes="340px"
                  className="object-cover opacity-35 group-hover:opacity-50 transition-opacity duration-500"/>
                <div className="absolute inset-0" style={{ background: 'linear-gradient(90deg, #0C0C0C 0%, rgba(12,12,12,0.85) 30%, rgba(12,12,12,0.20) 70%, transparent 100%)' }}/>
              </div>
              <div className="relative p-7 lg:p-8 z-10 max-w-[280px]">
                <p className="text-[9px] font-bold tracking-[0.18em] uppercase mb-2.5" style={{ color: 'rgba(255,255,255,0.50)' }}>{b.label}</p>
                <h3 className="font-display text-white leading-tight mb-3"
                  style={{ fontSize: 'clamp(1.5rem,2.8vw,2rem)', fontWeight: 400, whiteSpace: 'pre-line' }}>{b.headline}</h3>
                <p className="text-xs mb-5 font-medium" style={{ color: 'rgba(255,255,255,0.60)' }}>{b.sub}</p>
                <span className="inline-flex items-center gap-2 text-xs font-bold tracking-wide" style={{ color: '#D9A050' }}>
                  Shop Now
                  <svg className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3"/>
                  </svg>
                </span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* ══ KITCHEN ═════════════════════════════════════════════════════════ */}
      {kitchen.length > 0 && (
        <section className="py-16 px-6 bg-ink">
          <div className="max-w-[1320px] mx-auto">
            <SectionHeader label="Mika · Hisense · Ramtons" title="Home Appliances" href="/products?category=KITCHEN" cta="View all" dark/>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {kitchen.map(p => <ProductCard key={p.id} product={p as any}/>)}
            </div>
          </div>
        </section>
      )}

      {/* ══ NEW ARRIVALS ════════════════════════════════════════════════════ */}
      {latest.length > 0 && (
        <section className="py-16 px-6 bg-cream-warm/30">
          <div className="max-w-[1320px] mx-auto">
            <SectionHeader label="Just In" title="New Arrivals" href="/products" cta="View all new"/>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {latest.map(p => <ProductCard key={p.id} product={p as any}/>)}
            </div>
          </div>
        </section>
      )}

      {/* ══ WHY SMARTECH ════════════════════════════════════════════════════ */}
      <section className="py-14 px-6 bg-cream">
        <div className="max-w-[1320px] mx-auto">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { n: '01', title: 'Fast Nairobi Delivery',  desc: 'Same-day or next-day within Nairobi CBD and suburbs.' },
              { n: '02', title: '100% Genuine Products',  desc: 'Sourced directly from authorised Kenyan distributors.' },
              { n: '03', title: 'Order via WhatsApp',     desc: 'Place an order instantly — no account needed.' },
              { n: '04', title: 'After-sales Support',    desc: 'We stand behind every product post-purchase.' },
            ].map(f => (
              <div key={f.n} className="p-6 rounded-2xl border border-cream-warm bg-white/70 hover:bg-white hover:shadow-sm transition-all duration-200">
                <p className="font-display text-[2.2rem] font-light mb-4 leading-none" style={{ color: 'rgba(139,90,26,0.20)' }}>{f.n}</p>
                <h3 className="font-semibold text-ink text-sm mb-2">{f.title}</h3>
                <p className="text-ink-faint text-xs leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══ BRANDS ══════════════════════════════════════════════════════════ */}
      <section className="py-12 px-6 border-t border-cream-warm/60 bg-cream">
        <div className="max-w-[1320px] mx-auto">
          <p className="text-center text-[9px] font-bold tracking-[0.22em] uppercase text-ink/30 mb-8">Authorised brands</p>
          <div className="flex flex-wrap items-center justify-center gap-x-10 gap-y-3">
            {BRANDS.map(b => (
              <Link key={b} href={`/products?brand=${encodeURIComponent(b)}`}
                className="font-display text-xl font-light text-ink/30 hover:text-ink/65 transition-colors tracking-wide">{b}</Link>
            ))}
          </div>
        </div>
      </section>

      {/* ══ NEWSLETTER ══════════════════════════════════════════════════════ */}
      <section className="py-20 px-6 bg-ink">
        <div className="max-w-[1320px] mx-auto grid md:grid-cols-2 gap-12 lg:gap-20 items-center">
          <div>
            <p className="text-[9.5px] font-bold tracking-[0.18em] uppercase mb-5" style={{ color: '#D9A050' }}>Stay ahead</p>
            <h2 className="font-display text-cream mb-4" style={{ fontSize: 'clamp(1.9rem,3.8vw,2.9rem)', fontWeight: 400 }}>Get the best deals first</h2>
            <p className="text-sm leading-relaxed max-w-[320px]" style={{ color: 'rgba(255,255,255,0.55)' }}>New arrivals, exclusive offers and appliance news — no spam.</p>
            <div className="flex gap-5 mt-8">
              {SOCIAL.map(s => (
                <a key={s.label} href={s.href} target="_blank" rel="noopener noreferrer"
                  className="text-xs font-semibold tracking-wide text-cream/40 hover:text-cream/75 transition-colors">{s.label}</a>
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
    <div className="flex items-end justify-between mb-10">
      <div>
        <p className="text-[9.5px] font-bold tracking-[0.16em] uppercase mb-2.5" style={{ color: dark ? '#D9A050' : '#8B5A1A' }}>{label}</p>
        <h2 className={`font-display ${dark ? 'text-cream' : 'text-ink'}`} style={{ fontSize: 'clamp(1.65rem,3vw,2.5rem)', fontWeight: 400 }}>{title}</h2>
      </div>
      <Link href={href}
        className={['hidden sm:inline-flex items-center gap-1.5 text-xs font-semibold transition-colors', dark ? 'text-cream/45 hover:text-cream' : 'text-ink/45 hover:text-ink'].join(' ')}>
        {cta}
        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3"/>
        </svg>
      </Link>
    </div>
  );
}
