/**
 * lib/cloudinary.ts
 * Single source of truth for all Cloudinary operations.
 * Products are stored as images with context metadata — no database needed.
 */

import { rankBySearch } from './search';

const CLOUD = process.env.CLOUDINARY_CLOUD_NAME!;
const KEY   = process.env.CLOUDINARY_API_KEY!;
const SEC   = process.env.CLOUDINARY_API_SECRET!;

/* ── Types ──────────────────────────────────────────────────────────────────── */
export interface CldProduct {
  id:            string;
  sku:           string;
  name:          string;
  brand:         string;
  category:      string;
  subcategory?:  string;
  price:         number;
  comparePrice?: number;
  stock:         number;
  description?:  string;
  images:        string[];
  isActive:      boolean;
  isFeatured:    boolean;
  slug:          string;
  createdAt:     string;
  avgRating:     number;
  reviewCount:   number;
}

/* ── Helpers ────────────────────────────────────────────────────────────────── */
function b64auth() {
  return 'Basic ' + Buffer.from(`${KEY}:${SEC}`).toString('base64');
}

async function sha1(str: string): Promise<string> {
  const raw = await crypto.subtle.digest('SHA-1', new TextEncoder().encode(str));
  return Array.from(new Uint8Array(raw)).map(b => b.toString(16).padStart(2, '0')).join('');
}

export function skuToPublicId(sku: string) {
  return `smartech-products/${sku.replace(/[^a-zA-Z0-9_-]/g, '_')}`;
}

function escVal(v: string | number | boolean) {
  return String(v).replace(/\\/g, '\\\\').replace(/\|/g, '\\|').replace(/=/g, '\\=').replace(/\n/g, ' ');
}

function buildContext(fields: Partial<CldProduct>): string {
  const pairs: string[] = [];
  const add = (k: string, v: string | number | boolean | undefined | null) => {
    if (v != null && v !== '') pairs.push(`${k}=${escVal(v)}`);
  };
  add('sku',          fields.sku);   // FIX: store sku so it survives a read-back
  add('name',         fields.name);
  add('brand',        fields.brand);
  add('category',     fields.category);
  add('subcategory',  fields.subcategory);
  add('price',        fields.price);
  add('comparePrice', fields.comparePrice);
  add('stock',        fields.stock);
  add('description',  fields.description);
  add('isActive',     fields.isActive);
  add('isFeatured',   fields.isFeatured);
  add('slug',         fields.slug);
  add('createdAt',    fields.createdAt);
  return pairs.join('|');
}

function parseResource(r: any): CldProduct {
  // Cloudinary Search API returns context flat: { brand, name, ... }
  // Cloudinary Admin API returns context nested: { custom: { brand, name, ... } }
  const c   = r.context?.custom ?? r.context ?? {};
  const pid = r.public_id as string;
  // Derive sku from public_id as fallback; prefer the stored context value
  const derivedSku = pid.replace('smartech-products/', '').replace(/_/g, '-');
  const sku = (c.sku ?? derivedSku) as string;
  return {
    id:           pid,
    sku:          c.sku       ?? sku,
    name:         c.name      ?? sku,
    brand:        c.brand     ?? '',
    category:     c.category  ?? 'OTHER',
    subcategory:  c.subcategory || undefined,
    price:        parseFloat(c.price ?? '0'),
    comparePrice: c.comparePrice ? parseFloat(c.comparePrice) : undefined,
    stock:        parseInt(c.stock  ?? '1'),
    description:  c.description || undefined,
    images:       [r.secure_url],
    isActive:     c.isActive !== 'false',
    isFeatured:   c.isFeatured === 'true',
    slug:         c.slug ?? sku.toLowerCase(),
    createdAt:    c.createdAt ?? r.created_at ?? new Date().toISOString(),
    avgRating:    0,
    reviewCount:  0,
  };
}

/* ── Public API ─────────────────────────────────────────────────────────────── */

/**
 * List active products.
 * BUG FIX: Previously passed opts.limit as max_results to Cloudinary, which
 * truncated results BEFORE client-side filters (featured, category) ran.
 * Fix: always fetch 500, apply all filters, then slice to limit.
 */
