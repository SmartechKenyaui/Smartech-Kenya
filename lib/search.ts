/**
 * Product search ranking.
 *
 * Exact matches always win. A query only matches if every word in it appears
 * somewhere in the product — this is an AND, not an OR, so "Hisense blender"
 * correctly returns nothing rather than every Hisense product plus every
 * blender.
 *
 * Kept in its own module so it can be unit-tested without touching Cloudinary.
 * See tests/search.test.mjs.
 */

export interface Searchable {
  name:         string;
  brand:        string;
  sku:          string;
  description?: string | null;
}

/** Lowercase, strip punctuation, collapse whitespace. */
export function norm(v: string): string {
  return (v ?? '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, ' ')
    .trim();
}

/**
 * Score a product against a query. Higher is better; 0 means no match.
 *
 *   1000  exact product name
 *    900  exact SKU
 *    800  exact "brand + name"
 *    700  name starts with the query
 *    600  name contains the query as a phrase
 *    400  every query word appears in the name
 *    250  every query word appears in name + brand
 *    120  query is exactly a brand
 *     60  every query word appears somewhere, incl. description
 */
export function scoreProduct(p: Searchable, rawQuery: string): number {
  const q = norm(rawQuery);
  if (!q) return 0;

  const name      = norm(p.name);
  const brand     = norm(p.brand);
  const sku       = norm(p.sku);
  const desc      = norm(p.description ?? '');
  const brandName = norm(`${p.brand} ${p.name}`);
  const haystack  = `${name} ${brand} ${sku} ${desc}`;

  const words = q.split(' ').filter(Boolean);
  const allIn = (target: string) => words.every(w => target.includes(w));

  if (name      === q)           return 1000;
  if (sku       === q)           return 900;
  if (brandName === q)           return 800;
  if (name.startsWith(q))        return 700;
  if (name.includes(q))          return 600;
  if (allIn(name))               return 400;
  if (allIn(`${name} ${brand}`)) return 250;
  if (brand     === q)           return 120;
  if (allIn(haystack))           return 60;

  return 0;
}

/**
 * Filter and sort by relevance. Non-matches are dropped entirely.
 * Ties break toward the shorter (more specific) name, then alphabetically,
 * so results are stable across requests.
 */
export function rankBySearch<T extends Searchable>(products: T[], query: string): T[] {
  return products
    .map(p => ({ p, score: scoreProduct(p, query) }))
    .filter(x => x.score > 0)
    .sort((a, b) =>
      b.score - a.score ||
      a.p.name.length - b.p.name.length ||
      a.p.name.localeCompare(b.p.name))
    .map(x => x.p);
}
