"use client";

import React, { createContext, useContext, useMemo } from "react";
import { usePathname } from "next/navigation";
import {
  DEFAULT_LANGUAGE,
  type Language,
  languageFromPath,
  localisePath,
  stripLanguage,
} from "@/lib/i18n";

type LanguageContextValue = {
  language: Language;
  /** Current path with any language prefix removed — the canonical route identity. */
  basePath: string;
  /** Prefixes a route for the active language. Use for every internal link. */
  href: (path: string) => string;
};

const LanguageContext = createContext<LanguageContextValue>({
  language: DEFAULT_LANGUAGE,
  basePath: "/",
  href: (path) => path,
});

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const pathname = usePathname() || "/";

  // The URL is the single source of truth for language: no cookie, no localStorage, no
  // state to fall out of sync with what the visitor can see and share.
  const value = useMemo<LanguageContextValue>(() => {
    const language = languageFromPath(pathname);
    return {
      language,
      basePath: stripLanguage(pathname),
      href: (path: string) => localisePath(path, language),
    };
  }, [pathname]);

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
}

export const useLanguage = () => useContext(LanguageContext);
