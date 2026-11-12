import React from "react";
import { cn } from "@/lib/utils";

/**
 * A slow aurora wash for the top of a page.
 *
 * Three heavily blurred pools in the brand ramp, each drifting on its own loop so they
 * never line up into a visible cycle. It is `aria-hidden` decoration and sits in a
 * Section's backdrop slot, behind the content.
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
      <div className="absolute -left-[15%] -top-[35%] aspect-square w-[70%] animate-aurora-a rounded-full bg-[radial-gradient(circle,rgba(0,191,174,.42),transparent_62%)] blur-[60px] motion-reduce:animate-none" />
      <div className="absolute -right-[18%] top-[-10%] aspect-square w-[62%] animate-aurora-b rounded-full bg-[radial-gradient(circle,rgba(0,214,196,.34),transparent_62%)] blur-[60px] motion-reduce:animate-none" />
      <div className="absolute bottom-[-30%] left-[20%] aspect-square w-[55%] animate-aurora-c rounded-full bg-[radial-gradient(circle,rgba(244,238,220,.7),transparent_60%)] blur-[70px] motion-reduce:animate-none" />
    </div>
  );
}
