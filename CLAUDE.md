# CLAUDE.md

Project conventions live in **@AGENTS.md** — read it. The same rules apply to Claude Code
and every other agent, so there is one source of truth.

## The rule you must never break

All UI text lives in `src/translations/en.json` — never hardcode display text in `.tsx`.
Use `node scripts/merge-keys.mjs <patch.json>` and confirm with `npm run i18n:check`.

The site is **English only for now**. Bahasa Malaysia and 简体中文 are paused, their
dictionaries parked in `.archive/translations/`. `LANGUAGES` in `src/lib/i18n.ts` is the
only switch — see @AGENTS.md for how to turn them back on. While a language is off,
do not write `ms`/`zh` entries into patch files: the merge script writes exactly the
languages that are configured.

Numbers, company names and hospital names are **not** translations — they live in
`src/data/*.ts`. See @AGENTS.md for why, plus the inline-markup markers, the routing
model, and the motion rules.
