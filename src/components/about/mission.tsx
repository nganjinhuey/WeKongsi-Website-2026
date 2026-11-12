"use client";

import React from "react";
import Image from "next/image";
import { Binoculars, Target } from "lucide-react";
import { useTranslation } from "@/hooks/useTranslation";
import { Eyebrow } from "@/components/ui/section";
import RichText from "@/components/RichText";
import Reveal from "@/components/ui/reveal";
import { cn } from "@/lib/utils";

const PAIR = [
  {
    Icon: Target,
    labelKey: "ab.mv.missionLabel",
    bodyKey: "ab.mv.mission",
    tone: "border-turq/45 bg-[#DDF2EB]",
    icon: "bg-white text-teal-deep",
  },
  {
    Icon: Binoculars,
    labelKey: "ab.mv.visionLabel",
    bodyKey: "ab.mv.vision",
    tone: "border-steel/25 bg-[#E4EEF7]",
    icon: "bg-white text-steel",
  },
] as const;

/**
 * Mission and vision — a photograph holding the left edge, the statements on the right.
 *
 * The previous version was two cards centred under a heading, which is the layout a
 * mission statement always gets and the reason nobody reads one. Running the picture
 * off the left edge of the viewport gives the band a side to start from, and a page
 * of centred sections somewhere to breathe.
 *
 * The picture's right edge is MASKED rather than faded to a colour. A painted fade has
 * to pick one, and the band behind it is a gradient that shifts across its width — the
 * two met in a visible line when the hero tried it. A mask paints nothing, so the
 * photograph dissolves into whatever the ground actually is at that point.
 *
 * Below three columns the image becomes a band above the copy. A half-width portrait
 * of five people side by side is unreadable at phone width; full-bleed and short, it
 * still works.
 */
export default function AbMission() {
  const { t } = useTranslation();

  return (
    <section id="mission" className="relative isolate overflow-hidden bg-white">
      {/* The picture. Absolute from three columns up so it reaches the viewport edge —
          inside the container it would stop at the max-width and the padding. */}
      <div className="relative h-[260px] w-full sm:h-[340px] lg:absolute lg:inset-y-0 lg:left-0 lg:h-full lg:w-[46%]">
        <Image
          src="/images/mission-vision.jpg"
          alt={t("ab.mv.imgAlt")}
          fill
          sizes="(min-width: 1024px) 46vw, 100vw"
          className="object-cover object-[55%_32%] [-webkit-mask-image:linear-gradient(180deg,#000_62%,transparent_100%)] [mask-image:linear-gradient(180deg,#000_62%,transparent_100%)] lg:[-webkit-mask-image:linear-gradient(90deg,#000_58%,rgba(0,0,0,.5)_82%,transparent_100%)] lg:[mask-image:linear-gradient(90deg,#000_58%,rgba(0,0,0,.5)_82%,transparent_100%)]"
        />
      </div>

      <div className="container relative py-16 lg:py-24 xl:py-28">
        <div className="lg:ml-[46%] lg:max-w-[640px] lg:pl-12 xl:pl-16">
          <Reveal>
            <Eyebrow>{t("ab.mv.eyebrow")}</Eyebrow>
          </Reveal>
          <Reveal index={1}>
            <RichText
              as="h2"
              className="mt-5 t-h2 text-[clamp(30px,3.4vw,46px)] text-deep"
              accentClassName="text-gradient-brand"
            >
              {t("ab.mv.title")}
            </RichText>
          </Reveal>
          <Reveal index={2}>
            <p className="mt-5 max-w-xl text-[16px] leading-relaxed text-ink-2 sm:text-[17px]">
              {t("ab.mv.lede")}
            </p>
          </Reveal>

          <div className="mt-10 grid gap-5 sm:grid-cols-2">
            {PAIR.map(({ Icon, labelKey, bodyKey, tone, icon }, i) => (
              <Reveal key={labelKey} index={Math.min(i + 2, 3)} className="h-full">
                <article
                  className={cn(
                    "card-lift glow-edge flex h-full flex-col rounded-[24px] border p-7 shadow-tide hover:shadow-tide-glow",
                    tone,
                  )}
                >
                  <span
                    className={cn(
                      "grid h-12 w-12 place-items-center rounded-card shadow-tide",
                      icon,
                    )}
                  >
                    <Icon aria-hidden="true" className="h-[22px] w-[22px]" strokeWidth={1.8} />
                  </span>
                  <h3 className="t-eyebrow mt-6 text-teal-ink">{t(labelKey)}</h3>
                  <p className="mt-3 text-[14.5px] leading-relaxed text-ink-2">{t(bodyKey)}</p>
                </article>
              </Reveal>
            ))}
          </div>
        </div>
      </div>

      {/* The wave at the foot, from the brand's own print material. Two overlapping
          curves rather than one, so the edge reads as water rather than as a border;
          both sit behind the copy and neither is a hairline. */}
      <svg
        aria-hidden="true"
        viewBox="0 0 1440 140"
        preserveAspectRatio="none"
        className="pointer-events-none absolute inset-x-0 bottom-0 -z-10 h-[90px] w-full lg:h-[140px]"
      >
        <path d="M0 96C240 40 420 128 720 104S1200 16 1440 60v80H0z" fill="#C9EEE5" opacity=".5" />
        <path d="M0 120C260 72 480 140 760 118S1210 56 1440 96v44H0z" fill="#DCECF4" opacity=".75" />
      </svg>
    </section>
  );
}
