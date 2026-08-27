'use client';

import { useState }    from 'react';
import Link             from 'next/link';
import Image            from 'next/image';
import { useDispatch }  from 'react-redux';
import { addToCart }    from '@/store/slices/cartSlice';
import toast            from 'react-hot-toast';

interface Product {
  id:            string;
  name:          string;
  slug:          string;
  sku:           string;
  price:         number;
  comparePrice?: number | null;
  imageUrl?:     string;
  images?:       string[];
  brand:         string;
  category:      string;
  stock:         number;
  avgRating?:    number;
  reviewCount?:  number;
}

export function ProductCard({ product: p }: { product: Product }) {
  const dispatch = useDispatch();
  const [imgErr, setImgErr] = useState(false);

  const mainImage: string = p.imageUrl ?? p.images?.[0] ?? '';

  const disc = p.comparePrice && p.comparePrice > p.price
    ? Math.round((1 - p.price / p.comparePrice) * 100)
    : null;

  const addCart = (e: React.MouseEvent) => {
    e.preventDefault(); e.stopPropagation();
    if (p.stock === 0) return;
    dispatch(addToCart({
      productId: p.id,
      name:      p.name,
      price:     p.price,
      image:     mainImage,
      quantity:  1,
      stock:     p.stock,
    }));
    toast.success(`Added to cart`, {
      icon: '🛒',
      style: { background: '#0C0C0C', color: '#FFFFFF', borderRadius: '14px', fontSize: '13px' },
    });
  };

  const productUrl = `/products/${encodeURIComponent(p.sku)}`;

  return (
    <Link href={productUrl} className="group block">
      <article className="card h-full flex flex-col">

        {/* ── Image ── */}
        <div className="relative aspect-[4/3] overflow-hidden rounded-t-2xl"
          style={{ background: '#FFFFFF' }}>
          {mainImage && !imgErr ? (
            <Image
              src={mainImage} alt={p.name} fill
              sizes="(max-width:640px) 50vw,(max-width:1024px) 33vw,25vw"
              className="object-contain p-5 prod-img transition-transform duration-500 group-hover:scale-[1.04]"
              onError={() => setImgErr(true)}
            />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center" style={{ background: '#F5F5F5' }}>
              <svg className="w-12 h-12" style={{ color: 'rgba(154,160,166,0.45)' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1}
                  d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V7a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"/>
              </svg>
            </div>
          )}

          {disc !== null && disc > 0 && (
            <div className="absolute top-3 left-3 px-2.5 py-1 rounded-full text-[10px] font-bold tracking-wide text-white"
              style={{ background: '#C0392B' }}>
              -{disc}%
            </div>
          )}

          {p.stock > 0 && p.stock <= 3 && (
            <div className="absolute bottom-3 left-3 px-2 py-0.5 rounded-full text-[9px] font-bold tracking-wide text-white"
              style={{ background: '#8B5A1A' }}>
              Only {p.stock} left
            </div>
          )}

          {p.stock > 0 && (
            <button onClick={addCart} aria-label="Add to cart"
              className="absolute bottom-2.5 right-2.5 sm:bottom-3 sm:right-3 w-8 h-8 sm:w-9 sm:h-9 rounded-xl flex items-center justify-center shadow-md z-10
                         opacity-100 sm:opacity-0 sm:translate-y-2 sm:group-hover:opacity-100 sm:group-hover:translate-y-0
                         transition-all duration-200 active:scale-90"
              style={{ background: '#0C0C0C', color: '#FFFFFF' }}>
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4"/>
              </svg>
            </button>
          )}

          {p.stock === 0 && (
            <div className="absolute inset-0 flex items-center justify-center"
              style={{ background: 'rgba(255,255,255,0.65)' }}>
              <span className="text-xs font-semibold px-3 py-1.5 rounded-full"
                style={{ background: 'white', border: '1px solid #E8E8E8', color: '#6B6B6B' }}>
                Out of stock
              </span>
            </div>
          )}
        </div>

        {/* ── Info ── */}
        <div className="p-4 pt-3.5 flex flex-col flex-1">
          <p className="text-[9.5px] font-bold tracking-widest uppercase mb-1.5" style={{ color: '#9AA0A6' }}>
            {p.brand}
          </p>
          <h3 className="text-[13px] font-semibold leading-snug line-clamp-2 mb-auto pb-3" style={{ color: '#0C0C0C' }}>
            {p.name}
          </h3>

          {(p.avgRating ?? 0) > 0 && (
            <div className="flex items-center gap-1.5 mb-2.5">
              <div className="flex gap-0.5">
                {[1,2,3,4,5].map(s => (
                  <svg key={s} className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20"
                    style={{ color: s <= Math.round(p.avgRating!) ? '#C4902A' : '#E8E8E8' }}>
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
                  </svg>
                ))}
              </div>
              <span className="text-[10px] font-semibold" style={{ color: '#5F6368' }}>({p.reviewCount})</span>
            </div>
          )}

          {/* Price row */}
          <div className="flex items-baseline gap-2">
            <span className="price price-md">KES {p.price.toLocaleString()}</span>
            {p.comparePrice && p.comparePrice > p.price && (
              <span className="price-was text-xs">KES {p.comparePrice.toLocaleString()}</span>
            )}
          </div>
        </div>
      </article>
    </Link>
  );
}
