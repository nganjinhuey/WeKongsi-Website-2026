"use client";

import React, { useState } from "react";
import {
  BedDouble,
  HeartPulse,
  Ambulance,
  Scissors,
  Stethoscope,
  Sun,
  Smile,
  Wallet,
  Trophy,
  FlaskConical,
  CalendarCheck,
  Bandage,
  HandHeart,
  Ribbon,
  Minus,
  AlertCircle,
} from "lucide-react";
import { useTranslation } from "@/hooks/useTranslation";
import { programFacts } from "@/data/site";
import { Section, SectionHeading, Eyebrow } from "@/components/ui/section";
import { Button } from "@/components/ui/button";
import PageHero from "@/components/sections/PageHero";
import CoShare from "@/components/sections/CoShare";
import FinalCta from "@/components/sections/FinalCta";
import CellValue from "@/components/CellValue";
import RichText from "@/components/RichText";
import Reveal from "@/components/ui/reveal";
import { Media } from "@/components/ui/media";

/** `std`/`dlx` use the same tagged-value form as the plan comparison table, so the
    "/ day" and "per admission" wording translates while the figure stays fixed. */
const INPATIENT: {
  n: number;
  Icon: React.ComponentType<{ className?: string }>;
  std?: string;
  dlx?: string;
}[] = [
  { n: 1, Icon: BedDouble, std: "perDay:RM150", dlx: "perDay:RM250" },
  { n: 2, Icon: HeartPulse },
  { n: 3, Icon: Ambulance, std: "perAdmission:RM250", dlx: "t:mem.common.included" },
  { n: 4, Icon: Scissors },
  { n: 5, Icon: Stethoscope },
  { n: 6, Icon: Sun },
  { n: 7, Icon: Smile },
  { n: 8, Icon: Wallet, std: "perDay:RM50", dlx: "perDay:RM100" },
  { n: 9, Icon: Trophy },
];

const ADDITIONAL = [
  { n: 1, Icon: FlaskConical, badgeKey: "cov.a1.badge" },
  { n: 2, Icon: CalendarCheck },
  { n: 3, Icon: Bandage },
  { n: 4, Icon: HandHeart },
  { n: 5, Icon: Ribbon },
];

const EXCLUSIONS_SHOWN = 18;

