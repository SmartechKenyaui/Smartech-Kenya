import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Terms of Use — Smartech Kenya',
  description: 'Terms and conditions for purchasing from Smartech Kenya.',
};

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-cream">
      <div className="bg-ink py-14 px-6">
        <div className="max-w-3xl mx-auto">
          <p className="text-[10px] font-bold tracking-[0.16em] uppercase mb-3 text-cream/30">Legal</p>
          <h1 className="font-display text-cream font-light" style={{ fontSize:'clamp(2.4rem,5vw,3.8rem)' }}>
            Terms of Use
          </h1>
          <p className="text-cream/30 text-sm mt-3">Last updated: March 2026</p>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-6 py-14">
        <div className="bg-white rounded-2xl border border-cream-warm p-8 sm:p-10">
          <div className="space-y-8 text-ink-muted text-sm leading-relaxed">

            <section>
              <h2 className="font-semibold text-ink text-base mb-3">1. Orders & Payment</h2>
              <p>All orders are confirmed via WhatsApp, Instagram, or our website. Payment is required before delivery. We accept M-Pesa and bank transfer. Prices are in Kenyan Shillings (KES) and are subject to change without notice.</p>
            </section>

            <section>
              <h2 className="font-semibold text-ink text-base mb-3">2. Delivery</h2>
              <p>We deliver within Nairobi (same-day or next-day) and nationwide (1–3 business days). Delivery fees are confirmed at the time of order. Delivery times are estimates and not guaranteed.</p>
            </section>

            <section>
              <h2 className="font-semibold text-ink text-base mb-3">3. Genuine Products</h2>
              <p>All products sold by Smartech Kenya are genuine and sourced from authorised distributors. We do not sell counterfeit goods.</p>
            </section>

            <section>
              <h2 className="font-semibold text-ink text-base mb-3">4. Returns & Exchanges</h2>
              <p>We accept returns or exchanges within 7 days of delivery for items that are defective, damaged in transit, or not as described. The item must be unused and in its original packaging. Contact us via WhatsApp to initiate a return.</p>
            </section>

            <section>
              <h2 className="font-semibold text-ink text-base mb-3">5. Warranty</h2>
              <p>Warranty terms are as provided by the respective manufacturer. We will assist you in processing warranty claims with authorised service centres.</p>
            </section>

            <section>
              <h2 className="font-semibold text-ink text-base mb-3">6. Limitation of Liability</h2>
              <p>Smartech Kenya&apos;s liability is limited to the purchase price of the product. We are not responsible for indirect or consequential losses arising from product use.</p>
            </section>

            <section>
              <h2 className="font-semibold text-ink text-base mb-3">7. Contact</h2>
              <p>For any questions regarding these terms, contact us at <a href="mailto:smartechkenya01@gmail.com" className="text-ink underline underline-offset-2">smartechkenya01@gmail.com</a> or via WhatsApp on +254 746 722 417.</p>
            </section>
          </div>
        </div>

        <div className="flex gap-4 mt-8">
          <Link href="/privacy" className="text-sm text-ink-faint hover:text-ink transition-colors">Privacy Policy</Link>
          <span className="text-cream-muted">·</span>
          <Link href="/contact" className="text-sm text-ink-faint hover:text-ink transition-colors">Contact Us</Link>
        </div>
      </div>
    </div>
  );
}
