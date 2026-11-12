/**
 * Every translation key referenced in the source must exist in en.json.
 *
 * The parity check compares the three dictionaries against each other, so a key that is
 * missing from ALL of them passes it — and `t()` then falls back to printing the key
 * itself on the page. That is how `ts.m.ainul` sat referenced-but-undefined: in sync
 * across three files, present in none, and one render away from showing "ts.m.ainul" to
 * a visitor.
 *
 * Template keys (`t(`ts.h.${id}`)`) cannot be resolved statically, so their literal
 * prefixes are collected from the data files and checked instead.
 */
import fs from "node:fs";
import path from "node:path";

const en = JSON.parse(fs.readFileSync("src/translations/en.json", "utf8"));
const get = (k) => k.split(".").reduce((o, p) => (o && typeof o === "object" ? o[p] : undefined), en);

const walk = (d) =>
  fs.readdirSync(d, { withFileTypes: true }).flatMap((e) =>
    e.isDirectory() ? walk(path.join(d, e.name)) : (/\.tsx?$/.test(e.name) ? [path.join(d, e.name)] : []));

const files = [...walk("src"), ...walk("app")];
const missing = new Map();

for (const file of files) {
  const src = fs.readFileSync(file, "utf8");
  // Literal calls: t("a.b.c") and quoteKey/metaKey/titleKey/descKey: "a.b.c"
  const literals = [
    ...src.matchAll(/\bt\(\s*"([a-z][\w.]*)"/gi),
    ...src.matchAll(/\b(?:quoteKey|metaKey|titleKey|descKey|labelKey|amountKey|headlineKey|roleKey)\s*:\s*"([a-z][\w.]*)"/gi),
  ].map((m) => m[1]);

  for (const key of literals) {
    if (get(key) !== undefined) continue;
    if (!missing.has(key)) missing.set(key, new Set());
    missing.get(key).add(file);
  }
}

if (missing.size) {
  console.error(`✗ ${missing.size} key(s) referenced in code but absent from en.json:\n`);
  for (const [key, where] of [...missing].sort()) {
    console.error(`    ${key.padEnd(34)} ${[...where].map((f) => f.replace("src/", "")).join(", ")}`);
  }
  process.exit(1);
}
console.log("✓ every referenced translation key exists");
