/**
 * Guards the inline-markup convention.
 *
 * Translation strings may carry `[[accent]]`, `**bold**` and line breaks, which only
 * <RichText> knows how to render. A string with those markers dropped into JSX as a bare
 * `{t("key")}` child ships the literal brackets to the page — and because English often
 * has no marker where Malay or Chinese does, the bug is invisible until someone switches
 * language. This finds those call sites.
 *
 *   node scripts/check-markup.mjs
 *
 * Safe by construction, and therefore skipped: values passed as props to the components
 * that render through RichText themselves (SectionHeading, PageHero), and anything
 * already inside a <RichText> element.
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

/** Props whose components render their value through RichText. */
const RICH_PROPS = ["title", "lede", "eyebrow"];

const flatten = (obj, prefix = "") =>
  Object.entries(obj).flatMap(([k, v]) =>
    v && typeof v === "object" && !Array.isArray(v)
      ? flatten(v, `${prefix}${k}.`)
      : [[`${prefix}${k}`, v]],
  );

const marked = new Set();
for (const lang of LANGS) {
  const dict = JSON.parse(fs.readFileSync(path.join("src/translations", `${lang}.json`), "utf8"));
  for (const [key, value] of flatten(dict)) {
    if (typeof value === "string" && /\[\[|\*\*|\n/.test(value)) marked.add(key);
  }
}

const walk = (dir) =>
  fs.readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) return walk(full);
    return entry.name.endsWith(".tsx") ? [full] : [];
  });

const files = [...walk("src"), ...walk("app")];

const BARE_CALL = /\{t\(\s*["'`]([\w.]+)["'`][^)]*\)\}/g;

const problems = [];
for (const file of files) {
  // Blank out RichText bodies (keeping line count intact) so the calls inside them are
  // not reported — they are exactly the correct usage.
  const source = fs
    .readFileSync(file, "utf8")
    .replace(/<RichText[\s\S]*?<\/RichText>/g, (block) => block.replace(/[^\n]/g, " "));

  source.split("\n").forEach((line, index) => {
    for (const match of line.matchAll(BARE_CALL)) {
      const key = match[1];
      if (!marked.has(key)) continue;

      // `title={t(...)}` and friends are props on a RichText-rendering component.
      const before = line.slice(0, match.index).trimEnd();
      const isRichProp = RICH_PROPS.some((prop) => before.endsWith(`${prop}=`));
      if (isRichProp) continue;

      problems.push(`${file}:${index + 1}  ${key}`);
    }
  });
}

if (problems.length) {
  console.error(`✗ ${problems.length} translation string(s) with inline markup rendered as plain text.`);
  console.error("  Wrap these in <RichText>:\n");
  for (const problem of problems) console.error(`    ${problem}`);
  process.exit(1);
}

console.log(`✓ no unrendered markup — checked ${files.length} files against ${marked.size} marked keys`);
