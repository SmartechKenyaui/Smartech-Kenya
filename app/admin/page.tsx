'use client';

import { useState, useRef, useCallback, useEffect } from 'react';
import { ImageCropperModal } from '@/components/admin/ImageCropperModal';

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
  'Acer',
  'Alcatel',
  'Anker',
  'Apple',
  'Ariston',
  'Asus',
  'Beko',
  'Belkin',
  'Black+Decker',
  'Bolesi',
  'Bosch',
  'Bose',
  'Brother',
  'Bruhm',
  'Candy',
  'Canon',
  'D-Link',
  'Defy',
  'Dell',
  'EcoMax',
  'Electrolux',
  'Epson',
  'Geepas',
  'Google',
  'Haier',
  'Harman Kardon',
  'Hisense',
  'Honor',
  'Hotpoint',
  'HP',
  'Huawei',
  'Infinix',
  'itel',
  'JBL',
  'JVC',
  'Kenwood',
  'Lenovo',
  'LG',
  'Marshall',
  'Midea',
  'Mika',
  'Microsoft',
  'Motorola',
  'Moulinex',
  'MSI',
  'Nikai',
  'Nikon',
  'Nokia',
  'Nunix',
  'OnePlus',
  'Oppo',
  'Panasonic',
  'Philips',
  'POCO',
  'Ramtons',
  'Rashnik',
  'Realme',
  'Redmi',
  'Roch',
  'Russell Hobbs',
  'Samsung',
  'Scanfrost',
  'Sharp',
  'Skyworth',
  'SmartPro',
  'Sony',
  'TCL',
  'Tecno',
  'Tefal',
  'Tenda',
  'Toshiba',
  'TP-Link',
  'Ubiquiti',
  'Vitron',
  'Vivo',
  'Von Hotpoint',
  'Whirlpool',
  'Xiaomi',
  'ZTE',
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
  const [tab,         setTab]         = useState<'manage'|'add'|'images'|'folder'>('manage');
  const [sidebarOpen, setSidebarOpen] = useState(true);

  // Fast session restore from session storage (preserves login on page refresh)
  useEffect(() => {
    try {
      const saved = sessionStorage.getItem('smartech_admin_secret');
      if (saved) {
        setSecret(saved);
        setAuthed(true);
        // Load products in background asynchronously
        fetch(`/api/admin/upload-image?secret=${encodeURIComponent(saved)}`)
          .then(r => r.json())
          .then(pData => {
            if (pData.products) setProducts(pData.products);
            if (pData.dbError) setDbError(pData.dbError);
          })
          .catch(() => {});
      }
    } catch {}
  }, []);

  /* Fast Login */
  const login = async () => {
    if (!secret.trim()) return;
    setLoading(true);
    setError('');
    try {
      const authRes = await fetch(`/api/admin/cloudinary-upload?secret=${encodeURIComponent(secret.trim())}`);
      if (!authRes.ok) {
        setError('Incorrect password. Please try again.');
        setLoading(false);
        return;
      }

      // Validated! Save to sessionStorage for page refresh support
      try { sessionStorage.setItem('smartech_admin_secret', secret.trim()); } catch {}
      setAuthed(true);
      setLoading(false);

      // Fetch products in background asynchronously without blocking login
      fetch(`/api/admin/upload-image?secret=${encodeURIComponent(secret.trim())}`)
        .then(r => r.json())
        .then(pData => {
          if (pData.products) setProducts(pData.products);
          if (pData.dbError) setDbError(pData.dbError);
        })
        .catch(() => {
          setDbError('Could not reach database — image upload still works via Direct Upload.');
        });
    } catch {
      setError('Connection error. Please check your network.');
      setLoading(false);
    }
  };

  const logout = () => {
    try { sessionStorage.removeItem('smartech_admin_secret'); } catch {}
    setAuthed(false);
    setSecret('');
  };

  const handleViewLiveStore = () => {
    window.open('/', '_blank');
  };

  const [showPassword, setShowPassword] = useState(false);

  /* ── Login screen ── */
  if (!authed) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4 relative overflow-hidden bg-[#0A0D14]">
        {/* Ambient lighting & radial glow background */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-[#F97316]/10 rounded-full blur-[120px] pointer-events-none" />
        <div className="absolute bottom-10 right-10 w-[300px] h-[300px] bg-blue-500/5 rounded-full blur-[100px] pointer-events-none" />

        <div className="w-full max-w-[420px] relative z-10">
          {/* Glassmorphic Card */}
          <div className="bg-[#121722]/80 backdrop-blur-xl border border-white/[0.08] rounded-3xl p-8 sm:p-10 shadow-2xl shadow-black/60">
            {/* Logo / Badge */}
            <div className="text-center mb-8">
              <div className="w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                <img
                  src="/admin-icon.jpeg"
                  alt="Smartech Kenya Admin"
                  className="w-16 h-16 rounded-2xl object-cover shadow-xl border border-white/20 ring-4 ring-[#F97316]/20"
                />
              </div>
              <h1 className="text-white text-2xl font-bold tracking-tight">Admin Portal</h1>
            </div>

            {/* Form */}
            <div className="space-y-4">
              <div className="space-y-1.5">
                <label className="block text-xs font-semibold text-gray-300">Enter Your Password</label>
                <div className="relative">
                  <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
                    </svg>
                  </div>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={secret}
                    onChange={e => setSecret(e.target.value)}
                    placeholder="Enter your password"
                    onKeyDown={e => e.key === 'Enter' && login()}
                    className="w-full pl-11 pr-11 py-3.5 rounded-2xl text-sm bg-white/[0.05] border border-white/[0.12] text-white placeholder-gray-500 focus:bg-white/[0.08] focus:border-[#F97316] focus:ring-2 focus:ring-[#F97316]/20 outline-none transition-all"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 p-1 text-gray-400 hover:text-white transition-colors"
                  >
                    {showPassword ? (
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l18 18" />
                      </svg>
                    ) : (
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      </svg>
                    )}
                  </button>
                </div>
              </div>

              {error && (
                <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-xs font-semibold text-center flex items-center justify-center gap-1.5">
                  <svg className="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span>{error}</span>
                </div>
              )}

              <button
                onClick={login}
                disabled={loading || !secret.trim()}
                className="w-full py-3.5 rounded-2xl text-sm font-bold text-white bg-[#F97316] hover:bg-[#EA580C] active:scale-[0.99] transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-[#F97316]/25 flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>Verifying Credentials…</span>
                  </>
                ) : (
                  <span>Sign In to Dashboard</span>
                )}
              </button>
            </div>

          </div>
        </div>
      </div>
    );
  }

  const NAV_ITEMS = [
    { id: 'manage', icon: '✎',  label: 'Manage Products' },
    { id: 'add',    icon: '＋', label: 'Add Product'     },
    { id: 'images', icon: '🖼', label: 'Image Manager'   },
    { id: 'folder', icon: '📁', label: 'Folder Upload'   },
  ] as const;

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-[#F8F9FA]">
      {/* ── LEFT SIDEBAR ────────────────────────────────────────── */}
      <aside
        className={`bg-[#0C0F17] text-white flex flex-col shrink-0 border-r border-white/10 md:min-h-screen md:sticky md:top-0 md:h-screen transition-all duration-300 ${
          sidebarOpen ? 'w-full md:w-64 lg:w-72' : 'w-full md:w-20'
        }`}
      >
        {/* Brand Header & Toggle */}
        <div className="p-4 border-b border-white/10 flex items-center justify-between gap-2">
          <div className="flex items-center gap-3 overflow-hidden">
            <img
              src="/admin-icon.jpeg"
              alt="Smartech Admin"
              className="w-10 h-10 rounded-xl object-cover border border-white/20 shadow-md ring-2 ring-[#F97316]/20 shrink-0"
            />
            {sidebarOpen && (
              <div className="min-w-0">
                <h2 className="text-sm font-bold text-white tracking-tight leading-tight truncate">Smartech Kenya</h2>
                <p className="text-[11px] text-[#F97316] font-semibold">Admin Dashboard</p>
              </div>
            )}
          </div>
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="w-8 h-8 rounded-lg flex items-center justify-center text-white bg-white/20 hover:bg-[#F97316] border border-white/25 shadow-sm transition-all active:scale-95 shrink-0 cursor-pointer"
            title={sidebarOpen ? "Collapse sidebar" : "Expand sidebar"}
          >
            <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {sidebarOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M11 19l-7-7 7-7m8 14l-7-7 7-7" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 5l7 7-7 7M5 5l7 7-7 7" />
              )}
            </svg>
          </button>
        </div>

        {/* Navigation Items (Left Side List) */}
        <div className="flex-1 p-2.5 space-y-1.5 overflow-y-auto">
          {sidebarOpen && (
            <p className="px-3 py-2 text-[10px] font-bold uppercase tracking-wider text-gray-500">Navigation</p>
          )}
          {NAV_ITEMS.map(t => {
            const active = tab === t.id;
            return (
              <button
                key={t.id}
                onClick={() => setTab(t.id)}
                title={!sidebarOpen ? t.label : undefined}
                className={`w-full text-left rounded-xl text-xs font-semibold transition-all flex items-center gap-3 ${
                  sidebarOpen ? 'px-3.5 py-3' : 'px-0 py-3 justify-center'
                } ${
                  active
                    ? 'bg-[#F97316] text-white shadow-lg shadow-[#F97316]/25'
                    : 'text-gray-400 hover:text-white hover:bg-white/[0.06]'
                }`}
              >
                <span className={`text-base shrink-0 ${active ? 'text-white' : 'text-gray-300'}`}>{t.icon}</span>
                {sidebarOpen && <span className="flex-1 truncate">{t.label}</span>}
              </button>
            );
          })}
        </div>

        {/* Sidebar Footer */}
        <div className="p-3 border-t border-white/10 space-y-2 bg-[#090C12]">
          <button
            onClick={handleViewLiveStore}
            title={!sidebarOpen ? "View Live Store" : undefined}
            className={`w-full inline-flex items-center gap-2 py-2.5 rounded-xl text-xs font-semibold text-gray-300 hover:text-white bg-white/[0.06] hover:bg-white/[0.10] border border-white/[0.08] transition-all cursor-pointer ${
              sidebarOpen ? 'px-3.5 justify-start' : 'px-0 justify-center'
            }`}
          >
            <svg className="w-4 h-4 text-gray-400 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            {sidebarOpen && <span className="truncate">View Live Store</span>}
          </button>

          <button
            onClick={logout}
            title={!sidebarOpen ? "Sign Out" : undefined}
            className={`w-full inline-flex items-center gap-2 py-2.5 rounded-xl text-xs font-semibold text-red-400 hover:text-white bg-red-500/10 hover:bg-red-600 border border-red-500/20 transition-all active:scale-98 ${
              sidebarOpen ? 'px-3.5 justify-start' : 'px-0 justify-center'
            }`}
          >
            <svg className="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
            {sidebarOpen && <span>Sign Out</span>}
          </button>
        </div>
      </aside>

      {/* ── RIGHT MAIN CONTENT AREA ─────────────────────────────── */}
      <main className="flex-1 min-w-0 bg-[#FFFFFF] min-h-screen flex flex-col">
        {/* DB warning banner */}
        {dbError && (
          <div className="bg-amber-50 border-b border-amber-200 px-6 py-2.5">
            <p className="text-xs text-amber-800 text-center max-w-5xl mx-auto">
              ⚠ <strong>Database offline (Atlas IP whitelist).</strong> {dbError}
            </p>
          </div>
        )}

        {/* Content Container */}
        <div className="flex-1 max-w-6xl w-full mx-auto px-4 sm:px-8 py-8">
          {tab === 'images' && <ImageManager products={products} secret={secret} onUpdate={p => setProducts(p)} />}
          {tab === 'folder' && <FolderUpload products={products} secret={secret} onDone={p => setProducts(p)} />}
          {tab === 'add'    && <AddProduct   secret={secret} />}
          {tab === 'manage' && <ManageProducts secret={secret} />}
        </div>
      </main>
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
  const [cropTarget, setCropTarget] = useState<{ sku: string; name: string; src: string } | null>(null);

  const filtered = products.filter(p => {
    const matchSearch = !search || p.name.toLowerCase().includes(search.toLowerCase()) || p.sku.toLowerCase().includes(search.toLowerCase());
    const matchFilter = filter === 'all' ? true : filter === 'missing' ? isPlaceholder(p.images[0]) : !isPlaceholder(p.images[0]);
    return matchSearch && matchFilter;
  });

  const handlePickFile = useCallback(async (sku: string, name: string, file: File) => {
    try {
      const b64 = await fileToBase64(file);
      setCropTarget({ sku, name, src: b64 });
    } catch {
      alert('Could not read image file.');
    }
  }, []);

  const handleCropSave = useCallback(async (croppedBase64: string) => {
    if (!cropTarget) return;
    const { sku } = cropTarget;
    setCropTarget(null);
    setStatus(s => ({ ...s, [sku]: 'uploading' }));
    try {
      const resp = await fetch('/api/admin/upload-image', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ secret, sku, imageBase64: croppedBase64 }),
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
  }, [cropTarget, secret, products, onUpdate]);

  const onDrop = useCallback((sku: string, name: string, e: React.DragEvent) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file?.type.startsWith('image/')) {
      handlePickFile(sku, name, file);
    }
  }, [handlePickFile]);

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
              onDrop={e => onDrop(p.sku, p.name, e)}
              className="rounded-2xl overflow-hidden group transition-all duration-300 hover:shadow-[0_8px_32px_rgba(0,0,0,0.10)] hover:-translate-y-0.5 relative"
              style={{ background: 'white', border: '1px solid #E8E8E8' }}>
              <label className="block relative aspect-square cursor-pointer overflow-hidden"
                style={{ background: hasImg ? '#FFFFFF' : '#FAFAFA' }}>
                <input type="file" accept="image/*" className="hidden sr-only"
                  onChange={e => e.target.files?.[0] && handlePickFile(p.sku, p.name, e.target.files[0])} />
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
                      Click to crop & upload<br/>or drag here
                    </span>
                  </div>
                )}
                {hasImg && (
                  <div className="absolute inset-0 flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity"
                    style={{ background: 'rgba(12,12,12,0.50)' }}>
                    <span className="text-white text-[11px] font-bold px-3 py-1.5 rounded-full bg-[#0C0C0C]/80 border border-white/20">
                      ✂ Crop / Change
                    </span>
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
                <div className="flex items-center justify-between gap-2 mb-1.5">
                  <span className="text-[9px] font-bold tracking-widest uppercase text-gray-400 truncate">{p.brand}</span>
                  {hasImg && (
                    <button
                      type="button"
                      onClick={() => setCropTarget({ sku: p.sku, name: p.name, src: p.images[0] })}
                      className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-[11px] font-bold text-white bg-[#F97316] hover:bg-[#EA580C] shadow-xs shadow-[#F97316]/20 transition-all active:scale-95 cursor-pointer shrink-0"
                      title="Crop and adjust this product's image"
                    >
                      <span className="text-xs leading-none">✂</span>
                      <span>Crop</span>
                    </button>
                  )}
                </div>
                <p className="text-[11.5px] font-medium leading-snug line-clamp-2" style={{ color: '#0C0C0C' }}>{p.name}</p>
                <p className="text-[10px] font-mono mt-1" style={{ color: '#9AA0A6' }}>{p.sku}</p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Interactive Crop Modal */}
      {cropTarget && (
        <ImageCropperModal
          imageSrc={cropTarget.src}
          title={`Crop Image — ${cropTarget.name}`}
          aspectRatio={1}
          onCrop={handleCropSave}
          onClose={() => setCropTarget(null)}
        />
      )}

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
  const [croppedBase64, setCroppedBase64] = useState('');
  const [cropSrc, setCropSrc]       = useState<string | null>(null);
  const [saving,  setSaving]       = useState(false);
  const [success, setSuccess]      = useState('');
  const [error,   setError]        = useState('');

  const set = (k: string, v: string) => setForm(f => ({ ...f, [k]: v }));

  const handlePick = async (file: File) => {
    setImageFile(file);
    const b64 = await fileToBase64(file);
    setCropSrc(b64);
  };

  const handleCropDone = (cropped: string) => {
    setCroppedBase64(cropped);
    setPreview(cropped);
    setCropSrc(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true); setError(''); setSuccess('');
    try {
      let imageBase64 = croppedBase64;
      if (!imageBase64 && imageFile) imageBase64 = await fileToBase64(imageFile);
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
      setImageFile(null); setPreview(''); setCroppedBase64('');
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
        <div
          onDragOver={e => e.preventDefault()}
          onDrop={e => { e.preventDefault(); const f = e.dataTransfer.files[0]; if (f?.type.startsWith('image/')) handlePick(f); }}
          className="border-2 border-dashed rounded-2xl p-6 text-center relative"
          style={{ borderColor: '#D4C9B8', background: '#FAFAFA' }}>
          <input type="file" id="add-product-img" accept="image/*" onChange={e => { const f = e.target.files?.[0]; if (f) handlePick(f); }} className="hidden" />
          {imagePreview ? (
            <div className="flex flex-col items-center gap-3">
              <img src={imagePreview} alt="Preview" className="w-36 h-36 object-contain rounded-xl border border-gray-200 bg-white p-2 shadow-xs"/>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setCropSrc(imagePreview)}
                  className="px-3 py-1.5 rounded-xl text-xs font-semibold bg-[#F97316]/10 text-[#F97316] hover:bg-[#F97316]/20 border border-[#F97316]/30 transition-colors"
                >
                  ✂ Re-crop Image
                </button>
                <label
                  htmlFor="add-product-img"
                  className="px-3 py-1.5 rounded-xl text-xs font-semibold bg-gray-200 text-gray-700 hover:bg-gray-300 cursor-pointer transition-colors"
                >
                  Change Image
                </label>
              </div>
            </div>
          ) : (
            <label htmlFor="add-product-img" className="cursor-pointer block py-4" style={{ color: '#9AA0A6' }}>
              <div className="text-3xl mb-2">🖼</div>
              <p className="text-sm font-semibold text-gray-700">Click to crop & upload image</p>
              <p className="text-xs text-gray-400 mt-1">Supports drag and drop • JPG, PNG, WEBP</p>
            </label>
          )}
        </div>
      </div>

      {cropSrc && (
        <ImageCropperModal
          imageSrc={cropSrc}
          title="Crop Product Image"
          aspectRatio={1}
          onCrop={handleCropDone}
          onClose={() => setCropSrc(null)}
        />
      )}

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

  useEffect(() => {
    load();
  }, []);

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
                  <div className="flex items-center gap-2 flex-shrink-0">
                    <button
                      onClick={() => setEditing(p)}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold text-gray-800 bg-gray-100 hover:bg-gray-200 border border-gray-200 shadow-xs transition-all active:scale-95"
                      title="Edit Product Details"
                    >
                      <svg className="w-3.5 h-3.5 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                          d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"/>
                      </svg>
                      <span>Edit</span>
                    </button>
                    <button
                      onClick={() => setConfirmDelete(p)}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold text-red-700 bg-red-50 hover:bg-red-100 border border-red-200/80 shadow-xs transition-all active:scale-95"
                      title="Delete Product"
                    >
                      <svg className="w-3.5 h-3.5 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                          d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/>
                      </svg>
                      <span>Delete</span>
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
