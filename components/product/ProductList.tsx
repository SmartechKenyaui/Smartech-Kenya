import { listProducts }  from '@/lib/cloudinary';
import { ProductCard }    from './ProductCard';
import Link               from 'next/link';

interface SearchParams { [key: string]: string | undefined }

const TECH_ENUMS = ['SMARTPHONES','LAPTOPS','AUDIO_TV','SMART_HOME','ELECTRICAL','BEDROOM'];

export async function ProductList({ searchParams }: { searchParams: SearchParams }) {
  const category    = searchParams.category;
  const brand       = searchParams.brand;
  const search      = searchParams.search;
  const minPrice    = searchParams.minPrice ? parseFloat(searchParams.minPrice) : undefined;
  const maxPrice    = searchParams.maxPrice ? parseFloat(searchParams.maxPrice) : undefined;
  const page        = parseInt(searchParams.page ?? '1');
  const limit       = 12;

  // ── Fetch live products from Cloudinary ───────────────────────────────────
  // TECH is a virtual category grouping several enums; expand it for the query.
  let allProducts = await listProducts({ brand, search });

  // Category filtering (client-side after fetch, since listProducts may not
  // support the TECH virtual category or multi-enum filtering natively).
  if (category === 'TECH') {
    allProducts = allProducts.filter((p: any) => TECH_ENUMS.includes(p.category));
  } else if (category) {
    allProducts = allProducts.filter((p: any) => p.category === category);
  }

  if (searchParams.subcategory)
    allProducts = allProducts.filter((p: any) => p.subcategory === searchParams.subcategory);

  if (minPrice !== undefined) allProducts = allProducts.filter((p: any) => p.price >= minPrice);
  if (maxPrice !== undefined) allProducts = allProducts.filter((p: any) => p.price <= maxPrice);

  const total    = allProducts.length;
  const pages    = Math.ceil(total / limit);
  const products = allProducts.slice((page - 1) * limit, page * limit);

  if (products.length === 0) {
    return (
      <div className="text-center py-20 bg-white rounded-2xl border border-[#E8E8E8]">
        <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-[#F5F5F5] flex items-center justify-center">
          <svg className="w-7 h-7 text-ink-muted" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
          </svg>
        </div>
        <h3 className="font-semibold text-ink mb-1.5">No products found</h3>
        <p className="text-ink-faint text-sm mb-6">Try adjusting your filters or browse all products</p>
        <Link href="/products" className="btn-dark px-6 py-3 inline-flex">Clear filters</Link>
      </div>
    );
  }

  const buildPageUrl = (p: number) => {
    const params = new URLSearchParams(searchParams as Record<string, string>);
    params.set('page', String(p));
    return `/products?${params.toString()}`;
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-5">
        <p className="text-sm font-semibold text-ink-faint">
          <span className="font-bold text-ink">{total}</span> product{total !== 1 ? 's' : ''}
        </p>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 2xl:grid-cols-5 gap-3 sm:gap-4 lg:gap-5 mb-8">
        {products.map((p: any) => <ProductCard key={p.id} product={p}/>)}
      </div>

      {pages > 1 && (
        <div className="flex items-center justify-center gap-1.5 flex-wrap">
          {page > 1 && (
            <Link href={buildPageUrl(page - 1)}
              className="px-3 h-9 flex items-center justify-center rounded-xl text-sm border border-[#E8E8E8] text-ink-muted hover:border-ink/20 hover:text-ink transition-all">
              &#8592;
            </Link>
          )}
          {Array.from({ length: pages }, (_, i) => i + 1).map(n => (
            <Link key={n} href={buildPageUrl(n)}
              className={`w-9 h-9 flex items-center justify-center rounded-xl text-sm font-medium transition-all ${
                n === page
                  ? 'bg-ink text-cream'
                  : 'bg-white border border-[#E8E8E8] text-ink-muted hover:border-ink/20 hover:text-ink'
              }`}>
              {n}
            </Link>
          ))}
          {page < pages && (
            <Link href={buildPageUrl(page + 1)}
              className="px-3 h-9 flex items-center justify-center rounded-xl text-sm border border-[#E8E8E8] text-ink-muted hover:border-ink/20 hover:text-ink transition-all">
              &#8594;
            </Link>
          )}
        </div>
      )}
    </div>
  );
}
