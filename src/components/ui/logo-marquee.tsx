"use client";

import React from "react";
import Image from "next/image";
import type { Logo } from "@/data/logos";
import { cn } from "@/lib/utils";

/**
 * A continuously scrolling wall of logos.
 *
 * The track is rendered twice and translated by exactly -50%, so the second copy lands
 * where the first began and the loop is seamless. `aria-hidden` on the duplicate keeps a
 * screen reader from reading every name twice; the marquee pauses on hover so a name can
 * actually be read, and `motion-reduce` stops it entirely rather than merely slowing it.
 */
export default function LogoMarquee({
  logos,
  speed = "50s",
  tone = "light",
  reverse = false,
  className,
}: {
  logos: Logo[];
  speed?: string;
  tone?: "light" | "dark";
  /** Runs the track right-to-left, so two stacked rails drift apart rather than
   *  reading as one long belt pulling the eye off the page. */
  reverse?: boolean;
  className?: string;
}) {
  const track = (duplicate: boolean) => (
    <ul
      aria-hidden={duplicate || undefined}
      className="flex shrink-0 items-center gap-10 pr-10 sm:gap-16 sm:pr-16"
    >
      {logos.map((logo) => (
        <li key={`${logo.src}-${duplicate}`} className="shrink-0">
          {/* The source logos are full-colour JPEGs on white. On light sections
              mix-blend-multiply drops the white box away; on dark ones that is impossible,
              so each mark gets an explicit white chip rather than being inverted — which
              would flatten the whole rectangle to white, mark and all. */}
          <span
            className={cn(
              "flex items-center justify-center transition",
              tone === "dark" && "rounded-xl bg-white px-5 py-3",
            )}
          >
            {/* The track scrolls its own logos into view, so a lazy image would not begin
              fetching until it crossed the edge — arriving as a blank gap mid-scroll. The
              set is small and fixed, so every mark is fetched up front instead. */}
            <Image
              src={logo.src}
              alt={duplicate ? "" : logo.name}
              width={220}
              height={80}
              sizes="220px"
              loading="eager"
              className={cn(
                "h-9 w-auto max-w-[160px] object-contain sm:h-11 sm:max-w-[200px]",
                tone === "light"
                  ? "opacity-70 mix-blend-multiply hover:opacity-100"
                  : "opacity-90 hover:opacity-100",
              )}
            />
          </span>
        </li>
      ))}
    </ul>
  );

  return (
    <div
      className={cn("group relative overflow-hidden", className)}
      style={{
        // Fades both edges so logos enter and leave instead of being chopped off.
        // Kept shallow on purpose: a deeper fade made the leading and trailing logos
        // unreadable rather than merely softened.
        maskImage:
          "linear-gradient(90deg, transparent, #000 3%, #000 97%, transparent)",
        WebkitMaskImage:
          "linear-gradient(90deg, transparent, #000 3%, #000 97%, transparent)",
      }}
    >
      <div
        className={cn(
          "flex w-max animate-marquee group-hover:[animation-play-state:paused] motion-reduce:animate-none motion-reduce:justify-center",
          reverse && "[animation-direction:reverse]",
        )}
        style={{ ["--duration" as string]: speed }}
      >
        {track(false)}
        {track(true)}
      </div>
    </div>
  );
}
