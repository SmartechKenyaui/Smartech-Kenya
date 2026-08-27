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

      <div className="max-w-4xl mx-auto px-6 py-14">
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5 mb-12">

          {/* WhatsApp */}
          <a href="https://wa.me/254746722417?text=Hi%20Smartech%20Kenya%2C%20I%27d%20like%20to%20get%20in%20touch"
            target="_blank" rel="noopener noreferrer"
            className="group flex flex-col gap-4 p-6 bg-white rounded-3xl border border-cream-warm hover:shadow-xl hover:-translate-y-1 transition-all duration-200 ring-1 ring-black/5">
            <div className="w-12 h-12 rounded-2xl bg-[#25D366] flex items-center justify-center shadow-md">
              <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
              </svg>
            </div>
            <div>
              <div className="flex items-center gap-2 mb-1">
                <p className="font-bold text-ink text-base">WhatsApp</p>
                <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 bg-[#25D366]/15 text-[#166534] rounded-full">Fastest</span>
              </div>
              <p className="text-[#25D366] font-bold text-sm mb-1">+254 746 722 417</p>
              <p className="text-gray-500 text-xs leading-relaxed">Instant replies & fast ordering • Mon–Sat, 8am–7pm</p>
            </div>
          </a>

          {/* TikTok */}
          <a href="https://tiktok.com/@smartechkenya" target="_blank" rel="noopener noreferrer"
            className="group flex flex-col gap-4 p-6 bg-white rounded-3xl border border-cream-warm hover:shadow-xl hover:-translate-y-1 transition-all duration-200 ring-1 ring-black/5">
            <div className="w-12 h-12 rounded-2xl bg-black flex items-center justify-center shadow-md">
              <svg className="w-6 h-6 text-[#25F4EE]" fill="currentColor" viewBox="0 0 24 24">
                <path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-2.88 2.5 2.89 2.89 0 01-2.89-2.89 2.89 2.89 0 012.89-2.89c.28 0 .54.04.79.1V9.01a6.33 6.33 0 00-.79-.05 6.34 6.34 0 00-6.34 6.34 6.34 6.34 0 006.34 6.34 6.34 6.34 0 006.33-6.34V8.69a8.24 8.24 0 004.84 1.56V6.78a4.85 4.85 0 01-1.07-.09z"/>
              </svg>
            </div>
            <div>
              <div className="flex items-center gap-2 mb-1">
                <p className="font-bold text-ink text-base">TikTok</p>
                <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 bg-black/10 text-gray-800 rounded-full">Videos</span>
              </div>
              <p className="text-black font-bold text-sm mb-1">@smartechkenya</p>
              <p className="text-gray-500 text-xs leading-relaxed">Watch unboxings, live demos & appliance reviews</p>
            </div>
          </a>

          {/* Email */}
          <a href="mailto:smartechkenya01@gmail.com"
            className="group flex flex-col gap-4 p-6 bg-white rounded-3xl border border-cream-warm hover:shadow-xl hover:-translate-y-1 transition-all duration-200 ring-1 ring-black/5">
            <div className="w-12 h-12 rounded-2xl bg-[#F97316] flex items-center justify-center shadow-md">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/>
              </svg>
            </div>
            <div>
              <div className="flex items-center gap-2 mb-1">
                <p className="font-bold text-ink text-base">Email Support</p>
              </div>
              <p className="text-[#F97316] font-bold text-xs truncate mb-1">smartechkenya01@gmail.com</p>
              <p className="text-gray-500 text-xs leading-relaxed">Quotes, wholesale & customer support within 24h</p>
            </div>
          </a>

          {/* Instagram */}
          <a href="https://instagram.com/smartechkenya" target="_blank" rel="noopener noreferrer"
            className="group flex flex-col gap-4 p-6 bg-white rounded-3xl border border-cream-warm hover:shadow-xl hover:-translate-y-1 transition-all duration-200 ring-1 ring-black/5">
            <div className="w-12 h-12 rounded-2xl bg-[#E1306C] flex items-center justify-center shadow-md">
              <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/>
              </svg>
            </div>
            <div>
              <div className="flex items-center gap-2 mb-1">
                <p className="font-bold text-ink text-base">Instagram</p>
              </div>
              <p className="text-[#E1306C] font-bold text-sm mb-1">@smartechkenya</p>
              <p className="text-gray-500 text-xs leading-relaxed">Direct messages & daily product highlights</p>
            </div>
          </a>

          {/* Visit */}
          <div className="sm:col-span-2 flex flex-col gap-4 p-6 bg-white rounded-3xl border border-cream-warm ring-1 ring-black/5">
            <div className="w-12 h-12 rounded-2xl bg-gray-100 flex items-center justify-center">
              <svg className="w-6 h-6 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/>
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/>
              </svg>
            </div>
            <div>
              <p className="font-bold text-ink text-base mb-1">Visit Our Nairobi Showroom</p>
              <p className="text-gray-600 text-xs sm:text-sm leading-relaxed">
                Gaberone Plaza, 4th Floor, Shop A13<br/>
                Nairobi, Kenya<br/>
                Mon–Sat, 8:00 AM – 7:00 PM
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
