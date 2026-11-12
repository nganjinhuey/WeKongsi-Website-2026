"use client";

import React from "react";
import Image from "next/image";
import { useTranslation } from "@/hooks/useTranslation";
import { Eyebrow } from "@/components/ui/section";
import RichText from "@/components/RichText";

/**
 * The About hero: the claim on the wash, the team in a band beneath it.
 *
 * It was a full-bleed background first, and that could not hold at more than one
 * width. The band's height is fixed while the picture scales with the viewport, so
 * `object-position` had to mean something different at every size — the team's heads
 * landed at 317px on a 1024 screen and at 924px on a 2980 one, which is the gap you
 * see as a hole under the copy on a wide monitor.
 *
 * A band cropped to the team has no such drift: `about-team-band.jpg` is already the
 * right frame at 2.35:1, so the only thing that changes with the viewport is how much
 * of it you see. Its height is clamped, so on a very wide screen it tightens to a row
 * of faces instead of growing into a poster.
 *
 * The top of the band fades into the wash, so the team emerges from the ground the
 * headline stands on rather than being pasted below it.
 *
 * Entrance is transform-only: this h1 is the LCP element, and an element at opacity 0
 * is not eligible for LCP until it becomes visible.
 */
export default function AbHero() {
  const { t } = useTranslation();

  return (
    <section className="bg-hero-soft grain relative isolate overflow-hidden">
      <div className="container relative pt-[104px] text-center lg:pt-[132px]">
        <Eyebrow className="justify-center">{t("ab.hero.eyebrow")}</Eyebrow>

        <RichText
          as="h1"
          className="mt-6 t-display mx-auto max-w-4xl animate-[rise_.8s_cubic-bezier(.22,.61,.36,1)_both] text-[clamp(34px,5.2vw,64px)] text-deep motion-reduce:animate-none"
          accentClassName="text-sheen"
        >
          {t("ab.hero.title")}
        </RichText>

        <p className="mx-auto mt-6 max-w-[58ch] text-[16px] font-medium leading-relaxed text-ink sm:text-[17px]">
          {t("ab.hero.lede")}
        </p>
      </div>

      <div className="relative mt-10 h-[clamp(210px,30vw,470px)] w-full lg:mt-12">
        {/* BOTH ends of the picture are masked rather than covered by a coloured fade.
            A fade has to be painted some colour; the first attempt painted Cool White
            at the top and met a blue-green wash, which drew a line. The foot was
            painted white too and worked only while a white section followed it — move
            the mint band above the white one, as happened here, and the same line
            reappears at the bottom.
            A mask paints nothing. The photograph dissolves into the hero's own wash at
            both ends, so the band's neighbours can be reordered without this needing
            to be re-matched. */}
        <Image
          src="/images/about-team-band.jpg"
          alt={t("ab.hero.imgAlt")}
          fill
          priority
          sizes="100vw"
          className="object-cover object-top [-webkit-mask-image:linear-gradient(180deg,transparent_0%,rgba(0,0,0,0.45)_12%,#000_34%,#000_74%,rgba(0,0,0,0.35)_92%,transparent_100%)] [mask-image:linear-gradient(180deg,transparent_0%,rgba(0,0,0,0.45)_12%,#000_34%,#000_74%,rgba(0,0,0,0.35)_92%,transparent_100%)]"
        />
      </div>
    </section>
  );
}
