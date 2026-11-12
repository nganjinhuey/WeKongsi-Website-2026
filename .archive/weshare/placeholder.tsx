import React from "react";
import { useTranslation } from "@/hooks/useTranslation";
import { cn } from "@/lib/utils";

/**
 * A value the programme has not supplied yet, shown as a visible gap rather than filled
 * with a guess.
 *
 * It is deliberately loud: a dashed amber chip that cannot be mistaken for finished copy,
 * so an unfilled figure is caught in review instead of shipping as fact.
 */
export default function Placeholder({ children, className }: { children: string; className?: string }) {
  const { t } = useTranslation();
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-md border border-dashed border-warn-line bg-warn-bg px-2 py-0.5 align-middle text-[11px] font-semibold uppercase tracking-[0.07em] text-warn-ink",
        className,
      )}
    >
      <span className="sr-only">{t("wsp.ph.label")}: </span>
      {children}
    </span>
  );
}
