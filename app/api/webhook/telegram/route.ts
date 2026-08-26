/**
 * Telegram Bot Image Webhook — Smartech Kenya
 * Send a photo with SKU as caption → image uploaded to Cloudinary immediately.
 * No database. All product data lives in Cloudinary context metadata.
 */
import { NextRequest, NextResponse } from 'next/server';
import { updateProductImage, listAllProducts, getProductBySku } from '@/lib/cloudinary';

export const dynamic = 'force-dynamic';

const TG_API = (token: string) => `https://api.telegram.org/bot${token}`;

async function reply(token: string, chatId: number, text: string) {
  await fetch(`${TG_API(token)}/sendMessage`, {
    method: 'POST', headers: { 'Content-Type': 'application/json' },
    body:   JSON.stringify({ chat_id: chatId, text, parse_mode: 'HTML' }),
  });
}

async function getPhotoUrl(token: string, fileId: string): Promise<string> {
  const res  = await fetch(`${TG_API(token)}/getFile?file_id=${fileId}`);
  const data = await res.json();
  if (!data.ok) throw new Error('Could not get file path');
  return `https://api.telegram.org/file/bot${token}/${data.result.file_path}`;
}

async function downloadBase64(url: string): Promise<string> {
  const res  = await fetch(url);
  if (!res.ok) throw new Error(`Download failed: ${res.status}`);
  const buf  = Buffer.from(await res.arrayBuffer());
  const mime = buf[0] === 0xff ? 'image/jpeg' : buf[0] === 0x89 ? 'image/png' : 'image/jpeg';
  return `data:${mime};base64,${buf.toString('base64')}`;
}

export async function POST(req: NextRequest) {
  const token   = process.env.TELEGRAM_BOT_TOKEN;
  const ownerId = process.env.TELEGRAM_OWNER_ID;
  if (!token) return NextResponse.json({ error: 'TELEGRAM_BOT_TOKEN not set' }, { status: 500 });

  let update: any;
  try { update = await req.json(); } catch { return NextResponse.json({ ok: false }, { status: 400 }); }

  const msg    = update?.message;
  if (!msg) return NextResponse.json({ ok: true });

  const chatId  = msg.chat?.id as number;
  const fromId  = String(msg.from?.id ?? '');
  const caption = (msg.caption ?? msg.text ?? '').trim();

  if (ownerId && fromId !== ownerId) {
    await reply(token, chatId, '⛔ Unauthorized. This bot is for store admin only.');
    return NextResponse.json({ ok: true });
  }

  // Text commands
  if (!msg.photo && msg.text) {
    const cmd = msg.text.trim().toUpperCase();

    if (cmd === '/START' || cmd === 'HELP') {
      await reply(token, chatId,
        `<b>Smartech Kenya Image Bot</b>\n\nSend a product photo with the <b>SKU code</b> as caption.\n\nCommands:\n<code>LIST</code> — show all SKUs\n<code>SEARCH term</code> — find by name`
      );
      return NextResponse.json({ ok: true });
    }

    if (cmd === 'LIST') {
      const products = await listAllProducts();
      const noPhoto  = products.filter(p => !p.images[0] || p.images[0].includes('1x1'));
      const hasPhoto = products.filter(p => p.images[0] && !p.images[0].includes('1x1'));
      let txt = `<b>Need photos (${noPhoto.length}):</b>\n`;
      noPhoto.forEach(p => { txt += `\n<code>${p.sku}</code>  ${p.name.slice(0, 35)}`; });
      if (hasPhoto.length) {
        txt += `\n\n<b>Has photo (${hasPhoto.length}):</b>\n`;
        hasPhoto.forEach(p => { txt += `\n<code>${p.sku}</code>  ${p.name.slice(0, 35)}`; });
      }
      await reply(token, chatId, txt);
      return NextResponse.json({ ok: true });
    }

    if (cmd.startsWith('SEARCH ')) {
      const q        = caption.slice(7).trim().toLowerCase();
      const products = await listAllProducts();
      const found    = products.filter(p =>
        p.name.toLowerCase().includes(q) || p.sku.toLowerCase().includes(q)
      ).slice(0, 10);
      if (!found.length) {
        await reply(token, chatId, `No products found for "${q}"`);
      } else {
        const list = found.map(p => `<code>${p.sku}</code>  ${p.name.slice(0, 40)}`).join('\n');
        await reply(token, chatId, `<b>Found ${found.length}:</b>\n\n${list}`);
      }
      return NextResponse.json({ ok: true });
    }

    await reply(token, chatId, `Send <b>LIST</b> to see all SKUs, or send a photo with SKU as caption.`);
    return NextResponse.json({ ok: true });
  }

  // Photo message
  if (msg.photo) {
    if (!caption) {
      await reply(token, chatId, `Please add the <b>SKU code</b> as a caption.\n\nSend <b>LIST</b> to see all SKUs.`);
      return NextResponse.json({ ok: true });
    }

    const sku     = caption.trim().toUpperCase();
    const product = await getProductBySku(sku);

    if (!product) {
      await reply(token, chatId,
        `❌ No product with SKU <b>${sku}</b> found.\n\nSend <b>LIST</b> to see existing SKUs, or add it via the admin panel first.`
      );
      return NextResponse.json({ ok: true });
    }

    await reply(token, chatId, `⏳ Uploading photo for <b>${product.name.slice(0, 50)}</b>…`);

    try {
      const photos   = msg.photo as any[];
      const largest  = photos.reduce((a: any, b: any) => (b.file_size > a.file_size ? b : a));
      const photoUrl = await getPhotoUrl(token, largest.file_id);
      const b64      = await downloadBase64(photoUrl);
      await updateProductImage(b64, sku);

      await reply(token, chatId,
        `✅ <b>Done!</b> Image updated for:\n${product.name.slice(0, 60)}\n\n` +
        `SKU: <code>${sku}</code>\nLive on site immediately.`
      );
    } catch (err: any) {
      await reply(token, chatId, `❌ Upload failed: ${err?.message ?? 'Unknown error'}`);
    }

    return NextResponse.json({ ok: true });
  }

  return NextResponse.json({ ok: true });
}

export async function GET(req: NextRequest) {
  const setup  = req.nextUrl.searchParams.get('setup');
  const secret = req.nextUrl.searchParams.get('secret');
  if (!setup) return NextResponse.json({ status: 'Smartech Kenya Telegram Webhook — OK' });
  if (secret !== process.env.ADMIN_SECRET) return NextResponse.json({ error: 'Wrong secret' }, { status: 401 });

  const token = process.env.TELEGRAM_BOT_TOKEN;
  if (!token) return NextResponse.json({ error: 'TELEGRAM_BOT_TOKEN not set' }, { status: 500 });

  const hookUrl = `${process.env.NEXT_PUBLIC_APP_URL ?? req.nextUrl.origin}/api/webhook/telegram`;
  const res     = await fetch(`${TG_API(token)}/setWebhook`, {
    method: 'POST', headers: { 'Content-Type': 'application/json' },
    body:   JSON.stringify({ url: hookUrl, drop_pending_updates: true }),
  });
  const data = await res.json();
  return NextResponse.json({ telegram: data, webhook: hookUrl });
}
