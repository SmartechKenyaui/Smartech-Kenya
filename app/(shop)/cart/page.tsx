'use client';

import Image      from 'next/image';
import Link       from 'next/link';
import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState }      from '@/store';
import { removeFromCart, updateQuantity, clearCart } from '@/store/slices/cartSlice';

const WA_NUMBER = '254746722417';

function buildWhatsAppMessage(items: Array<{ name: string; quantity: number; price: number }>, total: number) {
  const lines = items.map(i => `- ${i.name} x${i.quantity} - KES ${(i.price * i.quantity).toLocaleString()}`).join('\n');
  return encodeURIComponent(
    `Hello Smartech Kenya!\n\nI would like to order:\n\n${lines}\n\nTotal: KES ${total.toLocaleString()}\n\nPlease confirm availability and delivery details. Thank you!`
  );
}

interface CartItem {
  productId: string;
  name: string;
  price: number;
  quantity: number;
  stock: number;
  image: string;
}

function CheckoutModal({ items, total, onClose }: {
  items: CartItem[];
  total: number;
  onClose: () => void;
}) {
  const msg = buildWhatsAppMessage(items, total);
  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4 sm:p-6">
      <div className="absolute inset-0 bg-ink/50 backdrop-blur-sm" onClick={onClose}/>
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden">
        <div className="px-6 pt-6 pb-5 border-b border-cream-warm">
          <div className="flex items-start justify-between">
            <div>
              <h2 className="font-display text-ink text-2xl font-light mb-1">Place Your Order</h2>
              <p className="text-ink-faint text-sm">Choose how you would like to reach us</p>
            </div>
            <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-cream transition-colors text-ink-faint">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12"/>
              </svg>
            </button>
          </div>
          <div className="mt-4 bg-cream rounded-xl px-4 py-3 flex justify-between items-center">
            <span className="text-ink-muted text-sm">{items.length} item{items.length > 1 ? 's' : ''}</span>
            <span className="price price-md">KES {total.toLocaleString()}</span>
          </div>
        </div>

        <div className="px-6 py-5 space-y-3">
          <a
            href={`https://wa.me/${WA_NUMBER}?text=${msg}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-4 p-4 rounded-xl border border-green-200 bg-green-50 hover:shadow-sm active:scale-[0.99] transition-all"
          >
            <div className="w-10 h-10 rounded-xl bg-[#25D366] flex items-center justify-center shrink-0">
              <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
              </svg>
            </div>
            <div className="flex-1">
              <p className="font-semibold text-ink text-sm">WhatsApp</p>
              <p className="text-ink-faint text-xs mt-0.5">Chat directly — fastest response</p>
            </div>
            <svg className="w-4 h-4 text-ink-faint" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3"/>
            </svg>
          </a>

          <a
            href="https://instagram.com/smartechkenya"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-4 p-4 rounded-xl border border-pink-200 bg-pink-50 hover:shadow-sm active:scale-[0.99] transition-all"
          >
            <div className="w-10 h-10 rounded-xl bg-[#E1306C] flex items-center justify-center shrink-0">
              <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/>
              </svg>
            </div>
            <div className="flex-1">
              <p className="font-semibold text-ink text-sm">Instagram</p>
              <p className="text-ink-faint text-xs mt-0.5">DM us your order</p>
            </div>
            <svg className="w-4 h-4 text-ink-faint" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3"/>
            </svg>
          </a>

          <a
            href="https://tiktok.com/@smartechkenya"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-4 p-4 rounded-xl border border-gray-200 bg-gray-50 hover:shadow-sm active:scale-[0.99] transition-all"
          >
            <div className="w-10 h-10 rounded-xl bg-[#010101] flex items-center justify-center shrink-0">
              <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
                <path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-2.88 2.5 2.89 2.89 0 01-2.89-2.89 2.89 2.89 0 012.89-2.89c.28 0 .54.04.79.1V9.01a6.33 6.33 0 00-.79-.05 6.34 6.34 0 00-6.34 6.34 6.34 6.34 0 006.34 6.34 6.34 6.34 0 006.33-6.34V8.69a8.24 8.24 0 004.84 1.56V6.78a4.85 4.85 0 01-1.07-.09z"/>
              </svg>
            </div>
            <div className="flex-1">
              <p className="font-semibold text-ink text-sm">TikTok</p>
              <p className="text-ink-faint text-xs mt-0.5">Find us and send a DM</p>
            </div>
            <svg className="w-4 h-4 text-ink-faint" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3"/>
            </svg>
          </a>
        </div>

        <div className="px-6 pb-6">
          <p className="text-center text-ink-faint text-xs leading-relaxed">
            We will confirm your order, arrange delivery and share payment details via your chosen channel.
          </p>
        </div>
      </div>
    </div>
  );
}

export default function CartPage() {
  const dispatch = useDispatch();
  const { items, total } = useSelector((s: RootState) => s.cart);
  const [showCheckout, setShowCheckout] = useState(false);
  const delivery   = total >= 5000 ? 0 : 350;
  const grandTotal = total + delivery;

  if (!items.length) return (
    <div className="min-h-screen bg-cream-warm pt-[68px] flex items-center justify-center px-6">
      <div className="text-center">
        <div className="w-20 h-20 bg-white rounded-2xl border border-cream-warm flex items-center justify-center mx-auto mb-6">
          <svg className="w-9 h-9 text-cream-muted" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"/>
          </svg>
        </div>
        <h2 className="font-display text-ink text-4xl font-light mb-2">Your cart is empty</h2>
        <p className="text-ink-faint text-sm mb-8">Add something great to get started.</p>
        <Link href="/products" className="btn-dark px-8 py-4">Shop Now</Link>
      </div>
    </div>
  );

  return (
    <>
      {showCheckout && (
        <CheckoutModal
          items={items}
          total={grandTotal}
          onClose={() => setShowCheckout(false)}
        />
      )}

      <div className="min-h-screen bg-cream-warm pt-[68px] pb-16">
        <div className="max-w-[1320px] mx-auto px-6 py-12">
          <div className="flex justify-between items-baseline mb-10">
            <h1 className="font-display text-ink" style={{ fontSize: 'clamp(2.5rem,5vw,4rem)', fontWeight: 400 }}>
              Your Cart
            </h1>
            <button onClick={() => dispatch(clearCart())} className="text-sm text-ink-faint hover:text-ink transition-colors">
              Clear all
            </button>
          </div>

          <div className="flex flex-col lg:flex-row gap-8">
            <div className="flex-1 space-y-3">
              {items.map(item => (
                <div key={item.productId} className="bg-white rounded-2xl border border-cream-warm p-5 flex gap-4">
                  <div className="w-24 h-24 bg-cream rounded-xl overflow-hidden relative shrink-0">
                    {item.image
                      ? <Image src={item.image} alt={item.name} fill sizes="96px" className="object-contain p-3"/>
                      : <div className="absolute inset-0 bg-cream-warm"/>
                    }
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-sm text-ink line-clamp-2 leading-snug mb-3">{item.name}</p>
                    <p className="price price-md">KES {item.price.toLocaleString()}</p>
                    <div className="flex items-center gap-1 mt-3 bg-cream rounded-xl w-fit px-2 py-1.5 border border-cream-warm">
                      <button
                        onClick={() => item.quantity > 1
                          ? dispatch(updateQuantity({ productId: item.productId, quantity: item.quantity - 1 }))
                          : dispatch(removeFromCart(item.productId))
                        }
                        className="w-7 h-7 flex items-center justify-center rounded-lg hover:bg-white transition-all text-ink-muted text-lg font-light"
                      >-</button>
                      <span className="w-7 text-center text-sm font-semibold text-ink">{item.quantity}</span>
                      <button
                        onClick={() => item.quantity < item.stock && dispatch(updateQuantity({ productId: item.productId, quantity: item.quantity + 1 }))}
                        disabled={item.quantity >= item.stock}
                        className="w-7 h-7 flex items-center justify-center rounded-lg hover:bg-white transition-all text-ink-muted text-lg font-light disabled:opacity-30"
                      >+</button>
                    </div>
                  </div>
                  <div className="flex flex-col justify-between items-end shrink-0">
                    <button onClick={() => dispatch(removeFromCart(item.productId))}
                      className="text-cream-muted hover:text-red-400 transition-colors p-1">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12"/>
                      </svg>
                    </button>
                    <span className="price price-md">KES {(item.price * item.quantity).toLocaleString()}</span>
                  </div>
                </div>
              ))}
            </div>

            <div className="w-full lg:w-80 shrink-0">
              <div className="bg-white rounded-2xl border border-cream-warm p-7 sticky top-[88px]">
                <h2 className="font-semibold text-ink mb-6">Order Summary</h2>
                <div className="space-y-3.5 text-sm mb-6 text-ink-faint">
                  <div className="flex justify-between">
                    <span>Subtotal</span>
                    <span className="price price-sm">KES {total.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Delivery</span>
                    {delivery === 0
                      ? <span className="text-forest-600 font-semibold">Free</span>
                      : <span className="price price-sm">KES {delivery.toLocaleString()}</span>
                    }
                  </div>
                  {delivery > 0 && (
                    <p className="text-xs text-cream-muted">
                      Add KES {(5000 - total).toLocaleString()} more for free delivery
                    </p>
                  )}
                </div>
                <div className="border-t border-cream-warm pt-5 mb-6 flex justify-between">
                  <span className="font-bold text-ink">Total</span>
                  <span className="price price-lg">KES {grandTotal.toLocaleString()}</span>
                </div>
                <button
                  onClick={() => setShowCheckout(true)}
                  className="w-full py-4 bg-ink text-cream text-sm font-semibold rounded-xl hover:bg-ink-soft transition-all active:scale-[0.98] flex items-center justify-center gap-2.5 mb-3">
                  Proceed to Order
                </button>
                <Link href="/products"
                  className="block text-center text-xs text-ink-faint hover:text-ink mt-4 transition-colors">
                  Continue Shopping
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
