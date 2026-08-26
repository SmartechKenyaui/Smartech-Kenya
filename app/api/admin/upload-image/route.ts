/**
 * POST /api/admin/upload-image  → { secret, sku, imageBase64 }
 * GET  /api/admin/upload-image  → list all products for admin (from Cloudinary)
 */
import { NextRequest, NextResponse } from 'next/server';
import { updateProductImage, listAllProducts } from '@/lib/cloudinary';

export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  try {
    const { secret, sku, imageBase64 } = await req.json();
    if (!secret || secret !== process.env.ADMIN_SECRET)
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    if (!sku || !imageBase64)
      return NextResponse.json({ error: 'sku and imageBase64 are required' }, { status: 400 });

    const imageUrl = await updateProductImage(imageBase64, sku.trim());
    return NextResponse.json({ success: true, imageUrl });
  } catch (err: any) {
    console.error('Admin upload error:', err);
    return NextResponse.json({ error: err?.message ?? 'Upload failed' }, { status: 500 });
  }
}

export async function GET(req: NextRequest) {
  const secret = req.nextUrl.searchParams.get('secret');
  if (!secret || secret !== process.env.ADMIN_SECRET)
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const products = await listAllProducts();
  return NextResponse.json({ products });
}
