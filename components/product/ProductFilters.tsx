'use client';

import { useRouter, usePathname } from 'next/navigation';
import { CATEGORIES } from '@/constants/categories';

const PRICES = [
  { label: 'Under KES 5,000',  min: '0',     max: '5000'  },
  { label: 'KES 5K – 10K',     min: '5000',  max: '10000' },
  { label: 'KES 10K – 25K',    min: '10000', max: '25000' },
  { label: 'KES 25K – 50K',    min: '25000', max: '50000' },
  { label: 'Over KES 50,000',  min: '50000', max: ''      },
];

export function ProductFilters({ searchParams }: { searchParams: Record<string,string|undefined> }) {
  const router   = useRouter();
  const pathname = usePathname();

  const set = (key: string, val: string | null) => {
    const p = new URLSearchParams(searchParams as Record<string,string>);
    val ? p.set(key, val) : p.delete(key);
    p.delete('page');
    router.push(`${pathname}?${p}`);
  };

  const hasFilters = !!(searchParams.category || searchParams.minPrice || searchParams.brand);

  return (
    <div className="bg-white rounded-2xl border border-cream-warm p-5 space-y-6 sticky top-[88px]">
      <div className="flex justify-between items-center">
        <span className="font-semibold text-sm text-ink">Filters</span>
        {hasFilters && (
          <button onClick={() => router.push(pathname)}
            className="text-xs text-ink-faint hover:text-ink underline-offset-2 hover:underline transition-colors">
            Clear all
          </button>
        )}
      </div>

      {/* Category */}
      <div>
        <p className="overline text-ink/40 mb-3">Category</p>
        <div className="space-y-0.5">
          {CATEGORIES.map(cat => (
            <div key={cat.slug}>
              <button
                onClick={() => set('category', searchParams.category === cat.enum ? null : cat.enum)}
                className={[
                  'w-full text-left px-3 py-2.5 rounded-xl text-sm transition-all font-medium',
                  searchParams.category === cat.enum
                    ? 'bg-ink text-cream'
                    : 'text-ink-muted hover:bg-cream-warm hover:text-ink',
                ].join(' ')}>
                {cat.name}
              </button>
              {searchParams.category === cat.enum && (
                <div className="pl-3 mt-0.5 space-y-0.5">
                  {cat.subcategories.map(sub => (
                    <button
                      key={sub.slug}
                      onClick={() => set('subcategory', searchParams.subcategory === sub.slug ? null : sub.slug)}
                      className={[
                        'w-full text-left px-3 py-2 rounded-lg text-xs transition-all',
                        searchParams.subcategory === sub.slug
                          ? 'bg-ink/90 text-cream font-semibold'
                          : 'text-ink-faint hover:bg-cream-warm hover:text-ink',
                      ].join(' ')}>
                      {sub.name}
                    </button>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Price */}
      <div>
        <p className="overline text-ink/40 mb-3">Price Range</p>
        <div className="space-y-0.5">
          {PRICES.map(({ label, min, max }) => {
            const active = searchParams.minPrice === min && (searchParams.maxPrice ?? '') === max;
            return (
              <button key={label}
                onClick={() => {
                  if (active) { set('minPrice', null); set('maxPrice', null); }
                  else        { set('minPrice', min);  set('maxPrice', max || null); }
                }}
                className={[
                  'w-full text-left px-3 py-2.5 rounded-xl text-sm transition-all',
                  active ? 'bg-ink text-cream font-medium' : 'text-ink-muted hover:bg-cream-warm hover:text-ink',
                ].join(' ')}>
                {label}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
