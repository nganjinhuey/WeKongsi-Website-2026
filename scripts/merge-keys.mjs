/**
 * Merges a patch file of the shape { "<dotted.key>": { en, ms, zh } } into the three
 * translation dictionaries at once. Writing all three languages in one record is what
 * keeps them in sync — there is no way to add an English string here and forget the
 * other two, because a missing language is a hard error.
 *
 *   node scripts/merge-keys.mjs scratch/patch-footer.json
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
const patchPath = process.argv[2];
if (!patchPath) {
  console.error("usage: node scripts/merge-keys.mjs <patch.json>");
  process.exit(1);
}

const patch = JSON.parse(fs.readFileSync(patchPath, "utf8"));
const dicts = Object.fromEntries(
  LANGS.map((l) => [l, JSON.parse(fs.readFileSync(path.join("src/translations", `${l}.json`), "utf8"))]),
);

const setDeep = (obj, key, value) => {
  const parts = key.split(".");
  let cur = obj;
  for (let i = 0; i < parts.length - 1; i++) {
    if (typeof cur[parts[i]] !== "object" || cur[parts[i]] === null || Array.isArray(cur[parts[i]])) {
      cur[parts[i]] = {};
    }
    cur = cur[parts[i]];
  }
  cur[parts[parts.length - 1]] = value;
};

let added = 0;
for (const [key, translations] of Object.entries(patch)) {
  const missing = LANGS.filter((l) => translations[l] === undefined);
  if (missing.length) {
    console.error(`✗ ${key} is missing: ${missing.join(", ")}`);
    process.exit(1);
  }
  for (const l of LANGS) setDeep(dicts[l], key, translations[l]);
  added++;
}

for (const l of LANGS) {
  fs.writeFileSync(path.join("src/translations", `${l}.json`), JSON.stringify(dicts[l], null, 2) + "\n");
}
console.log(`merged ${added} keys × ${LANGS.length} language${LANGS.length === 1 ? "" : "s"}`);
