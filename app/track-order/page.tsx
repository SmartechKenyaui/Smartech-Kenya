import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Track Your Order — Smartech Kenya',
  description: 'Track your Smartech Kenya order via WhatsApp or email.',
};

const WA_TRACK = 'https://wa.me/254746722417?text=Hi%20Smartech%20Kenya%2C%20I%27d%20like%20to%20track%20my%20order.%20My%20order%20reference%20is%3A%20';

export default function TrackOrderPage() {
  return (
    <div className="min-h-screen bg-cream">
      <div className="bg-ink py-14 px-6">
        <div className="max-w-2xl mx-auto">
          <p className="text-[10px] font-bold tracking-[0.16em] uppercase mb-3 text-cream/30">Orders</p>
          <h1 className="font-display text-cream font-light" style={{ fontSize:'clamp(2.4rem,5vw,3.8rem)' }}>
            Track Your Order
          </h1>
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-6 py-14">
        <div className="bg-white rounded-2xl border border-cream-warm p-8 sm:p-10 mb-6">
          <p className="text-ink-muted text-sm leading-relaxed mb-8">
            To track your order, send us your <strong className="text-ink font-medium">order reference number</strong> via
            WhatsApp or email. You&apos;ll get a real-time update on your delivery status within minutes.
          </p>

          <div className="space-y-3">
            <a href={WA_TRACK}
              target="_blank" rel="noopener noreferrer"
              className="flex items-center gap-4 p-5 rounded-xl border border-cream-warm hover:shadow-sm hover:-translate-y-0.5 transition-all duration-200 group">
              <div className="w-10 h-10 rounded-xl bg-[#25D366] flex items-center justify-center shrink-0">
                <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/>
                  <path d="M12 0C5.373 0 0 5.373 0 12c0 2.126.557 4.126 1.526 5.855L.055 23.266l5.533-1.448A11.95 11.95 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 22c-1.928 0-3.736-.518-5.29-1.42l-.378-.224-3.93 1.028 1.046-3.818-.246-.393A9.965 9.965 0 012 12C2 6.477 6.477 2 12 2s10 4.477 10 10-4.477 10-10 10z"/>
                </svg>
              </div>
              <div className="flex-1">
                <p className="font-semibold text-ink text-sm">Track via WhatsApp</p>
                <p className="text-ink-faint text-xs mt-0.5">Fastest — get a reply in minutes</p>
              </div>
              <svg className="w-4 h-4 text-ink-faint group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3"/>
              </svg>
            </a>

            <a href="mailto:smartechkenya01@gmail.com?subject=Order%20Tracking%20Request&body=Hi%20Smartech%20Kenya%2C%0A%0AI%20would%20like%20to%20track%20my%20order.%20My%20reference%20number%20is%3A%20%0A%0AThank%20you."
              className="flex items-center gap-4 p-5 rounded-xl border border-cream-warm hover:shadow-sm hover:-translate-y-0.5 transition-all duration-200 group">
              <div className="w-10 h-10 rounded-xl bg-ink flex items-center justify-center shrink-0">
                <svg className="w-5 h-5 text-cream" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/>
                </svg>
              </div>
              <div className="flex-1">
                <p className="font-semibold text-ink text-sm">Track via Email</p>
                <p className="text-ink-faint text-xs mt-0.5">smartechkenya01@gmail.com — within 24hrs</p>
              </div>
              <svg className="w-4 h-4 text-ink-faint group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3"/>
              </svg>
            </a>
          </div>
        </div>

        {/* Info cards */}
        <div className="grid sm:grid-cols-3 gap-4">
          {[
            { title: 'Your Order Reference', desc: 'Sent to you via WhatsApp when your order was confirmed.' },
            { title: 'Nairobi Delivery', desc: 'Same-day or next-day. Track your rider in real time via WhatsApp.' },
            { title: 'Nationwide Delivery', desc: '1–3 business days. Tracking details shared once dispatched.' },
          ].map(c => (
            <div key={c.title} className="bg-white rounded-2xl border border-cream-warm p-5">
              <p className="font-semibold text-ink text-xs mb-1.5">{c.title}</p>
              <p className="text-ink-faint text-xs leading-relaxed">{c.desc}</p>
            </div>
          ))}
        </div>

        <div className="mt-8 text-center">
          <Link href="/products" className="text-sm text-ink-faint hover:text-ink transition-colors">
            Continue Shopping
          </Link>
        </div>
      </div>
    </div>
  );
}
