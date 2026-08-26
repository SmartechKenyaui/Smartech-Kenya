/**
 * GET    /api/admin/hero?secret=...              → list hero images
 * POST   /api/admin/hero { secret, slot, imageBase64, alt } → upload
 * DELETE /api/admin/hero { secret, slot }        → delete
 */
import { NextRequest, NextResponse } from 'next/server';
import { listHeroImages, uploadHeroImage, deleteHeroImage } from '@/lib/cloudinary';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  const secret = req.nextUrl.searchParams.get('secret');
  if (!secret || secret !== process.env.ADMIN_SECRET)
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  try {
    const images = await listHeroImages();
    return NextResponse.json({ success: true, images });
  } catch (err: any) {
    return NextResponse.json({ error: err?.message ?? 'Failed' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const { secret, slot, imageBase64, alt, title } = await req.json();
    if (!secret || secret !== process.env.ADMIN_SECRET)
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    if (!slot || !imageBase64)
      return NextResponse.json({ error: 'slot and imageBase64 required' }, { status: 400 });

    const url = await uploadHeroImage(imageBase64, slot, alt ?? `Hero ${slot}`, title);
    return NextResponse.json({ success: true, url });
  } catch (err: any) {
    return NextResponse.json({ error: err?.message ?? 'Failed' }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const { secret, slot } = await req.json();
    if (!secret || secret !== process.env.ADMIN_SECRET)
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    if (!slot)
      return NextResponse.json({ error: 'slot required' }, { status: 400 });

    await deleteHeroImage(slot);
    return NextResponse.json({ success: true });
  } catch (err: any) {
    return NextResponse.json({ error: err?.message ?? 'Failed' }, { status: 500 });
  }
}
