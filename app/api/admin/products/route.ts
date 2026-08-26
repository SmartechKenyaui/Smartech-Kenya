/**
 * POST /api/admin/products
 * Create a new product — stores image + metadata in Cloudinary (no database).
 * Body: { secret, name, brand, sku, category, price, comparePrice?, stock?,
 *         description?, subcategory?, imageBase64?, isFeatured? }
 */
import { NextRequest, NextResponse } from 'next/server';
import { createProduct } from '@/lib/cloudinary';

export const dynamic = 'force-dynamic';

function slugify(str: string) {
  return str.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { secret, name, brand, sku, category, price, comparePrice, stock,
            description, subcategory, imageBase64, isFeatured } = body;

    if (!secret || secret !== process.env.ADMIN_SECRET)
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    if (!name || !brand || !category || price === undefined)
      return NextResponse.json({ error: 'name, brand, category and price are required' }, { status: 400 });

    if (typeof price !== 'number' || isNaN(price) || price <= 0)
      return NextResponse.json({ error: 'price must be a positive number' }, { status: 400 });

    const safeSku  = (sku || `${slugify(brand)}-${Date.now()}`).trim().toUpperCase();
    const slug     = `${slugify(name)}-${safeSku.toLowerCase()}`;
    const created  = new Date().toISOString();

    const product = await createProduct(imageBase64 || '', {
      sku:          safeSku,
      name:         name.trim(),
      brand:        brand.trim(),
      category,
      subcategory:  subcategory?.trim() || undefined,
      price:        parseFloat(String(price)),
      comparePrice: comparePrice ? parseFloat(String(comparePrice)) : undefined,
      stock:        stock ? parseInt(String(stock)) : 1,
      description:  description?.trim() || undefined,
      isActive:     true,
      isFeatured:   isFeatured === true,
      slug,
      createdAt:    created,
    });

    return NextResponse.json({ success: true, product }, { status: 201 });
  } catch (err: any) {
    console.error('Admin create product error:', err);
    return NextResponse.json({ error: err?.message ?? 'Failed to create product' }, { status: 500 });
  }
}
