# We Kongsi — website

The We Kongsi medical cost-sharing site, rebuilt as a Next.js application in English,
Bahasa Malaysia and Simplified Chinese.

```bash
npm install
npm run dev      # http://localhost:3000
```

| Script                | What it does                                              |
| --------------------- | --------------------------------------------------------- |
| `npm run dev`         | Dev server                                                 |
| `npm run build`       | Production build (pre-renders all 30 pages)                |
| `npm run start`       | Serve the production build                                 |
| `npm run lint`        | ESLint                                                     |
| `npm run i18n:check`  | Translation key parity + inline-markup usage               |
| `npm run check`       | Everything above, in order — run before committing         |

## What's here

Ten pages × three languages, all statically pre-rendered:

| Route             | View                         |
| ----------------- | ---------------------------- |
| `/`               | `src/views/Home.tsx`         |
| `/how-it-works`   | `src/views/HowItWorks.tsx`   |
| `/coverage`       | `src/views/Coverage.tsx`     |
| `/membership`     | `src/views/Membership.tsx`   |
| `/transparency`   | `src/views/Transparency.tsx` |
| `/hospital-info`  | `src/views/HospitalInfo.tsx` |
| `/about`          | `src/views/About.tsx`        |
| `/faq`            | `src/views/Faq.tsx`          |
| `/blog`           | `src/views/Blog.tsx`         |
| `/contact`        | `src/views/Contact.tsx`      |

English serves un-prefixed; Malay and Chinese sit under `/ms` and `/zh`.

## Layout of the code

```
app/
  [[...slug]]/page.tsx   one catch-all: resolves language + route, 404s the rest
  layout.tsx             root shell, fonts, header/footer
  sitemap.ts robots.ts   generated from src/lib/routes.ts
src/
  lib/routes.ts          every route, declared once
  lib/i18n.ts            language resolution, t(), path prefixing
  lib/seo.ts             per-page metadata + hreflang alternates
  translations/          en.json · ms.json · zh.json  (1,025 keys each)
  data/                  figures, names, tables — deliberately NOT translations
  components/sections/   page sections (Hero, CoverageGrid, CoShare, …)
  views/                 one file per page, composed from sections
scripts/
  merge-keys.mjs         add a key to all three languages at once
  check-translations.mjs key-parity check
  check-markup.mjs       catches inline markup rendered as plain text
```

## Conventions

Read **[AGENTS.md](AGENTS.md)** before editing copy or adding a page. The short version:
all display text is a translation key in all three languages; numbers and proper nouns
live in `src/data/`; routes are declared in `src/lib/routes.ts`.

## Content notes

Three things carried over from the previous site are worth a second look:

- **`src/data/transparency.ts`** publishes the April 2025 sharing report, which counts
  1,847 active members — while the homepage counters in `src/data/site.ts` state 7,055
  total members. Both figures came from the source site as-is. Refreshing the report will
  reconcile them.
- **`src/data/posts.ts`** carries three blog entries. The previous site listed six, but
  the other three still had unfilled `[PLACEHOLDER: …]` markers in their titles and
  summaries (dates, hospital counts, bill amounts), so they are not published here.
  Article pages themselves were never written; cards show "Coming soon" until an entry
  gets an `href`.
- The `/about` page previously showed a second statistic reading `[TBD] Needs Cases
  shared`. It is omitted rather than guessed at.

## Assets

`public/images/` holds ~70 images drawn from the source site's `assets/images/` folder,
resampled for the web. They cover the hero, app screenshots, 11 panel-hospital logos, 5
partner logos, the Shariah certificate, coverage and lifestyle photography, event photos,
member portraits for every testimonial, and portraits for all six leaders.

Nothing here is stock or external — it is the client's own library, which appeared empty
on first inspection because OneDrive was holding the files as cloud-only placeholders.

### ⚠️ Placeholder artwork with conflicting figures

Four images have **numbers printed into the artwork** from older marketing mockups. They
contradict the live site and each other, so they are placeholders pending fresh renders:

| Image | Figures baked in |
| --- | --- |
| `viz-sharing.jpg` *(not used — withdrawn)* | 7,995 members · RM 3,103,322.85 · 272 hospitals · 4,512 clinics |
| `app-dashboard.jpg` | 7,726 members · RM 3,103,272.85 · 4,512 clinics |
| `viz-record.jpg` *(used on /transparency)* | April 2026 · RM 304,700 · 6,094 active · 26 hospital · 587 clinic |
| `viz-documents.jpg` *(used as /transparency hero)* | Sept 2025 · RM 304,650 · 6,093 members · RM 63.27 |

For comparison, the live figures are **7,055 members · RM 4,548,932.85 · 293 hospitals ·
4,571 clinics** (`src/data/site.ts`) and the published report is **April 2025 · RM 78,800 ·
1,847 active members** (`src/data/transparency.ts`).

`viz-report.jpg` is the only explainer graphic with no figures on it, which is why it —
not the more detailed `viz-sharing.jpg` — sits under the homepage stats bar.

## Hero contrast

The homepage hero sets text over a photograph, so its legibility is measured rather than
eyeballed. `src/lib/hero-scrim.js` is the single source of truth for the scrim gradients
and the image's focal point — the component renders them as CSS and
`npm run hero:contrast` reconstructs the same compositing to check every pixel the copy
can occupy against WCAG AA, across 12 viewport widths and 6 hero heights. It needs no
browser and no server. Change the scrim and run it; it will tell you what broke.

## Design reference

The visual language follows **`EASY Landing Page/`** (a static HTML/CSS build). What was
taken from it:

| | |
| --- | --- |
| Brand ramp | turquoise `#00D6C4` → teal `#00BFAE` → deep `#008F89` |
| Navy | `#07133F`, with dark bands at `#071232` / `#050D26` |
| Accent ink | **`#03121B` on the bright pill** — not white |
| Bands | gradients, not flat fills: navy → teal-green with a teal radial bloom |
| Radii | card 24px, large 28px, pill 999px |
| Header | transparent over the hero, white glass once scrolled; nav is a centred floating pill |
| Shadows | `glow` on the accent pill, `card` / `float` on surfaces |

The dark-ink-on-accent rule is the important one. White on this teal measures 2.56–3.23:1
and failed WCAG AA for the entire life of the previous palette; `#03121B` on it measures
**9.1–12.0:1**. `scripts/check-hero-contrast.mjs` now gates solid fills as hard failures
rather than carrying that as a known exception.

Dark bands carry an `on-dark` class, which redefines the ink and surface custom properties
for everything inside (see `app/globals.css`). This is EASY's pattern: one set of
component styles, two sets of values — rather than every component branching on a prop.

### Earlier reference



Layout, motion and structure follow the INFII site kept in `INFII Website Reference/`
(excluded from the build, lint and type-check). The palette, logo and voice are We
Kongsi's own: navy `#16243a`, teal `#4a9d8e`, defined in `tailwind.config.ts`.
