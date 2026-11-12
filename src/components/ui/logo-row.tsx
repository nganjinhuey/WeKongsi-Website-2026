"use client";

import React from "react";
import Image from "next/image";
import type { Logo } from "@/data/logos";
import { cn } from "@/lib/utils";

/**
 * A static, centred wall of logos.
 *
 * Preferred over the marquee for short lists: with only five or six marks the duplicated
 * marquee track is narrower than the viewport, so the repeat is visible on screen and it
 * reads as a glitch rather than as motion. The marquee earns its keep from roughly a
 * dozen logos upward.
 */
export default function LogoRow({
  logos,
  tone = "light",
  vivid = false,
  className,
}: {
  logos: Logo[];
  tone?: "light" | "dark";
  /** Keeps the marks at full opacity — for strips that must not dim or recolour them. */
  vivid?: boolean;
  className?: string;
}) {
  return (
    <ul
      className={cn(
        "flex flex-wrap items-center justify-center gap-x-6 gap-y-6 sm:gap-x-10",
        className,
      )}
    >
      {logos.map((logo) => (
        <li key={logo.src}>
          {/* Colour-on-white source art: multiply drops the white box on light grounds;
              on dark ones the mark gets an explicit white chip instead. */}
          <span
            className={cn(
              "flex items-center justify-center",
              tone === "dark" && "rounded-xl bg-white px-5 py-3",
            )}
          >
            <Image
              src={logo.src}
              alt={logo.name}
              width={220}
              height={80}
              sizes="200px"
              className={cn(
                "h-9 w-auto max-w-[150px] object-contain transition sm:h-11 sm:max-w-[180px]",
                tone === "light"
                  ? vivid
                    ? "mix-blend-multiply"
                    : "opacity-70 mix-blend-multiply hover:opacity-100"
                  : "opacity-90 hover:opacity-100",
              )}
            />
          </span>
        </li>
      ))}
    </ul>
  );
}
