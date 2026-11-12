import React from "react";
import { cn } from "@/lib/utils";

/**
 * Slow-drifting pools of colour behind a band.
 *
 * Three very large, heavily blurred radials on long, offset loops (24s / 31s / 26s —
 * deliberately coprime-ish, so they never settle into a visible cycle), travelling a
 * few per cent, which registers as atmosphere rather than as animation. They stop
 * entirely under `prefers-reduced-motion`.
 *
 * **Positions are not free.** Every band already carries its own mesh of blooms, and
 * the alpha of each of those was set to the largest value the type on that band
 * survives. An orb dropped on top of one of them composites, so the pair is darker
 * than either was measured at. The band meshes bloom from the top-LEFT and the
 * bottom-RIGHT; these three sit right-of-centre, bottom-left and dead centre, so no
 * orb ever lands on a band bloom and the measurements still hold.
 *
 * Belongs in a Section's `backdrop` slot, never as a child: children are clipped to
 * the container's max-width, and an orb's edge would show as a rectangle.
 */
export default function Orbs({
  tone = "light",
  className,
}: {
  /** Dark bands need a brighter, more present bloom than near-white ones. */
  tone?: "light" | "dark";
  className?: string;
}) {
  const dark = tone === "dark";

  /* Turquoise is the pool that does the work — it is what makes a band read as lit
     rather than tinted. On light it is 0.34 over the wash's mid step, which bottoms
     the ground out at L=0.80 (ink-2 5.5:1); on dark it is 0.30 over petrol, L=0.088
     (#7FE8D8 5.2:1, white/75 5.2:1). A step brighter on either fails AA. */
  const accent = dark ? "rgba(37,182,165,.26)" : "rgba(127,232,216,.34)";
  /* Steel: a cool counterweight, so the band has two hues and not two tints. */
  const cool = dark ? "rgba(49,90,120,.46)" : "rgba(176,222,242,.52)";
  /* A pale lift through the middle, to stop the centre of a wide band going flat. */
  const lift = dark ? "rgba(127,232,216,.1)" : "rgba(255,255,255,.85)";

  return (
    <div
      aria-hidden="true"
      className={cn("pointer-events-none absolute inset-0 overflow-hidden", className)}
    >
      <div
        className="orb -top-[26%] right-[-8%] w-[54%] animate-drift motion-reduce:animate-none"
        style={{ background: `radial-gradient(circle, ${accent}, transparent 66%)` }}
      />
      <div
        className="orb -bottom-[30%] -left-[10%] w-[50%] animate-drift-slow motion-reduce:animate-none"
        style={{ background: `radial-gradient(circle, ${cool}, transparent 66%)` }}
      />
      <div
        className="orb left-[32%] top-[18%] w-[44%] animate-drift-wide motion-reduce:animate-none"
        style={{ background: `radial-gradient(circle, ${lift}, transparent 64%)` }}
      />
    </div>
  );
}
