# AGENTS.md — project conventions

Rules for anyone (human or AI) editing this repo. Read this before touching user-facing
text or adding a page.

## 🌐 The translation rule (most important)

The site currently ships **English only**. Bahasa Malaysia and 简体中文 are paused — their
dictionaries are parked in `.archive/translations/` and the site does not build them.

**The machinery is untouched, so this is still a translated site with one language in
it.** Every piece of UI text is a key in `src/translations/en.json`, never a literal in a
`.tsx` file:

```tsx
import { useTranslation } from "@/hooks/useTranslation";

const { t, tList } = useTranslation();
<h1>{t("site.hero.title")}</h1>
<p>{t("tr.summary.basedOn", { count: 1847 })}</p>   // {{count}} interpolation
{tList("cov.excl.list").map(…)}                     // list-valued keys
```

Add or change a string through a patch file and the merge script, which writes every
language currently configured and refuses if one is missing:

```jsonc
// scratch/patch-thing.json
{ "thing.title": { "en": "…" } }
```
```bash
node scripts/merge-keys.mjs scratch/patch-thing.json
npm run i18n:check      # key parity + inline-markup usage
```

### Turning a language back on

`LANGUAGES` in `src/lib/i18n.ts` is the single source of truth — routes, the sitemap,
hreflang alternates, the language switcher and all three check scripts read it. To
restore Bahasa Malaysia and Chinese:

1. Copy `ms.json` and `zh.json` back from `.archive/translations/` into
   `src/translations/`.
2. Add `"ms"` and `"zh"` to `LANGUAGES`.

Nothing else changes. The URL prefix logic (`/ms/about`), the switcher and the parity
checks all come back by themselves, and `npm run i18n:check` will then tell you about
any key added to English while they were paused.

`t()` falls back to English when a key is missing in another language. That is a safety
net so a gap degrades to readable English rather than a raw key on screen — it is **not**
an excuse to skip a translation once a language is back on.

## Inline markup in copy

Translation strings use three portable markers, rendered by `<RichText>`:

| Marker      | Renders as                                |
| ----------- | ----------------------------------------- |
| `[[text]]`  | brand-gradient accent span                |
| `**text**`  | semibold emphasis                         |
| `\n`        | line break                                |

A marked string dropped into JSX as a bare `{t("key")}` ships the literal brackets to the
page. `scripts/check-markup.mjs` catches that — it is part of `npm run i18n:check`. This
matters most where one language carries a marker another does not — invisible until
someone switches language, which is why the check runs over every configured language.

`SectionHeading` and `PageHero` render `title`, `lede` and `eyebrow` through `RichText`
already, so passing marked strings to them is safe.

## Numbers and proper nouns are not translations

Figures (`RM1,000,000`, `7,055`), company names and hospital names live in `src/data/*.ts`,
never in the translation files — a number that differs between languages is wrong in at
least two of them. Where a figure needs a phrase around it, the phrase is a key with a
`{{value}}` placeholder (`mem.common.perDayValue`) or a tagged cell value expanded by
`<CellValue>` (`perDay:RM150`).

## Routing

- English is the default and un-prefixed: `/`, `/coverage`, …
- Malay and Chinese sit behind a prefix: `/ms/coverage`, `/zh/coverage`.
- Every route is declared once in `src/lib/routes.ts`. The optional catch-all at
  `app/[[...slug]]/page.tsx` uses that list to pre-render all pages × all languages, to
  404 anything unknown, and to build the sitemap. **Adding a page means adding a route
  there, a view in `src/views/`, and an entry in `src/components/PageView.tsx`.**
- Link internally with the `href()` helper so the language prefix is preserved:
  ```tsx
  const { href } = useTranslation();
  <Link href={href("/coverage")}>…</Link>
  ```

## Motion

`<Reveal>` is the only scroll-entrance primitive. Its hidden state lives in CSS behind
`html.js`, not an inline `opacity: 0` — so with JavaScript blocked or slow the page is
fully visible rather than blank below the hero. Do not reintroduce inline hidden states
for below-the-fold content.

Above-the-fold headings animate on **transform only**. An element at `opacity: 0` is not
eligible for Largest Contentful Paint until it becomes visible, so fading in an `h1` makes
LCP wait for hydration.

## Stack

Next.js 15 (App Router) · React 19 · TypeScript · Tailwind · framer-motion · Radix.
`@/` → `src/`.

## Before committing

```bash
npm run check     # tsc + eslint + i18n parity + markup + production build
```
