'use client';

import { useState, useRef, useCallback } from 'react';

/* ── Types ── */
interface Product {
  sku:      string;
  name:     string;
  brand:    string;
  category: string;
  images:   string[];
}

interface UploadJob {
  file:   File;
  sku:    string;
  name:   string;
  status: 'pending' | 'uploading' | 'done' | 'error' | 'no-match';
  url?:   string;
  error?: string;
}

const CATEGORIES = [
  { value: 'SMARTPHONES',     label: 'Smartphones'     },
  { value: 'LAPTOPS',         label: 'Laptops'         },
  { value: 'HOME_APPLIANCES', label: 'Home Appliances' },
  { value: 'KITCHEN',         label: 'Kitchen'         },
  { value: 'BEDROOM',         label: 'Bedroom'         },
  { value: 'AUDIO_TV',        label: 'Audio & TV'      },
  { value: 'ELECTRICAL',      label: 'Electrical'      },
  { value: 'SMART_HOME',      label: 'Smart Home'      },
];

const BRANDS = [
  'Beko',
  'Bolesi',
  'Bruhm',
  'Haier',
  'Hisense',
  'HP',
  'Infinix',
  'itel',
  'JBL',
  'LG',
  'Mika',
  'Motorola',
  'Nokia',
  'Nunix',
  'Ramtons',
  'Rashnik',
  'Roch',
  'Samsung',
  'SmartPro',
  'Sony',
  'EcoMax',
  'TCL',
  'Tecno',
  'Vitron',
  'Von Hotpoint',
  'Other',
];

function isPlaceholder(img: string) {
  return !img || img.includes('unsplash.com');
}

function matchFile(filename: string, products: Product[]): Product | null {
  const base    = filename.toLowerCase().replace(/\.[^.]+$/, '').replace(/[^a-z0-9]/g, '-');
  const bySku   = products.find(p => p.sku.toLowerCase().replace(/[^a-z0-9]/g, '-') === base);
  if (bySku) return bySku;
  const partial = products.find(p => base.includes(p.sku.toLowerCase().replace(/[^a-z0-9]/g, '-').substring(0, 6)));
  if (partial) return partial;
  const byName  = products.find(p => {
    const slug = p.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').substring(0, 30);
    return base.includes(slug.substring(0, 15)) || slug.includes(base.substring(0, 15));
  });
  return byName ?? null;
}

async function fileToBase64(file: File): Promise<string> {
  return new Promise((res, rej) => {
    const r = new FileReader();
    r.onload  = e => res(e.target!.result as string);
    r.onerror = () => rej(new Error('read failed'));
    r.readAsDataURL(file);
  });
}

