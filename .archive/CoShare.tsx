"use client";

import React from "react";
import { ShieldCheck, Check } from "lucide-react";
import { useTranslation } from "@/hooks/useTranslation";
import { Section, SectionHeading } from "@/components/ui/section";
import RichText from "@/components/RichText";
import Reveal from "@/components/ui/reveal";

const AGE_BANDS = [
  { key: "co.age1", rate: "25%" },
  { key: "co.age2", rate: "10%" },
  { key: "co.age3", rate: "20%" },
];

const EXAMPLES = [
  { n: 1, bill: "RM2,000", rate: "10%", pays: "RM200", capKey: "co.ex1.cap", worksOut: null },
  { n: 2, bill: "RM50,000", rate: "10%", pays: "RM500", capKey: "co.ex2.cap", worksOut: "RM5,000" },
];

/** The member's own portion of an inpatient bill, and the cap that bounds it. */
export default function CoShare() {
  const { t } = useTranslation();

  return (
    <Section tone="light" id="co-share">
      <SectionHeading eyebrow={t("co.tag")} title={t("co.title")} lede={t("co.desc")} />

      <div className="mt-14 grid gap-5 sm:grid-cols-3">
        {AGE_BANDS.map((band, i) => (
          <Reveal key={band.key} index={i}>
            <article className="rounded-card border border-line bg-mint-soft p-7 text-center">
              <p className="text-sm font-semibold text-ink-2">{t(band.key)}</p>
              <p className="mt-3 font-display text-4xl font-extrabold tracking-tight text-teal-deep">
                {band.rate}
              </p>
              <p className="mt-2 text-xs text-ink-3">{t("co.ofbill")}</p>
            </article>
          </Reveal>
        ))}
      </div>

      <div className="mt-12 grid gap-6 lg:grid-cols-2">
        {EXAMPLES.map((example, i) => (
          <Reveal key={example.n} index={i}>
            <article className="h-full rounded-card border border-line bg-white p-8">
              <span className="inline-flex rounded-full bg-mint px-3.5 py-1.5 text-[11px] font-bold uppercase tracking-[0.12em] text-teal-deep">
                {t("co.worked")}
              </span>
              <h3 className="mt-5 font-display text-base font-bold leading-snug text-deep">
                {t(`co.ex${example.n}.t`)}
              </h3>

              <dl className="mt-6 space-y-3">
                <div className="flex items-baseline justify-between gap-4 border-b border-line pb-3">
                  <dt className="text-sm text-ink-2">{t("co.lbl.approved")}</dt>
                  <dd className="font-display text-base font-bold text-deep">{example.bill}</dd>
                </div>
                <div className="flex items-baseline justify-between gap-4 border-b border-line pb-3">
                  <dt className="text-sm text-ink-2">{t("co.lbl.rate")}</dt>
                  <dd className="font-display text-base font-bold text-deep">{example.rate}</dd>
                </div>
                {example.worksOut && (
                  <div className="flex items-baseline justify-between gap-4 border-b border-line pb-3">
                    <dt className="text-sm text-ink-2">{t("co.lbl.worksout")}</dt>
                    <dd className="font-display text-base font-bold text-ink-3 line-through">
                      {example.worksOut}
                    </dd>
                  </div>
                )}
                <div className="flex items-baseline justify-between gap-4 rounded-card bg-mint-soft px-4 py-3">
                  <dt className="text-sm font-semibold text-deep">{t("co.lbl.youpay")}</dt>
                  <dd className="text-right">
                    <span className="block font-display text-xl font-extrabold text-teal-deep">
                      {example.pays}
                    </span>
                    <span className="block text-[11px] text-ink-3">{t(example.capKey)}</span>
                  </dd>
                </div>
              </dl>

              <RichText as="p" className="mt-5 text-sm leading-relaxed text-ink-2">
                {t(`co.ex${example.n}.result`)}
              </RichText>
            </article>
          </Reveal>
        ))}
      </div>

      <div className="mt-12 grid gap-6 lg:grid-cols-[1fr_1fr]">
        <Reveal>
          <div className="flex h-full gap-4 rounded-card border border-teal/30 bg-mint-soft p-8">
            <ShieldCheck className="h-6 w-6 shrink-0 text-teal" />
            <div>
              <RichText
                as="h3"
                className="font-display text-xl font-extrabold leading-tight tracking-tight text-deep"
              >
                {t("co.cap.t")}
              </RichText>
              <p className="mt-3 text-sm leading-relaxed text-ink-2">{t("co.cap.d")}</p>
            </div>
          </div>
        </Reveal>

        <Reveal index={1}>
          <ul className="grid h-full gap-3">
            {["co.pt1", "co.pt2", "co.pt3", "co.pt4"].map((key) => (
              <li
                key={key}
                className="flex items-start gap-3 rounded-card border border-line bg-white p-4"
              >
                <Check className="mt-0.5 h-4 w-4 shrink-0 text-teal" />
                <RichText as="span" className="text-sm leading-relaxed text-ink-2">
                  {t(key)}
                </RichText>
              </li>
            ))}
          </ul>
        </Reveal>
      </div>
    </Section>
  );
}
