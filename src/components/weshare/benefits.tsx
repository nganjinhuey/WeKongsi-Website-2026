"use client";

import React from "react";
import { useTranslation } from "@/hooks/useTranslation";
import { programFacts, additionalBenefitLimits } from "@/data/site";
import { Section, Eyebrow } from "@/components/ui/section";
import RichText from "@/components/RichText";
import Reveal from "@/components/ui/reveal";
import Orbs from "@/components/ui/orbs";

/** The nine inpatient benefits, keyed to the cov.i1–i9 copy. */
const INPATIENT = ["i1", "i2", "i4", "i6", "i3", "i8", "i5", "i7", "i9"];

/** The five that carry their own limit, keyed to the cov.a1–a5 copy. */
const ADDITIONAL = ["a1", "a2", "a3", "a4", "a5"] as const;

const money = (n: number) => `RM${n.toLocaleString("en-MY")}`;

/**
 * What the community shares — two cards, and nothing else.
 *
 * This section has been three things. Fourteen bordered cards, which was an
 * inventory rather than a design; then one long ledger, which read better but still
 * asked the eye to walk fourteen rows before it learned anything. It is now the two
 * facts a reader actually came for: what is shared inside the annual limit, and what
 * sits outside it with a limit of its own. One card each, and the limits on the face
 * of them.
 *
 * The descriptions are short forms (`cov.*.s`), not the full ones — a card is read at
 * a glance, and a sentence per row turns a glance back into a wall. The full wording
 * remains in `cov.*.d` for the Program Guidelines summary.
 */
export default function WsxBenefits() {
  const { t } = useTranslation();

  return (
    <Section tone="accent" id="benefits" backdrop={<Orbs />}>
      {/* The header sits over the cards rather than beside a picture. The photograph
          that used to hold the right half was a generic clinical stock shot: it said
          nothing the two cards do not say better, and at half the row it left the copy
          stranded against 300px of empty column. The cards are the section. */}
      <div className="mx-auto max-w-3xl text-center">
        <Reveal>
          <Eyebrow className="justify-center">{t("wsx.ben.eyebrow")}</Eyebrow>
        </Reveal>
        <Reveal index={1}>
          <RichText as="h2" className="mt-5 t-h2 text-deep" accentClassName="text-gradient-brand">
            {t("wsx.ben.title")}
          </RichText>
        </Reveal>
        <Reveal index={2}>
          <p className="mt-5 text-[15.5px] leading-relaxed text-ink-2 sm:text-base">
            {t("wsx.ben.lede")}
          </p>
        </Reveal>
      </div>

      <div className="mt-14 grid items-start gap-6 lg:mt-16 lg:grid-cols-[1.42fr_1fr]">
        {/* ---------- Inside the annual limit ---------- */}
        <Reveal>
          <article className="card-lift glow-edge h-full rounded-[28px] border border-white/70 bg-white p-7 shadow-tide hover:shadow-tide-glow sm:p-9">
            <div className="flex flex-wrap items-center justify-between gap-x-5 gap-y-3">
              <h3 className="font-display text-[21px] font-semibold tracking-[-0.025em] text-deep sm:text-[23px]">
                {t("wsx.ben.inTitle")}
              </h3>
              {/* The limit on the face of the card rather than in a footnote: it is
                  the condition every row below it is subject to. */}
              <span className="rounded-pill bg-mint px-3.5 py-1.5 text-[12.5px] font-semibold text-teal-ink">
                {t("wsx.ben.inNote", { amount: money(programFacts.annualLimit) })}
              </span>
            </div>

            <span
              aria-hidden="true"
              className="mt-5 block h-[2px] w-full rounded-pill bg-grad-accent"
            />

            <dl className="mt-7 grid gap-x-10 gap-y-6 sm:grid-cols-2">
              {INPATIENT.map((k) => (
                <div key={k}>
                  <dt className="font-display text-[15.5px] font-semibold leading-snug tracking-[-0.02em] text-deep">
                    {t(`cov.${k}.t`)}
                  </dt>
                  <dd className="mt-1 text-[13.5px] leading-snug text-ink-2">{t(`cov.${k}.s`)}</dd>
                </div>
              ))}
            </dl>
          </article>
        </Reveal>

        {/* ---------- Outside it, each with its own limit ---------- */}
        <Reveal index={1}>
          <article className="card-lift glow-edge flex h-full flex-col rounded-[28px] border border-white/70 bg-mint p-7 shadow-tide hover:shadow-tide-glow sm:p-9">
            <h3 className="font-display text-[21px] font-semibold tracking-[-0.025em] text-deep sm:text-[23px]">
              {t("wsx.ben.addTitle")}
            </h3>

            {/* A limit beside every name, which is the only thing that makes this
                card different from the one next to it — and the reason it is a list
                of amounts rather than a list of sentences. */}
            <dl className="mt-6">
              {ADDITIONAL.map((k) => (
                <div
                  key={k}
                  className="row-tide flex items-baseline justify-between gap-5 border-b border-line py-3.5 last:border-b-0"
                >
                  <dt className="relative z-10 flex flex-wrap items-baseline gap-2 text-[14.5px] leading-snug text-ink-2">
                    {t(`cov.${k}.s`)}
                    {/* Quiet on purpose. Uppercase and bold, this read louder than the
                        benefit it qualifies — but it cannot be dropped: this one is
                        Deluxe-only, and a card that implies otherwise is wrong about
                        what a member is entitled to. */}
                    {k === "a1" && (
                      <span className="rounded-pill border border-line bg-white/70 px-2 py-0.5 text-[11px] font-medium text-ink-2">
                        {t("cov.a1.badge")}
                      </span>
                    )}
                  </dt>
                  <dd className="relative z-10 shrink-0 font-display text-[15.5px] font-semibold tracking-[-0.02em] text-deep">
                    {money(additionalBenefitLimits[k])}
                  </dd>
                </div>
              ))}
            </dl>

            <p className="mt-6 text-[12.5px] leading-relaxed text-ink-2">{t("wsx.ben.addNote")}</p>
          </article>
        </Reveal>
      </div>
    </Section>
  );
}
