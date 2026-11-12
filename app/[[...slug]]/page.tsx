import React from "react";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { DEFAULT_LANGUAGE, LANGUAGES, isLanguage, type Language } from "@/lib/i18n";
import { buildMetadata } from "@/lib/seo";
import { findRoute, routes } from "@/lib/routes";
import PageView from "@/components/PageView";

type Props = { params: Promise<{ slug?: string[] }> };

// Without these the catch-all renders on demand for every visit — no edge cache, a cold
// start whenever traffic is thin, and no bfcache on back-navigation. Pre-rendering the
// known routes turns every page × language combination into a static page.
export const revalidate = 3600;
export const dynamicParams = false;

export function generateStaticParams(): { slug?: string[] }[] {
  return routes.flatMap((route) => {
    const segments = route.path === "/" ? [] : route.path.slice(1).split("/");
    return LANGUAGES.map((language) =>
      language === DEFAULT_LANGUAGE ? { slug: segments } : { slug: [language, ...segments] },
    );
  });
}

/** Splits a slug into its language and the route path underneath it. */
function resolve(slug: string[]): { language: Language; path: string } {
  const segments = [...slug];
  let language: Language = DEFAULT_LANGUAGE;
  if (segments[0] && isLanguage(segments[0]) && segments[0] !== DEFAULT_LANGUAGE) {
    language = segments.shift() as Language;
  }
  return { language, path: "/" + segments.join("/") };
}

export async function generateMetadata(props: Props): Promise<Metadata> {
  const { slug = [] } = await props.params;
  const { language, path } = resolve(slug);
  const route = findRoute(path);
  if (!route) return {};
  return buildMetadata(path, language);
}

export default async function Page(props: Props) {
  const { slug = [] } = await props.params;
  const { language, path } = resolve(slug);
  const route = findRoute(path);

  // An unknown URL 404s rather than rendering a soft 200. Left unchecked, every typo and
  // every dead link would look like a real page to a crawler.
  if (!route) notFound();

  return <PageView route={route} language={language} />;
}
