import en from "@/translations/en.json";

/**
 * The languages the site builds.
 *
 * Bahasa Malaysia and Chinese are paused — their dictionaries are parked in
 * `.archive/translations/`. Everything downstream reads this list (routes, sitemap,
 * hreflang, the switcher, the parity scripts), so adding them back here and restoring
 * the two JSON files is the whole job of turning them back on.
 */
export const LANGUAGES = ["en"] as const;
export type Language = (typeof LANGUAGES)[number];

export const LANGUAGE_LABELS: Record<Language, string> = { en: "English" };

export const LANGUAGE_SHORT: Record<Language, string> = { en: "EN" };

/** The `lang` attribute for <html>, which is not the same as our URL segment. */
export const HTML_LANG: Record<Language, string> = { en: "en" };

export const DEFAULT_LANGUAGE: Language = "en";

/**
 * The hreflang code for a language, which is not always our URL segment: Chinese
 * serves from `/zh` but must be declared as `zh-Hans`. Kept here so the sitemap and
 * each page's <head> cannot disagree about it.
 */
export const HREFLANG: Record<string, string> = { zh: "zh-Hans" };
export const hreflangOf = (language: Language): string => HREFLANG[language] ?? language;

const dictionaries: Record<Language, unknown> = { en };

export const isLanguage = (value: string): value is Language =>
  (LANGUAGES as readonly string[]).includes(value);

/**
 * English serves from the root (`/about`); an additional language sits behind a
 * prefix. Both halves of that mapping live here so a route and its language can never
 * disagree — the prefix logic stays in place while only English ships, so restoring a
 * language needs no change to it.
 */
export const languageFromPath = (pathname: string): Language => {
  const first = pathname.split("/").filter(Boolean)[0];
  return first && isLanguage(first) && first !== DEFAULT_LANGUAGE ? first : DEFAULT_LANGUAGE;
};

export const stripLanguage = (pathname: string): string => {
  const segments = pathname.split("/").filter(Boolean);
  if (segments[0] && isLanguage(segments[0]) && segments[0] !== DEFAULT_LANGUAGE) segments.shift();
  return "/" + segments.join("/");
};

export const localisePath = (path: string, language: Language): string => {
  const clean = stripLanguage(path);
  if (language === DEFAULT_LANGUAGE) return clean;
  return clean === "/" ? `/${language}` : `/${language}${clean}`;
};

const lookup = (dictionary: unknown, key: string): unknown =>
  key.split(".").reduce<unknown>(
    (node, part) =>
      node && typeof node === "object" ? (node as Record<string, unknown>)[part] : undefined,
    dictionary,
  );

/**
 * Resolves a dotted key, falling back to English when a translation is missing so a
 * gap degrades to readable English rather than a raw key on screen. The key itself is
 * the last resort — it makes the omission obvious in review instead of invisible.
 */
export function translate(
  language: Language,
  key: string,
  vars?: Record<string, string | number>,
): string {
  const raw = lookup(dictionaries[language], key) ?? lookup(dictionaries[DEFAULT_LANGUAGE], key);
  if (typeof raw !== "string") return key;
  if (!vars) return raw;
  return raw.replace(/\{\{(\w+)\}\}/g, (match, name: string) =>
    name in vars ? String(vars[name]) : match,
  );
}

/** Same resolution as `translate`, for keys whose value is a list (e.g. rotating hero lines). */
export function translateList(language: Language, key: string): string[] {
  const raw = lookup(dictionaries[language], key) ?? lookup(dictionaries[DEFAULT_LANGUAGE], key);
  return Array.isArray(raw) ? (raw as string[]) : [];
}
