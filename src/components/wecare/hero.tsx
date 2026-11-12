"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Check } from "lucide-react";
import { useTranslation } from "@/hooks/useTranslation";
import { external } from "@/lib/routes";
import { wecareFacts } from "@/data/site";
import { Button } from "@/components/ui/button";
import RichText from "@/components/RichText";
import { cn } from "@/lib/utils";

/**
 * The WeCare hero, built on the same bones as WeShare's.
 *
 * Both plan pages now open the same way: one full-bleed photograph as the ground, a
 * veil over it, and the proposition centred on top — lockup, eyebrow, headline, lede,
 * actions, then a glass strip of four facts along the foot. Two plan heroes doing the
 * same job should not be two different objects, and the WeShare hero had already
 * solved the hard parts of this one.
 *
 * The picture is the ground at every width, phone included. It used to drop into flow
 * below the copy under three columns, which read as a banner that had fallen off the
 * section rather than as a hero; `object-position` moves the subject instead, so the
 * crop keeps her in frame as the box narrows.
 *
 * The type stays dark. The header is hardcoded to its light treatment and carries a
 * dark WeKongsi wordmark, and the WeCare lockup here is keyed to transparency — a
 * white-type hero would mean reversing both marks and the navigation with them. The
 * picture comes up to the type instead, through `.hero-veil`.
 *
 * Entrance is transform-only: this h1 is the LCP element, and an element at opacity 0
 * is not eligible for LCP until it becomes visible.
 */

const HIGHLIGHTS = [
  { k: "h1", vars: {} },
  { k: "h2", vars: { count: wecareFacts.episodesPerYear } },
  { k: "h3", vars: { amount: `RM${wecareFacts.perEpisodeCap}` } },
  { k: "h4", vars: {} },
] as const;

export default function WcxHero() {
  const { t, href } = useTranslation();

  return (
    <section className="relative isolate overflow-hidden pb-14 pt-[100px] lg:pb-16 lg:pt-[124px]">
      {/* The ground, at every width. `priority` because this is the largest thing
          above the fold and the LCP candidate. The subject sits right of centre in
          the frame, so the crop is pulled left of it — that keeps the near-white
          field under the headline and lets her hold the right of the band as the box
          narrows towards a phone. */}
      <Image
        src="/images/wecare-hero.jpg"
        alt={t("wcx.hero.imgAlt")}
        fill
        priority
        sizes="100vw"
        className="-z-20 object-cover object-[72%_center] sm:object-[62%_center] lg:object-[56%_center]"
      />
      <div aria-hidden="true" className="hero-veil absolute inset-0 -z-10" />

      {/* Grain over the veil, not under it: four per cent of noise is what dithers an
          eight-bit gradient's steps away, and the veil is where the banding is. */}
      <div aria-hidden="true" className="grain absolute inset-0 -z-10" />

      <div className="container relative flex flex-col items-center text-center">
        {/* The lockup, trimmed from the brand PNG and keyed to transparency, so the
            counters in "WeCare" show the band rather than a white card. It names the
            product before a word is read. */}
        <Image
          src="/images/wecare-logo-560.png"
          alt={t("wcx.hero.logoAlt")}
          width={560}
          height={101}
          priority
          className="h-auto w-[172px] animate-[rise_.7s_cubic-bezier(.22,.61,.36,1)_both] sm:w-[196px] motion-reduce:animate-none"
        />

        <span className="mt-6 inline-flex items-center rounded-pill border border-white/70 bg-white/85 px-3.5 py-1.5 text-[11.5px] font-semibold uppercase tracking-[0.1em] text-teal-ink shadow-[0_2px_18px_-8px_rgba(18,63,70,.45)] backdrop-blur">
          {t("wcx.hero.eyebrow")}
        </span>

        {/* The home page's travelling sweep rather than a static gradient, so all
            three heroes open the same way. Every stop in that ramp is dark enough to
            carry a headline on a near-white ground. */}
        <RichText
          as="h1"
          className="mt-6 max-w-4xl t-display animate-[rise_.8s_cubic-bezier(.22,.61,.36,1)_.06s_both] text-[clamp(34px,6vw,72px)] text-deep motion-reduce:animate-none"
          accentClassName="text-sheen"
        >
          {t("wcx.hero.title")}
        </RichText>

        <p className="mt-6 max-w-[58ch] text-[15.5px] font-medium leading-relaxed text-ink sm:text-[16.5px]">
          {t("wcx.hero.lede")}
        </p>

        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <Button asChild size="lg">
            <a href={external.join} target="_blank" rel="noopener noreferrer">
              {t("wcx.hero.cta1")}
              <ArrowRight className="h-5 w-5" />
            </a>
          </Button>
          <Button asChild size="lg" variant="outline">
            <Link href={href("/plans/wecare") + "#how"}>{t("wcx.hero.cta2")}</Link>
          </Button>
        </div>

        {/* The four facts a visitor decides on, in the strip the WeShare hero uses for
            its figures — same glass, same lattice drawn by the cells' own borders,
            because `divide-*` follows DOM order and cannot tell the end of a row from
            the middle of one. */}
        <dl className="glass mt-12 grid w-full rounded-xl2 px-6 py-4 sm:grid-cols-2 lg:mt-14 lg:grid-cols-4 lg:px-4 lg:py-7">
          {HIGHLIGHTS.map(({ k, vars }, i) => (
            <div
              key={k}
              className={cn(
                "flex items-center justify-center gap-2.5 border-line px-2 py-4 text-center lg:py-2",
                i > 0 && "border-t sm:border-t-0 lg:border-l",
                i % 2 === 1 && "sm:border-l",
                i >= 2 && "sm:border-t lg:border-t-0",
              )}
            >
              <span className="grid h-5 w-5 shrink-0 place-items-center rounded-full bg-grad-accent text-white">
                <Check aria-hidden="true" className="h-3 w-3" strokeWidth={3} />
              </span>
              <dt className="text-[14px] font-semibold text-deep">{t(`wcx.hero.${k}`, vars)}</dt>
            </div>
          ))}
        </dl>

        {/* Still in the first screen — it is the single most common thing a visitor
            gets wrong about this product, and a page that waits until the small print
            to correct it has already misled them. Below the strip rather than above
            it because the band has faded to white by here: set over the picture it
            measured 4.44:1, a hair under AA for 12.5px. */}
        <p className="mt-7 max-w-[56ch] text-[12.5px] leading-relaxed text-ink-2">
          {t("wcx.hero.not")}
        </p>
      </div>
    </section>
  );
}
