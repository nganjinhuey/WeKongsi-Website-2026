"use client";

import React from "react";
import { useTranslation } from "@/hooks/useTranslation";

const FACTS = ["m1", "m2", "m3", "m4", "m5", "m6"];

/**
 * A dark strip of the facts that most often get asked about, drifting past.
 *
 * The track is rendered twice and translated by exactly -50% so the loop is seamless;
 * the duplicate is `aria-hidden` so a screen reader reads the list once. With reduced
 * motion the animation stops and the first copy simply sits there as a static list.
 */
export default function WsMarquee() {
  const { t } = useTranslation();

  const track = (duplicate: boolean) => (
    <ul
      aria-hidden={duplicate || undefined}
      className="flex shrink-0 items-center gap-10 pr-10 sm:gap-14 sm:pr-14"
    >
      {FACTS.map((f) => (
        <li key={f} className="flex shrink-0 items-center gap-10 sm:gap-14">
          <span className="whitespace-nowrap text-[14px] font-medium text-white/85 sm:text-[15px]">
            {t(`wsp.marquee.${f}`)}
          </span>
          <span aria-hidden="true" className="text-[13px] text-turq">
            &#10022;
          </span>
        </li>
      ))}
    </ul>
  );

  return (
    <section className="relative overflow-hidden bg-deep-band py-5">
      <div
        className="group relative overflow-hidden"
        style={{
          maskImage: "linear-gradient(90deg, transparent, #000 4%, #000 96%, transparent)",
          WebkitMaskImage: "linear-gradient(90deg, transparent, #000 4%, #000 96%, transparent)",
        }}
      >
        <div
          className="flex w-max animate-marquee group-hover:[animation-play-state:paused] motion-reduce:animate-none"
          style={{ ["--duration" as string]: "38s" }}
        >
          {track(false)}
          {track(true)}
        </div>
      </div>
    </section>
  );
}
