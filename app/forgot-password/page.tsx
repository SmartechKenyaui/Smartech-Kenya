import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Reset Password — Smartech Kenya',
};

export default function ForgotPasswordPage() {
  return (
    <div className="min-h-screen bg-cream-warm flex items-center justify-center px-4 py-20">
      <div className="w-full max-w-[400px]">
        <Link href="/" className="flex justify-center mb-10">
          <img src="/logo.png" alt="Smartech Kenya" width={160} height={44}
            style={{ objectFit: 'contain' }} />
        </Link>

        <div className="bg-white rounded-3xl border border-cream-warm shadow-sm p-8 text-center">
          <div className="w-14 h-14 bg-cream-warm rounded-2xl flex items-center justify-center mx-auto mb-5">
            <svg className="w-7 h-7 text-ink-muted" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"/>
            </svg>
          </div>

          <h1 className="font-display text-ink text-2xl font-light mb-2">Reset Password</h1>
          <p className="text-ink-faint text-sm leading-relaxed mb-8">
            To reset your password, contact us directly and we&apos;ll sort it out right away.
          </p>

          <div className="space-y-3">
            <a href="https://wa.me/254746722417?text=Hi%20Smartech%20Kenya%2C%20I%20need%20to%20reset%20my%20account%20password.%20My%20email%20is%3A%20"
              target="_blank" rel="noopener noreferrer"
              className="flex items-center justify-center gap-2.5 w-full py-3.5 rounded-xl bg-ink text-cream text-sm font-semibold hover:bg-ink-soft transition-all">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/>
                <path d="M12 0C5.373 0 0 5.373 0 12c0 2.126.557 4.126 1.526 5.855L.055 23.266l5.533-1.448A11.95 11.95 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 22c-1.928 0-3.736-.518-5.29-1.42l-.378-.224-3.93 1.028 1.046-3.818-.246-.393A9.965 9.965 0 012 12C2 6.477 6.477 2 12 2s10 4.477 10 10-4.477 10-10 10z"/>
              </svg>
              Message us on WhatsApp
            </a>

            <a href="mailto:smartechkenya01@gmail.com?subject=Password%20Reset%20Request&body=Hi%20Smartech%20Kenya%2C%0A%0AI%20need%20to%20reset%20my%20password.%20My%20account%20email%20is%3A%20"
              className="flex items-center justify-center gap-2.5 w-full py-3.5 rounded-xl border border-cream-warm text-ink text-sm font-medium hover:bg-cream-warm transition-colors">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                  d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/>
              </svg>
              Send us an email
            </a>
          </div>

          <p className="text-cream-muted text-xs mt-6 leading-relaxed">
            Include the email address you registered with and we&apos;ll reset your account within 24 hours.
          </p>
        </div>

        <p className="text-center text-sm text-ink-faint mt-6">
          <Link href="/login" className="text-ink font-semibold hover:underline">Back to Sign in</Link>
        </p>
      </div>
    </div>
  );
}
