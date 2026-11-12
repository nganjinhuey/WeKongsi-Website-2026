"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight } from "lucide-react";
import { motion, useReducedMotion } from "framer-motion";
import { useTranslation } from "@/hooks/useTranslation";
import { external } from "@/lib/routes";
import { Button } from "@/components/ui/button";
import RichText from "@/components/RichText";
import { HERO_ACCENT, SCRIM_NARROW, SCRIM_WIDE, SCRIM_VERTICAL, toCss } from "@/lib/hero-scrim";

const PILLS = ["site.hero.pill1", "site.hero.pill2", "site.hero.pill3"];

export default function Hero() {
  const { t } = useTranslation();
  const reduceMotion = useReducedMotion();

  // Transform-only, with no opacity fade. The h1 here is the page's LCP element, and an
  // element at opacity 0 is not eligible for largest paint until it becomes visible —
  // fading it in would make LCP wait for React to hydrate. Sliding it does not.
  const rise = {
    hidden: { y: reduceMotion ? 0 : 26 },
    show: (i: number) => ({
      y: 0,
      transition: { duration: 0.85, delay: 0.08 + i * 0.14, ease: [0.16, 1, 0.3, 1] as const },
    }),
  };

  return (
    <section className="relative isolate overflow-hidden bg-deep">
      {/* Full-bleed photograph.
          `priority` + `sizes="100vw"` because this is the LCP image: it must be discovered
          in the initial HTML rather than after hydration. object-position keeps the family
          — the subject — in frame as the crop tightens on narrow viewports, where they
          would otherwise be cropped out to the right. */}
      <Image
        src="/images/hero.jpg"
        alt=""
        fill
        priority
        sizes="100vw"
        className="-z-10 object-cover object-[72%_center] sm:object-[68%_center] lg:object-center"
      />

      {/* Readability scrims, in two variants because the text sits differently at each
          size. Below lg the copy spans the full width, so the whole frame is dimmed;
          from lg it occupies the left column, so the scrim becomes a horizontal ramp that
          leaves the family lit on the right. Values are tuned to keep body text at or
          above 4.5:1 against the composited background, and the numbers live in
          src/lib/hero-scrim.js so scripts/check-hero-contrast.mjs can prove it. */}
      <div
        aria-hidden="true"
        className="absolute inset-0 -z-10 lg:hidden"
        style={{ backgroundImage: toCss(SCRIM_NARROW) }}
      />
      <div
        aria-hidden="true"
        className="absolute inset-0 -z-10 hidden lg:block"
        style={{ backgroundImage: toCss(SCRIM_WIDE) }}
      />
      {/* A slim vertical wash: lifts the teal accent off the window light at the top and
          seats the stats card against the bottom edge instead of letting it float. */}
      <div
        aria-hidden="true"
        className="absolute inset-0 -z-10"
        style={{ backgroundImage: toCss(SCRIM_VERTICAL) }}
      />

      {/* Bottom padding leaves room for the stats card, which is pulled up over this
          section by its own negative margin. */}
      <div
        className="container relative pb-36 pt-36 sm:pb-40 sm:pt-40 lg:pb-44 lg:pt-48 xl:pt-52"
        style={{ "--hero-accent": HERO_ACCENT } as React.CSSProperties}
      >
        <div className="max-w-xl lg:max-w-lg xl:max-w-2xl">
          <motion.p
            custom={0}
            variants={rise}
            initial="hidden"
            animate="show"
            style={{ color: HERO_ACCENT }}
            className="t-eyebrow font-display [text-shadow:0_1px_10px_rgba(2,26,24,.6)]"
          >
            {t("site.hero.eyebrow")}
          </motion.p>

          <motion.div custom={1} variants={rise} initial="hidden" animate="show">
            <RichText
              as="h1"
              className="mt-5 font-display t-display text-white [text-shadow:0_2px_18px_rgba(2,26,24,.55)]"
              accentClassName="text-[color:var(--hero-accent)]"
            >
              {t("site.hero.title")}
            </RichText>
          </motion.div>

          <motion.p
            custom={2}
            variants={rise}
            initial="hidden"
            animate="show"
            className="mt-6 max-w-lg text-base leading-relaxed text-white/85 [text-shadow:0_1px_12px_rgba(2,26,24,.6)] sm:text-lg"
          >
            {t("site.hero.sub")}
          </motion.p>

          <div className="mt-9 flex flex-col gap-3 sm:flex-row">
            <Button asChild size="lg">
              <a href={external.join} target="_blank" rel="noopener noreferrer">
                {t("hero.cta1")}
                <ArrowRight className="h-5 w-5" />
              </a>
            </Button>
            <Button asChild variant="ghostLight" size="lg">
              <Link href="#intro">{t("hero.cta2")}</Link>
            </Button>
          </div>

          {/* Dot-separated rather than icon-led: over a photograph, three small icons add
              visual noise exactly where the scrim is weakest. */}
          <ul className="mt-10 flex flex-wrap items-center gap-x-3 gap-y-2">
            {PILLS.map((key, i) => (
              <React.Fragment key={key}>
                {i > 0 && (
                  <li aria-hidden="true" style={{ background: HERO_ACCENT }} className="h-1 w-1 rounded-full opacity-70" />
                )}
                <li className="text-sm font-medium text-white/90 [text-shadow:0_1px_10px_rgba(2,26,24,.65)]">
                  {t(key)}
                </li>
              </React.Fragment>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
