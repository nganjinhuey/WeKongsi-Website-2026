"use client";

import React from "react";
import Image from "next/image";
import { HandHeart, Users } from "lucide-react";
import { useTranslation } from "@/hooks/useTranslation";
import { Section, Eyebrow } from "@/components/ui/section";
import RichText from "@/components/RichText";
import Reveal from "@/components/ui/reveal";
import { cn } from "@/lib/utils";

const HALVES = [
  {
    k: "we",
    Icon: Users,
    word: "ab.name.we",
    labelKey: "ab.name.weLabel",
    descKey: "ab.name.weDesc",
    wordClass: "text-gradient-brand",
  },
  {
    k: "kongsi",
    Icon: HandHeart,
    word: "ab.name.kongsi",
    labelKey: "ab.name.kongsiLabel",
    descKey: "ab.name.kongsiDesc",
    wordClass: "text-deep",
  },
] as const;

/**
 * The mark, as the axis of the row.
 *
 * A white disc on a white band would be invisible, so the edge is drawn by a
 * turquoise hairline and a bloom behind it rather than by a shadow — a drop shadow at
 * this size reads as a sticker, and light reads as emphasis.
 */
function Mark({ alt }: { alt: string }) {
  return (
    <span className="relative grid h-[132px] w-[132px] shrink-0 place-items-center lg:h-[176px] lg:w-[176px]">
      <span
        aria-hidden="true"
        className="absolute inset-[-18%] rounded-full bg-[radial-gradient(closest-side,rgba(37,182,165,.3),transparent_72%)] blur-[18px]"
      />
      <span className="relative grid h-full w-full place-items-center rounded-full border border-turq/35 bg-white shadow-tide">
        <Image
          src="/images/wekongsi-mark-260.png"
          alt={alt}
          width={260}
          height={245}
          className="h-auto w-[74px] lg:w-[98px]"
        />
      </span>
    </span>
  );
}

/**
 * Why the name — the mark in the middle, the two halves either side.
 *
 * Light ground, and deliberately a plain one. An earlier version tinted two large
 * ovals behind the halves to draw a Venn; two near-white tints on a near-white band
 * gave the copy nothing to stand on and read as smudges rather than as a diagram.
 * What joins the words now is a single hairline running the width of the row, which
 * the mark interrupts — the same idea with none of the cost.
 *
 * Three columns at desktop (`1fr auto 1fr`), so the mark is the axis and the two words
 * turn to face it. Stacked on a phone, with the mark still between them: it is the
 * thing that joins the words, and a logo parked at the foot is just a logo parked at
 * the foot.
 */
export default function AbName() {
  const { t } = useTranslation();

  return (
    <Section tone="light" id="name">
      <div className="mx-auto max-w-2xl text-center">
        <Reveal>
          <Eyebrow className="justify-center">{t("ab.name.eyebrow")}</Eyebrow>
        </Reveal>
        <Reveal index={1}>
          <RichText
            as="h2"
            className="mt-5 t-h2 text-[clamp(28px,3.4vw,44px)] text-deep"
            accentClassName="text-gradient-brand"
          >
            {t("ab.name.title")}
          </RichText>
        </Reveal>
        <Reveal index={2}>
          <p className="mt-5 text-[15.5px] leading-relaxed text-ink-2 sm:text-base">
            {t("ab.name.lede")}
          </p>
        </Reveal>
      </div>

      <div className="relative mx-auto mt-14 max-w-5xl lg:mt-20">
        {/* No connector rule here. A hairline across the row sat at the vertical
            centre, which is exactly where the two big words sit — it struck through
            both of them and read as a mistake. The mark between them is doing that
            job already. */}
        <div className="relative grid items-center gap-12 lg:grid-cols-[1fr_auto_1fr] lg:gap-16">
          {HALVES.map(({ k, Icon, word, labelKey, descKey, wordClass }, i) => (
            <React.Fragment key={k}>
              {/* The mark sits between the two halves in the DOM, so the stacked phone
                  layout gets the right order for free. */}
              {i === 1 && (
                <Reveal index={1} className="flex justify-center">
                  <Mark alt={t("ab.name.markAlt")} />
                </Reveal>
              )}
              <Reveal index={i} className="block">
                <div
                  className={cn(
                    "flex flex-col items-center text-center",
                    /* The two halves turn to face the mark. */
                    i === 0 ? "lg:items-end lg:text-right" : "lg:items-start lg:text-left",
                  )}
                >
                  <Icon aria-hidden="true" className="h-9 w-9 text-teal-deep" strokeWidth={1.6} />
                  <p
                    className={cn(
                      "mt-5 font-display text-[clamp(52px,6.6vw,86px)] font-bold leading-none tracking-[-0.045em]",
                      wordClass,
                    )}
                  >
                    {t(word)}
                  </p>
                  <span
                    aria-hidden="true"
                    className="mt-6 block h-[3px] w-16 rounded-pill bg-grad-accent"
                  />
                  <p className="mt-6 font-display text-[21px] font-semibold tracking-[-0.025em] text-deep sm:text-[23px]">
                    {t(labelKey)}
                  </p>
                  <p className="mt-2.5 max-w-[32ch] text-[14.5px] leading-relaxed text-ink-2">
                    {t(descKey)}
                  </p>
                </div>
              </Reveal>
            </React.Fragment>
          ))}
        </div>
      </div>

      {/* The close. It was a filled pill, which read as a button nobody could press,
          and it was italic. It is now simply the last sentence of the section, set at
          display size with the name in the brand gradient, under a short rule. */}
      <Reveal index={3}>
        <div className="mt-16 flex flex-col items-center lg:mt-20">
          <span aria-hidden="true" className="block h-[3px] w-12 rounded-pill bg-grad-accent" />
          <RichText
            as="p"
            className="mt-7 text-center font-display text-[clamp(22px,2.6vw,32px)] font-semibold tracking-[-0.03em] text-deep"
            accentClassName="text-gradient-brand"
          >
            {t("ab.name.close")}
          </RichText>
        </div>
      </Reveal>
    </Section>
  );
}
