"use client";

import React from "react";
import { useTranslation } from "@/hooks/useTranslation";
import { Section, Eyebrow } from "@/components/ui/section";
import { Media } from "@/components/ui/media";
import RichText from "@/components/RichText";
import Reveal from "@/components/ui/reveal";
import Orbs from "@/components/ui/orbs";

/**
 * The opening statement and the four principles it rests on. How the sharing model
 * works lives on the WeShare page, not here.
 *
 * The principles have no heading of their own: the Community-Based heading above is their
 * title.
 */

/** The four principles. Their copy keys still live under `pil.*`. */
const PRINCIPLES = [
  { n: 1, image: "/images/principle-affordability.jpg" },
  { n: 2, image: "/images/principle-transparency.jpg" },
  { n: 3, image: "/images/principle-access.jpg" },
  { n: 4, image: "/images/principle-community.jpg" },
];

export default function IntroProcess() {
  const { t } = useTranslation();

  return (
    <>
      {/* ---------- What We Kongsi is ---------- */}
      <Section tone="light" id="intro" backdrop={<Orbs />}>
        <div className="mx-auto flex max-w-4xl flex-col items-center gap-5 text-center">
          <Reveal>
            <Eyebrow>{t("intro.eyebrow")}</Eyebrow>
          </Reveal>

          <Reveal index={1}>
            {/* The largest type on the page after the hero — its positioning
                statement. Still no forced line break: the measure is set so the wrap
                falls where it should on its own, which lets each language break where
                its own length wants to. At `max-w-3xl` it ran to three lines, because
                the unbreakable accent phrase could not share a line with "Platform". */}
            <RichText
              as="h2"
              className="t-h2 text-deep"
              // Keeping the accent phrase unbreakable makes the line fall before it
              // rather than through it — "Medical Cost-Sharing" split across two lines,
              // half-teal on each, read as a mistake.
              accentClassName="bg-grad-accent bg-clip-text text-transparent whitespace-nowrap"
            >
              {t("intro.title")}
            </RichText>
          </Reveal>

          <Reveal index={2}>
            <p className="mt-1 max-w-3xl text-base leading-relaxed text-ink-2 sm:text-[17px]">
              {t("intro.p2")}
            </p>
          </Reveal>
        </div>

        {/* Four cards, and the numeral is what makes them a sequence rather than a
            set. It is set enormous and almost invisible behind the copy — legible from
            across the room as a shape, never competing with the heading it sits under.
            Decoration only: the order is already in the markup, so it is aria-hidden. */}
        <div className="mt-14 grid items-stretch gap-6 sm:grid-cols-2 lg:mt-16 lg:grid-cols-4">
          {PRINCIPLES.map(({ n, image }, i) => (
            <Reveal key={n} index={i} className="h-full">
              <article className="card-lift glow-edge group relative flex h-full flex-col overflow-hidden rounded-card border border-line bg-white shadow-tide hover:shadow-tide-glow">
                {/* A single ratio cannot hold the image at ~45-50% of the card: once four
                    columns narrow below xl the picture shrinks while the copy block does
                    not. A squarer crop in that range keeps the proportion. */}
                <div className="img-zoom relative">
                  <Media
                    src={image}
                    ratio="5/4"
                    rounded="brand"
                    sizes="(max-width: 640px) 92vw, (max-width: 1024px) 46vw, 23vw"
                    className="rounded-b-none lg:aspect-square xl:aspect-[5/4]"
                  />
                  {/* The photograph resolves into the card instead of stopping on a
                      ruled edge — the same move the hero wash makes at its own seam. */}
                  <span
                    aria-hidden="true"
                    className="pointer-events-none absolute inset-x-0 bottom-0 h-16 bg-gradient-to-b from-transparent to-white"
                  />
                  <span className="sheen-host pointer-events-none absolute inset-0" />
                </div>

                <div className="relative flex flex-1 flex-col p-6 lg:p-7">
                  <span
                    aria-hidden="true"
                    className="watermark absolute right-3 top-2 font-display"
                  >
                    {n}
                  </span>
                  <p className="relative text-[11.5px] font-semibold uppercase tracking-[0.16em] text-ink-3">
                    {t(`pil.p${n}.eyebrow`)}
                  </p>
                  <h3 className="text-gradient-title relative mt-2.5 font-display text-[21px] font-semibold leading-snug tracking-[-0.01em] lg:text-[22px]">
                    {t(`pil.p${n}.title`)}
                  </h3>
                  <p className="relative mt-3 text-[14.5px] leading-relaxed text-ink-2">
                    {t(`pil.p${n}.body`)}
                  </p>
                </div>
              </article>
            </Reveal>
          ))}
        </div>
      </Section>
    </>
  );
}
