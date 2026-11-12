"use client";

import { useCallback } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { translate, translateList } from "@/lib/i18n";

export function useTranslation() {
  const { language, href } = useLanguage();

  const t = useCallback(
    (key: string, vars?: Record<string, string | number>) => translate(language, key, vars),
    [language],
  );

  const tList = useCallback((key: string) => translateList(language, key), [language]);

  return { t, tList, language, href };
}
