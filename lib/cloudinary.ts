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
export async function listProducts(opts?: {
  category?: string;
  brand?:    string;
  featured?: boolean;
  search?:   string;
  limit?:    number;
}): Promise<CldProduct[]> {
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
    if (!res.ok) {
      console.error('Cloudinary Search API error:', res.status, await res.text().catch(() => ''));
      return [];
    }
    const data = await res.json();

    // Only show products with real metadata (name exists and differs from auto-derived sku)
    let products: CldProduct[] = (data.resources ?? [])
      .map(parseResource)
      .filter((p: CldProduct) => p.isActive && p.name && p.name !== p.sku);

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
    return [];
  }
}

/** Get a single product by SKU — fast direct lookup. */
export async function getProductBySku(sku: string): Promise<CldProduct | null> {
  try {
    const pid = skuToPublicId(sku);
    const res = await fetch(
      `https://api.cloudinary.com/v1_1/${CLOUD}/resources/image/upload/${pid}?context=true`,
      { headers: { Authorization: b64auth() }, cache: 'no-store' }
    );
    if (!res.ok) return null;
    return parseResource(await res.json());
  } catch {
    return null;
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
