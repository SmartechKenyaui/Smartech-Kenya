'use client';

import { useState }   from 'react';
import Image           from 'next/image';
import Link            from 'next/link';
import { useDispatch } from 'react-redux';
import { addToCart }   from '@/store/slices/cartSlice';
import toast           from 'react-hot-toast';

const WA = '254746722417';

interface Review {
  id: string; rating: number; comment?: string | null;
  createdAt: string | Date;
  user?: { name: string; image?: string | null };
}

interface Product {
  id: string; name: string; brand: string; description: string;
  price: number; comparePrice?: number | null;
  images: string[]; stock: number; category: string;
  features?: Record<string, unknown> | null;
  specifications?: Record<string, unknown> | null;
  avgRating: number; reviewCount: number; reviews: Review[];
  seller: { id: string; name: string };
}

export function ProductDetail({ product: p }: { product: Product }) {
  const dispatch = useDispatch();
  const [activeImg, setActiveImg] = useState(0);
  const [qty, setQty] = useState(1);

  const discount = p.comparePrice && p.comparePrice > p.price
    ? Math.round((1 - p.price / p.comparePrice) * 100) : null;

  const waMsg = encodeURIComponent(
    `Hi Smartech Kenya! I'd like to order:\n\n${p.name}\nQty: ${qty}\nPrice: KES ${p.price.toLocaleString()}\n\nPlease confirm availability. Thank you!`
  );

  const handleAddToCart = () => {
    dispatch(addToCart({ productId: p.id, name: p.name, price: p.price, image: p.images[0] ?? '', quantity: qty, stock: p.stock }));
    toast.success(`${qty > 1 ? qty + '× ' : ''}Added to cart`);
  };

  return (
    <div className="bg-white rounded-2xl border border-cream-warm overflow-hidden">

      {/* Breadcrumb */}
      <div className="px-6 py-4 border-b border-cream-warm/60 flex items-center gap-2 text-xs text-ink-faint">
        <Link href="/" className="hover:text-ink transition-colors">Home</Link>
        <span>/</span>
        <Link href="/products" className="hover:text-ink transition-colors">Products</Link>
        <span>/</span>
        <span className="text-ink truncate max-w-[200px]">{p.name}</span>
      </div>

      <div className="grid md:grid-cols-2">

        {/* ── Images ── */}
        <div className="p-6 lg:p-8 bg-cream-warm/30 border-r border-cream-warm/60">
          <div className="relative aspect-square rounded-2xl overflow-hidden bg-cream mb-4">
            {p.images[activeImg] ? (
              <Image src={p.images[activeImg]} alt={p.name} fill
                className="object-contain p-8" sizes="(max-width:768px) 100vw, 50vw" priority/>
            ) : (
              <div className="absolute inset-0 flex items-center justify-center">
                <svg className="w-20 h-20 text-cream-muted/30" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={0.8}
                    d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"/>
                </svg>
              </div>
            )}
            {discount !== null && discount > 0 && (
              <div className="absolute top-3 left-3 px-2.5 py-1 bg-red-600 text-white text-[10px] font-bold rounded-full">
                -{discount}%
              </div>
            )}
          </div>
          {p.images.length > 1 && (
            <div className="flex gap-2 flex-wrap">
              {p.images.map((img, i) => (
                <button key={i} onClick={() => setActiveImg(i)}
                  className={`w-14 h-14 rounded-xl overflow-hidden border-2 transition-all ${
                    activeImg === i ? 'border-ink' : 'border-transparent opacity-45 hover:opacity-75'
                  }`}>
                  <Image src={img} alt="" width={56} height={56} className="object-contain w-full h-full p-1"/>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* ── Info ── */}
        <div className="p-6 lg:p-8 flex flex-col">
          <p className="text-[10px] font-bold text-cream-muted uppercase tracking-widest mb-2">{p.brand}</p>
          <h1 className="font-display text-ink leading-tight mb-4"
            style={{ fontSize: 'clamp(1.5rem,3vw,2.2rem)', fontWeight: 400 }}>
            {p.name}
          </h1>

          {/* Rating */}
          {p.avgRating > 0 && (
            <div className="flex items-center gap-2 mb-5">
              <div className="flex gap-0.5">
                {[1,2,3,4,5].map(s => (
                  <svg key={s} className={`w-4 h-4 ${s <= Math.round(p.avgRating) ? 'text-amber-luxe' : 'text-cream-warm'}`}
                    fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
                  </svg>
                ))}
              </div>
              <span className="text-xs text-ink-faint">{p.avgRating.toFixed(1)} ({p.reviewCount} reviews)</span>
            </div>
          )}

          {/* Price */}
          <div className="flex items-baseline gap-3 mb-5">
            <span className="price" style={{ fontSize: 'clamp(1.6rem,3vw,2rem)' }}>
              KES {p.price.toLocaleString()}
            </span>
            {p.comparePrice && p.comparePrice > p.price && (
              <span className="price-was text-base">KES {p.comparePrice.toLocaleString()}</span>
            )}
          </div>

          <p className="text-ink-muted text-sm leading-relaxed mb-6">{p.description}</p>

          {/* Features list */}
          {Array.isArray(p.features) && p.features.length > 0 && (
            <ul className="space-y-1.5 mb-6">
              {(p.features as string[]).slice(0, 5).map((f, i) => (
                <li key={i} className="flex items-start gap-2 text-sm text-ink-muted">
                  <svg className="w-4 h-4 mt-0.5 shrink-0 text-ink/30" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7"/>
                  </svg>
                  {f}
                </li>
              ))}
            </ul>
          )}

          {/* Stock */}
          <div className="flex items-center gap-2 mb-5">
            <div className={`w-2 h-2 rounded-full ${p.stock > 5 ? 'bg-ink/40' : p.stock > 0 ? 'bg-amber-luxe' : 'bg-red-400'}`}/>
            <span className="text-sm text-ink-faint">
              {p.stock > 5 ? 'In stock' : p.stock > 0 ? `Only ${p.stock} left` : 'Out of stock'}
            </span>
          </div>

          {/* Qty + CTA */}
          {p.stock > 0 && (
            <div className="space-y-3 mb-6">
              <div className="flex items-center gap-3">
                {/* Qty */}
                <div className="flex items-center border border-cream-warm rounded-xl overflow-hidden">
                  <button onClick={() => setQty(Math.max(1, qty - 1))}
                    className="w-10 h-10 flex items-center justify-center hover:bg-cream-warm transition-colors text-ink-muted text-lg">−</button>
                  <span className="w-10 text-center text-sm font-semibold text-ink">{qty}</span>
                  <button onClick={() => setQty(Math.min(p.stock, qty + 1))}
                    className="w-10 h-10 flex items-center justify-center hover:bg-cream-warm transition-colors text-ink-muted text-lg">+</button>
                </div>
                {/* Add to cart */}
                <button onClick={handleAddToCart}
                  className="flex-1 h-10 bg-ink text-cream text-sm font-semibold rounded-xl hover:bg-ink-soft transition-all active:scale-[0.98]">
                  Add to Cart
                </button>
              </div>
              {/* WhatsApp order */}
              <a href={`https://wa.me/${WA}?text=${waMsg}`} target="_blank" rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 w-full h-10 rounded-xl border border-cream-warm text-sm font-medium text-ink-muted hover:bg-cream-warm transition-colors">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/>
                  <path d="M12 0C5.373 0 0 5.373 0 12c0 2.126.557 4.126 1.526 5.855L.055 23.266l5.533-1.448A11.95 11.95 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 22c-1.928 0-3.736-.518-5.29-1.42l-.378-.224-3.93 1.028 1.046-3.818-.246-.393A9.965 9.965 0 012 12C2 6.477 6.477 2 12 2s10 4.477 10 10-4.477 10-10 10z"/>
                </svg>
                Order via WhatsApp
              </a>
            </div>
          )}

          {/* Seller */}
          <div className="mt-auto pt-5 border-t border-cream-warm flex items-center gap-2">
            <div className="w-6 h-6 bg-cream-warm rounded-full flex items-center justify-center text-ink-faint text-[10px] font-bold">
              {p.seller.name[0]}
            </div>
            <span className="text-xs text-cream-muted">
              Sold by <span className="font-medium text-ink-muted">{p.seller.name}</span>
            </span>
          </div>
        </div>
      </div>

      {/* Specifications */}
      {p.specifications && Object.keys(p.specifications).length > 0 && (
        <div className="border-t border-cream-warm p-6 lg:p-8">
          <h2 className="font-semibold text-ink mb-5 text-sm uppercase tracking-wide">Specifications</h2>
          <div className="grid sm:grid-cols-2 gap-x-8">
            {Object.entries(p.specifications as Record<string,string>).map(([k, v]) => (
              <div key={k} className="flex gap-4 py-2.5 border-b border-cream-warm/60 last:border-0">
                <span className="text-ink-faint text-xs w-36 shrink-0 pt-0.5">{k}</span>
                <span className="text-ink text-xs font-medium">{String(v)}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Reviews */}
      {p.reviews.length > 0 && (
        <div className="border-t border-cream-warm p-6 lg:p-8">
          <h2 className="font-semibold text-ink mb-6 text-sm uppercase tracking-wide">
            Customer Reviews <span className="font-normal text-cream-muted normal-case tracking-normal ml-1">({p.reviewCount})</span>
          </h2>
          <div className="space-y-5">
            {p.reviews.slice(0, 5).map(r => (
              <div key={r.id} className="border-b border-cream-warm/60 pb-5 last:border-0">
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-7 h-7 bg-cream-warm rounded-full flex items-center justify-center text-xs font-bold text-ink-faint">
                    {r.user?.name?.[0] ?? 'C'}
                  </div>
                  <span className="text-sm font-medium text-ink">{r.user?.name ?? 'Customer'}</span>
                  <div className="flex gap-0.5 ml-1">
                    {[1,2,3,4,5].map(s => (
                      <svg key={s} className={`w-3 h-3 ${s <= r.rating ? 'text-amber-luxe' : 'text-cream-warm'}`}
                        fill="currentColor" viewBox="0 0 20 20">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
                      </svg>
                    ))}
                  </div>
                </div>
                {r.comment && <p className="text-ink-muted text-sm leading-relaxed ml-9">{r.comment}</p>}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
