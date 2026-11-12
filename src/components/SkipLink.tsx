"use client";

import React from "react";
import { useTranslation } from "@/hooks/useTranslation";

/**
 * First focusable element on the page, visible only while focused. It lives in a client
 * component rather than inline in the root layout because the layout has no access to the
 * language in the URL, and a skip link that announces itself in the wrong language is of
 * little use to the person relying on it.
 */
export default function SkipLink() {
  const { t } = useTranslation();

  return (
    <a
      href="#main"
      className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[60] focus:rounded-full focus:bg-deep focus:px-5 focus:py-3 focus:text-sm focus:text-white"
    >
      {t("site.common.skipToContent")}
    </a>
  );
}
