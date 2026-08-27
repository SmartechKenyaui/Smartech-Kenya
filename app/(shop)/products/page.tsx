import { Suspense }       from 'react';
import { ProductList }    from '@/components/product/ProductList';
import type { Metadata }  from 'next';

export const metadata: Metadata = { title: 'All Products — Smartech Kenya' };

export default function ProductsPage({ searchParams }: { searchParams: Record<string, string | undefined> }) {
  return (
    <div className="min-h-screen bg-white">
      {/* Products immediately — no hero panel, no filter sidebar */}
      <div className="max-w-[1440px] 2xl:max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 pt-6 pb-14">
        <Suspense fallback={<GridSkeleton />}>
          <ProductList searchParams={searchParams} />
        </Suspense>
      </div>
    </div>
  );
}

function GridSkeleton() {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 2xl:grid-cols-5 gap-3 sm:gap-4 lg:gap-5">
      {[...Array(12)].map((_, i) => (
        <div key={i} className="bg-white rounded-2xl overflow-hidden border border-[#E8E8E8]">
          <div className="aspect-[4/3] skeleton"/>
          <div className="p-4 space-y-2">
            <div className="h-3 skeleton w-1/3"/>
            <div className="h-4 skeleton"/>
            <div className="h-5 skeleton w-1/2"/>
          </div>
        </div>
      ))}
    </div>
  );
}