const DEMO_PRODUCTS: CldProduct[] = [
  {
    id: 'smartech-products/HIS-43-4K',
    sku: 'HIS-43-4K',
    name: 'Hisense 43" 4K UHD Smart TV',
    brand: 'Hisense',
    category: 'AUDIO_TV',
    price: 32999,
    comparePrice: 38999,
    stock: 8,
    description: '4K Ultra HD Smart TV with HDR, Dolby Audio, Bluetooth and built-in Netflix, YouTube & Prime Video.',
    images: ['https://images.unsplash.com/photo-1509281373149-e957c6296406?w=700&q=80'],
    isActive: true,
    isFeatured: true,
    slug: 'hisense-43-4k-uhd-smart-tv-his-43-4k',
    createdAt: new Date().toISOString(),
    avgRating: 4.8,
    reviewCount: 24,
  },
  {
    id: 'smartech-products/MIKA-REF-200L',
    sku: 'MIKA-REF-200L',
    name: 'Mika 200L Double Door Refrigerator',
    brand: 'Mika',
    category: 'KITCHEN',
    subcategory: 'fridges',
    price: 42500,
    comparePrice: 48000,
    stock: 5,
    description: 'Energy-saving double door top-mount freezer refrigerator with VC filter and toughened glass shelves.',
    images: ['https://images.unsplash.com/photo-1584568694244-14fbdf83bd30?w=700&q=80'],
    isActive: true,
    isFeatured: true,
    slug: 'mika-200l-double-door-refrigerator-mika-ref-200l',
    createdAt: new Date().toISOString(),
    avgRating: 4.9,
    reviewCount: 18,
  },
  {
    id: 'smartech-products/SAM-A54-128',
    sku: 'SAM-A54-128',
    name: 'Samsung Galaxy A54 5G 128GB',
    brand: 'Samsung',
    category: 'SMARTPHONES',
    price: 39500,
    comparePrice: 44000,
    stock: 12,
    description: '50MP OIS camera, 120Hz Super AMOLED display, 5000mAh battery with 25W fast charging.',
    images: ['https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=700&q=80'],
    isActive: true,
    isFeatured: true,
    slug: 'samsung-galaxy-a54-5g-128gb-sam-a54-128',
    createdAt: new Date().toISOString(),
    avgRating: 4.7,
    reviewCount: 31,
  },
  {
    id: 'smartech-products/RAM-BLD-15L',
    sku: 'RAM-BLD-15L',
    name: 'Ramtons 1.5L Stainless Steel Blender',
    brand: 'Ramtons',
    category: 'KITCHEN',
    subcategory: 'small-appliances',
    price: 4200,
    comparePrice: 5000,
    stock: 15,
    description: 'Heavy duty 500W motor with 4-speed settings, pulse function and detachable stainless steel blades.',
    images: ['https://images.unsplash.com/photo-1570222094114-d054a817e56b?w=700&q=80'],
    isActive: true,
    isFeatured: false,
    slug: 'ramtons-1-5l-stainless-steel-blender-ram-bld-15l',
    createdAt: new Date().toISOString(),
    avgRating: 4.6,
    reviewCount: 14,
  },
  {
    id: 'smartech-products/HP-250-G9-I5',
    sku: 'HP-250-G9-I5',
    name: 'HP 250 G9 Intel Core i5 8GB 512GB SSD',
    brand: 'HP',
    category: 'LAPTOPS',
    price: 64999,
    comparePrice: 72000,
    stock: 6,
    description: '15.6" FHD display, 12th Gen Intel Core i5-1235U, 8GB DDR4 RAM, 512GB NVMe SSD, Windows 11 Pro.',
    images: ['https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=700&q=80'],
    isActive: true,
    isFeatured: true,
    slug: 'hp-250-g9-intel-core-i5-8gb-512gb-ssd-hp-250-g9-i5',
    createdAt: new Date().toISOString(),
    avgRating: 4.8,
    reviewCount: 9,
  },
  {
    id: 'smartech-products/LG-WM-8KG',
    sku: 'LG-WM-8KG',
    name: 'LG 8KG Front Load AI DD Washing Machine',
    brand: 'LG',
    category: 'KITCHEN',
    subcategory: 'washing-machines',
    price: 68000,
    comparePrice: 75000,
    stock: 4,
    description: 'AI Direct Drive motor with Steam hygiene technology and TurboWash fast cleaning cycles.',
    images: ['https://images.unsplash.com/photo-1626806787461-102c1bfaaea1?w=700&q=80'],
    isActive: true,
    isFeatured: false,
    slug: 'lg-8kg-front-load-ai-dd-washing-machine-lg-wm-8kg',
    createdAt: new Date().toISOString(),
    avgRating: 4.9,
    reviewCount: 12,
  },
  {
    id: 'smartech-products/MIKA-CKR-5050',
    sku: 'MIKA-CKR-5050',
    name: 'Mika 4-Gas Cooker 50x50 with Oven',
    brand: 'Mika',
    category: 'KITCHEN',
    subcategory: 'cookers',
    price: 26500,
    comparePrice: 31000,
    stock: 7,
    description: '4 gas burners with auto ignition, gas oven with grill, double glass oven door and push button knobs.',
    images: ['https://images.unsplash.com/photo-1556911220-e15b29be8c8f?w=700&q=80'],
    isActive: true,
    isFeatured: true,
    slug: 'mika-4-gas-cooker-50x50-with-oven-mika-ckr-5050',
    createdAt: new Date().toISOString(),
    avgRating: 4.7,
    reviewCount: 22,
  },
  {
    id: 'smartech-products/VON-WD-01',
    sku: 'VON-WD-01',
    name: 'Von Hotpoint Table Top Hot & Normal Water Dispenser',
    brand: 'Von Hotpoint',
    category: 'KITCHEN',
    subcategory: 'water-dispensers',
    price: 6500,
    comparePrice: 7800,
    stock: 11,
    description: 'Compact table top design, high efficiency heating element, food grade stainless steel water tank.',
    images: ['https://images.unsplash.com/photo-1544816155-12df9643f363?w=700&q=80'],
    isActive: true,
    isFeatured: false,
    slug: 'von-hotpoint-table-top-hot-normal-water-dispenser-von-wd-01',
    createdAt: new Date().toISOString(),
    avgRating: 4.5,
    reviewCount: 8,
  }
];

