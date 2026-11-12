"use client";

import React from "react";
import { Video, Building2, HeartHandshake } from "lucide-react";
import { useTranslation } from "@/hooks/useTranslation";
import { programFacts } from "@/data/site";
import { Section } from "@/components/ui/section";
import RichText from "@/components/RichText";
import Reveal from "@/components/ui/reveal";
import { Media } from "@/components/ui/media";

const BENEFIT_ICONS = [Video, Building2, HeartHandshake];

/** The optional Conditional Outpatient Benefit, presented as an add-on rather than core. */
export default function CobCard() {
  const { t } = useTranslation();

  const figures = [
    { prefix: t("cob.s.upto"), value: `RM${programFacts.cobPerEpisode}`, label: t("cob.s1.label") },
    { prefix: t("cob.s.upto2"), value: String(programFacts.cobEpisodesPerYear), label: t("cob.s2.label") },
    { prefix: t("cob.s.covers"), value: String(programFacts.cobConditions), label: t("cob.s3.label") },
  ];

  return (
    <Section tone="light">
      <Reveal>
        <div className="overflow-hidden rounded-xl2 border border-line bg-mint-soft">
          <div className="grid gap-10 p-8 sm:p-12 lg:grid-cols-[1.1fr_.9fr] lg:p-14">
            <div>
              <span className="inline-flex items-center gap-2 rounded-full bg-teal/10 px-3.5 py-1.5 text-xs font-semibold uppercase tracking-[0.12em] text-teal-deep">
                {t("cob.pill")}
              </span>
              <RichText
                as="h2"
                className="mt-5 font-display text-2xl font-extrabold leading-tight tracking-tight text-deep sm:text-3xl lg:text-4xl"
              >
                {t("cob.title")}
              </RichText>
              <p className="mt-4 max-w-lg text-base leading-relaxed text-ink-2">
                {t("cob.desc")}
              </p>

              <ul className="mt-8 grid gap-4 sm:grid-cols-3">
                {[1, 2, 3].map((n, i) => {
                  const Icon = BENEFIT_ICONS[i];
                  return (
                    <li key={n} className="rounded-card border border-line bg-white p-5">
                      <Icon className="h-5 w-5 text-teal" />
                      <p className="mt-3 font-display text-sm font-bold text-deep">
                        {t(`cob.b${n}.t`)}
                      </p>
                      <p className="mt-1.5 text-xs leading-relaxed text-ink-2">
                        {t(`cob.b${n}.d`)}
                      </p>
                    </li>
                  );
                })}
              </ul>
            </div>

            <div className="flex flex-col justify-center gap-4 rounded-card bg-deep p-8 text-white">
              <Media
                src="/images/app-in-hand.jpg"
                ratio="16/9"
                rounded="brand"
                sizes="(max-width: 1024px) 90vw, 38vw"
                className="mb-2 bg-deep-deeper"
              />
              <div className="flex items-baseline gap-2">
                <span className="font-display text-4xl font-extrabold tracking-tight">
                  RM{programFacts.cobMonthly}
                </span>
                <span className="text-sm text-white/60">{t("cob.badge.month")}</span>
                <span className="ml-auto rounded-full bg-teal/20 px-3 py-1 text-[11px] font-semibold uppercase tracking-wider text-turq">
                  {t("cob.badge.addon")}
                </span>
              </div>
              <dl className="mt-2 divide-y divide-white/10">
                {figures.map((figure) => (
                  <div key={figure.label} className="flex items-baseline justify-between gap-4 py-3.5">
                    <dt className="text-xs leading-snug text-white/60">{figure.label}</dt>
                    <dd className="shrink-0 text-right">
                      <span className="mr-1.5 text-[11px] uppercase tracking-wider text-white/40">
                        {figure.prefix}
                      </span>
                      <span className="font-display text-lg font-bold text-turq">
                        {figure.value}
                      </span>
                    </dd>
                  </div>
                ))}
              </dl>
            </div>
          </div>

          <div className="border-t border-line bg-white px-8 py-5 sm:px-12 lg:px-14">
            <RichText as="p" className="text-xs leading-relaxed text-ink-3">
              {t("cob.note")}
            </RichText>
          </div>
        </div>
      </Reveal>
    </Section>
  );
}
