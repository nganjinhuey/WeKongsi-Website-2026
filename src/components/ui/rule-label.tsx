import React from "react";
import { cn } from "@/lib/utils";

/**
 * A small pill label with a rule running out of it on both sides.
 *
 * It does one job: it cuts a card in half without drawing a line across it. A plain
 * hairline separates two blocks but says nothing about them; this one names the block
 * below it — "across a year", "what's included" — so a reader scanning a column of
 * cards can find the same block in each without reading any of them.
 *
 * The rules fade out rather than ending, which is the same decision the bands and the
 * `edge-glow` hairline make everywhere else here: a rule with two hard ends reads as a
 * box being drawn, a rule that dissolves reads as light. The dots are where a hard end
 * would otherwise be.
 *
 * Three tones, because the pill has to be visible against three different grounds and
 * carry 12px type on each. On white and on the mint gradient the measured pairs are
 * ice blue / `teal-ink` at 6.28:1 and white at 75% / `teal-ink` at 7.33:1. On a dark
 * band the pill is **unfilled**: `bg-white/10` lifts the ground enough to drop
 * `turq-light` to 3.70:1, where the band on its own holds 4.68:1.
 */
export default function RuleLabel({
  children,
  tone = "light",
  className,
}: {
  children: React.ReactNode;
  /** `light` on white, `glass` on the mint gradient, `dark` on a petrol band. */
  tone?: "light" | "glass" | "dark";
  className?: string;
}) {
  const dark = tone === "dark";

  const pill = {
    light: "border-line bg-mint text-teal-ink",
    glass: "border-white/70 bg-white/75 text-teal-ink",
    dark: "border-white/20 text-turq-light",
  }[tone];

  const ink = dark ? "rgba(255,255,255,.3)" : "rgba(18,63,70,.22)";
  const dot = dark ? "bg-turq-light/55" : "bg-teal-deep/45";

  const rule = (direction: "left" | "right") => (
    <span aria-hidden="true" className="flex min-w-0 flex-1 items-center gap-2">
      <span
        className={cn("h-px min-w-0 flex-1", direction === "right" && "order-2")}
        style={{
          backgroundImage: `linear-gradient(${direction === "left" ? "90deg" : "270deg"},transparent,${ink})`,
        }}
      />
      <span className={cn("h-[3px] w-[3px] shrink-0 rounded-full", dot)} />
    </span>
  );

  return (
    <div className={cn("flex items-center gap-2.5", className)}>
      {rule("left")}
      <span className={cn("t-eyebrow shrink-0 rounded-pill border px-3 py-1.5", pill)}>
        {children}
      </span>
      {rule("right")}
    </div>
  );
}
