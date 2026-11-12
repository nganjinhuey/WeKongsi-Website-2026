"use client";

import React from "react";
import Link from "next/link";
import { ArrowRight, Building2, MapPinned, Pill, Video } from "lucide-react";
import { useTranslation } from "@/hooks/useTranslation";
import { wecareFacts } from "@/data/site";
import { clinicCounts } from "@/data/clinics";
import { Section, Eyebrow } from "@/components/ui/section";
import RichText from "@/components/RichText";
import Reveal from "@/components/ui/reveal";
import Orbs from "@/components/ui/orbs";

/**
 * The two rows that sit beside the feature cell, laid out along their width.
 *
 * At `lg` these are three-fifths of the row and barely a hundred pixels tall, so the
 * icon goes to the left of the words rather than above them — a portrait card stacked
 * into a landscape box leaves a column of air down one side.
 */
const WIDE = [
  { k: "b2", Icon: Building2 },
  { k: "b3", Icon: Pill },
] as const;

/**
 * What the membership opens — four benefits, one line each, in a bento.
 *
 * One line is still the whole copy decision: a reader arriving from the hero does not
 * want four paragraphs, they want to know in four seconds whether this is the kind of
 * thing they are looking for. What changed is the arrangement. Four identical cards in
 * a row said all four mattered equally, which is not true and is also the least
 * interesting thing a row of cards can say — so the grid now has a shape: the
 * teleconsultation cell is tall and lit, the two middle benefits run along their width,
 * and the panel gets the full bottom row because it is the one with a number behind it.
 *
 * That number is live. `clinicCounts.total` is the MiCare GP panel the subscription
 * actually opens — the same list the clinic directory renders — so the cell states it
 * and links there rather than asserting "nationwide" and leaving it at that.
 *
 * The feature cell is the stage gradient, not a dark band. The Care Episode section
 * owns the only dark ground on this page by design, because it is the one thing a
 * visitor has to understand; a second dark object this early would spend that.
 */
