"use client";

import React from "react";
import { Check, Stethoscope } from "lucide-react";
import { useTranslation } from "@/hooks/useTranslation";
import { wecareFacts } from "@/data/site";
import { Section, Eyebrow } from "@/components/ui/section";
import RichText from "@/components/RichText";
import Reveal from "@/components/ui/reveal";

/**
 * The twenty-one conditions, as a checklist beside the argument.
 *
 * It was a centred cloud of pills, which is what you reach for when a list has no
 * structure — and it read as a tag cloud rather than as a statement of what the plan
 * covers. The same twenty-one items set as a ticked checklist say "this is the scope"
 * instead, and running them beside the heading rather than under it fills a wide band
 * that a centred column leaves empty on both sides.
 *
 * They stay in the Programme Guidelines' own order and are NOT grouped by body system.
 * A grouping would be an editorial invention over a clinical list, and putting a
 * condition in the wrong bucket is a content error dressed as a design decision.
 *
 * The qualifier sits in the left column with the heading, not under the list. "Covered"
 * and "a doctor will treat this remotely" are different claims, and the second is the
 * practitioner's to make.
 */
export default function WcxConditions() {
  const { t, tList } = useTranslation();
  const conditions = tList("wcx.cond.list");

  return (
    <Section tone="light" id="conditions">
      <div className="grid gap-12 lg:grid-cols-[minmax(0,2fr)_minmax(0,3fr)] lg:items-start lg:gap-16">
        {/* ---------- The argument ---------- */}
        <div>
          <Reveal>
            <Eyebrow>{t("wcx.cond.eyebrow")}</Eyebrow>
          </Reveal>
          <Reveal index={1}>
            <RichText as="h2" className="mt-5 t-h2 text-deep" accentClassName="text-gradient-brand">
              {t("wcx.cond.title")}
            </RichText>
          </Reveal>
          <Reveal index={2}>
            <p className="mt-5 max-w-md text-[15.5px] leading-relaxed text-ink-2 sm:text-base">
              {t("wcx.cond.lede")}
            </p>
          </Reveal>

          {/* The count as a figure rather than a word in the sentence: it is the one
              number that says how wide the scope is. */}
          <Reveal index={3}>
            <div className="mt-9 flex items-center gap-4">
              <span className="font-display text-[clamp(52px,6vw,72px)] font-semibold leading-none tracking-[-0.05em] text-gradient-brand">
                {wecareFacts.conditions}
              </span>
              <span className="max-w-[12ch] text-[15px] font-medium leading-snug text-ink-2">
                {t("wcx.cond.count")}
              </span>
            </div>
          </Reveal>

          <Reveal index={3}>
            <p className="mt-8 flex max-w-md gap-3.5 rounded-card bg-mint-soft p-5 text-[13px] leading-relaxed text-ink-2">
              <Stethoscope
                aria-hidden="true"
                className="mt-0.5 h-[18px] w-[18px] shrink-0 text-teal-ink"
                strokeWidth={1.9}
              />
              {t("wcx.cond.note")}
            </p>
          </Reveal>
        </div>

        {/* ---------- The list ---------- */}
        <Reveal index={1}>
          <div className="rounded-[28px] border border-line bg-mint-soft p-6 shadow-tide sm:p-8">
            <p className="t-eyebrow text-teal-ink">{t("wcx.cond.listLabel")}</p>
            <span
              aria-hidden="true"
              className="mt-4 block h-[2px] w-full rounded-pill bg-grad-accent"
            />
            <ul className="mt-5 grid gap-x-8 sm:grid-cols-2">
              {conditions.map((name) => (
                <li
                  key={name}
                  className="row-tide flex items-start gap-3 border-b border-line py-3 last:border-b-0 sm:[&:nth-last-child(2)]:border-b-0"
                >
                  <span className="relative z-10 mt-[3px] grid h-[18px] w-[18px] shrink-0 place-items-center rounded-full bg-grad-accent text-white">
                    <Check aria-hidden="true" className="h-2.5 w-2.5" strokeWidth={3.5} />
                  </span>
                  <span className="relative z-10 text-[14.5px] leading-snug text-ink-2">
                    {name}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </Reveal>
      </div>
    </Section>
  );
}