export async function listProducts(opts?: {
  category?: string;
  brand?:    string;
  featured?: boolean;
  search?:   string;
  limit?:    number;
}): Promise<CldProduct[]> {
  try {
    let products: CldProduct[] = [];

    if (CLOUD && KEY && SEC && CLOUD !== 'demo' && KEY !== '1234567890') {
      const res = await fetch(
        `https://api.cloudinary.com/v1_1/${CLOUD}/resources/search`,
        {
          method:  'POST',
          headers: { Authorization: b64auth(), 'Content-Type': 'application/json' },
          body:    JSON.stringify({
            expression:  'public_id:smartech-products/*',
            with_field:  ['context'],
            max_results: 500,
            sort_by:     [{ created_at: 'desc' }],
          }),
          cache: 'no-store',
        }
      );
      if (res.ok) {
        const data = await res.json();
        products = (data.resources ?? [])
          .map(parseResource)
          .filter((p: CldProduct) => p.isActive && p.name && p.name !== p.sku);
      }
    }

    // Fallback to local catalog if Cloudinary is empty or unconfigured
    if (products.length === 0) {
      products = [...DEMO_PRODUCTS];
    }

    if (opts?.featured) products = products.filter(p => p.isFeatured);
    if (opts?.category) products = products.filter(p => p.category === opts.category);
    if (opts?.brand)    products = products.filter(p => p.brand.toLowerCase() === opts.brand!.toLowerCase());
    if (opts?.search) {
      products = rankBySearch(products, opts.search);
    }

    // Slice AFTER filtering
    if (opts?.limit) products = products.slice(0, opts.limit);
    return products;
  } catch (err) {
    console.error('listProducts error:', err);
    let fallback = [...DEMO_PRODUCTS];
    if (opts?.featured) fallback = fallback.filter(p => p.isFeatured);
    if (opts?.category) fallback = fallback.filter(p => p.category === opts.category);
    if (opts?.brand)    fallback = fallback.filter(p => p.brand.toLowerCase() === opts.brand!.toLowerCase());
    if (opts?.search)   fallback = rankBySearch(fallback, opts.search);
    if (opts?.limit)    fallback = fallback.slice(0, opts.limit);
    return fallback;
  }
}

/** Get a single product by SKU — fast direct lookup. */
export async function getProductBySku(sku: string): Promise<CldProduct | null> {
  try {
    if (CLOUD && KEY && SEC && CLOUD !== 'demo' && KEY !== '1234567890') {
      const pid = skuToPublicId(sku);
      const res = await fetch(
        `https://api.cloudinary.com/v1_1/${CLOUD}/resources/image/upload/${pid}?context=true`,
        { headers: { Authorization: b64auth() }, cache: 'no-store' }
      );
      if (res.ok) return parseResource(await res.json());
    }
    return DEMO_PRODUCTS.find(p => p.sku.toUpperCase() === sku.toUpperCase()) ?? null;
  } catch {
    return DEMO_PRODUCTS.find(p => p.sku.toUpperCase() === sku.toUpperCase()) ?? null;
  }
}

