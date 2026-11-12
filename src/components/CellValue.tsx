"use client";

import React from "react";
import { useTranslation } from "@/hooks/useTranslation";

/**
 * Expands the tagged cell values used by the plan comparison table.
 *
 * `t:<key>` is a translated word ("Included"); `upTo:`, `perDay:` and `perAdmission:`
 * wrap a figure in a phrase that translates while the figure itself stays put. Anything
 * else renders verbatim — figures are language-neutral by design.
 */
export default function CellValue({ value }: { value: string }) {
  const { t } = useTranslation();

  if (value.startsWith("t:")) return <>{t(value.slice(2))}</>;
  if (value.startsWith("upTo:")) return <>{t("mem.common.upToValue", { value: value.slice(5) })}</>;
  if (value.startsWith("perDay:")) return <>{t("mem.common.perDayValue", { value: value.slice(7) })}</>;
  if (value.startsWith("perAdmission:"))
    return <>{t("mem.common.perAdmission", { value: value.slice(13) })}</>;
  return <>{value}</>;
}