export default function Coverage() {
  const { t, tList } = useTranslation();
  const [allExclusions, setAllExclusions] = useState(false);

  const exclusions = tList("cov.excl.list");
  const visibleExclusions = allExclusions ? exclusions : exclusions.slice(0, EXCLUSIONS_SHOWN);

  return (
    <>
      <PageHero
        eyebrow={t("cov.hero.eyebrow")}
        title={t("cov.hero.title")}
        lede={t("cov.hero.lede")}
        image="/images/coverage-inpatient.jpg"
      />

      {/* Inpatient benefits */}
      <Section tone="light" id="inpatient">
        <SectionHeading
          eyebrow={t("cov.inpatient.eyebrow")}
          title={t("cov.inpatient.title")}
          lede={t("cov.inpatient.desc")}
        />

        <Reveal>
          <div className="mx-auto mt-12 max-w-2xl rounded-xl2 bg-band-hero p-8 text-center">
            <p className="text-[11px] font-bold uppercase tracking-[0.14em] text-turq">
              {t("cov.limit.label")}
            </p>
            <p className="mt-2 font-display text-4xl font-extrabold tracking-tight text-white sm:text-5xl">
              RM{programFacts.annualLimit.toLocaleString("en-MY")}
            </p>
            <p className="mt-2 text-sm text-white/55">{t("cov.limit.note")}</p>
          </div>
        </Reveal>

        <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {INPATIENT.map(({ n, Icon, std, dlx }, i) => (
            <Reveal key={n} index={i % 3}>
              <article className="flex h-full flex-col rounded-card border border-line bg-white p-7">
                <span className="grid h-11 w-11 place-items-center rounded-card bg-mint text-teal">
                  <Icon className="h-5 w-5" />
                </span>
                <h3 className="mt-5 font-display text-base font-bold leading-snug text-deep">
                  {t(`cov.i${n}.t`)}
                </h3>
                <p className="mt-3 flex-1 text-sm leading-relaxed text-ink-2">
                  {t(`cov.i${n}.d`)}
                </p>
                {std && dlx && (
                  <dl className="mt-5 grid grid-cols-2 gap-3 border-t border-line pt-5 text-sm">
                    <div>
                      <dt className="text-[11px] uppercase tracking-wider text-ink-3">
                        {t("mem.plan.standard")}
                      </dt>
                      <dd className="mt-0.5 font-display font-bold text-deep">
                        <CellValue value={std} />
                      </dd>
                    </div>
                    <div>
                      <dt className="text-[11px] uppercase tracking-wider text-ink-3">
                        {t("mem.plan.deluxe")}
                      </dt>
                      <dd className="mt-0.5 font-display font-bold text-teal-deep">
                        <CellValue value={dlx} />
                      </dd>
                    </div>
                  </dl>
                )}
              </article>
            </Reveal>
          ))}
        </div>
      </Section>

      {/* Additional benefits */}
      <Section tone="soft" id="additional">
        <SectionHeading
          eyebrow={t("cov.add.eyebrow")}
          title={t("cov.add.title")}
          lede={t("cov.add.desc")}
        />
        <Reveal index={1}>
          <div className="mt-12 grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
            {[
              "/images/coverage-family.jpg",
              "/images/life-accident.jpg",
              "/images/coverage-cancer.jpg",
              "/images/life-consult.jpg",
            ].map((src, i) => (
              <Media key={src} src={src} ratio="4/3" sizes="(max-width: 1024px) 46vw, 23vw"
                className={i % 2 === 1 ? "lg:translate-y-6" : undefined} />
            ))}
          </div>
        </Reveal>

        <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {ADDITIONAL.map(({ n, Icon, badgeKey }, i) => (
            <Reveal key={n} index={i % 3}>
              <article className="h-full rounded-card border border-line bg-white p-7">
                <div className="flex items-start justify-between gap-3">
                  <span className="grid h-11 w-11 place-items-center rounded-card bg-deep text-white">
                    <Icon className="h-5 w-5" />
                  </span>
                  {badgeKey && (
                    <span className="rounded-full bg-teal/10 px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-teal-deep">
                      {t(badgeKey)}
                    </span>
                  )}
                </div>
                <h3 className="mt-5 font-display text-base font-bold leading-snug text-deep">
                  {t(`cov.a${n}.t`)}
                </h3>
                <p className="mt-3 text-sm leading-relaxed text-ink-2">{t(`cov.a${n}.d`)}</p>
              </article>
            </Reveal>
          ))}
        </div>
      </Section>

      {/* Outpatient / COB */}
      <Section tone="deep" id="outpatient">
        <SectionHeading
          tone="dark"
          eyebrow={t("cov.cob.eyebrow")}
          title={t("cov.cob.title")}
          lede={t("cov.cob.desc")}
        />

        <Reveal>
          <div className="mx-auto mt-12 w-fit rounded-card border border-white/10 bg-white/[0.04] px-8 py-6 text-center">
            <p className="flex items-baseline justify-center gap-1.5">
              <span className="font-display text-4xl font-extrabold tracking-tight text-turq">
                RM{programFacts.cobMonthly}
              </span>
              <span className="text-sm text-white/50">{t("cob.badge.month")}</span>
            </p>
            <p className="mt-1.5 text-xs text-white/50">{t("cov.cob.priceNote")}</p>
          </div>
        </Reveal>

        <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {[1, 2, 3, 4].map((n, i) => (
            <Reveal key={n} index={i}>
              <article className="h-full rounded-card border border-white/10 bg-white/[0.04] p-7">
                <h3 className="font-display text-base font-bold text-white">
                  {t(`cov.cob.f${n}.t`)}
                </h3>
                <p className="mt-3 text-sm leading-relaxed text-white/60">
                  {t(`cov.cob.f${n}.d`)}
                </p>
              </article>
            </Reveal>
          ))}
        </div>

        <div className="mt-12">
          <Reveal>
            <h3 className="text-center font-display text-base font-bold text-white">
              {t("cov.cob.conditionsTitle")}
            </h3>
          </Reveal>
          <Reveal index={1}>
            <ul className="mt-6 flex flex-wrap justify-center gap-2.5">
              {tList("cov.cob.conditions").map((condition) => (
                <li
                  key={condition}
                  className="rounded-full border border-white/12 bg-white/[0.05] px-4 py-2 text-sm text-white/75"
                >
                  {condition}
                </li>
              ))}
            </ul>
          </Reveal>
        </div>
      </Section>

      <CoShare />

      {/* Supported conditions */}
      <Section tone="soft" id="conditions">
        <SectionHeading
          eyebrow={t("cov.cond.eyebrow")}
          title={t("cov.cond.title")}
          lede={t("cov.cond.desc")}
        />
        <div className="mt-14 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {tList("cov.cond.list").map((condition, i) => (
            <Reveal key={condition} index={i % 3}>
              <div className="flex items-center gap-3 rounded-card border border-line bg-white p-5">
                <span className="h-2 w-2 shrink-0 rounded-full bg-teal" />
                <span className="text-sm font-medium text-deep">{condition}</span>
              </div>
            </Reveal>
          ))}
        </div>
        <Reveal index={2}>
          <p className="mt-8 text-center text-xs leading-relaxed text-ink-3">
            {t("cov.cond.note")}
          </p>
        </Reveal>
      </Section>

      {/* Exclusions */}
      <Section tone="light" id="exclusions">
        <SectionHeading
          eyebrow={t("cov.excl.eyebrow")}
          title={t("cov.excl.title")}
          lede={t("cov.excl.desc")}
        />

        <Reveal>
          <ul className="mt-12 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {visibleExclusions.map((item) => (
              <li
                key={item}
                className="flex items-start gap-3 rounded-card border border-line bg-[#f7faf9] p-4"
              >
                <Minus className="mt-0.5 h-4 w-4 shrink-0 text-ink-3" />
                <span className="text-sm leading-relaxed text-ink-2">{item}</span>
              </li>
            ))}
          </ul>
        </Reveal>

        {!allExclusions && exclusions.length > EXCLUSIONS_SHOWN && (
          <div className="mt-8 flex justify-center">
            <Button variant="outline" onClick={() => setAllExclusions(true)}>
              {t("cov.excl.showAll")} ({exclusions.length})
            </Button>
          </div>
        )}

        {/* Pre-existing conditions */}
        <Reveal>
          <div className="mt-16 rounded-xl2 border border-amber-200 bg-amber-50 p-8 sm:p-10">
            <Eyebrow>{t("cov.pre.eyebrow")}</Eyebrow>
            <RichText
              as="h3"
              className="mt-5 font-display text-2xl font-extrabold tracking-tight text-deep"
            >
              {t("cov.pre.title")}
            </RichText>
            <ul className="mt-6 space-y-3.5">
              {["cov.pre.p1", "cov.pre.p2", "cov.pre.p3", "cov.pre.p4"].map((key) => (
                <li key={key} className="flex gap-3">
                  <AlertCircle className="mt-0.5 h-4 w-4 shrink-0 text-amber-600" />
                  <RichText as="span" className="text-sm leading-relaxed text-ink-2">
                    {t(key)}
                  </RichText>
                </li>
              ))}
            </ul>
          </div>
        </Reveal>

        <Reveal index={1}>
          <p className="mt-10 text-center text-xs leading-relaxed text-ink-3">
            {t("cov.footnote")}
          </p>
        </Reveal>
      </Section>

      <FinalCta />
    </>
  );
}
