// Tests the real ranking module in lib/search.ts — no duplicated logic.
//   node tests/search.test.mjs
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const here = dirname(fileURLToPath(import.meta.url));
const src  = readFileSync(join(here, '..', 'lib', 'search.ts'), 'utf8');

// Strip TypeScript annotations so the module runs under plain node.
const js = src
  .replace(/export interface[\s\S]*?\n}\n/g, '')      // drop the interface
  .replace(/<T extends Searchable>/g, '')              // drop generics
  .replace(/:\s*[A-Za-z_][\w.<>\[\]| ]*(?=\s*[,)])/g, '') // param types
  .replace(/\)\s*:\s*[A-Za-z_][\w.<>\[\]| ]*\s*\{/g, ') {') // return types
  .replace(/\bexport\s+/g, '');

const mod = new Function(`${js}; return { norm, scoreProduct, rankBySearch };`)();
const { scoreProduct, rankBySearch } = mod;

// ── Realistic catalogue ────────────────────────────────────────────────────
const CATALOG = [
  { name: 'Hisense 43" Smart TV',        brand: 'Hisense', sku: 'HIS-TV-43',    description: 'Full HD smart television with Netflix' },
  { name: 'Hisense 43" Smart TV Bundle', brand: 'Hisense', sku: 'HIS-TV-43-BN', description: 'TV plus wall mount and HDMI cable' },
  { name: 'Hisense 55" Smart TV',        brand: 'Hisense', sku: 'HIS-TV-55',    description: '4K UHD television' },
  { name: 'Samsung Galaxy A54',          brand: 'Samsung', sku: 'SAM-A54',      description: 'Smartphone with 128GB storage' },
  { name: 'Samsung Galaxy A54 Case',     brand: 'Samsung', sku: 'SAM-A54-CS',   description: 'Protective case' },
  { name: 'Mika Washing Machine 8KG',    brand: 'Mika',    sku: 'MIKA-WM-8KG',  description: 'Front load washer' },
  { name: 'Ramtons Blender 1.5L',        brand: 'Ramtons', sku: 'RAM-BL-15',    description: 'Glass jar blender for smoothies' },
  { name: 'HP Pavilion 15',              brand: 'HP',      sku: 'HP-PAV-15',    description: 'Laptop with Netflix preinstalled and TV out' },
  { name: 'JBL Flip 6 Speaker',          brand: 'JBL',     sku: 'JBL-FL6',      description: 'Bluetooth speaker' },
  { name: 'Von Hotpoint Fridge 200L',    brand: 'Von Hotpoint', sku: 'VON-FR-200', description: 'Double door refrigerator' },
];

// ── Test harness ───────────────────────────────────────────────────────────
let pass = 0, fail = 0;
const results = [];

function test(desc, fn) {
  try { fn(); pass++; results.push(['PASS', desc, '']); }
  catch (e) { fail++; results.push(['FAIL', desc, e.message]); }
}
function eq(actual, expected, label = '') {
  const a = JSON.stringify(actual), b = JSON.stringify(expected);
  if (a !== b) throw new Error(`${label} expected ${b}, got ${a}`);
}
const names = (q) => rankBySearch(CATALOG, q).map(p => p.name);

// ══ 1. EXACT MATCH RANKS FIRST ══
test('exact product name is the #1 result', () => {
  eq(names('Hisense 43" Smart TV')[0], 'Hisense 43" Smart TV');
});
test('exact name beats longer name containing it', () => {
  const r = names('Hisense 43" Smart TV');
  if (r.indexOf('Hisense 43" Smart TV') >= r.indexOf('Hisense 43" Smart TV Bundle'))
    throw new Error('bundle ranked at or above exact match');
});
test('exact SKU returns that product first', () => {
  eq(names('MIKA-WM-8KG')[0], 'Mika Washing Machine 8KG');
});
test('SKU lookup is punctuation-insensitive', () => {
  eq(names('mika wm 8kg')[0], 'Mika Washing Machine 8KG');
});
test('exact "brand + name" ranks top', () => {
  eq(names('Samsung Samsung Galaxy A54')[0], 'Samsung Galaxy A54');
});

