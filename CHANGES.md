# Smartech Kenya — restructured

Every change below was validated against a real production build and a
running server, not eyeballed.

## Apply

1. Extract this zip **over** your repo folder, replacing when asked.
2. Double-click `PUSH.bat`.
3. Locally afterwards: `npm install` (dependencies changed).

`PUSH.bat` handles the deletions and moves an extract can't do, then
commits and pushes once.

---

## Test results

| Suite | Result |
|---|---|
| `node tests/search.test.mjs` | 20 / 20 |
| Rendered product-card HTML | 10 / 10 |
| Served-CSS assertions | 12 / 12 |
| Live production assertions | 14 / 14 |
| `npx next build` | clean, 31 routes |
| Route smoke test | 11 / 11 HTTP 200 |

---

## Structure

Before, `components/features/products/` nested three deep for one domain,
`lib/` had two byte-identical Prisma clients, and dead code sat beside live
code with nothing marking the difference.

```
app/
  (auth)/     login, register
  (legal)/    privacy, terms          <- grouped
  (shop)/     products, products/[slug], cart
  admin/  api/  contact/  track-order/  upload/  wishlist/
  icon.png  apple-icon.png            <- square, generated
components/
  layout/     Header, Footer, Providers
  product/    ProductCard, ProductList, ProductDetail,
              ProductFilters, AddToCartButton, FeaturedProducts
  search/     SearchBar
  ui/         Button
lib/
  cloudinary.ts   data access
  search.ts       ranking (pure, unit-tested)
  format.ts
constants/  categories.ts
store/      index.ts, slices/
types/      index.ts
tests/      search.test.mjs
```

URLs are unchanged — route groups `(legal)` and `(auth)` don't appear in
paths, so `/privacy` and `/terms` still resolve. Verified on a live server.

## Dead code removed

An import-graph scan found 19 orphaned files. Removed:

| Removed | Why |
|---|---|
| `lib/db/prisma.ts` | byte-identical duplicate of `lib/prisma.ts` |
| `lib/prisma.ts` | nothing imported it |
| `lib/auth/config.ts`, `lib/auth/password.ts` | NextAuth route is a 501 stub |
| `lib/validation/schemas.ts` | never imported |
| `lib/utils/errors.ts` | never imported; also the source of TS errors |
| `constants/index.ts`, `images.ts`, `heroImages.ts` | never imported |
| `prisma/` | schema + seeds for a DB nothing queries |

`app/api/auth/[...nextauth]/route.ts` and `app/api/register/route.ts` both
return 501 by design, and products come from Cloudinary — so the entire
database layer was dead weight. `prisma generate` was removed from the
build script: it ran on every deploy, downloaded engine binaries, and
generated a client nothing imported. Builds are faster and have one fewer
network failure point.

`next-auth` stays: `login/page.tsx` and `register/page.tsx` still call
`signIn()`.

**To restore the DB later:** `npm i prisma @prisma/client`, restore
`prisma/schema.prisma` from git history, and put `prisma generate &&`
back in the build script.

## Search extracted and genuinely tested

Ranking moved out of `lib/cloudinary.ts` into `lib/search.ts` as pure
functions. `tests/search.test.mjs` now loads that file directly, so the
tests cannot drift from shipped code — previously the test held a copy of
the logic and would have passed even if the real code changed.

Old behaviour: loose `includes()` over name, brand, SKU **and description**,
unranked — a laptop whose blurb said "TV out" came back for "TV", mixed in
with actual TVs.

| Score | Match |
|---|---|
| 1000 | exact product name |
| 900 | exact SKU |
| 800 | exact "brand + name" |
| 700 | name starts with query |
| 600 | name contains query as a phrase |
| 400 | every query word in the name |
| 250 | every query word in name + brand |
| 120 | query is exactly a brand |
| 60 | every query word anywhere, incl. description |

Score 0 is dropped. Ties break toward the shorter name.

Verified: `Hisense 43" Smart TV` ranks above `...TV Bundle`; `MIKA-WM-8KG`
and `mika wm 8kg` both resolve; `Hisense blender` returns **empty** (AND,
not OR); case, quotes and word order are ignored; missing `description`
doesn't crash.

