import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Privacy Policy — Smartech Kenya',
  description: 'How Smartech Kenya collects, uses and protects your personal information.',
};

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-cream">
      <div className="bg-ink py-14 px-6">
        <div className="max-w-3xl mx-auto">
          <p className="text-[10px] font-bold tracking-[0.16em] uppercase mb-3 text-cream/30">Legal</p>
          <h1 className="font-display text-cream font-light" style={{ fontSize:'clamp(2.4rem,5vw,3.8rem)' }}>
            Privacy Policy
          </h1>
          <p className="text-cream/30 text-sm mt-3">Last updated: March 2026</p>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-6 py-14">
        <div className="bg-white rounded-2xl border border-cream-warm p-8 sm:p-10 prose prose-sm max-w-none">
          <div className="space-y-8 text-ink-muted text-sm leading-relaxed">

            <section>
              <h2 className="font-semibold text-ink text-base mb-3">1. Information We Collect</h2>
              <p>When you place an order or contact us, we may collect your name, phone number, email address, and delivery address. We use this information solely to process and fulfil your order.</p>
            </section>

            <section>
              <h2 className="font-semibold text-ink text-base mb-3">2. How We Use Your Information</h2>
              <p>Your information is used to confirm orders, arrange delivery, and respond to enquiries. We do not sell, rent or share your personal data with third parties for marketing purposes.</p>
            </section>

            <section>
              <h2 className="font-semibold text-ink text-base mb-3">3. WhatsApp & Social Channels</h2>
              <p>When you contact us via WhatsApp, Instagram or TikTok, your messages and profile information are governed by those platforms&apos; respective privacy policies. We store only the order details you provide to us.</p>
            </section>

            <section>
              <h2 className="font-semibold text-ink text-base mb-3">4. Data Security</h2>
              <p>We take reasonable steps to protect your information. Our website uses HTTPS encryption. Order details shared over WhatsApp are protected by WhatsApp&apos;s end-to-end encryption.</p>
            </section>

            <section>
              <h2 className="font-semibold text-ink text-base mb-3">5. Cookies</h2>
              <p>This website uses minimal cookies for essential functionality (session management). We do not use advertising or tracking cookies.</p>
            </section>

            <section>
              <h2 className="font-semibold text-ink text-base mb-3">6. Your Rights</h2>
              <p>You may request access to, correction of, or deletion of your personal data at any time by contacting us at <a href="mailto:smartechkenya01@gmail.com" className="text-ink underline underline-offset-2">smartechkenya01@gmail.com</a>.</p>
            </section>

            <section>
              <h2 className="font-semibold text-ink text-base mb-3">7. Contact</h2>
              <p>For any privacy-related questions, contact us at <a href="mailto:smartechkenya01@gmail.com" className="text-ink underline underline-offset-2">smartechkenya01@gmail.com</a> or via WhatsApp on +254 746 722 417.</p>
            </section>
          </div>
        </div>

        <div className="flex gap-4 mt-8">
          <Link href="/terms"   className="text-sm text-ink-faint hover:text-ink transition-colors">Terms of Use</Link>
          <span className="text-cream-muted">·</span>
          <Link href="/contact" className="text-sm text-ink-faint hover:text-ink transition-colors">Contact Us</Link>
        </div>
      </div>
    </div>
  );
}