/** Get a product by slug. */
export async function getProductBySlug(slug: string): Promise<CldProduct | null> {
  const parts = slug.split('-');
  for (let i = parts.length - 1; i >= Math.max(0, parts.length - 4); i--) {
    const candidate = parts.slice(i).join('-').toUpperCase();
    const p = await getProductBySku(candidate);
    if (p) return p;
  }
  const all = await listProducts();
  return all.find(p => p.slug === slug) ?? null;
}

/** Create a new product — uploads image + sets context metadata. */
export async function createProduct(
  imageBase64: string,
  fields: Omit<CldProduct, 'id' | 'images' | 'avgRating' | 'reviewCount'>
): Promise<CldProduct> {
  const pid  = skuToPublicId(fields.sku);
  const ctx  = buildContext({ ...fields });
  const ts   = Math.floor(Date.now() / 1000);
  const file = imageBase64 || 'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7';

  const sig = await sha1(`context=${ctx}&overwrite=true&public_id=${pid}&timestamp=${ts}${SEC}`);
  const res = await fetch(`https://api.cloudinary.com/v1_1/${CLOUD}/image/upload`, {
    method: 'POST',
    body:   new URLSearchParams({ file, public_id: pid, overwrite: 'true', context: ctx, api_key: KEY, timestamp: String(ts), signature: sig }),
  });
  if (!res.ok) throw new Error(`Cloudinary upload failed: ${await res.text()}`);
  return parseResource(await res.json());
}

/**
 * Update just the image of a product while preserving all metadata.
 * BUG FIX: Cloudinary wipes context on overwrite if context param is omitted.
 * We fetch the existing product first and re-include its context.
 */
export async function updateProductImage(imageBase64: string, sku: string): Promise<string> {
  const pid      = skuToPublicId(sku);
  const ts       = Math.floor(Date.now() / 1000);
  const existing = await getProductBySku(sku);
  const ctx      = existing ? buildContext(existing) : '';

  const formObj: Record<string, string> = {
    file: imageBase64, public_id: pid, overwrite: 'true', api_key: KEY, timestamp: String(ts),
  };

  if (ctx) {
    formObj.context   = ctx;
    formObj.signature = await sha1(`context=${ctx}&overwrite=true&public_id=${pid}&timestamp=${ts}${SEC}`);
  } else {
    formObj.signature = await sha1(`overwrite=true&public_id=${pid}&timestamp=${ts}${SEC}`);
  }

  const res = await fetch(`https://api.cloudinary.com/v1_1/${CLOUD}/image/upload`, {
    method: 'POST',
    body:   new URLSearchParams(formObj),
  });
  if (!res.ok) throw new Error(`Image update failed: ${res.status}`);
  return (await res.json()).secure_url as string;
}

/**
 * Update context metadata without changing the image.
 * Cloudinary Admin API /context endpoint returns 404 on free plans.
 * Fix: re-post the existing image URL with overwrite=true and full merged context.
 */
export async function updateProductContext(sku: string, fields: Partial<CldProduct>): Promise<void> {
  const pid = skuToPublicId(sku);
  const existing = await getProductBySku(sku);
  if (!existing) throw new Error(`Product not found: ${sku}`);
  const merged = { ...existing, ...fields };
  const ctx    = buildContext(merged);
  const ts     = Math.floor(Date.now() / 1000);
  const imgUrl = existing.images[0];
  const sig    = await sha1(`context=${ctx}&overwrite=true&public_id=${pid}&timestamp=${ts}${SEC}`);
  const res = await fetch(`https://api.cloudinary.com/v1_1/${CLOUD}/image/upload`, {
    method: 'POST',
    body:   new URLSearchParams({ file: imgUrl, public_id: pid, overwrite: 'true', context: ctx, api_key: KEY, timestamp: String(ts), signature: sig }),
  });
  if (!res.ok) {
    const txt = await res.text().catch(() => String(res.status));
    throw new Error(`Context update failed: ${txt}`);
  }
}

