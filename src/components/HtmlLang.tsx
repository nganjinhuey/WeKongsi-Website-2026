"use client";

import { useEffect } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { HTML_LANG } from "@/lib/i18n";

/**
 * Keeps <html lang> in step with the language in the URL.
 *
 * The App Router has exactly one root <html>, and it is rendered by app/layout.tsx, which
 * cannot see the current route's params — so the served markup always says lang="en".
 * Two things make up for it: every page's content wrapper carries its own `lang`
 * attribute (valid HTML, and what assistive tech actually reads for a subtree), and this
 * corrects the document element once on the client. Search engines are told the real
 * story by the hreflang alternates in src/lib/seo.ts, which are fully static.
 */
export default function HtmlLang() {
  const { language } = useLanguage();

  useEffect(() => {
    document.documentElement.lang = HTML_LANG[language];
  }, [language]);

  return null;
}