## Two build-breaking bugs (both pre-existing)

**1. `app/admin/page.tsx` had a parse error**

```js
const BRANDS = const BRANDS = [
```

A syntax error breaks the build regardless of `typescript.ignoreBuildErrors`
— `main` was not deploying. Fixed, plus a stray `];;`.

**2. `next.config.js` used Next 15 syntax on Next 14.1**

`serverExternalPackages` only moved top-level in 14.2+. On 14.1 it was
silently ignored with a config warning. Moved back under
`experimental.serverComponentsExternalPackages`.

## Products page — panel removed

Hero header and filter sidebar gone from `app/(shop)/products/page.tsx`;
products are the first thing on screen, grid widened 3 -> 4 columns.
Confirmed live: zero occurrences of "Filters".

Homepage hero was `min-h-[88vh]`, so **no** products were visible on load.
Now 46vh mobile / 52vh desktop. Say the word if you'd rather it go entirely.

`ProductFilters.tsx` is kept — re-add the `<aside>` to bring filters back.

## Favicon — the actual problem

Next was serving your logo correctly all along. The real issue: the logo is
**256x115**, a wide wordmark, and squeezed into a 16px tab it was an
illegible smudge. I rendered it at 16px and 32px to confirm.

The distinctive mark is the letter **"S" on cart wheels**. Cropped square
and regenerated:

| File | Size | Notes |
|---|---|---|
| `app/icon.png` | 256x256 | transparent, adapts to light/dark tab bars |
| `app/apple-icon.png` | 180x180 | opaque — iOS rejects transparency |
| `public/favicon.ico` | multi-res | 16/24/32/48/64/128/256 |
| `public/favicon.png` | 256x256 | transparent |
| `public/logo.png` | 256x115 | **unchanged** — header wordmark |

Served HTML now reports `sizes="256x256"` and `sizes="180x180"`.

The `metadata.icons` block was removed — Next's file convention always
overrides it, so it was dead config.

## White theme

`tailwind.config.js`:

```
DEFAULT  #F5F0E8 -> #FFFFFF
warm     #EDE7D9 -> #F0F0F0
muted    #B8A99A -> #9AA0A6
dark     #8A7B6E -> #5F6368
```

Every `bg-cream` turns white from that one change. Then swept all remaining
hardcoded cream hex across `app/` and `components/`. Verified: zero
occurrences of `#F5F0E8` or `#EDE7D9` in source, served HTML, or served CSS.

## Bolder type

body 400 -> **500**; `h1`-`h6` -> **700** (confirmed to sit after Tailwind's
preflight reset, so it wins the cascade); product names `font-semibold`.

## Prices — bright blue, bold, never italic

```css
.price      /* #0066FF, weight 700, font-style: normal, tabular-nums */
.price-sm   /* 0.9375rem */
.price-md   /* 1.125rem  */
.price-lg   /* 1.5rem    */
.price-xl   /* 2rem      */
.price-was  /* grey, struck through, never italic */
```

Applied to all 14 price displays across ProductCard, ProductDetail,
`products/[slug]`, cart and wishlist.

**Where the italics came from:** prices used `font-display`, mapped to
Cormorant Garamond — a serif that ships italic cuts and was rendering them.
Beyond swapping every price class, there's a global guard:

```css
.font-display, [class*="font-display"] { font-style: normal !important; }
em, i { font-style: normal; }
```

`tabular-nums` aligns digits in the cart totals column.

Served markup:

```html
<span class="price price-md">KES 32,999</span>
<span class="price-was text-xs">KES 41,999</span>
```

Zero occurrences of "italic" in any served page.

Note: `ProductDetail.tsx` is currently **orphaned** — `products/[slug]`
renders its own inline markup. Both were fixed, so the page is correct
either way, but only the slug page's copy is live.

---

## Security

The GitHub token pasted earlier has full `repo` scope and travelled in
plain text. Revoke it at **Settings -> Developer settings -> Personal
access tokens** and issue a fresh one.