/* ══════════════════════════════════════════════════════════
   ROOT PAGE
══════════════════════════════════════════════════════════ */
export default function AdminPage() {
  const [secret,   setSecret]   = useState('');
  const [authed,   setAuthed]   = useState(false);
  const [products, setProducts] = useState<Product[]>([]);
  const [dbError,  setDbError]  = useState('');
  const [loading,  setLoading]  = useState(false);
  const [error,    setError]    = useState('');
  const [tab,      setTab]      = useState<'images'|'folder'|'direct'|'add'|'manage'|'hero'>('add');

  /* Login: auth via DB-free endpoint, then try to load products */
  const login = async () => {
    setLoading(true); setError('');
    try {
      /* Step 1 — verify secret (no MongoDB) */
      const authRes = await fetch(`/api/admin/cloudinary-upload?secret=${encodeURIComponent(secret)}`);
      if (!authRes.ok) { setError('Wrong password.'); setLoading(false); return; }

      /* Step 2 — try to load products (may fail if Atlas is blocked) */
      try {
        const pRes = await fetch(`/api/admin/upload-image?secret=${encodeURIComponent(secret)}`);
        const pData = await pRes.json();
        if (pData.products) setProducts(pData.products);
        if (pData.dbError)  setDbError(pData.dbError);
      } catch {
        setDbError('Could not reach database — image upload still works via Direct Upload.');
      }

      setAuthed(true);
    } catch { setError('Connection error.'); }
    setLoading(false);
  };

  /* ── Login screen ── */
  if (!authed) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4" style={{ background: '#0C0C0C' }}>
        <div className="w-full max-w-sm">
          <div className="text-center mb-10">
            <div className="w-14 h-14 rounded-2xl mx-auto mb-5 flex items-center justify-center"
              style={{ background: 'rgba(139,90,26,0.15)', border: '1px solid rgba(139,90,26,0.30)' }}>
              <svg className="w-7 h-7" style={{ color: '#C4872C' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8}
                  d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"/>
              </svg>
            </div>
            <h1 className="text-white text-2xl font-semibold tracking-tight">Admin Panel</h1>
            <p className="text-sm mt-1.5" style={{ color: 'rgba(255,255,255,0.35)' }}>Smartech Kenya</p>
          </div>
          <div className="space-y-3">
            <input type="password" value={secret} onChange={e => setSecret(e.target.value)}
              placeholder="Admin password"
              onKeyDown={e => e.key === 'Enter' && login()}
              className="w-full px-4 py-3.5 rounded-xl text-sm focus:outline-none"
              style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.12)', color: '#FFFFFF' }}/>
            {error && <p className="text-red-400 text-xs text-center">{error}</p>}
            <button onClick={login} disabled={loading || !secret.trim()}
              className="w-full py-3.5 rounded-xl text-sm font-bold transition-all disabled:opacity-40"
              style={{ background: '#8B5A1A', color: '#FFFFFF' }}>
              {loading ? 'Signing in…' : 'Sign in'}
            </button>
          </div>
          <div className="mt-8 p-4 rounded-xl text-xs leading-relaxed"
            style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', color: 'rgba(255,255,255,0.40)' }}>
            <p className="font-semibold mb-1.5" style={{ color: 'rgba(255,255,255,0.60)' }}>Quick upload</p>
            <p>Sign in → <strong style={{ color: 'rgba(255,255,255,0.55)' }}>Direct Upload</strong> → pick file → get Cloudinary URL instantly. Works even when database is offline.</p>
          </div>
        </div>
      </div>
    );
  }

  const noImage  = products.filter(p => isPlaceholder(p.images[0])).length;
  const hasImage = products.length - noImage;

  return (
    <div className="min-h-screen" style={{ background: '#FFFFFF' }}>
      {/* Header */}
      <div className="sticky top-0 z-30" style={{ background: '#0C0C0C', borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
        <div className="max-w-5xl mx-auto px-6 h-14 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-6 h-6 rounded flex items-center justify-center" style={{ background: 'rgba(139,90,26,0.25)' }}>
              <svg className="w-3.5 h-3.5" style={{ color: '#C4872C' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                  d="M14.7 6.3a1 1 0 000 1.4l1.6 1.6a1 1 0 001.4 0l3.77-3.77a6 6 0 01-7.94 7.94l-6.91 6.91a2.12 2.12 0 01-3-3l6.91-6.91a6 6 0 017.94-7.94l-3.76 3.76z"/>
              </svg>
            </div>
            <span className="text-white font-semibold text-sm">Admin Panel</span>
            {products.length > 0 && (
              <span className="hidden sm:block text-xs px-2.5 py-0.5 rounded-full font-medium"
                style={{ background: 'rgba(139,90,26,0.20)', color: '#D9A050' }}>
                {products.length} products · {hasImage} with images · {noImage} need images
              </span>
            )}
          </div>
          <button onClick={() => setAuthed(false)}
            className="text-xs px-3 py-1.5 rounded-lg"
            style={{ color: 'rgba(255,255,255,0.40)', border: '1px solid rgba(255,255,255,0.10)' }}>
            Sign out
          </button>
        </div>
      </div>

      {/* DB warning banner */}
      {dbError && (
        <div className="bg-amber-50 border-b border-amber-200 px-6 py-2.5">
          <p className="text-xs text-amber-800 text-center max-w-5xl mx-auto">
            ⚠ <strong>Database offline (Atlas IP whitelist).</strong> {dbError}
          </p>
        </div>
      )}

      {/* Tabs */}
      <div style={{ background: 'white', borderBottom: '1px solid #E8E8E8' }}>
        <div className="max-w-5xl mx-auto px-6 flex">
          {([
            { id: 'direct', icon: '⚡', label: 'Direct Upload'  },
            { id: 'images', icon: '🖼', label: 'Image Manager'  },
            { id: 'folder', icon: '📁', label: 'Folder Upload'  },
            { id: 'add',    icon: '＋', label: 'Add Product'    },
            { id: 'manage', icon: '✎',  label: 'Manage'         },
            { id: 'hero',   icon: '🖼',  label: 'Hero Images'    },
          ] as const).map(t => (
            <button key={t.id} onClick={() => setTab(t.id)}
              className="px-5 py-4 text-sm font-semibold border-b-2 transition-all flex items-center gap-2"
              style={{
                borderColor: tab === t.id ? '#8B5A1A' : 'transparent',
                color:       tab === t.id ? '#8B5A1A' : '#6B6B6B',
              }}>
              <span className="text-base leading-none">{t.icon}</span>
              {t.label}
            </button>
          ))}
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-6 py-8">
        {tab === 'direct' && <DirectUpload secret={secret} />}
        {tab === 'images' && <ImageManager products={products} secret={secret} onUpdate={p => setProducts(p)} />}
        {tab === 'folder' && <FolderUpload products={products} secret={secret} onDone={p => setProducts(p)} />}
        {tab === 'add'    && <AddProduct   secret={secret} />}
        {tab === 'manage' && <ManageProducts secret={secret} />}
        {tab === 'hero'   && <HeroImages   secret={secret} />}
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════════════════
   DIRECT UPLOAD — no MongoDB, just Cloudinary → URL
══════════════════════════════════════════════════════════ */
interface DirectResult { url: string; publicId: string; copied: boolean; }

function DirectUpload({ secret }: { secret: string }) {
  const [results,    setResults]    = useState<DirectResult[]>([]);
  const [uploading,  setUploading]  = useState(false);
  const [drag,       setDrag]       = useState(false);
  const [publicId,   setPublicId]   = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  const upload = async (files: File[]) => {
    const imgs = files.filter(f => f.type.startsWith('image/'));
    if (!imgs.length) return;
    setUploading(true);
    for (const file of imgs) {
      try {
        const b64 = await fileToBase64(file);
        const id  = publicId.trim() || file.name.replace(/\.[^.]+$/, '').replace(/[^a-zA-Z0-9_-]/g, '_');
        const res = await fetch('/api/admin/cloudinary-upload', {
          method:  'POST',
          headers: { 'Content-Type': 'application/json' },
          body:    JSON.stringify({ secret, imageBase64: b64, publicId: id }),
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error);
        setResults(prev => [{ url: data.url, publicId: data.publicId, copied: false }, ...prev]);
        setPublicId(''); // reset for next file
      } catch (err: any) {
        alert(`Upload failed: ${err.message}`);
      }
    }
    setUploading(false);
  };

  const copy = async (url: string, i: number) => {
    await navigator.clipboard.writeText(url);
    setResults(prev => prev.map((r, idx) => idx === i ? { ...r, copied: true } : r));
    setTimeout(() => setResults(prev => prev.map((r, idx) => idx === i ? { ...r, copied: false } : r)), 2000);
  };

  return (
    <div className="max-w-2xl space-y-6">
      <div>
        <h2 className="text-lg font-bold" style={{ color: '#0C0C0C' }}>Direct Cloudinary Upload</h2>
        <p className="text-sm mt-1" style={{ color: '#6B6B6B' }}>
          Upload an image to Cloudinary and get its URL. Use this URL in the Add Product tab. This does NOT create a product entry — use Add Product for that.
          Paste the URL into your product record manually if needed.
        </p>
      </div>

      <div>
        <label className="block text-sm font-semibold mb-1.5" style={{ color: '#0C0C0C' }}>
          Public ID <span className="font-normal text-xs" style={{ color: '#9AA0A6' }}>(optional — used as filename in Cloudinary)</span>
        </label>
        <input value={publicId} onChange={e => setPublicId(e.target.value)}
          placeholder="e.g. MIKA-WM-8KG  (auto-set from filename if blank)"
          className="w-full px-4 py-2.5 rounded-xl text-sm focus:outline-none"
          style={{ background: 'white', border: '1px solid #E8E8E8', color: '#0C0C0C' }}/>
      </div>

      {/* Drop zone */}
      <div
        onDragOver={e => { e.preventDefault(); setDrag(true); }}
        onDragLeave={() => setDrag(false)}
        onDrop={e => { e.preventDefault(); setDrag(false); upload(Array.from(e.dataTransfer.files)); }}
        onClick={() => inputRef.current?.click()}
        className="border-2 border-dashed rounded-2xl p-14 text-center cursor-pointer transition-all"
        style={{ borderColor: drag ? '#8B5A1A' : '#D4C9B8', background: drag ? 'rgba(139,90,26,0.04)' : 'white' }}>
        <input ref={inputRef} type="file" multiple accept="image/*" className="hidden"
          onChange={e => e.target.files && upload(Array.from(e.target.files))}/>
        {uploading
          ? <div className="flex flex-col items-center gap-3">
              <div className="w-10 h-10 border-2 border-t-transparent rounded-full animate-spin"
                style={{ borderColor: '#8B5A1A', borderTopColor: 'transparent' }}/>
              <p className="text-sm font-medium" style={{ color: '#8B5A1A' }}>Uploading to Cloudinary…</p>
            </div>
          : <>
              <div className="text-4xl mb-3">☁️</div>
              <p className="font-semibold" style={{ color: '#0C0C0C' }}>Click or drag images here</p>
              <p className="text-sm mt-1" style={{ color: '#9AA0A6' }}>Uploads directly to Cloudinary — no database needed</p>
            </>
        }
      </div>

      {/* Results */}
      {results.length > 0 && (
        <div className="space-y-3">
          <p className="text-sm font-semibold" style={{ color: '#0C0C0C' }}>{results.length} uploaded</p>
          {results.map((r, i) => (
            <div key={i} className="rounded-2xl overflow-hidden flex"
              style={{ background: 'white', border: '1px solid #E8E8E8' }}>
              <img src={r.url} alt="" className="w-20 h-20 object-cover shrink-0"/>
              <div className="flex-1 px-4 py-3 min-w-0">
                <p className="text-[10px] font-bold tracking-wider uppercase mb-1" style={{ color: '#9AA0A6' }}>
                  smartech-products/{r.publicId}
                </p>
                <p className="text-xs font-mono truncate mb-2" style={{ color: '#3A3A3A' }}>{r.url}</p>
                <button onClick={() => copy(r.url, i)}
                  className="text-xs px-3 py-1 rounded-lg font-bold transition-colors"
                  style={{
                    background: r.copied ? 'rgba(22,101,52,0.10)' : '#0C0C0C',
                    color:      r.copied ? '#166534' : '#FFFFFF',
                  }}>
                  {r.copied ? '✓ Copied!' : 'Copy URL'}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

/* ══════════════════════════════════════════════════════════
   IMAGE MANAGER
══════════════════════════════════════════════════════════ */
function ImageManager({ products, secret, onUpdate }: {
  products: Product[];
  secret:   string;
  onUpdate: (p: Product[]) => void;
}) {
  const [status, setStatus] = useState<Record<string, 'uploading'|'done'|'error'>>({});
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState<'all'|'missing'|'done'>('all');

  const filtered = products.filter(p => {
    const matchSearch = !search || p.name.toLowerCase().includes(search.toLowerCase()) || p.sku.toLowerCase().includes(search.toLowerCase());
    const matchFilter = filter === 'all' ? true : filter === 'missing' ? isPlaceholder(p.images[0]) : !isPlaceholder(p.images[0]);
    return matchSearch && matchFilter;
  });

  const upload = useCallback(async (sku: string, file: File) => {
    setStatus(s => ({ ...s, [sku]: 'uploading' }));
    try {
      const b64  = await fileToBase64(file);
      const resp = await fetch('/api/admin/upload-image', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body:   JSON.stringify({ secret, sku, imageBase64: b64 }),
      });
      const data = await resp.json();
      if (!resp.ok) throw new Error(data.error);
      onUpdate(products.map(p =>
        p.sku === sku ? { ...p, images: [data.imageUrl, ...p.images.filter(i => !i.includes('unsplash'))] } : p
      ));
      setStatus(s => ({ ...s, [sku]: 'done' }));
    } catch {
      setStatus(s => ({ ...s, [sku]: 'error' }));
    }
  }, [secret, products, onUpdate]);

  const onDrop = useCallback((sku: string, e: React.DragEvent) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file?.type.startsWith('image/')) upload(sku, file);
  }, [upload]);

  if (products.length === 0) {
    return (
      <div className="text-center py-20" style={{ color: '#9AA0A6' }}>
        <p className="text-4xl mb-4">📭</p>
        <p className="font-semibold text-sm">No products loaded</p>
        <p className="text-xs mt-2">Database may be offline. Use <strong>Direct Upload</strong> to upload images to Cloudinary and copy the URLs.</p>
      </div>
    );
  }

  const missing = products.filter(p => isPlaceholder(p.images[0])).length;

  return (
    <div className="space-y-5">
      {missing > 0 && (
        <div className="flex items-start gap-3 p-4 rounded-2xl"
          style={{ background: 'rgba(139,90,26,0.06)', border: '1px solid rgba(139,90,26,0.18)' }}>
          <div className="w-8 h-8 rounded-xl flex items-center justify-center shrink-0"
            style={{ background: 'rgba(139,90,26,0.12)' }}>
            <svg className="w-4 h-4" style={{ color: '#8B5A1A' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"/>
            </svg>
          </div>
          <div>
            <p className="text-sm font-semibold" style={{ color: '#3A3A3A' }}>
              {missing} product{missing !== 1 ? 's' : ''} need images
            </p>
            <p className="text-xs mt-0.5 leading-relaxed" style={{ color: '#6B6B6B' }}>
              Click any card or drag an image onto it — uploads to Cloudinary and saves automatically.
            </p>
          </div>
        </div>
      )}

      <div className="flex items-center gap-3">
        <div className="relative flex-1">
          <svg className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 pointer-events-none"
            style={{ color: '#9AA0A6' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
          </svg>
          <input type="text" value={search} onChange={e => setSearch(e.target.value)}
            placeholder="Search products…"
            className="w-full pl-10 pr-4 py-2.5 rounded-xl text-sm focus:outline-none"
            style={{ background: 'white', border: '1px solid #E8E8E8', color: '#0C0C0C' }}/>
        </div>
        <div className="flex rounded-xl overflow-hidden text-sm" style={{ border: '1px solid #E8E8E8', background: 'white' }}>
          {([['all','All'],['missing','Need image'],['done','Has image']] as const).map(([v,l]) => (
            <button key={v} onClick={() => setFilter(v)}
              className="px-3.5 py-2.5 font-medium transition-colors"
              style={{ background: filter === v ? '#0C0C0C' : 'transparent', color: filter === v ? '#FFFFFF' : '#6B6B6B' }}>
              {l}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {filtered.map(p => {
          const st     = status[p.sku];
          const hasImg = !isPlaceholder(p.images[0]);
          return (
            <div key={p.sku}
              onDragOver={e => e.preventDefault()}
              onDrop={e => onDrop(p.sku, e)}
              className="rounded-2xl overflow-hidden group transition-all duration-300 hover:shadow-[0_8px_32px_rgba(0,0,0,0.10)] hover:-translate-y-0.5"
              style={{ background: 'white', border: '1px solid #E8E8E8' }}>
              <label className="block relative aspect-square cursor-pointer overflow-hidden"
                style={{ background: hasImg ? '#FFFFFF' : '#FAFAFA' }}>
                <input type="file" accept="image/*" className="hidden sr-only"
                  onChange={e => e.target.files?.[0] && upload(p.sku, e.target.files[0])} />
                {hasImg ? (
                  <img src={p.images[0]} alt={p.name}
                    className="w-full h-full object-contain p-4 group-hover:scale-105 transition-transform duration-300"/>
                ) : (
                  <div className="absolute inset-0 flex flex-col items-center justify-center gap-2">
                    <div className="w-10 h-10 rounded-xl flex items-center justify-center"
                      style={{ background: 'rgba(139,90,26,0.08)', border: '1.5px dashed rgba(139,90,26,0.30)' }}>
                      <svg className="w-5 h-5" style={{ color: '#8B5A1A' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 4v16m8-8H4"/>
                      </svg>
                    </div>
                    <span className="text-[10px] font-semibold tracking-wide text-center px-3 leading-tight" style={{ color: '#8B5A1A' }}>
                      Click to upload<br/>or drag here
                    </span>
                  </div>
                )}
                {hasImg && (
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                    style={{ background: 'rgba(12,12,12,0.40)' }}>
                    <span className="text-white text-[11px] font-bold px-3 py-1.5 rounded-full"
                      style={{ background: 'rgba(12,12,12,0.55)' }}>Change image</span>
                  </div>
                )}
                {st === 'uploading' && (
                  <div className="absolute inset-0 flex items-center justify-center" style={{ background: 'rgba(255,255,255,0.85)' }}>
                    <div className="w-8 h-8 border-2 border-t-transparent rounded-full animate-spin"
                      style={{ borderColor: '#8B5A1A', borderTopColor: 'transparent' }}/>
                  </div>
                )}
                {st === 'done' && (
                  <div className="absolute top-2 right-2 w-6 h-6 rounded-full flex items-center justify-center" style={{ background: '#166534' }}>
                    <svg className="w-3.5 h-3.5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7"/>
                    </svg>
                  </div>
                )}
                {st === 'error' && (
                  <div className="absolute top-2 right-2 w-6 h-6 rounded-full flex items-center justify-center bg-red-600">
                    <svg className="w-3.5 h-3.5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12"/>
                    </svg>
                  </div>
                )}
              </label>
              <div className="p-3">
                <p className="text-[9px] font-bold tracking-widest uppercase mb-0.5" style={{ color: '#9AA0A6' }}>{p.brand}</p>
                <p className="text-[11.5px] font-medium leading-snug line-clamp-2" style={{ color: '#0C0C0C' }}>{p.name}</p>
                <p className="text-[10px] font-mono mt-1" style={{ color: '#9AA0A6' }}>{p.sku}</p>
              </div>
            </div>
          );
        })}
      </div>

      {filtered.length === 0 && (
        <div className="text-center py-16" style={{ color: '#9AA0A6' }}>
          <p className="text-3xl mb-3">🔍</p>
          <p className="font-medium text-sm">No products match</p>
        </div>
      )}
    </div>
  );
}

/* ══════════════════════════════════════════════════════════
   FOLDER UPLOAD
══════════════════════════════════════════════════════════ */
function FolderUpload({ products, secret, onDone: _onDone }: {
  products: Product[];
  secret:   string;
  onDone?:  (p: Product[]) => void;
}) {
  const [jobs,    setJobs]    = useState<UploadJob[]>([]);
  const [running, setRunning] = useState(false);
  const [drag,    setDrag]    = useState(false);
  const folderRef = useRef<HTMLInputElement>(null);
  const filesRef  = useRef<HTMLInputElement>(null);

  const buildJobs = useCallback((files: FileList | File[]) => {
    const arr = Array.from(files).filter(f => f.type.startsWith('image/'));
    setJobs(arr.map(file => {
      const match = matchFile(file.name, products);
      return { file, sku: match?.sku ?? '', name: match?.name ?? '(no match)', status: (match ? 'pending' : 'no-match') as UploadJob['status'] };
    }));
  }, [products]);

  const runUploads = async () => {
    setRunning(true);
    for (const job of jobs.filter(j => j.status === 'pending')) {
      setJobs(prev => prev.map(j => j.file === job.file ? { ...j, status: 'uploading' } : j));
      try {
        const b64 = await fileToBase64(job.file);
        const res = await fetch('/api/admin/upload-image', {
          method: 'POST', headers: { 'Content-Type': 'application/json' },
          body:   JSON.stringify({ secret, sku: job.sku, imageBase64: b64 }),
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || 'Upload failed');
        setJobs(prev => prev.map(j => j.file === job.file ? { ...j, status: 'done', url: data.imageUrl } : j));
      } catch (err: any) {
        setJobs(prev => prev.map(j => j.file === job.file ? { ...j, status: 'error', error: err.message } : j));
      }
    }
    setRunning(false);
  };

  const matched   = jobs.filter(j => j.status !== 'no-match').length;
  const unmatched = jobs.filter(j => j.status === 'no-match').length;
  const done      = jobs.filter(j => j.status === 'done').length;
  const errors    = jobs.filter(j => j.status === 'error').length;

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-bold" style={{ color: '#0C0C0C' }}>Bulk Folder Upload</h2>
        <p className="text-sm mt-1" style={{ color: '#6B6B6B' }}>
          Select a folder or multiple images. Files are matched by SKU in the filename —
          e.g. <code className="px-1.5 py-0.5 rounded text-xs font-mono" style={{ background: '#E8E8E8', color: '#3A3A3A' }}>MIKA-WM-8KG.jpg</code>
        </p>
      </div>

      <div
        onDragOver={e => { e.preventDefault(); setDrag(true); }}
        onDragLeave={() => setDrag(false)}
        onDrop={e => {
          e.preventDefault(); setDrag(false);
          const files: File[] = [];
          for (let i = 0; i < e.dataTransfer.items.length; i++) {
            const f = e.dataTransfer.items[i].getAsFile();
            if (f?.type.startsWith('image/')) files.push(f);
          }
          if (files.length) buildJobs(files);
        }}
        className="border-2 border-dashed rounded-2xl p-12 text-center transition-all"
        style={{ borderColor: drag ? '#8B5A1A' : '#D4C9B8', background: drag ? 'rgba(139,90,26,0.04)' : 'white' }}>
        <div className="text-4xl mb-3">📂</div>
        <p className="font-semibold" style={{ color: '#0C0C0C' }}>Drag & drop images here</p>
        <p className="text-sm mt-1" style={{ color: '#9AA0A6' }}>or choose:</p>
        <div className="flex justify-center gap-3 mt-5">
          <button onClick={() => folderRef.current?.click()}
            className="px-5 py-2.5 rounded-xl text-sm font-bold"
            style={{ background: '#0C0C0C', color: '#FFFFFF' }}>📁 Select Folder</button>
          <button onClick={() => filesRef.current?.click()}
            className="px-5 py-2.5 rounded-xl text-sm font-bold"
            style={{ background: 'white', border: '1px solid #E8E8E8', color: '#3A3A3A' }}>🖼 Select Files</button>
        </div>
        <input ref={folderRef} type="file" multiple accept="image/*"
          // @ts-ignore
          webkitdirectory="" directory=""
          onChange={e => e.target.files?.length && buildJobs(e.target.files)} className="hidden" />
        <input ref={filesRef} type="file" multiple accept="image/*"
          onChange={e => e.target.files && buildJobs(e.target.files)} className="hidden" />
      </div>

      {jobs.length > 0 && (
        <div className="rounded-2xl overflow-hidden" style={{ background: 'white', border: '1px solid #E8E8E8' }}>
          <div className="flex items-center justify-between px-5 py-4" style={{ borderBottom: '1px solid #E8E8E8' }}>
            <div className="flex items-center gap-3 text-xs font-medium">
              <span style={{ color: '#3A3A3A' }}>{jobs.length} files</span>
              {matched   > 0 && <span style={{ color: '#166534' }}>✓ {matched} matched</span>}
              {unmatched > 0 && <span style={{ color: '#8B5A1A' }}>⚠ {unmatched} unmatched</span>}
              {done      > 0 && <span style={{ color: '#1e40af' }}>↑ {done} uploaded</span>}
              {errors    > 0 && <span style={{ color: '#dc2626' }}>✗ {errors} failed</span>}
            </div>
            <div className="flex gap-2">
              <button onClick={() => setJobs([])}
                className="text-xs px-2 py-1 rounded" style={{ color: '#9AA0A6' }}>Clear</button>
              {matched > done && (
                <button onClick={runUploads} disabled={running}
                  className="px-4 py-1.5 rounded-lg text-sm font-bold disabled:opacity-50"
                  style={{ background: '#0C0C0C', color: '#FFFFFF' }}>
                  {running ? 'Uploading…' : `Upload ${matched - done} files`}
                </button>
              )}
            </div>
          </div>
          <div className="divide-y max-h-[440px] overflow-y-auto" style={{ borderColor: '#FFFFFF' }}>
            {jobs.map((job, i) => (
              <div key={i} className="flex items-center gap-3 px-5 py-3">
                <div className="w-10 h-10 rounded-xl overflow-hidden shrink-0" style={{ background: '#FFFFFF' }}>
                  <img src={URL.createObjectURL(job.file)} alt="" className="w-full h-full object-cover"/>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate" style={{ color: '#0C0C0C' }}>{job.file.name}</p>
                  <p className="text-xs truncate" style={{ color: '#9AA0A6' }}>
                    {job.status === 'no-match' ? '⚠ No matching product' : `→ ${job.name} (${job.sku})`}
                  </p>
                </div>
                <div className="shrink-0">
                  {job.status === 'pending'   && <span className="text-[11px] px-2.5 py-1 rounded-full font-medium" style={{ background: '#FFFFFF', color: '#6B6B6B' }}>Pending</span>}
                  {job.status === 'uploading' && <span className="text-[11px] px-2.5 py-1 rounded-full font-medium animate-pulse" style={{ background: 'rgba(139,90,26,0.10)', color: '#8B5A1A' }}>Uploading…</span>}
                  {job.status === 'done'      && <span className="text-[11px] px-2.5 py-1 rounded-full font-medium" style={{ background: 'rgba(22,101,52,0.10)', color: '#166534' }}>✓ Done</span>}
                  {job.status === 'error'     && <span className="text-[11px] px-2.5 py-1 rounded-full font-medium" style={{ background: 'rgba(220,38,38,0.08)', color: '#dc2626' }} title={job.error}>✗ Failed</span>}
                  {job.status === 'no-match'  && <span className="text-[11px] px-2.5 py-1 rounded-full font-medium" style={{ background: 'rgba(139,90,26,0.08)', color: '#8B5A1A' }}>No match</span>}
                </div>
                {job.status === 'no-match' && (
                  <select
                    onChange={e => setJobs(prev => prev.map((j, idx) => idx === i
                      ? { ...j, sku: e.target.value, name: products.find(p => p.sku === e.target.value)?.name ?? '', status: e.target.value ? 'pending' : 'no-match' }
                      : j))}
                    className="text-xs rounded-lg px-2 py-1.5 shrink-0 max-w-[160px] focus:outline-none"
                    style={{ border: '1px solid #E8E8E8', color: '#3A3A3A', background: 'white' }}>
                    <option value="">Assign to product…</option>
                    {products.map(p => <option key={p.sku} value={p.sku}>{p.name.substring(0, 30)}</option>)}
                  </select>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

/* ══════════════════════════════════════════════════════════
   ADD PRODUCT
══════════════════════════════════════════════════════════ */
function AddProduct({ secret }: { secret: string }) {
  const [form, setForm] = useState({
    name: '', brand: 'Mika', sku: '', category: 'KITCHEN',
    price: '', comparePrice: '', stock: '10', subcategory: '', description: '',
    isFeatured: false,
  });
  const [imageFile, setImageFile]  = useState<File | null>(null);
  const [imagePreview, setPreview] = useState('');
  const [saving,  setSaving]       = useState(false);
  const [success, setSuccess]      = useState('');
  const [error,   setError]        = useState('');

  const set = (k: string, v: string) => setForm(f => ({ ...f, [k]: v }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true); setError(''); setSuccess('');
    try {
      let imageBase64 = '';
      if (imageFile) imageBase64 = await fileToBase64(imageFile);
      const res = await fetch('/api/admin/products', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          secret, ...form,
          price:        parseFloat(form.price),
          comparePrice: form.comparePrice ? parseFloat(form.comparePrice) : undefined,
          stock:        parseInt(form.stock) || 10,
          sku:          form.sku || undefined,
          subcategory:  form.subcategory || undefined,
          description:  form.description || undefined,
          imageBase64:  imageBase64 || undefined,
          isFeatured:   form.isFeatured,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed');
      setSuccess(`✓ "${data.product?.name ?? form.name}" added successfully`);
      setForm({ name:'', brand:'Mika', sku:'', category:'KITCHEN', price:'', comparePrice:'', stock:'10', subcategory:'', description:'', isFeatured: false });
      setImageFile(null); setPreview('');
    } catch (err: any) { setError(err.message); }
    setSaving(false);
  };

  const inp      = "w-full px-4 py-2.5 rounded-xl text-sm focus:outline-none";
  const inpStyle = { background: 'white', border: '1px solid #E8E8E8', color: '#0C0C0C' };

  return (
    <form onSubmit={handleSubmit} className="max-w-2xl space-y-6">
      <h2 className="text-lg font-bold" style={{ color: '#0C0C0C' }}>Add New Product</h2>
      {success && <div className="px-4 py-3 rounded-xl text-sm font-medium" style={{ background: 'rgba(22,101,52,0.08)', border: '1px solid rgba(22,101,52,0.20)', color: '#166534' }}>{success}</div>}
      {error   && <div className="px-4 py-3 rounded-xl text-sm" style={{ background: 'rgba(220,38,38,0.06)', border: '1px solid rgba(220,38,38,0.15)', color: '#dc2626' }}>{error}</div>}

      <div>
        <label className="block text-sm font-semibold mb-2" style={{ color: '#0C0C0C' }}>Product Image</label>
        <label
          onDragOver={e => e.preventDefault()}
          onDrop={e => { e.preventDefault(); const f = e.dataTransfer.files[0]; if (f?.type.startsWith('image/')) { setImageFile(f); setPreview(URL.createObjectURL(f)); } }}
          className="block border-2 border-dashed rounded-2xl p-6 text-center cursor-pointer"
          style={{ borderColor: '#D4C9B8', background: '#FAFAFA' }}>
          <input type="file" accept="image/*" onChange={e => { const f = e.target.files?.[0]; if (!f) return; setImageFile(f); setPreview(URL.createObjectURL(f)); }} className="hidden" />
          {imagePreview
            ? <img src={imagePreview} alt="Preview" className="w-32 h-32 object-contain mx-auto rounded-xl"/>
            : <div style={{ color: '#9AA0A6' }}><div className="text-3xl mb-2">🖼</div><p className="text-sm">Click or drag image here</p></div>}
        </label>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="col-span-2">
          <label className="block text-sm font-semibold mb-1.5" style={{ color: '#0C0C0C' }}>Product Name *</label>
          <input required value={form.name} onChange={e => set('name', e.target.value)} placeholder="MIKA 8kg Front Load Inverter Washing Machine" className={inp} style={inpStyle}/>
        </div>
        <div>
          <label className="block text-sm font-semibold mb-1.5" style={{ color: '#0C0C0C' }}>Brand *</label>
          <select required value={form.brand} onChange={e => set('brand', e.target.value)} className={inp} style={inpStyle}>
            {BRANDS.map(b => <option key={b}>{b}</option>)}
          </select>
        </div>
        <div>
          <label className="block text-sm font-semibold mb-1.5" style={{ color: '#0C0C0C' }}>SKU</label>
          <input value={form.sku} onChange={e => set('sku', e.target.value)} placeholder="Auto-generated if blank" className={inp} style={inpStyle}/>
        </div>
        <div>
          <label className="block text-sm font-semibold mb-1.5" style={{ color: '#0C0C0C' }}>Category *</label>
          <select required value={form.category} onChange={e => set('category', e.target.value)} className={inp} style={inpStyle}>
            {CATEGORIES.map(c => <option key={c.value} value={c.value}>{c.label}</option>)}
          </select>
        </div>
        <div>
          <label className="block text-sm font-semibold mb-1.5" style={{ color: '#0C0C0C' }}>Subcategory</label>
          <input value={form.subcategory} onChange={e => set('subcategory', e.target.value)} placeholder="washing-machines" className={inp} style={inpStyle}/>
        </div>
        <div>
          <label className="block text-sm font-semibold mb-1.5" style={{ color: '#0C0C0C' }}>Price (KES) *</label>
          <input required type="number" value={form.price} onChange={e => set('price', e.target.value)} placeholder="45000" className={inp} style={inpStyle}/>
        </div>
        <div>
          <label className="block text-sm font-semibold mb-1.5" style={{ color: '#0C0C0C' }}>Compare Price (KES)</label>
          <input type="number" value={form.comparePrice} onChange={e => set('comparePrice', e.target.value)} placeholder="55000 (crossed-out)" className={inp} style={inpStyle}/>
        </div>
        <div>
          <label className="block text-sm font-semibold mb-1.5" style={{ color: '#0C0C0C' }}>Stock</label>
          <input type="number" value={form.stock} onChange={e => set('stock', e.target.value)} className={inp} style={inpStyle}/>
        </div>
        <div className="col-span-2">
          <label className="block text-sm font-semibold mb-1.5" style={{ color: '#0C0C0C' }}>Description</label>
          <textarea value={form.description} onChange={e => set('description', e.target.value)} rows={3} placeholder="Optional…" className={`${inp} resize-none`} style={inpStyle}/>
        </div>
        <div className="col-span-2">
          <label className="flex items-center gap-3 cursor-pointer select-none">
            <div
              onClick={() => setForm(f => ({ ...f, isFeatured: !f.isFeatured }))}
              className="relative w-11 h-6 rounded-full transition-colors duration-200 flex-shrink-0"
              style={{ background: form.isFeatured ? '#8B5A1A' : '#D4C9B8' }}>
              <div className="absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white shadow transition-transform duration-200"
                style={{ transform: form.isFeatured ? 'translateX(20px)' : 'translateX(0)' }}/>
            </div>
            <div>
              <p className="text-sm font-semibold" style={{ color: '#0C0C0C' }}>Featured Product</p>
              <p className="text-xs" style={{ color: '#6B6B6B' }}>Show on homepage Featured Products section</p>
            </div>
          </label>
        </div>
      </div>
      <button type="submit" disabled={saving}
        className="w-full py-3.5 rounded-xl font-bold text-sm hover:opacity-90 active:scale-[0.99] transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
        style={{ background: '#0C0C0C', color: '#FFFFFF' }}>
        {saving ? 'Saving…' : 'Add Product'}
      </button>
    </form>
  );
}

/* ══════════════════════════════════════════════════════════
   MANAGE PRODUCTS — polished product management panel
══════════════════════════════════════════════════════════ */
interface ManagedProduct {
  id: string; sku: string; name: string; brand: string; category: string;
  price: number; comparePrice?: number; stock: number; subcategory?: string; description?: string;
  images: string[]; isFeatured: boolean; isActive: boolean; slug: string;
}

function Toggle({ on, onChange, disabled, color = '#8B5A1A' }: {
  on: boolean; onChange: () => void; disabled?: boolean; color?: string;
}) {
  return (
    <div
      onClick={() => !disabled && onChange()}
      className="relative w-11 h-6 rounded-full transition-all duration-200 flex-shrink-0"
      style={{
        background: on ? color : '#D4C9B8',
        cursor: disabled ? 'wait' : 'pointer',
        boxShadow: on ? `0 0 0 3px ${color}22` : 'none',
      }}>
      <div
        className="absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white transition-transform duration-200"
        style={{
          transform: on ? 'translateX(20px)' : 'translateX(0)',
          boxShadow: '0 1px 3px rgba(0,0,0,0.20)',
        }}
      />
    </div>
  );
}

const CATEGORY_LABELS: Record<string, string> = {
  SMARTPHONES: 'Phones', LAPTOPS: 'Laptops', HOME_APPLIANCES: 'Appliances',
  KITCHEN: 'Kitchen', BEDROOM: 'Bedroom', AUDIO_TV: 'Audio/TV',
  ELECTRICAL: 'Electrical', SMART_HOME: 'Smart Home', OTHER: 'Other',
};

/* ── Edit Modal ── */
function EditModal({ product, secret, onSave, onClose }: {
  product: ManagedProduct;
  secret: string;
  onSave: (updated: Partial<ManagedProduct>) => void;
  onClose: () => void;
}) {
  const CATS = [
    { value: 'SMARTPHONES',     label: 'Smartphones'     },
    { value: 'LAPTOPS',         label: 'Laptops'         },
    { value: 'HOME_APPLIANCES', label: 'Home Appliances' },
    { value: 'KITCHEN',         label: 'Kitchen'         },
    { value: 'BEDROOM',         label: 'Bedroom'         },
    { value: 'AUDIO_TV',        label: 'Audio & TV'      },
    { value: 'ELECTRICAL',      label: 'Electrical'      },
    { value: 'SMART_HOME',      label: 'Smart Home'      },
    { value: 'OTHER',           label: 'Other'           },
  ];

  const [form, setForm] = useState({
    name:         product.name,
    brand:        product.brand,
    price:        String(product.price),
    comparePrice: product.comparePrice ? String(product.comparePrice) : '',
    stock:        String(product.stock),
    subcategory:  product.subcategory ?? '',
    description:  product.description ?? '',
    category:     product.category,
    isFeatured:   product.isFeatured,
    isActive:     product.isActive,
  });
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setPreview] = useState(product.images[0] ?? '');
  const [saving, setSaving]  = useState(false);
  const [error,  setError]   = useState('');

  const set = (k: string, v: string | boolean) => setForm(f => ({ ...f, [k]: v }));

  const handleSave = async () => {
    setSaving(true); setError('');
    try {
      let imageBase64: string | undefined;
      if (imageFile) {
        imageBase64 = await new Promise<string>((res, rej) => {
          const r = new FileReader();
          r.onload = e => res(e.target!.result as string);
          r.onerror = () => rej(new Error('read failed'));
          r.readAsDataURL(imageFile);
        });
      }

      const payload: any = {
        secret,
        sku: product.sku,
        name:         form.name.trim(),
        brand:        form.brand.trim(),
        category:     form.category,
        subcategory:  form.subcategory.trim() || undefined,
        description:  form.description.trim() || undefined,
        price:        parseFloat(form.price),
        comparePrice: form.comparePrice ? parseFloat(form.comparePrice) : undefined,
        stock:        parseInt(form.stock) || 1,
        isFeatured:   form.isFeatured,
        isActive:     form.isActive,
      };
      if (imageBase64) payload.imageBase64 = imageBase64;

      // If updating image, we need to re-create (overwrite) via the products endpoint
      if (imageBase64) {
        // Delete old, create new with same SKU
        await fetch('/api/admin/manage', {
          method: 'DELETE',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ secret, sku: product.sku }),
        });
        const res = await fetch('/api/admin/products', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ ...payload, sku: product.sku }),
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || 'Failed');
      } else {
        const res = await fetch('/api/admin/manage', {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || 'Failed');
      }

      onSave({
        name:         form.name.trim(),
        brand:        form.brand.trim(),
        category:     form.category,
        subcategory:  form.subcategory.trim() || undefined,
        description:  form.description.trim() || undefined,
        price:        parseFloat(form.price),
        comparePrice: form.comparePrice ? parseFloat(form.comparePrice) : undefined,
        stock:        parseInt(form.stock) || 1,
        isFeatured:   form.isFeatured,
        isActive:     form.isActive,
        images:       imagePreview ? [imagePreview] : product.images,
      });
      onClose();
    } catch (e: any) { setError(e.message); }
    setSaving(false);
  };

  const inp = 'w-full px-3.5 py-2.5 rounded-xl text-sm focus:outline-none';
  const inpStyle = { background: '#FAFAFA', border: '1px solid #E8E8E8', color: '#0C0C0C' };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose}/>
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white px-6 py-4 border-b border-gray-100 flex items-center justify-between z-10">
          <div>
            <h2 className="font-bold text-gray-900">Edit Product</h2>
            <p className="text-xs text-gray-400 mt-0.5 font-mono">{product.sku}</p>
          </div>
          <button onClick={onClose} className="p-2 rounded-xl text-gray-400 hover:bg-gray-100 transition-colors">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12"/>
            </svg>
          </button>
        </div>

        <div className="px-6 py-5 space-y-4">
          {error && (
            <div className="px-4 py-3 rounded-xl text-sm" style={{ background: 'rgba(220,38,38,0.06)', border: '1px solid rgba(220,38,38,0.15)', color: '#dc2626' }}>
              {error}
            </div>
          )}

          {/* Image */}
          <div>
            <label className="block text-sm font-semibold mb-2" style={{ color: '#0C0C0C' }}>Product Image</label>
            <label className="block border-2 border-dashed rounded-2xl p-4 text-center cursor-pointer transition-colors hover:border-orange-300"
              style={{ borderColor: '#D4C9B8' }}>
              <input type="file" accept="image/*" className="hidden"
                onChange={e => {
                  const f = e.target.files?.[0];
                  if (!f) return;
                  setImageFile(f);
                  setPreview(URL.createObjectURL(f));
                }}/>
              {imagePreview
                ? <img src={imagePreview} alt="Preview" className="w-28 h-28 object-contain mx-auto rounded-xl"/>
                : <div className="text-gray-400"><div className="text-3xl mb-1">🖼</div><p className="text-sm">Click to change image</p></div>
              }
              {imageFile && <p className="text-xs text-orange-500 mt-2 font-semibold">New image selected — will replace on save</p>}
            </label>
          </div>

          {/* Name */}
          <div>
            <label className="block text-sm font-semibold mb-1.5" style={{ color: '#0C0C0C' }}>Product Name</label>
            <input value={form.name} onChange={e => set('name', e.target.value)} className={inp} style={inpStyle}/>
          </div>

          {/* Brand / Category */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-semibold mb-1.5" style={{ color: '#0C0C0C' }}>Brand</label>
              <input value={form.brand} onChange={e => set('brand', e.target.value)} className={inp} style={inpStyle}/>
            </div>
            <div>
              <label className="block text-sm font-semibold mb-1.5" style={{ color: '#0C0C0C' }}>Category</label>
              <select value={form.category} onChange={e => set('category', e.target.value)} className={inp} style={inpStyle}>
                {CATS.map(c => <option key={c.value} value={c.value}>{c.label}</option>)}
              </select>
            </div>
          </div>

          {/* Subcategory */}
          <div>
            <label className="block text-sm font-semibold mb-1.5" style={{ color: '#0C0C0C' }}>Subcategory</label>
            <input value={form.subcategory} onChange={e => set('subcategory', e.target.value)}
              placeholder="e.g. washing-machines, fridges" className={inp} style={inpStyle}/>
          </div>

          {/* Price / Compare / Stock */}
          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="block text-sm font-semibold mb-1.5" style={{ color: '#0C0C0C' }}>Price (KES)</label>
              <input type="number" value={form.price} onChange={e => set('price', e.target.value)} className={inp} style={inpStyle}/>
            </div>
            <div>
              <label className="block text-sm font-semibold mb-1.5" style={{ color: '#0C0C0C' }}>Compare Price</label>
              <input type="number" value={form.comparePrice} onChange={e => set('comparePrice', e.target.value)} placeholder="Optional" className={inp} style={inpStyle}/>
            </div>
            <div>
              <label className="block text-sm font-semibold mb-1.5" style={{ color: '#0C0C0C' }}>Stock</label>
              <input type="number" value={form.stock} onChange={e => set('stock', e.target.value)} className={inp} style={inpStyle}/>
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-semibold mb-1.5" style={{ color: '#0C0C0C' }}>Description</label>
            <textarea value={form.description} onChange={e => set('description', e.target.value)}
              rows={3} placeholder="Optional…" className={`${inp} resize-none`} style={inpStyle}/>
          </div>

          {/* Toggles */}
          <div className="flex gap-6 pt-1">
            <label className="flex items-center gap-3 cursor-pointer">
              <Toggle on={form.isFeatured} onChange={() => set('isFeatured', !form.isFeatured)} color="#8B5A1A"/>
              <div>
                <p className="text-sm font-semibold" style={{ color: '#0C0C0C' }}>Featured</p>
                <p className="text-xs" style={{ color: '#9B8B7A' }}>Show on homepage</p>
              </div>
            </label>
            <label className="flex items-center gap-3 cursor-pointer">
              <Toggle on={form.isActive} onChange={() => set('isActive', !form.isActive)} color="#166534"/>
              <div>
                <p className="text-sm font-semibold" style={{ color: '#0C0C0C' }}>Active</p>
                <p className="text-xs" style={{ color: '#9B8B7A' }}>Visible in store</p>
              </div>
            </label>
          </div>
        </div>

        {/* Footer */}
        <div className="sticky bottom-0 bg-white px-6 py-4 border-t border-gray-100 flex gap-3">
          <button onClick={onClose} disabled={saving}
            className="flex-1 py-3 rounded-xl text-sm font-semibold border transition-colors disabled:opacity-40"
            style={{ borderColor: '#D4C9B8', color: '#6B6B6B' }}>
            Cancel
          </button>
          <button onClick={handleSave} disabled={saving || !form.name || !form.price}
            className="flex-1 py-3 rounded-xl text-sm font-bold text-white transition-colors disabled:opacity-40"
            style={{ background: '#0C0C0C' }}>
            {saving ? 'Saving…' : 'Save Changes'}
          </button>
        </div>
      </div>
    </div>
  );
}

/* ── Manage Products tab ── */
function ManageProducts({ secret }: { secret: string }) {
  const [products, setProducts] = useState<ManagedProduct[]>([]);
  const [loading,  setLoading]  = useState(true);
  const [error,    setError]    = useState('');
  const [saving,   setSaving]   = useState<string | null>(null);
  const [flash,    setFlash]    = useState<Record<string, string>>({});
  const [search,   setSearch]   = useState('');
  const [filter,   setFilter]   = useState<'all'|'featured'|'inactive'>('all');
  const [editing,  setEditing]  = useState<ManagedProduct | null>(null);
  const [confirmDelete, setConfirmDelete] = useState<ManagedProduct | null>(null);
  const [deleting, setDeleting] = useState<string | null>(null);

  const load = async () => {
    setLoading(true); setError('');
    try {
      const res  = await fetch(`/api/admin/manage?secret=${encodeURIComponent(secret)}`);
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to load');
      setProducts(data.products || []);
    } catch (e: any) { setError(e.message); }
    setLoading(false);
  };

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useState(() => { load(); });

  const patch = async (sku: string, fields: Partial<ManagedProduct>) => {
    setSaving(sku);
    try {
      const res = await fetch('/api/admin/manage', {
        method:  'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify({ secret, sku, ...fields }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed');
      setProducts(ps => ps.map(p => p.sku === sku ? { ...p, ...fields } : p));
      setFlash(f => ({ ...f, [sku]: 'saved' }));
      setTimeout(() => setFlash(f => { const n = { ...f }; delete n[sku]; return n; }), 2500);
    } catch (e: any) {
      setFlash(f => ({ ...f, [sku]: 'error:' + e.message }));
      setTimeout(() => setFlash(f => { const n = { ...f }; delete n[sku]; return n; }), 4000);
    }
    setSaving(null);
  };

  const handleDelete = async (p: ManagedProduct) => {
    setDeleting(p.sku);
    try {
      const res = await fetch('/api/admin/manage', {
        method:  'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify({ secret, sku: p.sku }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed');
      setProducts(ps => ps.filter(x => x.sku !== p.sku));
    } catch (e: any) {
      alert('Delete failed: ' + e.message);
    }
    setDeleting(null);
    setConfirmDelete(null);
  };

  const filtered = products.filter(p => {
    if (filter === 'featured' && !p.isFeatured) return false;
    if (filter === 'inactive' && p.isActive)    return false;
    if (!search) return true;
    const q = search.toLowerCase();
    return p.name.toLowerCase().includes(q) || p.sku.toLowerCase().includes(q) || p.brand.toLowerCase().includes(q);
  });

  const featuredCount = products.filter(p => p.isFeatured).length;
  const inactiveCount = products.filter(p => !p.isActive).length;

  const FILTER_TABS = [
    { id: 'all',      label: `All (${products.length})` },
    { id: 'featured', label: `★ Featured (${featuredCount})` },
    { id: 'inactive', label: `Hidden (${inactiveCount})` },
  ] as const;

  if (loading) return (
    <div className="flex flex-col items-center justify-center py-24 gap-4">
      <div className="w-8 h-8 rounded-full border-2 border-t-transparent animate-spin"
        style={{ borderColor: '#8B5A1A', borderTopColor: 'transparent' }}/>
      <p className="text-sm" style={{ color: '#6B6B6B' }}>Loading from Cloudinary…</p>
    </div>
  );

  if (error) return (
    <div className="flex flex-col items-center justify-center py-24 gap-4">
      <p className="text-sm text-red-500">{error}</p>
      <button onClick={load} className="px-5 py-2.5 rounded-xl text-sm font-semibold"
        style={{ background: '#0C0C0C', color: '#FFFFFF' }}>Try again</button>
    </div>
  );

  return (
    <>
      {/* Edit modal */}
      {editing && (
        <EditModal
          product={editing}
          secret={secret}
          onSave={fields => setProducts(ps => ps.map(p => p.sku === editing.sku ? { ...p, ...fields } : p))}
          onClose={() => setEditing(null)}
        />
      )}

      {/* Delete confirm */}
      {confirmDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setConfirmDelete(null)}/>
          <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-sm p-6 text-center">
            <div className="w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-4"
              style={{ background: 'rgba(220,38,38,0.08)' }}>
              <svg className="w-7 h-7 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8}
                  d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/>
              </svg>
            </div>
            <h3 className="font-bold text-gray-900 mb-2">Delete Product?</h3>
            <p className="text-sm text-gray-500 mb-1 line-clamp-2">{confirmDelete.name}</p>
            <p className="text-xs text-red-400 mb-6">This permanently removes it from Cloudinary. Cannot be undone.</p>
            <div className="flex gap-3">
              <button onClick={() => setConfirmDelete(null)}
                className="flex-1 py-2.5 rounded-xl text-sm font-semibold border border-gray-200 text-gray-600 hover:bg-gray-50">
                Cancel
              </button>
              <button onClick={() => handleDelete(confirmDelete)}
                disabled={deleting === confirmDelete.sku}
                className="flex-1 py-2.5 rounded-xl text-sm font-bold text-white bg-red-500 hover:bg-red-600 disabled:opacity-50 transition-colors">
                {deleting === confirmDelete.sku ? 'Deleting…' : 'Delete'}
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="space-y-5">
        {/* Header */}
        <div className="flex items-start justify-between gap-4 flex-wrap">
          <div>
            <h2 className="text-lg font-bold" style={{ color: '#0C0C0C' }}>Manage Products</h2>
            <p className="text-xs mt-1" style={{ color: '#9B8B7A' }}>
              Edit, delete, toggle Featured & Active — changes are live immediately
            </p>
          </div>
          <div className="flex gap-2 items-center flex-wrap">
            <div className="relative">
              <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 pointer-events-none"
                style={{ color: '#9AA0A6' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0"/>
              </svg>
              <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search products…"
                className="pl-9 pr-4 py-2 rounded-xl text-sm focus:outline-none"
                style={{ background: 'white', border: '1px solid #E8E8E8', color: '#0C0C0C', width: '200px' }}/>
            </div>
            <button onClick={load}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold border transition-colors"
              style={{ borderColor: '#D4C9B8', color: '#6B6B6B', background: 'white' }}>
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                  d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"/>
              </svg>
              Refresh
            </button>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-3">
          {[
            { label: 'Total',    value: products.length,  color: '#0C0C0C' },
            { label: 'Featured', value: featuredCount,    color: '#8B5A1A' },
            { label: 'Hidden',   value: inactiveCount,    color: '#6B7280' },
          ].map(s => (
            <div key={s.label} className="p-4 rounded-2xl border text-center"
              style={{ background: 'white', borderColor: '#E8E8E8' }}>
              <p className="text-2xl font-bold" style={{ color: s.color }}>{s.value}</p>
              <p className="text-xs mt-0.5" style={{ color: '#9B8B7A' }}>{s.label}</p>
            </div>
          ))}
        </div>

        {/* Filter tabs */}
        <div className="flex gap-1 p-1 rounded-xl" style={{ background: '#F0EBE3' }}>
          {FILTER_TABS.map(t => (
            <button key={t.id} onClick={() => setFilter(t.id)}
              className="flex-1 py-2 rounded-lg text-xs font-semibold transition-all"
              style={{
                background: filter === t.id ? 'white' : 'transparent',
                color:      filter === t.id ? '#0C0C0C' : '#9B8B7A',
                boxShadow:  filter === t.id ? '0 1px 3px rgba(0,0,0,0.08)' : 'none',
              }}>
              {t.label}
            </button>
          ))}
        </div>

        {/* Product list */}
        {filtered.length === 0 ? (
          <div className="text-center py-16 rounded-2xl border border-dashed"
            style={{ borderColor: '#D4C9B8', color: '#9B8B7A' }}>
            <p className="text-3xl mb-3">📦</p>
            <p className="text-sm font-medium">No products match</p>
          </div>
        ) : (
          <div className="grid gap-2">
            {filtered.map(p => {
              const isFlashing = !!flash[p.sku];
              const hasError   = flash[p.sku]?.startsWith('error:');
              const isBusy     = saving === p.sku;

              return (
                <div key={p.sku}
                  className="flex items-center gap-4 p-3.5 rounded-2xl border transition-all duration-200"
                  style={{
                    background:  'white',
                    borderColor: isFlashing ? (hasError ? 'rgba(220,38,38,0.30)' : 'rgba(22,101,52,0.25)') : '#E8E8E8',
                    opacity:     p.isActive ? 1 : 0.6,
                  }}>

                  {/* Thumb */}
                  <div className="w-16 h-16 rounded-xl overflow-hidden flex-shrink-0"
                    style={{ background: '#F7F4F0' }}>
                    {p.images[0]
                      ? <img src={p.images[0]} alt={p.name} className="w-full h-full object-cover"/>
                      : <div className="w-full h-full flex items-center justify-center text-2xl">📷</div>}
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <p className="font-semibold text-sm" style={{ color: '#0C0C0C' }}>{p.name}</p>
                      {p.isFeatured && (
                        <span className="text-[9px] font-bold px-2 py-0.5 rounded-full tracking-wide"
                          style={{ background: 'rgba(139,90,26,0.12)', color: '#8B5A1A' }}>★ FEATURED</span>
                      )}
                      {!p.isActive && (
                        <span className="text-[9px] font-bold px-2 py-0.5 rounded-full tracking-wide"
                          style={{ background: 'rgba(100,100,100,0.10)', color: '#6B7280' }}>HIDDEN</span>
                      )}
                    </div>
                    <p className="text-xs mt-0.5" style={{ color: '#9B8B7A' }}>
                      {p.brand} · {CATEGORY_LABELS[p.category] ?? p.category}
                      {p.subcategory && ` · ${p.subcategory}`}
                      <span className="mx-1 opacity-40">·</span>
                      <span className="font-mono">{p.sku}</span>
                    </p>
                    <div className="flex items-center gap-2 mt-1">
                      <p className="text-sm font-bold" style={{ color: '#0C0C0C' }}>
                        KES {Number(p.price).toLocaleString()}
                      </p>
                      {p.comparePrice && (
                        <p className="text-xs line-through" style={{ color: '#9AA0A6' }}>
                          KES {Number(p.comparePrice).toLocaleString()}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Flash */}
                  {isFlashing && (
                    <div className="flex-shrink-0 px-3 py-1.5 rounded-xl text-xs font-semibold"
                      style={{
                        background: hasError ? 'rgba(220,38,38,0.08)' : 'rgba(22,101,52,0.08)',
                        color:      hasError ? '#dc2626' : '#166534',
                      }}>
                      {hasError ? '✗ Failed' : '✓ Saved'}
                    </div>
                  )}

                  {/* Spinner */}
                  {isBusy && !isFlashing && (
                    <div className="w-4 h-4 rounded-full border-2 border-t-transparent animate-spin flex-shrink-0"
                      style={{ borderColor: '#8B5A1A', borderTopColor: 'transparent' }}/>
                  )}

                  {/* Action buttons */}
                  <div className="flex items-center gap-1 flex-shrink-0">
                    <button onClick={() => setEditing(p)}
                      className="p-2 rounded-xl text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-colors"
                      title="Edit">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                          d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"/>
                      </svg>
                    </button>
                    <button onClick={() => setConfirmDelete(p)}
                      className="p-2 rounded-xl text-gray-400 hover:text-red-500 hover:bg-red-50 transition-colors"
                      title="Delete">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                          d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/>
                      </svg>
                    </button>
                  </div>

                  {/* Toggles */}
                  <div className="flex items-center gap-4 flex-shrink-0 pl-2 border-l border-gray-100">
                    <div className="flex flex-col items-center gap-1.5">
                      <Toggle on={p.isFeatured} onChange={() => patch(p.sku, { isFeatured: !p.isFeatured })} disabled={isBusy} color="#8B5A1A"/>
                      <span className="text-[9px] font-semibold tracking-wide uppercase"
                        style={{ color: p.isFeatured ? '#8B5A1A' : '#9AA0A6' }}>Featured</span>
                    </div>
                    <div className="flex flex-col items-center gap-1.5">
                      <Toggle on={p.isActive} onChange={() => patch(p.sku, { isActive: !p.isActive })} disabled={isBusy} color="#166634"/>
                      <span className="text-[9px] font-semibold tracking-wide uppercase"
                        style={{ color: p.isActive ? '#166634' : '#9AA0A6' }}>Active</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </>
  );
}

/* ══════════════════════════════════════════════════════════
   HERO IMAGES — Upload images that appear in the homepage hero
══════════════════════════════════════════════════════════ */
function HeroImages({ secret }: { secret: string }) {
  const SLOTS = [1, 2, 3, 4];

  const [slots, setSlots] = useState<Record<number, { src: string; alt: string; loading: boolean; error: string }>>({
    1: { src: '', alt: '', loading: false, error: '' },
    2: { src: '', alt: '', loading: false, error: '' },
    3: { src: '', alt: '', loading: false, error: '' },
    4: { src: '', alt: '', loading: false, error: '' },
  });
  const [loadingAll, setLoadingAll] = useState(true);
  const [success, setSuccess] = useState('');

  // Load current hero images on mount
  useState(() => {
    fetch(`/api/admin/hero?secret=${encodeURIComponent(secret)}`)
      .then(r => r.json())
      .then(data => {
        if (data.images) {
          const updated = { ...slots };
          data.images.forEach((img: any, i: number) => {
            const slot = i + 1;
            if (updated[slot]) updated[slot] = { ...updated[slot], src: img.src, alt: img.alt ?? '' };
          });
          setSlots(updated);
        }
      })
      .catch(() => {})
      .finally(() => setLoadingAll(false));
  });

  const upload = async (slot: number, file: File) => {
    const alt = slots[slot].alt || `Hero image ${slot}`;
    setSlots(s => ({ ...s, [slot]: { ...s[slot], loading: true, error: '' } }));
    try {
      const base64 = await new Promise<string>((res, rej) => {
        const r = new FileReader();
        r.onload = e => res(e.target!.result as string);
        r.onerror = () => rej(new Error('read failed'));
        r.readAsDataURL(file);
      });
      const resp = await fetch('/api/admin/hero', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ secret, slot, imageBase64: base64, alt }),
      });
      const data = await resp.json();
      if (!resp.ok) throw new Error(data.error || 'Failed');
      setSlots(s => ({ ...s, [slot]: { ...s[slot], src: data.url, loading: false } }));
      setSuccess(`✓ Slot ${slot} updated`);
      setTimeout(() => setSuccess(''), 3000);
    } catch (e: any) {
      setSlots(s => ({ ...s, [slot]: { ...s[slot], loading: false, error: e.message } }));
    }
  };

  const removeImage = async (slot: number) => {
    if (!confirm(`Delete hero image ${slot}?`)) return;
    setSlots(s => ({ ...s, [slot]: { ...s[slot], loading: true, error: '' } }));
    try {
      const resp = await fetch('/api/admin/hero', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ secret, slot }),
      });
      if (!resp.ok) throw new Error((await resp.json()).error || 'Failed');
      setSlots(s => ({ ...s, [slot]: { src: '', alt: '', loading: false, error: '' } }));
    } catch (e: any) {
      setSlots(s => ({ ...s, [slot]: { ...s[slot], loading: false, error: e.message } }));
    }
  };

  if (loadingAll) return (
    <div className="flex items-center justify-center py-24">
      <div className="w-8 h-8 rounded-full border-2 border-t-transparent animate-spin" style={{ borderColor: '#8B5A1A', borderTopColor: 'transparent' }}/>
    </div>
  );

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-bold" style={{ color: '#0C0C0C' }}>Hero Images</h2>
        <p className="text-xs mt-1" style={{ color: '#9B8B7A' }}>
          Upload up to 4 images for the homepage hero section. Images appear in slot order (1 → 4).
        </p>
      </div>

      {success && (
        <div className="px-4 py-3 rounded-xl text-sm font-medium"
          style={{ background: 'rgba(22,101,52,0.08)', border: '1px solid rgba(22,101,52,0.20)', color: '#166534' }}>
          {success}
        </div>
      )}

      <div className="grid grid-cols-2 gap-4">
        {SLOTS.map(slot => {
          const s = slots[slot];
          return (
            <div key={slot} className="rounded-2xl border overflow-hidden" style={{ borderColor: '#E8E8E8' }}>
              {/* Preview area */}
              <div className="relative aspect-[4/3] bg-gray-100">
                {s.src ? (
                  <img src={s.src} alt={s.alt} className="w-full h-full object-cover"/>
                ) : (
                  <div className="absolute inset-0 flex flex-col items-center justify-center" style={{ color: '#9AA0A6' }}>
                    <div className="text-4xl mb-2">🖼</div>
                    <p className="text-xs font-medium">Slot {slot} — empty</p>
                    <p className="text-[10px] mt-0.5">Will use Unsplash fallback</p>
                  </div>
                )}
                {/* Slot badge */}
                <div className="absolute top-2 left-2 w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold text-white"
                  style={{ background: 'rgba(0,0,0,0.55)' }}>
                  {slot}
                </div>
                {/* Delete btn */}
                {s.src && !s.loading && (
                  <button onClick={() => removeImage(slot)}
                    className="absolute top-2 right-2 w-7 h-7 rounded-full flex items-center justify-center text-white transition-opacity hover:opacity-75"
                    style={{ background: 'rgba(220,38,38,0.8)' }}>
                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12"/>
                    </svg>
                  </button>
                )}
                {s.loading && (
                  <div className="absolute inset-0 flex items-center justify-center bg-white/70">
                    <div className="w-6 h-6 rounded-full border-2 border-t-transparent animate-spin" style={{ borderColor: '#8B5A1A', borderTopColor: 'transparent' }}/>
                  </div>
                )}
              </div>

              {/* Controls */}
              <div className="p-3 space-y-2" style={{ background: 'white' }}>
                <input
                  value={s.alt}
                  onChange={e => setSlots(ss => ({ ...ss, [slot]: { ...ss[slot], alt: e.target.value } }))}
                  placeholder={`Alt text for slot ${slot}…`}
                  className="w-full px-3 py-2 rounded-lg text-xs focus:outline-none"
                  style={{ background: '#FAFAFA', border: '1px solid #E8E8E8', color: '#0C0C0C' }}
                />
                <label className="flex items-center gap-2 cursor-pointer w-full px-3 py-2 rounded-lg text-xs font-semibold justify-center transition-colors"
                  style={{ background: '#0C0C0C', color: '#FFFFFF' }}>
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"/>
                  </svg>
                  {s.src ? 'Replace image' : 'Upload image'}
                  <input type="file" accept="image/*" className="hidden"
                    onChange={e => { const f = e.target.files?.[0]; if (f) upload(slot, f); }}/>
                </label>
                {s.error && <p className="text-[10px] text-red-500">{s.error}</p>}
              </div>
            </div>
          );
        })}
      </div>

      <div className="p-4 rounded-xl text-xs leading-relaxed" style={{ background: 'rgba(139,90,26,0.06)', border: '1px solid rgba(139,90,26,0.15)', color: '#6B5A3A' }}>
        <p className="font-semibold mb-1">Tips for great hero images:</p>
        <p>• Use landscape images (wider than tall) — 4:3 or 16:9 ratio works best</p>
        <p>• Recommended size: 1200×800px or larger for sharp display</p>
        <p>• If all slots are empty, the homepage uses Unsplash placeholder images</p>
      </div>
    </div>
  );
}
