/**
 * This route previously used Twilio for WhatsApp.
 * It has been replaced by the free Telegram bot at:
 * /api/webhook/telegram
 */
import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function GET() {
  return NextResponse.json({
    message: 'WhatsApp/Twilio integration removed. Using Telegram bot instead.',
    newEndpoint: '/api/webhook/telegram',
  });
}

export async function POST() {
  return NextResponse.json({
    message: 'WhatsApp/Twilio integration removed. Using Telegram bot instead.',
    newEndpoint: '/api/webhook/telegram',
  }, { status: 410 }); // 410 Gone
}
