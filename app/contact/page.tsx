import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Contact Us — Smartech Kenya',
  description: 'Get in touch with Smartech Kenya. Order via WhatsApp, email or visit us at Gaberone Plaza, Nairobi.',
};

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-cream">
      <div className="bg-ink py-14 px-6">
        <div className="max-w-3xl mx-auto">
          <p className="text-[10px] font-bold tracking-[0.16em] uppercase mb-3" style={{ color:'#C4872C' }}>Get in touch</p>
          <h1 className="font-display text-cream font-light" style={{ fontSize:'clamp(2.4rem,5vw,3.8rem)' }}>
            Contact Us
          </h1>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-6 py-14">
        <div className="grid sm:grid-cols-2 gap-5 mb-12">

          {/* WhatsApp */}
          <a href="https://wa.me/254746722417?text=Hi%20Smartech%20Kenya%2C%20I%27d%20like%20to%20get%20in%20touch"
            target="_blank" rel="noopener noreferrer"
            className="group flex flex-col gap-4 p-7 bg-white rounded-2xl border border-cream-warm hover:shadow-md hover:-translate-y-0.5 transition-all duration-200">
            <div className="w-11 h-11 rounded-xl bg-[#25D366] flex items-center justify-center">
              <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/>
                <path d="M12 0C5.373 0 0 5.373 0 12c0 2.126.557 4.126 1.526 5.855L.055 23.266l5.533-1.448A11.95 11.95 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 22c-1.928 0-3.736-.518-5.29-1.42l-.378-.224-3.93 1.028 1.046-3.818-.246-.393A9.965 9.965 0 012 12C2 6.477 6.477 2 12 2s10 4.477 10 10-4.477 10-10 10z"/>
              </svg>
            </div>
            <div>
              <p className="font-semibold text-ink text-sm mb-1">WhatsApp — Fastest</p>
              <p className="text-ink-faint text-xs leading-relaxed">+254 746 722 417<br/>Mon–Sat, 8am–7pm</p>
            </div>
          </a>

          {/* Email */}
          <a href="mailto:smartechkenya01@gmail.com"
            className="group flex flex-col gap-4 p-7 bg-white rounded-2xl border border-cream-warm hover:shadow-md hover:-translate-y-0.5 transition-all duration-200">
            <div className="w-11 h-11 rounded-xl bg-ink flex items-center justify-center">
              <svg className="w-5 h-5 text-cream" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/>
              </svg>
            </div>
            <div>
              <p className="font-semibold text-ink text-sm mb-1">Email</p>
              <p className="text-ink-faint text-xs leading-relaxed">smartechkenya01@gmail.com<br/>We reply within 24 hours</p>
            </div>
          </a>

          {/* Instagram */}
          <a href="https://instagram.com/smartechkenya" target="_blank" rel="noopener noreferrer"
            className="group flex flex-col gap-4 p-7 bg-white rounded-2xl border border-cream-warm hover:shadow-md hover:-translate-y-0.5 transition-all duration-200">
            <div className="w-11 h-11 rounded-xl bg-[#E1306C] flex items-center justify-center">
              <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/>
              </svg>
            </div>
            <div>
              <p className="font-semibold text-ink text-sm mb-1">Instagram</p>
              <p className="text-ink-faint text-xs leading-relaxed">@smartechkenya<br/>DM us to order</p>
            </div>
          </a>

          {/* Visit */}
          <div className="flex flex-col gap-4 p-7 bg-white rounded-2xl border border-cream-warm">
            <div className="w-11 h-11 rounded-xl bg-cream-warm flex items-center justify-center">
              <svg className="w-5 h-5 text-ink-muted" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/>
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/>
              </svg>
            </div>
            <div>
              <p className="font-semibold text-ink text-sm mb-1">Visit Us</p>
              <p className="text-ink-faint text-xs leading-relaxed">
                Gaberone Plaza, 4th Floor<br/>
                Nairobi, Kenya<br/>
                Mon–Sat, 8am–7pm
              </p>
            </div>
          </div>
        </div>

        <div className="text-center">
          <Link href="/products" className="btn-dark px-8 py-3.5">Browse Products</Link>
        </div>
      </div>
    </div>
  );
}
