import type { Metadata, Viewport } from 'next';
import './globals.css';
import { Providers } from '@/components/layout/Providers';
import { Header }    from '@/components/layout/Header';
import { Footer }    from '@/components/layout/Footer';
import { Toaster }   from 'react-hot-toast';

const SITE_URL = process.env.NEXT_PUBLIC_APP_URL ?? 'https://smartechkenya.co.ke';
let metadataBase: URL;
try { metadataBase = new URL(SITE_URL); } catch { metadataBase = new URL('https://smartechkenya.co.ke'); }

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
};

export const metadata: Metadata = {
  metadataBase,
  title: {
    default:  'Smartech Kenya — Premium Electronics & Home Appliances',
    template: '%s — Smartech Kenya',
  },
  description: "Kenya's destination for genuine electronics and home appliances. MIKA, Hisense, Samsung, HP & more. Fast Nairobi delivery. Order via WhatsApp.",
  keywords: ['kenya', 'electronics', 'home appliances', 'smartphones', 'laptops', 'fridges', 'washing machines', 'nairobi', 'mika', 'hisense', 'samsung'],
  authors: [{ name: 'Smartech Kenya' }],
  openGraph: {
    title:       'Smartech Kenya — Premium Electronics & Home Appliances',
    description: 'Genuine electronics and home appliances. Fast Nairobi delivery.',
    type:        'website',
    locale:      'en_KE',
    url:         SITE_URL,
    siteName:    'Smartech Kenya',
  },
  twitter: {
    card:        'summary_large_image',
    title:       'Smartech Kenya',
    description: 'Genuine electronics and home appliances. Fast Nairobi delivery.',
  },
  robots: { index: true, follow: true },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        {/* Fonts */}
        <link rel="preconnect" href="https://fonts.googleapis.com"/>
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous"/>
      </head>
      <body className="font-sans bg-white text-ink">
        <Providers>
          <div className="flex min-h-screen flex-col">
            <Header/>
            <main className="flex-1">{children}</main>
            <Footer/>
          </div>
          <Toaster
            position="bottom-right"
            toastOptions={{
              duration: 3000,
              style: {
                background:   '#0C0C0C',
                color:        '#FFFFFF',
                borderRadius: '14px',
                fontSize:     '13px',
                padding:      '12px 18px',
              },
            }}
          />
        </Providers>
      </body>
    </html>
  );
}
