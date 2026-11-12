"use client";

import React from "react";
import Image from "next/image";
import { useTranslation } from "@/hooks/useTranslation";
import { cn } from "@/lib/utils";

/**
 * The brand lockup: the badge mark beside a typeset wordmark.
 *
 * The original site shipped only a JPEG lockup — which has no transparency, so it cannot
 * sit on the deep footer — and the wordmark-only file it referenced was missing from the
 * asset folder entirely. The badge is circular with a white interior, so clipping it with
 * `rounded-full` lets the same file work on light and dark without a second export.
 */
export default function Logo({
  tone = "light",
  showDescriptor = true,
  className,
}: {
  tone?: "light" | "dark";
  /** The header hides this: it is the widest thing competing with the nav for room. */
  showDescriptor?: boolean;
  className?: string;
}) {
  const { t } = useTranslation();

  return (
    <span className={cn("flex items-center gap-2.5", className)}>
      <Image
        src="/images/wekongsi-badge-96.png"
        alt=""
        width={96}
        height={96}
        priority
        className="h-10 w-10 rounded-full"
      />
      <span className="flex flex-col leading-none">
        <span
          className={cn(
            "font-display text-[19px] font-semibold tracking-[-0.02em]",
            tone === "dark" ? "text-white" : "text-deep",
          )}
        >
          We Kongsi
        </span>
        {showDescriptor && (
          <span
            className={cn(
              "mt-1 text-[9px] font-semibold uppercase tracking-[0.16em]",
              tone === "dark" ? "text-turq-light" : "text-teal-deep",
            )}
          >
            {t("site.brand.descriptor")}
          </span>
        )}
      </span>
    </span>
  );
}
