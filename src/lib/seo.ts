import type { Metadata } from "next";
import {
  DEFAULT_LANGUAGE,
  LANGUAGES,
  hreflangOf,
  type Language,
  localisePath,
  translate,
} from "@/lib/i18n";
import { SITE_URL, findRoute } from "@/lib/routes";

const OG_LOCALE: Record<string, string> = {
  en: "en_MY",
  ms: "ms_MY",
  zh: "zh_CN",
};

/**
 * Builds page metadata from the route registry and the translation files, so a page's
 * <title> and its on-page heading can never drift apart — both come from the same JSON.
 *
 * Takes the path rather than the route key. Several articles share the key "story",
 * so a key no longer identifies a page — and the key-to-path map this used to carry
 * had to be kept in step with the route list by hand, which is the kind of duplication
 * that is correct right up until someone adds a page.
 *
 * Alternates are declared for whatever LANGUAGES currently holds. Listing a language
 * the site no longer builds would point a search engine at a 404, so this reads the
 * live list rather than naming them.
 */
export function buildMetadata(path: string, language: Language): Metadata {
  const route = findRoute(path);
  if (!route) return {};

  const title = translate(language, route.titleKey);
  const description = translate(language, route.descKey);
  const canonical = `${SITE_URL}${localisePath(route.path, language)}`;

  return {
    title: route.key === "home" ? { absolute: title } : title,
    description,
    alternates: {
      canonical,
      languages: {
        ...Object.fromEntries(
          LANGUAGES.map((l) => [hreflangOf(l), `${SITE_URL}${localisePath(route.path, l)}`]),
        ),
        "x-default": `${SITE_URL}${localisePath(route.path, DEFAULT_LANGUAGE)}`,
      },
    },
    openGraph: {
      type: "website",
      siteName: "We Kongsi",
      locale: OG_LOCALE[language],
      url: canonical,
      title,
      description,
    },
    twitter: { card: "summary_large_image", title, description },
  };
}
