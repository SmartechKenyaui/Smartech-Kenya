import { MetadataRoute } from 'next';
import { listProducts }  from '@/lib/cloudinary';

export const dynamic = 'force-dynamic';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl  = process.env.NEXT_PUBLIC_APP_URL ?? 'https://smartechkenya.com';
  const products = await listProducts().catch(() => []);

  // BUG FIX: Use p.sku to match ProductCard href — was using p.slug which
  // could diverge from what the product page actually resolves.
  const productUrls: MetadataRoute.Sitemap = products.map(p => ({
    url:             `${baseUrl}/products/${encodeURIComponent(p.sku)}`,
    lastModified:    new Date(p.createdAt),
    changeFrequency: 'weekly',
    priority:        0.8,
  }));

  return [
    { url: baseUrl,                    lastModified: new Date(), changeFrequency: 'daily',  priority: 1.0 },
    { url: `${baseUrl}/products`,      lastModified: new Date(), changeFrequency: 'daily',  priority: 0.9 },
    ...productUrls,
  ];
}