/** List all products including inactive (admin use). */
export async function listAllProducts(): Promise<CldProduct[]> {
  try {
    const res = await fetch(
      `https://api.cloudinary.com/v1_1/${CLOUD}/resources/search`,
      {
        method:  'POST',
        headers: { Authorization: b64auth(), 'Content-Type': 'application/json' },
        body:    JSON.stringify({
          expression:  'public_id:smartech-products/*',
          with_field:  ['context'],
          max_results: 500,
          sort_by:     [{ created_at: 'desc' }],
        }),
        cache: 'no-store',
      }
    );
    if (!res.ok) return [];
    const data = await res.json();
    return (data.resources ?? [])
      .map(parseResource)
      .filter((p: CldProduct) => p.name && p.name !== p.sku);
  } catch { return []; }
}

/** Delete a product image + all its metadata from Cloudinary. */
export async function deleteProduct(sku: string): Promise<void> {
  const pid = skuToPublicId(sku);
  const ts  = Math.floor(Date.now() / 1000);
  const sig = await sha1(`invalidate=true&public_id=${pid}&timestamp=${ts}${SEC}`);
  const res = await fetch(`https://api.cloudinary.com/v1_1/${CLOUD}/image/destroy`, {
    method: 'POST',
    body:   new URLSearchParams({ public_id: pid, invalidate: 'true', api_key: KEY, timestamp: String(ts), signature: sig }),
  });
  if (!res.ok) {
    const txt = await res.text().catch(() => String(res.status));
    throw new Error(`Delete failed: ${txt}`);
  }
}


/* ── Hero Images ─────────────────────────────────────────────────────────── */
export interface HeroImage {
  src:   string;
  alt:   string;
  title: string;
}

/** List images in the smartech-hero/ folder */
export async function listHeroImages(): Promise<HeroImage[]> {
  try {
    const res = await fetch(
      `https://api.cloudinary.com/v1_1/${CLOUD}/resources/search`,
      {
        method:  'POST',
        headers: { Authorization: b64auth(), 'Content-Type': 'application/json' },
        body:    JSON.stringify({
          expression:  'public_id:smartech-hero/*',
          with_field:  ['context'],
          max_results: 20,
          sort_by:     [{ created_at: 'asc' }],
        }),
        cache: 'no-store',
      }
    );
    if (!res.ok) return [];
    const data = await res.json();
    return (data.resources ?? []).map((r: any) => {
      const c = r.context?.custom ?? r.context ?? {};
      return {
        src:   r.secure_url as string,
        alt:   (c.alt ?? c.caption ?? 'Smartech Kenya') as string,
        title: (c.title ?? '') as string,
      };
    });
  } catch { return []; }
}

/** Upload a hero image to the smartech-hero/ folder */
export async function uploadHeroImage(
  imageBase64: string,
  slot: number,          // 1-4 (slot number keeps order stable)
  alt: string,
  title?: string,
): Promise<string> {
  const pid = `smartech-hero/hero-${slot}`;
  const ctx = `alt=${escVal(alt)}|title=${escVal(title ?? '')}`;
  const ts  = Math.floor(Date.now() / 1000);
  const sig = await sha1(`context=${ctx}&overwrite=true&public_id=${pid}&timestamp=${ts}${SEC}`);
  const res = await fetch(`https://api.cloudinary.com/v1_1/${CLOUD}/image/upload`, {
    method: 'POST',
    body:   new URLSearchParams({
      file:      imageBase64,
      public_id: pid,
      overwrite: 'true',
      context:   ctx,
      api_key:   KEY,
      timestamp: String(ts),
      signature: sig,
    }),
  });
  if (!res.ok) throw new Error(`Hero upload failed: ${await res.text()}`);
  return (await res.json()).secure_url as string;
}

/** Delete a hero image slot */
export async function deleteHeroImage(slot: number): Promise<void> {
  const pid = `smartech-hero/hero-${slot}`;
  const ts  = Math.floor(Date.now() / 1000);
  const sig = await sha1(`invalidate=true&public_id=${pid}&timestamp=${ts}${SEC}`);
  const res = await fetch(`https://api.cloudinary.com/v1_1/${CLOUD}/image/destroy`, {
    method: 'POST',
    body:   new URLSearchParams({ public_id: pid, invalidate: 'true', api_key: KEY, timestamp: String(ts), signature: sig }),
  });
  if (!res.ok) throw new Error(`Hero delete failed: ${await res.text()}`);
}
