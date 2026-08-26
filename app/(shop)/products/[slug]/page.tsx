import { notFound }         from 'next/navigation';
import Image                 from 'next/image';
import Link                  from 'next/link';
import { getProductBySku, listProducts } from '@/lib/cloudinary';
import { AddToCartButton } from '@/components/product/AddToCartButton';
import type { Metadata }     from 'next';

export const dynamic = 'force-dynamic';

interface Props { params: { slug: string } }

const WA = '254746722417';

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  // params.slug is the SKU (e.g. "MIKA-WM-8KG")
  const product = await getProductBySku(decodeURIComponent(params.slug));
  if (!product) return { title: 'Product Not Found — Smartech Kenya' };
  return {
    title:       `${product.name} — Smartech Kenya`,
    description: product.description ??
      `Buy ${product.name} by ${product.brand} at Smartech Kenya. Fast Nairobi delivery. KES ${product.price.toLocaleString()}.`,
    openGraph: {
      images: product.images[0] ? [{ url: product.images[0] }] : [],
    },
  };
}

export default async function ProductDetailPage({ params }: Props) {
  // BUG FIX: Previously used getProductBySlug(params.slug) which ran fragile
  // slug-splitting logic and often returned null → notFound crash.
  // ProductCard now links to /products/{sku}, so we do a fast direct SKU lookup.
  const product = await getProductBySku(decodeURIComponent(params.slug));
  if (!product) notFound();

  // Related: same category, exclude self
  const related = (await listProducts({ category: product.category, limit: 5 }))
    .filter(p => p.sku !== product.sku)
    .slice(0, 4);

  const discount = product.comparePrice && product.comparePrice > product.price
    ? Math.round((1 - product.price / product.comparePrice) * 100)
    : null;

  const waMsg = encodeURIComponent(
    `Hi Smartech Kenya! I'd like to order:\n\n${product.name}\nSKU: ${product.sku}\nPrice: KES ${product.price.toLocaleString()}\n\nPlease confirm availability. Thank you!`
  );

  return (
    <div className="min-h-screen bg-cream">

      {/* Breadcrumb */}
      <div className="border-b border-cream-warm/60 bg-cream">
        <div className="max-w-[1320px] mx-auto px-6 py-3.5 flex items-center gap-2 text-xs text-ink/40 flex-wrap">
          <Link href="/"          className="hover:text-ink/70 transition-colors">Home</Link>
          <span>/</span>
          <Link href="/products"  className="hover:text-ink/70 transition-colors">Products</Link>
          <span>/</span>
          <Link href={`/products?category=${product.category}`}
            className="hover:text-ink/70 transition-colors capitalize">
            {product.category.charAt(0) + product.category.slice(1).toLowerCase().replace(/_/g, ' ')}
          </Link>
          <span>/</span>
          <span className="text-ink/65 truncate max-w-[200px]">{product.name}</span>
        </div>
      </div>

      <div className="max-w-[1320px] mx-auto px-6 py-10 lg:py-14">
        <div className="grid lg:grid-cols-2 gap-10 lg:gap-16 items-start">

          {/* ── Image ── */}
          <div className="rounded-2xl overflow-hidden border border-cream-warm bg-white"
            style={{ aspectRatio: '1 / 1', position: 'relative' }}>
            {product.images[0] ? (
              <Image
                src={product.images[0]} alt={product.name} fill
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="object-contain p-8"
                priority
              />
            ) : (
              <div className="absolute inset-0 flex items-center justify-center bg-cream-warm/30">
                <svg className="w-16 h-16 text-ink/10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1}
                    d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"/>
                </svg>
              </div>
            )}
            {discount && (
              <div className="absolute top-4 left-4 px-2.5 py-1 rounded-full text-[10px] font-bold tracking-wide bg-[#C0392B] text-white">
                -{discount}%
              </div>
            )}
          </div>

          {/* ── Details ── */}
          <div className="lg:pt-2">

            {/* Brand + category tags */}
            <div className="flex items-center gap-2.5 mb-4 flex-wrap">
              <Link href={`/products?brand=${encodeURIComponent(product.brand)}`}
                className="text-[10px] font-bold tracking-[0.18em] uppercase px-2.5 py-1 rounded-full border border-cream-warm bg-white hover:bg-cream-warm/40 transition-colors text-ink/60">
                {product.brand}
              </Link>
              <Link href={`/products?category=${product.category}`}
                className="text-[10px] font-bold tracking-[0.18em] uppercase text-ink/35 hover:text-ink/60 transition-colors">
                {product.category.replace(/_/g, ' ')}
              </Link>
            </div>

            <h1 className="font-display text-ink mb-5 leading-tight"
              style={{ fontSize: 'clamp(1.7rem, 3vw, 2.6rem)', fontWeight: 400 }}>
              {product.name}
            </h1>

            {/* Price */}
            <div className="flex items-baseline gap-3 mb-6">
              <span className="price" style={{ fontSize: '1.875rem' }}>
                KES {product.price.toLocaleString()}
              </span>
              {product.comparePrice && product.comparePrice > product.price && (
                <span className="price-was text-base">
                  KES {product.comparePrice.toLocaleString()}
                </span>
              )}
            </div>

            {product.description && (
              <ul className="text-sm leading-relaxed text-ink/65 mb-7 max-w-[480px] list-disc list-inside space-y-1.5">
                {product.description
                  .split(/\n|(?<=\.)\s+/)
                  .map((s: string) => s.trim())
                  .filter(Boolean)
                  .map((item: string, i: number) => (
                    <li key={i}>{item}</li>
                  ))}
              </ul>
            )}

            {/* Stock badge */}
            <div className="flex items-center gap-2 mb-8">
              {product.stock > 0 ? (
                <>
                  <span className="w-2 h-2 rounded-full bg-emerald-500"/>
                  <span className="text-xs font-medium text-ink/60">
                    {product.stock > 10 ? 'In Stock' : `Only ${product.stock} left`}
                  </span>
                </>
              ) : (
                <>
                  <span className="w-2 h-2 rounded-full bg-red-400"/>
                  <span className="text-xs font-medium text-ink/60">Out of Stock</span>
                </>
              )}
            </div>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row gap-3 mb-8">
              <a href={`https://wa.me/${WA}?text=${waMsg}`}
                target="_blank" rel="noopener noreferrer"
                className="btn flex-1 flex items-center justify-center gap-2.5 px-7 py-4 rounded-full text-sm font-semibold shadow-lg"
                style={{ background: '#25D366', color: '#fff' }}>
                <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347"/>
                </svg>
                Order on WhatsApp
              </a>
              <AddToCartButton
                productId={product.id}
                name={product.name}
                price={product.price}
                image={product.images[0] ?? ''}
                stock={product.stock}
              />
            </div>

            {/* Trust */}
            <div className="pt-6 border-t border-cream-warm/60 grid grid-cols-3 gap-4 text-center">
              {[
                { icon: '🚚', label: 'Fast Delivery',    sub: 'Nairobi same-day'   },
                { icon: '✓',  label: '100% Genuine',     sub: 'Authorised dealer'  },
                { icon: '💬', label: 'WhatsApp Support', sub: '+254 746 722 417'   },
              ].map(b => (
                <div key={b.label}>
                  <div className="text-lg mb-1">{b.icon}</div>
                  <p className="text-[10px] font-semibold text-ink">{b.label}</p>
                  <p className="text-[9px] text-ink/45">{b.sub}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Related products */}
        {related.length > 0 && (
          <section className="mt-20">
            <div className="flex items-end justify-between mb-8">
              <div>
                <p className="text-[9.5px] font-bold tracking-[0.16em] uppercase mb-2" style={{ color: '#8B5A1A' }}>
                  You may also like
                </p>
                <h2 className="font-display text-ink" style={{ fontSize: 'clamp(1.4rem,2.5vw,2rem)', fontWeight: 400 }}>
                  Related Products
                </h2>
              </div>
              <Link href={`/products?category=${product.category}`}
                className="hidden sm:inline-flex items-center gap-1.5 text-xs font-semibold text-ink/45 hover:text-ink transition-colors">
                View all
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3"/>
                </svg>
              </Link>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {related.map(p => (
                <Link key={p.id} href={`/products/${encodeURIComponent(p.sku)}`}
                  className="group rounded-2xl overflow-hidden border border-cream-warm bg-white hover:shadow-md transition-all duration-200">
                  <div className="relative bg-cream-warm/20" style={{ aspectRatio: '1 / 1' }}>
                    {p.images[0] ? (
                      <Image src={p.images[0]} alt={p.name} fill
                        sizes="(max-width: 768px) 50vw, 25vw"
                        className="object-contain p-4 group-hover:scale-105 transition-transform duration-300"/>
                    ) : (
                      <div className="absolute inset-0 flex items-center justify-center">
                        <svg className="w-10 h-10 text-ink/10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1}
                            d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"/>
                        </svg>
                      </div>
                    )}
                  </div>
                  <div className="p-3.5">
                    <p className="text-[9px] font-bold tracking-wider uppercase text-ink/35 mb-1">{p.brand}</p>
                    <p className="text-xs font-medium text-ink leading-snug mb-2 line-clamp-2">{p.name}</p>
                    <p className="price price-sm">KES {p.price.toLocaleString()}</p>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
