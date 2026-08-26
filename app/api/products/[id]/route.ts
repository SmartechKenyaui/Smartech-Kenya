import { NextRequest, NextResponse } from 'next/server';
import { getProductBySku } from '@/lib/cloudinary';

export const dynamic = 'force-dynamic';

export async function GET(
  _req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const product = await getProductBySku(params.id);
    if (!product)
      return NextResponse.json({ success: false, error: 'Product not found' }, { status: 404 });
    return NextResponse.json({ success: true, data: product });
  } catch (err) {
    console.error('GET /api/products/[id] error:', err);
    return NextResponse.json({ success: false, error: 'Failed to fetch product' }, { status: 500 });
  }
}
