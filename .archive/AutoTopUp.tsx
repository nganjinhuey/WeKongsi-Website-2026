"use client";

import React from "react";
import { useTranslation } from "@/hooks/useTranslation";
import { Section, SectionHeading } from "@/components/ui/section";
import RichText from "@/components/RichText";
import Reveal from "@/components/ui/reveal";

/** The four-step onboarding timeline, plus the fixed-amount alternative. */
export default function AutoTopUp() {
  const { t } = useTranslation();

  return (
    <Section tone="deep" id="auto-top-up">
      <SectionHeading
        tone="dark"
        eyebrow={t("at.tag")}
        title={t("at.title")}
        lede={t("at.desc")}
      />

      <div className="mt-14">
        <Reveal>
          <h3 className="text-center font-display text-lg font-bold text-white">
            {t("at.steptitle")}
          </h3>
        </Reveal>

        <ol className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {[1, 2, 3, 4].map((n, i) => (
            <Reveal key={n} index={i} as="li">
              <div className="relative h-full rounded-card border border-white/10 bg-white/[0.04] p-7">
                <span className="inline-flex rounded-full bg-teal/20 px-3 py-1 text-[11px] font-bold uppercase tracking-[0.1em] text-turq">
                  {t(`at.s${n}.day`)}
                </span>
                <h4 className="mt-4 font-display text-base font-bold text-white">
                  {t(`at.s${n}.t`)}
                </h4>
                <RichText as="p" className="mt-2.5 text-sm leading-relaxed text-white/60">
                  {t(`at.s${n}.d`)}
                </RichText>
              </div>
            </Reveal>
          ))}
        </ol>
      </div>

      <div className="mt-12 grid gap-6 lg:grid-cols-[1.1fr_.9fr]">
        <Reveal>
          <div className="h-full rounded-card border border-white/10 bg-white/[0.04] p-8">
            <h3 className="font-display text-lg font-bold text-white">{t("at.simtitle")}</h3>

            {/* A static illustration of the top-up cycle rather than an animated meter:
                the three states are the point, and all three stay readable at once. */}
            <div className="mt-6 rounded-card bg-deep-deeper p-6">
              <div className="flex items-baseline justify-between gap-3">
                <span className="text-xs text-white/50">{t("at.balance")}</span>
                <span className="font-display text-sm font-bold text-white">RM150 / RM150</span>
              </div>
              <div
                className="mt-3 h-2.5 overflow-hidden rounded-full bg-white/10"
                role="img"
                aria-label={t("at.status.restore")}
              >
                <div className="h-full w-full rounded-full bg-grad-accent" />
              </div>
              <div className="mt-2.5 flex items-center justify-between text-[11px] text-white/40">
                <span>RM0</span>
                <span>
                  {t("at.trigger")} · RM{75}
                </span>
                <span>RM150</span>
              </div>
            </div>

            <ol className="mt-6 space-y-3">
              {["at.leg1", "at.leg2", "at.leg3"].map((key, i) => (
                <li key={key} className="flex gap-3 text-sm text-white/65">
                  <span className="grid h-6 w-6 shrink-0 place-items-center rounded-full bg-white/10 font-display text-xs font-bold text-turq">
                    {i + 1}
                  </span>
                  {t(key)}
                </li>
              ))}
            </ol>

            <RichText as="p" className="mt-6 text-xs text-white/45">
              {t("at.foot")}
            </RichText>
          </div>
        </Reveal>

        <Reveal index={1}>
          <div className="flex h-full flex-col justify-center rounded-card border border-teal/30 bg-teal/[0.08] p-8">
            <span className="inline-flex w-fit rounded-full bg-teal/20 px-3.5 py-1.5 text-[11px] font-bold uppercase tracking-[0.12em] text-turq">
              {t("at.fixed.tag")}
            </span>
            <RichText
              as="h3"
              className="mt-5 font-display text-2xl font-extrabold leading-tight tracking-tight text-white"
              accentClassName="text-gradient-light"
            >
              {t("at.fixed.t")}
            </RichText>
            <RichText as="p" className="mt-4 text-sm leading-relaxed text-white/65">
              {t("at.fixed.d")}
            </RichText>
          </div>
        </Reveal>
      </div>

      <Reveal index={2}>
        <p className="mt-10 text-center text-xs text-white/40">{t("sa.note")}</p>
      </Reveal>
    </Section>
  );
}
