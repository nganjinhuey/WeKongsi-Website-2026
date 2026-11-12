import React from "react";
import { cn } from "@/lib/utils";

/**
 * A slow aurora wash for the top of a page.
 *
 * Three heavily blurred pools in the brand ramp, each drifting on its own loop so they
 * never line up into a visible cycle. It is `aria-hidden` decoration and sits in a
 * Section's backdrop slot, behind the content.
 *
 * The first pool is turquoise rather than pale mint, which is the difference between
 * a wash that reads as lit and one that reads as tinted. It sits right-of-centre
 * because the hero wash already blooms turquoise from the top left, and two
 * turquoise pools on the same corner composite past the alpha each was measured at.
 *
 * `motion-reduce` stops the drift rather than slowing it — the wash still renders, it
 * just holds still, so nobody loses the colour and nobody gets the movement.
 */
export default function Aurora({ className }: { className?: string }) {
  return (
    <div
      aria-hidden="true"
      className={cn("pointer-events-none absolute inset-0 overflow-hidden", className)}
    >
      <div className="absolute -top-[30%] right-[-6%] aspect-square w-[58%] animate-aurora-a rounded-full bg-[radial-gradient(circle,rgba(127,232,216,.42),transparent_66%)] blur-[60px] motion-reduce:animate-none" />
      <div className="absolute -left-[16%] top-[-8%] aspect-square w-[52%] animate-aurora-b rounded-full bg-[radial-gradient(circle,rgba(255,255,255,.95),transparent_62%)] blur-[60px] motion-reduce:animate-none" />
      <div className="absolute bottom-[-34%] left-[24%] aspect-square w-[60%] animate-aurora-c rounded-full bg-[radial-gradient(circle,rgba(176,222,242,.62),transparent_62%)] blur-[70px] motion-reduce:animate-none" />
    </div>
  );
}
