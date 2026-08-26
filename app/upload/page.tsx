'use client';
import { useState, useRef } from 'react';

const CATS = ['KITCHEN','SMARTPHONES','LAPTOPS','AUDIO_TV','HOME_APPLIANCES','SMART_HOME','BEDROOM','ELECTRICAL'];
const BRANDS = ['Mika','Hisense','Samsung','LG','Ramtons','HP','Von Hotpoint','Sony','Tecno','Infinix','Beko','TCL','Other'];

export default function UploadPage() {
  const [secret,  setSecret]  = useState('');
  const [authed,  setAuthed]  = useState(false);
  const [img,     setImg]     = useState('');
  const [preview, setPreview] = useState('');
  const [form,    setForm]    = useState({ name:'', brand:'Mika', category:'KITCHEN', price:'', stock:'10', featured: false });
  const [status,  setStatus]  = useState('');
  const [done,    setDone]    = useState<{name:string,url:string}[]>([]);
  const ref = useRef<HTMLInputElement>(null);

  const pick = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0]; if (!f) return;
    const r = new FileReader();
    r.onload = ev => { setImg(ev.target!.result as string); setPreview(URL.createObjectURL(f)); };
    r.readAsDataURL(f);
  };

  const submit = async () => {
    if (!form.name || !form.price || !img) { setStatus('Fill in name, price and pick an image.'); return; }
    setStatus('Uploading…');
    try {
      const res  = await fetch('/api/admin/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          secret, imageBase64: img,
          name: form.name, brand: form.brand, category: form.category,
          price: parseFloat(form.price), stock: parseInt(form.stock) || 10,
          isFeatured: form.featured,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed');
      setDone(prev => [{ name: form.name, url: data.product?.images?.[0] || '' }, ...prev]);
      setForm(f => ({ ...f, name: '', price: '', featured: false }));
      setImg(''); setPreview('');
      setStatus('✓ Product added! It will appear on the homepage now.');
    } catch (e: any) { setStatus('Error: ' + e.message); }
  };

  if (!authed) return (
    <div style={{ minHeight:'100vh', background:'#0C0C0C', display:'flex', alignItems:'center', justifyContent:'center', fontFamily:'system-ui' }}>
      <div style={{ width:320, textAlign:'center' }}>
        <p style={{ color:'#FFFFFF', fontSize:22, fontWeight:600, marginBottom:8 }}>Smartech Upload</p>
        <p style={{ color:'rgba(255,255,255,0.4)', fontSize:13, marginBottom:24 }}>Enter your admin password</p>
        <input type="password" placeholder="Admin password" value={secret} onChange={e => setSecret(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && setAuthed(true)}
          style={{ width:'100%', padding:'12px 16px', borderRadius:12, border:'1px solid rgba(255,255,255,0.12)', background:'rgba(255,255,255,0.06)', color:'#FFFFFF', fontSize:14, boxSizing:'border-box', marginBottom:10 }}/>
        <button onClick={() => setAuthed(true)} disabled={!secret}
          style={{ width:'100%', padding:'13px', borderRadius:12, background:'#8B5A1A', color:'#FFFFFF', fontWeight:700, fontSize:14, border:'none', cursor:'pointer' }}>
          Sign In
        </button>
      </div>
    </div>
  );

  return (
    <div style={{ minHeight:'100vh', background:'#FFFFFF', fontFamily:'system-ui', padding:'40px 20px' }}>
      <div style={{ maxWidth:520, margin:'0 auto' }}>
        <p style={{ fontSize:22, fontWeight:700, color:'#0C0C0C', marginBottom:4 }}>Add Product</p>
        <p style={{ fontSize:13, color:'#888', marginBottom:28 }}>Products appear on homepage immediately after upload.</p>

        {/* Image drop zone */}
        <div onClick={() => ref.current?.click()}
          style={{ border:'2px dashed #D4C9B8', borderRadius:16, padding:24, textAlign:'center', cursor:'pointer',
            background: preview ? '#fff' : '#FAFAFA', marginBottom:20, minHeight:160,
            display:'flex', alignItems:'center', justifyContent:'center' }}>
          <input ref={ref} type="file" accept="image/*" onChange={pick} style={{ display:'none' }}/>
          {preview
            ? <img src={preview} style={{ maxHeight:200, maxWidth:'100%', borderRadius:10, objectFit:'contain' }}/>
            : <div style={{ color:'#9AA0A6' }}>
                <div style={{ fontSize:36, marginBottom:8 }}>🖼</div>
                <div style={{ fontWeight:600, color:'#555' }}>Click to pick image</div>
              </div>
          }
        </div>

        {/* Fields */}
        {[
          { label:'Product Name *', key:'name', placeholder:'e.g. MIKA 8KG Washing Machine' },
          { label:'Price (KES) *',  key:'price', placeholder:'e.g. 45000', type:'number' },
          { label:'Stock',          key:'stock', placeholder:'10', type:'number' },
        ].map(f => (
          <div key={f.key} style={{ marginBottom:14 }}>
            <label style={{ display:'block', fontWeight:600, fontSize:13, color:'#333', marginBottom:5 }}>{f.label}</label>
            <input type={f.type || 'text'} placeholder={f.placeholder}
              value={(form as any)[f.key]} onChange={e => setForm(p => ({ ...p, [f.key]: e.target.value }))}
              style={{ width:'100%', padding:'11px 14px', borderRadius:10, border:'1px solid #DDD', fontSize:14, boxSizing:'border-box', background:'#fff' }}/>
          </div>
        ))}

        <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:12, marginBottom:14 }}>
          <div>
            <label style={{ display:'block', fontWeight:600, fontSize:13, color:'#333', marginBottom:5 }}>Brand</label>
            <select value={form.brand} onChange={e => setForm(p => ({ ...p, brand: e.target.value }))}
              style={{ width:'100%', padding:'11px 14px', borderRadius:10, border:'1px solid #DDD', fontSize:14, background:'#fff' }}>
              {BRANDS.map(b => <option key={b}>{b}</option>)}
            </select>
          </div>
          <div>
            <label style={{ display:'block', fontWeight:600, fontSize:13, color:'#333', marginBottom:5 }}>Category</label>
            <select value={form.category} onChange={e => setForm(p => ({ ...p, category: e.target.value }))}
              style={{ width:'100%', padding:'11px 14px', borderRadius:10, border:'1px solid #DDD', fontSize:14, background:'#fff' }}>
              {CATS.map(c => <option key={c}>{c}</option>)}
            </select>
          </div>
        </div>

        <label style={{ display:'flex', alignItems:'center', gap:10, marginBottom:20, cursor:'pointer' }}>
          <input type="checkbox" checked={form.featured} onChange={e => setForm(p => ({ ...p, featured: e.target.checked }))}
            style={{ width:16, height:16 }}/>
          <span style={{ fontSize:13, fontWeight:600, color:'#333' }}>Show in Featured section on homepage</span>
        </label>

        {status && (
          <div style={{ padding:'12px 16px', borderRadius:10, marginBottom:16, fontSize:13, fontWeight:500,
            background: status.startsWith('✓') ? 'rgba(22,101,52,0.08)' : status.startsWith('Error') ? 'rgba(220,38,38,0.07)' : 'rgba(139,90,26,0.08)',
            color: status.startsWith('✓') ? '#166534' : status.startsWith('Error') ? '#dc2626' : '#8B5A1A',
            border: `1px solid ${status.startsWith('✓') ? 'rgba(22,101,52,0.2)' : status.startsWith('Error') ? 'rgba(220,38,38,0.15)' : 'rgba(139,90,26,0.18)'}` }}>
            {status}
          </div>
        )}

        <button onClick={submit} disabled={!form.name || !form.price || !img}
          style={{ width:'100%', padding:'15px', borderRadius:12, background:'#0C0C0C', color:'#FFFFFF',
            fontWeight:700, fontSize:15, border:'none', cursor:'pointer', opacity: (!form.name||!form.price||!img) ? 0.4 : 1 }}>
          Upload Product
        </button>

        {done.length > 0 && (
          <div style={{ marginTop:28 }}>
            <p style={{ fontWeight:700, fontSize:14, color:'#333', marginBottom:12 }}>✓ {done.length} product{done.length>1?'s':''} uploaded</p>
            {done.map((d,i) => (
              <div key={i} style={{ display:'flex', alignItems:'center', gap:12, padding:'10px 14px', borderRadius:10, background:'#fff', border:'1px solid #E8E8E8', marginBottom:8 }}>
                {d.url && <img src={d.url} style={{ width:44, height:44, objectFit:'contain', borderRadius:8, background:'#F5F5F5' }}/>}
                <span style={{ fontSize:13, fontWeight:600, color:'#0C0C0C' }}>{d.name}</span>
                <span style={{ marginLeft:'auto', fontSize:11, color:'#22c55e', fontWeight:700 }}>LIVE</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
