/**
 * NextAuth is no longer used — auth is handled by ADMIN_SECRET for the admin
 * panel, and customer login is not required for browsing products.
 * This stub prevents 404s on any existing links.
 */
import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';
export async function GET()  { return NextResponse.json({ message: 'Auth not configured' }, { status: 501 }); }
export async function POST() { return NextResponse.json({ message: 'Auth not configured' }, { status: 501 }); }