export default function WcxBenefits() {
  const { t, href } = useTranslation();

  return (
    <Section tone="light" id="included" className="py-[72px] lg:py-20 xl:py-24">
      <div className="mx-auto max-w-2xl text-center">
        <Reveal>
          <Eyebrow className="justify-center">{t("wcx.what.eyebrow")}</Eyebrow>
        </Reveal>
        <Reveal index={1}>
          <RichText as="h2" className="mt-5 t-h2 text-deep" accentClassName="text-gradient-brand">
            {t("wcx.what.title")}
          </RichText>
        </Reveal>
        <Reveal index={2}>
          <p className="mt-5 text-[16px] leading-relaxed text-ink-2 sm:text-[17px]">
            {t("wcx.what.lede")}
          </p>
        </Reveal>
      </div>

      <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:mt-14 lg:grid-cols-5">
        {/* ---- The feature cell: tall, lit, and first ---- */}
        <Reveal className="h-full sm:col-span-2 lg:row-span-2">
          <article className="card-lift glow-edge sheen-host group relative flex h-full flex-col overflow-hidden rounded-[26px] border border-turq/40 bg-grad-stage p-8 shadow-tide hover:shadow-tide-glow">
            <Orbs className="opacity-50" />

            <span className="relative z-10 grid h-14 w-14 place-items-center rounded-xl2 bg-white/80 text-teal-ink shadow-tide transition-colors duration-300 group-hover:bg-teal-deep group-hover:text-white">
              <Video aria-hidden="true" className="h-7 w-7" strokeWidth={1.7} />
            </span>

            <h3 className="relative z-10 mt-7 font-display text-[clamp(20px,2.1vw,24px)] font-semibold leading-snug tracking-[-0.025em] text-deep">
              {t("wcx.what.b1.t")}
            </h3>
            <p className="relative z-10 mt-3 text-[15px] leading-relaxed text-ink-2">
              {t("wcx.what.b1.d")}
            </p>

            {/* The hours again, as a figure rather than a clause — it is the thing a
                reader checks against their own evening, and in the sentence above it
                is the fourth phrase along. */}
            <p className="relative z-10 mt-auto flex flex-wrap items-baseline gap-x-2.5 pt-8">
              <span className="font-display text-[clamp(22px,2.3vw,27px)] font-semibold leading-none tracking-[-0.03em] text-teal-ink">
                {wecareFacts.teleHours}
              </span>
              <span className="text-[13px] text-ink-2">{t("wcx.what.b1.hoursNote")}</span>
            </p>
          </article>
        </Reveal>

        {/* ---- The two along the middle ---- */}
        {WIDE.map(({ k, Icon }, i) => (
          <Reveal key={k} index={i + 1} className="h-full lg:col-span-3">
            {/* Centred, not top-aligned: these stretch to half the feature cell's
                height, and two lines pinned to the top of a 180px box leave a third of
                the card empty underneath them. */}
            <article className="card-lift card-bar glow-edge group relative flex h-full items-center gap-5 overflow-hidden rounded-[26px] border border-line bg-white p-7 shadow-tide hover:shadow-tide-glow">
              <span className="relative z-10 grid h-12 w-12 shrink-0 place-items-center rounded-card bg-mint text-teal-ink transition-colors duration-300 group-hover:bg-teal-deep group-hover:text-white">
                <Icon aria-hidden="true" className="h-[22px] w-[22px]" strokeWidth={1.8} />
              </span>
              <div className="relative z-10 min-w-0">
                <h3 className="font-display text-[17px] font-semibold leading-snug tracking-[-0.02em] text-deep">
                  {t(`wcx.what.${k}.t`)}
                </h3>
                <p className="mt-2 text-[14px] leading-relaxed text-ink-2">
                  {t(`wcx.what.${k}.d`)}
                </p>
              </div>
            </article>
          </Reveal>
        ))}

        {/* ---- The panel, across the foot, with the count behind the claim ---- */}
        <Reveal index={3} className="h-full sm:col-span-2 lg:col-span-5">
          <Link
            href={href("/clinic-info")}
            className="card-lift glow-edge group relative flex h-full flex-col gap-6 overflow-hidden rounded-[26px] border border-line bg-white p-7 shadow-tide hover:shadow-tide-glow sm:flex-row sm:items-center sm:gap-8 sm:p-8"
          >
            <span className="relative z-10 grid h-12 w-12 shrink-0 place-items-center rounded-card bg-mint text-teal-ink transition-colors duration-300 group-hover:bg-teal-deep group-hover:text-white">
              <MapPinned aria-hidden="true" className="h-[22px] w-[22px]" strokeWidth={1.8} />
            </span>

            <div className="relative z-10 min-w-0 flex-1">
              <h3 className="font-display text-[17px] font-semibold leading-snug tracking-[-0.02em] text-deep">
                {t("wcx.what.b4.t")}
              </h3>
              <p className="mt-2 text-[14px] leading-relaxed text-ink-2">{t("wcx.what.b4.d")}</p>
            </div>

            {/* The figure sits on the rule rather than inside the prose: it is the
                evidence for the word "nationwide", and it reads as evidence only if it
                is not a clause in a sentence. */}
            <div className="relative z-10 flex items-center gap-6 border-line sm:border-l sm:pl-8">
              <p>
                <span className="block font-display text-[clamp(26px,2.6vw,32px)] font-semibold leading-none tracking-[-0.035em] tabular-nums text-deep">
                  {clinicCounts.total.toLocaleString("en-MY")}
                </span>
                <span className="mt-2 block text-[12.5px] leading-snug text-ink-2">
                  {t("wcx.what.b4.stat")}
                </span>
              </p>
              <span className="inline-flex shrink-0 items-center gap-1.5 whitespace-nowrap text-[13.5px] font-semibold text-teal-deep transition-colors group-hover:text-teal-ink">
                {t("wcx.what.b4.cta")}
                <ArrowRight
                  aria-hidden="true"
                  className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-0.5"
                />
              </span>
            </div>
          </Link>
        </Reveal>
      </div>
    </Section>
  );
}
