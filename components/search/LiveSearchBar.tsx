'use client';

import { useState, useEffect, useRef, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { formatPrice } from '@/lib/format';

interface SearchResult {
  id: string;
  sku: string;
  name: string;
  brand: string;
  category: string;
  price: number;
  comparePrice?: number;
  images: string[];
  stock: number;
}

const POPULAR_SEARCHES = [
  'Hisense 4K Smart TV',
  'Double Door Fridge',
  'HP Core i5 Laptop',
  'Front Load Washing Machine',
  'Ramtons Cooker',
  'Samsung OLED TV',
];

export function LiveSearchBar({
  placeholder = 'Search products, brands, models…',
  autoFocus = false,
  onClose,
  isMobileModal = false,
}: {
  placeholder?: string;
  autoFocus?: boolean;
  onClose?: () => void;
  isMobileModal?: boolean;
}) {
  const router = useRouter();
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const [, startTransition] = useTransition();

  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const debounceTimer = useRef<NodeJS.Timeout | null>(null);

  // Auto-focus support
  useEffect(() => {
    if (autoFocus) {
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [autoFocus]);

  // Click outside listener
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Live fetch with debounce
  useEffect(() => {
    const q = query.trim();
    if (q.length < 2) {
      setResults([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    if (debounceTimer.current) clearTimeout(debounceTimer.current);

    debounceTimer.current = setTimeout(async () => {
      try {
        const res = await fetch(`/api/products?search=${encodeURIComponent(q)}&limit=6`);
        const json = await res.json();
        if (json.success && json.data?.products) {
          setResults(json.data.products);
        } else {
          setResults([]);
        }
      } catch (err) {
        console.error('Search fetch error:', err);
        setResults([]);
      } finally {
        setLoading(false);
      }
    }, 180);

    return () => {
      if (debounceTimer.current) clearTimeout(debounceTimer.current);
    };
  }, [query]);

  const handleSearchSubmit = (searchQuery: string) => {
    const q = searchQuery.trim();
    if (!q) return;
    setIsOpen(false);
    if (onClose) onClose();
    startTransition(() => {
      router.push(`/products?search=${encodeURIComponent(q)}`);
    });
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev < results.length - 1 ? prev + 1 : 0));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev > 0 ? prev - 1 : results.length - 1));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (selectedIndex >= 0 && results[selectedIndex]) {
        const selected = results[selectedIndex];
        setIsOpen(false);
        if (onClose) onClose();
        router.push(`/products/${encodeURIComponent(selected.sku)}`);
      } else {
        handleSearchSubmit(query);
      }
    } else if (e.key === 'Escape') {
      setIsOpen(false);
      if (onClose) onClose();
    }
  };

  return (
    <div ref={containerRef} className="relative w-full">
      {/* Search Input Form */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSearchSubmit(query);
        }}
        className="relative w-full"
      >
        <div className="relative flex items-center">
          <svg
            className="absolute left-3.5 sm:left-4 w-4 h-4 text-gray-400 pointer-events-none"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>

          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setIsOpen(true);
              setSelectedIndex(-1);
            }}
            onFocus={() => setIsOpen(true)}
            onKeyDown={handleKeyDown}
            placeholder={placeholder}
            className={`w-full pl-10 sm:pl-11 pr-10 py-2 sm:py-2.5 rounded-full text-sm bg-gray-100/90 border border-gray-200/80
                       text-gray-900 placeholder-gray-400 focus:bg-white focus:border-orange-400 focus:ring-2 focus:ring-orange-400/20
                       outline-none transition-all duration-200 ${isMobileModal ? 'py-3 text-base' : ''}`}
          />

          {/* Clear or Loading Spinner */}
          <div className="absolute right-3.5 flex items-center">
            {loading ? (
              <svg className="w-4 h-4 text-orange-500 animate-spin" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
              </svg>
            ) : query ? (
              <button
                type="button"
                onClick={() => {
                  setQuery('');
                  setResults([]);
                  inputRef.current?.focus();
                }}
                className="p-1 rounded-full text-gray-400 hover:text-gray-600 hover:bg-gray-200/60 transition-colors"
              >
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            ) : null}
          </div>
        </div>
      </form>

      {/* Live Dropdown Results */}
      {isOpen && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden z-50 animate-fadeIn">
          {/* Results List */}
          {results.length > 0 ? (
            <div className="py-2">
              <div className="px-4 py-1.5 flex items-center justify-between text-[11px] font-bold text-gray-400 uppercase tracking-wider">
                <span>Matching Products</span>
                <span>{results.length} results</span>
              </div>

              <div className="divide-y divide-gray-50 max-h-[380px] overflow-y-auto hide-scrollbar">
                {results.map((product, idx) => {
                  const isSelected = idx === selectedIndex;
                  const img = product.images?.[0] || '';
                  return (
                    <Link
                      key={product.id || product.sku}
                      href={`/products/${encodeURIComponent(product.sku)}`}
                      onClick={() => {
                        setIsOpen(false);
                        if (onClose) onClose();
                      }}
                      className={`flex items-center gap-3.5 px-4 py-2.5 transition-colors ${
                        isSelected ? 'bg-orange-50/80 text-gray-900' : 'hover:bg-gray-50/90 text-gray-800'
                      }`}
                    >
                      {/* Thumbnail */}
                      <div className="relative w-12 h-12 rounded-xl bg-gray-50 border border-gray-100 overflow-hidden shrink-0 flex items-center justify-center">
                        {img ? (
                          <Image src={img} alt={product.name} fill sizes="48px" className="object-contain p-1" />
                        ) : (
                          <span className="text-lg">📦</span>
                        )}
                      </div>

                      {/* Info */}
                      <div className="flex-1 min-w-0">
                        {product.brand && (
                          <span className="text-[10px] font-bold tracking-wider text-orange-600 uppercase">
                            {product.brand}
                          </span>
                        )}
                        <p className="text-xs font-semibold text-gray-900 truncate leading-snug">{product.name}</p>
                        <p className="text-xs font-bold text-gray-900 mt-0.5">{formatPrice(product.price)}</p>
                      </div>

                      {/* Arrow */}
                      <svg className="w-4 h-4 text-gray-300 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </Link>
                  );
                })}
              </div>

              {/* View All Results Button */}
              <div className="p-2 border-t border-gray-100 bg-gray-50/60">
                <button
                  type="button"
                  onClick={() => handleSearchSubmit(query)}
                  className="w-full py-2 px-4 rounded-xl text-xs font-bold text-orange-600 hover:bg-orange-50 transition-colors flex items-center justify-center gap-1.5"
                >
                  <span>See all results for &ldquo;{query}&rdquo;</span>
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </button>
              </div>
            </div>
          ) : query.trim().length >= 2 && !loading ? (
            /* No Results */
            <div className="p-6 text-center">
              <p className="text-sm font-semibold text-gray-800 mb-1">No products found for &ldquo;{query}&rdquo;</p>
              <p className="text-xs text-gray-500 mb-4">Try checking spelling or use broader keywords.</p>
              <button
                type="button"
                onClick={() => handleSearchSubmit(query)}
                className="px-4 py-2 rounded-xl text-xs font-bold bg-gray-900 text-white hover:bg-black transition-colors"
              >
                Search all catalog
              </button>
            </div>
          ) : (
            /* Popular Quick Searches */
            <div className="p-4">
              <p className="text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-2.5">
                Popular Searches
              </p>
              <div className="flex flex-wrap gap-1.5">
                {POPULAR_SEARCHES.map((item) => (
                  <button
                    key={item}
                    type="button"
                    onClick={() => {
                      setQuery(item);
                      handleSearchSubmit(item);
                    }}
                    className="px-3 py-1.5 rounded-full text-xs font-medium bg-gray-100 text-gray-700 hover:bg-orange-50 hover:text-orange-600 hover:border-orange-200 border border-transparent transition-all"
                  >
                    {item}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
