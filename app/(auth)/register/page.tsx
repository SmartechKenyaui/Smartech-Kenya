'use client';

import { useState }  from 'react';
import { useForm }    from 'react-hook-form';
import { signIn }     from 'next-auth/react';
import { useRouter }  from 'next/navigation';
import Image from 'next/image';
import Link           from 'next/link';

type Form = { name: string; email: string; phone?: string; password: string; confirm: string };

export default function RegisterPage() {
  const router = useRouter();
  const [err,  setErr]  = useState('');
  const [busy, setBusy] = useState(false);
  const { register, handleSubmit, watch, formState: { errors } } = useForm<Form>();
  const pw = watch('password');

  const onSubmit = async (data: Form) => {
    setBusy(true); setErr('');
    try {
      const res  = await fetch('/api/register', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data) });
      const json = await res.json();
      if (!res.ok) { setErr(json.error ?? 'Registration failed.'); setBusy(false); return; }
      const login = await signIn('credentials', { email: data.email, password: data.password, redirect: false });
      if (login?.error) router.push('/login?registered=true');
      else { router.push('/'); router.refresh(); }
    } catch { setErr('Something went wrong.'); setBusy(false); }
  };

  return (
    <div className="min-h-screen bg-cream-warm flex items-center justify-center px-4 py-20">
      <div className="w-full max-w-[400px]">

        <Link href="/" className="flex justify-center mb-10">
          <Image src="/logo.png" alt="Smartech Kenya" width={160} height={44} className="object-contain" />
        </Link>

        <div className="bg-white rounded-3xl border border-cream-warm shadow-sm p-8">
          <h1 className="font-display text-ink text-3xl font-light mb-1">Create account</h1>
          <p className="text-ink-faint text-sm mb-7">Join Smartech Kenya today</p>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
            {err && <div className="bg-red-50 border border-red-100 text-red-600 text-sm px-4 py-3 rounded-xl">{err}</div>}

            {[
              { id: 'name',  label: 'Full name',       type: 'text',  ph: 'Jane Doe',        rules: { required: 'Required', minLength: { value: 2, message: 'Too short' } } },
              { id: 'email', label: 'Email address',   type: 'email', ph: 'you@example.com', rules: { required: 'Required', pattern: { value: /^\S+@\S+\.\S+$/, message: 'Invalid' } } },
              { id: 'phone', label: 'Phone (optional)',type: 'tel',   ph: '+254 7XX XXX XXX', rules: {} },
            ].map(({ id, label, type, ph, rules }) => (
              <div key={id}>
                <label className="block text-xs font-semibold text-ink-muted uppercase tracking-wide mb-2">{label}</label>
                <input type={type} placeholder={ph} {...register(id as any, rules)}
                  className="w-full px-4 py-3.5 rounded-xl border border-cream-warm bg-cream text-sm text-ink placeholder-cream-muted focus:outline-none focus:border-amber-luxe focus:ring-2 focus:ring-amber-luxe/10 transition-all"
                />
                {(errors as any)[id] && <p className="text-red-500 text-xs mt-1">{(errors as any)[id]?.message}</p>}
              </div>
            ))}

            <div>
              <label className="block text-xs font-semibold text-ink-muted uppercase tracking-wide mb-2">Password</label>
              <input type="password" placeholder="Min. 8 chars, 1 uppercase, 1 number"
                {...register('password', { required: 'Required', minLength: { value: 8, message: 'Min 8 chars' }, pattern: { value: /(?=.*[A-Z])(?=.*[0-9])/, message: 'Need uppercase & number' } })}
                className="w-full px-4 py-3.5 rounded-xl border border-cream-warm bg-cream text-sm text-ink placeholder-cream-muted focus:outline-none focus:border-amber-luxe focus:ring-2 focus:ring-amber-luxe/10 transition-all"
              />
              {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password.message}</p>}
            </div>

            <div>
              <label className="block text-xs font-semibold text-ink-muted uppercase tracking-wide mb-2">Confirm password</label>
              <input type="password" placeholder="••••••••"
                {...register('confirm', { required: 'Required', validate: v => v === pw || 'Passwords must match' })}
                className="w-full px-4 py-3.5 rounded-xl border border-cream-warm bg-cream text-sm text-ink placeholder-cream-muted focus:outline-none focus:border-amber-luxe focus:ring-2 focus:ring-amber-luxe/10 transition-all"
              />
              {errors.confirm && <p className="text-red-500 text-xs mt-1">{errors.confirm.message}</p>}
            </div>

            <button type="submit" disabled={busy}
              className="w-full py-3.5 bg-ink text-cream text-sm font-semibold rounded-xl hover:bg-ink-soft transition-all disabled:opacity-50 active:scale-[0.98] mt-2">
              {busy ? 'Creating account…' : 'Create account'}
            </button>
          </form>
        </div>

        <p className="text-center text-sm text-ink-faint mt-6">
          Have an account?{' '}
          <Link href="/login" className="text-ink font-semibold hover:underline">Sign in</Link>
        </p>
      </div>
    </div>
  );
}
