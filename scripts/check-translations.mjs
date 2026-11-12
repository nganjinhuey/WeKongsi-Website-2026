/**
 * Parity check: all three dictionaries must carry exactly the same key set. An English
 * string without its Bahasa Malaysia and Chinese counterparts is a bug, not a to-do —
 * the runtime falls back to English, so the gap is otherwise invisible in the browser.
 */
import fs from "node:fs";
import path from "node:path";

/**
 * The languages to check, read from the app's own list so this script and the site can
 * never disagree about what ships. Add a language to LANGUAGES in src/lib/i18n.ts and
 * it is checked here automatically.
 */
const LANGS = (() => {
  const src = fs.readFileSync("src/lib/i18n.ts", "utf8");
  const m = src.match(/export const LANGUAGES = \[([^\]]*)\]/);
  if (!m) {
    console.error("✗ could not read LANGUAGES from src/lib/i18n.ts");
    process.exit(1);
  }
  return [...m[1].matchAll(/"([a-z-]+)"/g)].map((x) => x[1]);
})();
const flatten = (obj, prefix = "") =>
  Object.entries(obj).flatMap(([k, v]) =>
    v && typeof v === "object" && !Array.isArray(v) ? flatten(v, `${prefix}${k}.`) : [`${prefix}${k}`],
  );

const keys = Object.fromEntries(
  LANGS.map((l) => [
    l,
    new Set(flatten(JSON.parse(fs.readFileSync(path.join("src/translations", `${l}.json`), "utf8")))),
  ]),
);

let failed = false;
for (const l of LANGS) {
  for (const other of LANGS) {
    if (l === other) continue;
    const missing = [...keys[l]].filter((k) => !keys[other].has(k));
    if (missing.length) {
      failed = true;
      console.error(`✗ ${other}.json is missing ${missing.length} key(s) present in ${l}.json:`);
      for (const k of missing.slice(0, 25)) console.error(`    ${k}`);
      if (missing.length > 25) console.error(`    …and ${missing.length - 25} more`);
    }
  }
}

if (failed) process.exit(1);
console.log(
  `✓ translations in sync — ${keys.en.size} keys × ${LANGS.length} language${LANGS.length === 1 ? "" : "s"}`,
);
