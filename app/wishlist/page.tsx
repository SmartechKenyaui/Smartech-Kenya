'use client';

import Image from 'next/image';
import Link  from 'next/link';
import { useDispatch, useSelector } from 'react-redux';
import { RootState }          from '@/store';
import { removeFromWishlist } from '@/store/slices/wishlistSlice';
import { addToCart }          from '@/store/slices/cartSlice';
import toast                  from 'react-hot-toast';

export default function WishlistPage() {
  const dispatch = useDispatch();
  const items    = useSelector((s: RootState) => s.wishlist.items);

  const moveToCart = (item: typeof items[0]) => {
    dispatch(addToCart({
      productId: item.productId,
      name:      item.name,
      price:     item.price,
      image:     item.image,
      quantity:  1,
      stock:     99,
    }));
    dispatch(removeFromWishlist(item.productId));
    toast.success('Moved to cart');
  };

  if (!items.length) {
    return (
      <div className="min-h-[60vh] bg-cream flex items-center justify-center px-6">
        <div className="text-center">
          <div className="w-16 h-16 bg-cream-warm rounded-2xl flex items-center justify-center mx-auto mb-5">
            <svg className="w-7 h-7 text-cream-muted" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"/>
            </svg>
          </div>
          <h2 className="font-display text-ink text-3xl font-light mb-2">Your wishlist is empty</h2>
          <p className="text-ink-faint text-sm mb-8">Save products you love for later.</p>
          <Link href="/products" className="btn-dark px-8 py-3.5">Browse Products</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-cream-warm/30 py-12 px-6">
      <div className="max-w-[1320px] mx-auto">
        <h1 className="font-display text-ink mb-10"
          style={{ fontSize: 'clamp(2rem,4vw,3rem)', fontWeight: 400 }}>
          Wishlist <span className="text-ink/30 font-light text-2xl ml-2">({items.length})</span>
        </h1>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {items.map(item => (
            <div key={item.productId}
              className="bg-white rounded-2xl border border-cream-warm overflow-hidden group">
              <div className="relative aspect-square bg-cream">
                {item.image ? (
                  <Image src={item.image} alt={item.name} fill
                    sizes="(max-width:768px) 50vw, 25vw"
                    className="object-contain p-5"/>
                ) : (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <svg className="w-10 h-10 text-cream-muted/30" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1}
                        d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01"/>
                    </svg>
                  </div>
                )}
                <button
                  onClick={() => { dispatch(removeFromWishlist(item.productId)); toast.success('Removed from wishlist'); }}
                  className="absolute top-3 right-3 w-7 h-7 bg-white rounded-full flex items-center justify-center
                             opacity-0 group-hover:opacity-100 transition-opacity shadow-sm hover:bg-red-50">
                  <svg className="w-3.5 h-3.5 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12"/>
                  </svg>
                </button>
              </div>

              <div className="p-4">
                <p className="text-ink text-xs font-semibold leading-snug line-clamp-2 mb-3">{item.name}</p>
                <p className="price price-md mb-3">
                  KES {item.price.toLocaleString()}
                </p>
                <button onClick={() => moveToCart(item)}
                  className="w-full py-2.5 bg-ink text-cream text-xs font-semibold rounded-xl
                             hover:bg-ink-soft transition-all active:scale-[0.98]">
                  Add to Cart
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