// ══ 2. DESCRIPTION NOISE IS SUPPRESSED ══
test('description-only hit does not outrank a name match', () => {
  const r = names('TV');
  if (r[0] === 'HP Pavilion 15')
    throw new Error('laptop (desc-only "TV out") outranked actual TVs');
});
test('Netflix (description only) still findable but ranked last', () => {
  const r = names('Netflix');
  if (r.length === 0) throw new Error('description match should still return results');
  const scores = r.map(p => scoreProduct(p, 'Netflix'));
  if (Math.max(...scores) > 60) throw new Error('description-only match scored too high');
});

// ══ 3. ALL WORDS MUST MATCH (AND, not OR) ══
test('multi-word query requires every word', () => {
  const r = names('Hisense blender');
  eq(r, [], 'no product is both Hisense and a blender');
});
test('word order does not matter', () => {
  const a = names('washing mika');
  const b = names('mika washing');
  eq(a[0], b[0]);
  eq(a[0], 'Mika Washing Machine 8KG');
});

// ══ 4. NO MATCH = EMPTY, NOT EVERYTHING ══
test('nonsense query returns nothing', () => {
  eq(names('zzzzqqq'), []);
});
test('empty query returns nothing', () => {
  eq(names(''), []);
  eq(names('   '), []);
});

// ══ 5. BRAND QUERIES ══
test('brand query returns all of that brand', () => {
  const r = names('Hisense');
  if (r.length !== 3) throw new Error(`expected 3 Hisense products, got ${r.length}`);
});
test('multi-word brand works', () => {
  eq(names('Von Hotpoint')[0], 'Von Hotpoint Fridge 200L');
});

// ══ 6. CASE / PUNCTUATION INSENSITIVITY ══
test('case insensitive', () => {
  eq(names('HISENSE 43" SMART TV')[0], names('hisense 43 smart tv')[0]);
});
test('quotes and punctuation ignored', () => {
  eq(names('Hisense 43 Smart TV')[0], 'Hisense 43" Smart TV');
});

// ══ 7. PREFIX + PHRASE ══
test('prefix match ranks above scattered-word match', () => {
  const prefix   = scoreProduct(CATALOG[3], 'Samsung Galaxy');
  const scattered = scoreProduct(CATALOG[3], 'Samsung 128GB');
  if (prefix <= scattered) throw new Error('prefix should outrank scattered');
});

// ══ 8. TIE-BREAK: SHORTER NAME WINS ══
test('on equal score the shorter/more specific name wins', () => {
  const r = names('Samsung Galaxy A54');
  eq(r[0], 'Samsung Galaxy A54');
});

// ══ 9. STABILITY ══
test('ranking is deterministic across runs', () => {
  eq(names('smart tv'), names('smart tv'));
});
test('no product appears twice', () => {
  const r = names('Hisense');
  eq(r.length, new Set(r).size);
});
test('null/undefined description does not crash', () => {
  const odd = [{ name: 'Widget', brand: 'X', sku: 'W1' }];
  eq(rankBySearch(odd, 'widget').length, 1);
});

// ── Report ─────────────────────────────────────────────────────────────────
console.log('\n══ SEARCH RANKING TESTS ══\n');
for (const [status, desc, err] of results) {
  console.log(`  ${status === 'PASS' ? '✅' : '❌'} ${desc}`);
  if (err) console.log(`       ${err}`);
}
console.log(`\n  ${pass} passed, ${fail} failed\n`);

console.log('── Sample rankings ──');
for (const q of ['Hisense 43" Smart TV', 'smart tv', 'samsung', 'blender', 'TV']) {
  console.log(`  "${q}"`.padEnd(26), '→', names(q).slice(0, 3).join('  |  ') || '(none)');
}
process.exit(fail ? 1 : 0);
