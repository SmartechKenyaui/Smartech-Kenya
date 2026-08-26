/**
 * GET    /api/admin/manage?secret=...          → list ALL products
 * PATCH  /api/admin/manage { secret, sku, ...fields } → update context
 * DELETE /api/admin/manage { secret, sku }     → delete from Cloudinary
 */
import { NextRequest, NextResponse } from 'next/server';
import { listAllProducts, updateProductContext, deleteProduct } from '@/lib/cloudinary';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  const secret = req.nextUrl.searchParams.get('secret');
  if (!secret || secret !== process.env.ADMIN_SECRET)
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  try {
    const products = await listAllProducts();
    return NextResponse.json({ success: true, products });
  } catch (err: any) {
    return NextResponse.json({ error: err?.message ?? 'Failed' }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const body = await req.json();
    const { secret, sku, ...fields } = body;
    if (!secret || secret !== process.env.ADMIN_SECRET)
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    if (!sku)
      return NextResponse.json({ error: 'sku required' }, { status: 400 });
    await updateProductContext(sku, fields);
    return NextResponse.json({ success: true });
  } catch (err: any) {
    console.error('Admin manage PATCH error:', err);
    return NextResponse.json({ error: err?.message ?? 'Failed' }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const { secret, sku } = await req.json();
    if (!secret || secret !== process.env.ADMIN_SECRET)
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    if (!sku)
      return NextResponse.json({ error: 'sku required' }, { status: 400 });
    await deleteProduct(sku);
    return NextResponse.json({ success: true });
  } catch (err: any) {
    console.error('Admin manage DELETE error:', err);
    return NextResponse.json({ error: err?.message ?? 'Failed' }, { status: 500 });
  }
}
