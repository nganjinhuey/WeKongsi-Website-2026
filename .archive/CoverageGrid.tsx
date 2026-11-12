"use client";

import React from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { useTranslation } from "@/hooks/useTranslation";
import { Section, SectionHeading } from "@/components/ui/section";
import { Button } from "@/components/ui/button";
import Reveal from "@/components/ui/reveal";
import { Media } from "@/components/ui/media";

/**
 * The medical needs the community shares.
 *
 * The cards carry no figures at all: amounts and sharing limits made this read as an
 * insurance benefits table, and what a visitor needs here is WHAT is supported. Every
 * limit, and the further benefits, live on /coverage — which the button below links to.
 */
const NEEDS = [
  { key: "c1", image: "/images/coverage-inpatient.jpg" },
  // The consultation photograph reads as treatment being discussed, which is why it sits
  // on Cancer rather than following the order its filename suggests.
  { key: "c3", image: "/images/coverage-diagnostics.jpg" },
  { key: "c4", image: "/images/coverage-family.jpg" },
  // COB is the one optional item here, so it is flagged on the card itself — everything
  // else in this row is included in membership.
  { key: "cob", image: "/images/coverage-clinic.jpg", optional: true },
];

export default function CoverageGrid({ showCta = false }: { showCta?: boolean }) {
  const { t, href } = useTranslation();

  return (
    <Section tone="soft" id="coverage">
      <SectionHeading
        eyebrow={t("coverage.tag")}
        title={t("coverage.title")}
        lede={t("coverage.desc")}
        // Without this the line breaks inside the accent and leaves "Needs" alone.
        accentClassName="text-gradient-brand whitespace-nowrap"
      />

      <div className="mt-14 grid items-stretch gap-6 sm:grid-cols-2 lg:mt-16 xl:grid-cols-4">
        {NEEDS.map(({ key, image, optional }, i) => (
          <Reveal key={key} index={i} className="h-full">
            <article className="card-lift flex h-full flex-col overflow-hidden rounded-card border border-line bg-white">
              <div className="relative">
                <Media
                  src={image}
                  ratio="5/4"
                  rounded="brand"
                  sizes="(max-width: 640px) 92vw, (max-width: 1024px) 46vw, 23vw"
                  className="rounded-b-none lg:aspect-square xl:aspect-[5/4]"
                />
                {optional && (
                  <span className="absolute left-4 top-4 rounded-pill bg-white/95 px-3 py-1.5 text-[11px] font-semibold uppercase tracking-[0.12em] text-teal-deep backdrop-blur-sm">
                    {t("coverage.cob.badge")}
                  </span>
                )}
              </div>

              <div className="flex flex-1 flex-col p-6 xl:p-5">
                <p className="text-[11.5px] font-semibold uppercase tracking-[0.16em] text-ink-3">
                  {t(`coverage.${key}.cat`)}
                </p>
                {/* Sized to keep every title on one line at each column count — the reserved
                    second line that previously kept the descriptions aligned is gone,
                    because on the three titles that fit in one line it read as a gap.
                    The size steps track the column geometry rather than the screen: the
                    narrowest boxes are four-across at xl (240px) and two-across at the
                    bottom of sm (228px), so those two take the smallest type.
                    "Outpatient Cancer Treatment" is the binding case throughout. */}
                <h3 className="text-gradient-title mt-2.5 font-display text-[19px] font-bold leading-snug tracking-[-0.01em] sm:text-[16px] md:text-[19px] lg:text-[20px] xl:text-[16px]">
                  {t(`coverage.${key}.t`)}
                </h3>
                <p className="mt-3 text-[14.5px] leading-relaxed text-ink-2">
                  {t(`coverage.${key}.d`)}
                </p>
              </div>
            </article>
          </Reveal>
        ))}
      </div>

      <Reveal index={2}>
        <div className="mt-10 flex flex-col items-center gap-5">
          <p className="text-center text-xs text-ink-3">{t("coverage.note")}</p>
          {showCta && (
            <Button asChild variant="outline">
              <Link href={href("/coverage")}>
                {t("site.footer.benefitsCoverage")}
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
          )}
        </div>
      </Reveal>
    </Section>
  );
}
