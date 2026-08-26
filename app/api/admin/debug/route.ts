/**
 * GET /api/admin/debug?secret=...
 * Returns raw Cloudinary search response — no filtering, no parsing.
 * Use this to diagnose why products aren't showing.
 */
import { NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

const CLOUD = process.env.CLOUDINARY_CLOUD_NAME!;
const KEY   = process.env.CLOUDINARY_API_KEY!;
const SEC   = process.env.CLOUDINARY_API_SECRET!;

function b64auth() {
  return 'Basic ' + Buffer.from(`${KEY}:${SEC}`).toString('base64');
}

export async function GET(req: NextRequest) {
  const secret = req.nextUrl.searchParams.get('secret');
  if (!secret || secret !== process.env.ADMIN_SECRET)
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const results: Record<string, any> = {};

  // Test 1: folder expression
  try {
    const r1 = await fetch(`https://api.cloudinary.com/v1_1/${CLOUD}/resources/search`, {
      method: 'POST',
      headers: { Authorization: b64auth(), 'Content-Type': 'application/json' },
      body: JSON.stringify({ expression: 'folder:smartech-products', with_field: ['context'], max_results: 10 }),
      cache: 'no-store',
    });
    results.folder_expression = { status: r1.status, body: await r1.json() };
  } catch(e: any) { results.folder_expression = { error: e.message }; }

  // Test 2: public_id wildcard expression
  try {
    const r2 = await fetch(`https://api.cloudinary.com/v1_1/${CLOUD}/resources/search`, {
      method: 'POST',
      headers: { Authorization: b64auth(), 'Content-Type': 'application/json' },
      body: JSON.stringify({ expression: 'public_id:smartech-products/*', with_field: ['context'], max_results: 10 }),
      cache: 'no-store',
    });
    results.public_id_expression = { status: r2.status, body: await r2.json() };
  } catch(e: any) { results.public_id_expression = { error: e.message }; }

  // Test 3: list ALL resources (no filter) — see if anything exists at all
  try {
    const r3 = await fetch(`https://api.cloudinary.com/v1_1/${CLOUD}/resources/image/upload?max_results=10&context=true`, {
      headers: { Authorization: b64auth() },
      cache: 'no-store',
    });
    results.all_resources_sample = { status: r3.status, body: await r3.json() };
  } catch(e: any) { results.all_resources_sample = { error: e.message }; }

  // Test 4: env vars present?
  results.env_check = {
    CLOUD_NAME_set: !!CLOUD,
    API_KEY_set:    !!KEY,
    API_SECRET_set: !!SEC,
    ADMIN_SECRET_set: !!process.env.ADMIN_SECRET,
  };

  return NextResponse.json(results, { status: 200 });
}
