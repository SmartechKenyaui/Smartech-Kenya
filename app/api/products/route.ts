import { NextRequest, NextResponse } from 'next/server';
import { listProducts } from '@/lib/cloudinary';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category') ?? undefined;
    const brand    = searchParams.get('brand')    ?? undefined;
    const search   = searchParams.get('search')   ?? undefined;
    const page     = parseInt(searchParams.get('page')  || '1');
    const limit    = parseInt(searchParams.get('limit') || '12');
    const minPrice = searchParams.get('minPrice') ? parseFloat(searchParams.get('minPrice')!) : undefined;
    const maxPrice = searchParams.get('maxPrice') ? parseFloat(searchParams.get('maxPrice')!) : undefined;

    let products = await listProducts({ category, brand, search });

    if (minPrice != null) products = products.filter(p => p.price >= minPrice);
    if (maxPrice != null) products = products.filter(p => p.price <= maxPrice);

    const total = products.length;
    const paged = products.slice((page - 1) * limit, page * limit);

    return NextResponse.json({
      success: true,
      data: {
        products:   paged,
        pagination: { page, limit, total, pages: Math.ceil(total / limit) },
      },
    });
  } catch (error) {
    console.error('GET /api/products error:', error);
    return NextResponse.json({ success: false, error: 'Failed to fetch products' }, { status: 500 });
  }
}
