'use client';

import { useState, useTransition } from 'react';
import { useRouter }                from 'next/navigation';

export function SearchBar() {
  const router              = useRouter();
  const [query,  setQuery]  = useState('');
  const [isPending, startTransition] = useTransition();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const q = query.trim();
    if (!q) return;
    startTransition(() => {
      router.push(`/products?search=${encodeURIComponent(q)}`);
    });
  };

  return (
    <form onSubmit={handleSubmit} className="relative group">
      <svg
        className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400"
        fill="none" stroke="currentColor" viewBox="0 0 24 24"
      >
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
      </svg>
      <input
        type="search"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search phones, TVs, blenders..."
        className="w-full pl-11 pr-4 py-3 bg-gray-50 border border-gray-100 rounded-2xl text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:border-gray-300 focus:bg-white transition-all"
      />
      {isPending && (
        <div className="absolute right-4 top-1/2 -translate-y-1/2">
          <svg className="w-4 h-4 text-gray-400 animate-spin" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
          </svg>
        </div>
      )}
    </form>
  );
}
