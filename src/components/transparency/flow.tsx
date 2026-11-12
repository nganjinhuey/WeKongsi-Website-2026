"use client";

import React from "react";
import { ChevronDown, ChevronRight, HandCoins, HeartHandshake, Landmark } from "lucide-react";
import { useTranslation } from "@/hooks/useTranslation";
import { Section, SectionHeading } from "@/components/ui/section";
import RichText from "@/components/RichText";
import Reveal from "@/components/ui/reveal";
import Orbs from "@/components/ui/orbs";
import { cn } from "@/lib/utils";

const STAGES = [
  { n: 1, Icon: HandCoins },
  { n: 2, Icon: Landmark },
  { n: 3, Icon: HeartHandshake },
] as const;

/**
 * Where the money goes, before the numbers that say how much of it there was.
 *
 * A page of published figures answers "how much" and leaves "who was holding it"
 * unanswered, which is the question a transparency page is actually asked. So the
 * route the money takes comes first: collected, held by a licensed trustee outside
 * the company, shared to the member who needed it.
 *
 * Same journey grammar as the WeShare page — chevrons in the gaps, the last panel the
 * only one that is not white — so a reader who has seen one recognises the other.
 */
export default function TrFlow() {
  const { t } = useTranslation();

  return (
    <Section tone="mint" id="flow" backdrop={<Orbs />}>
      <SectionHeading
        eyebrow={t("tr.flow.eyebrow")}
        title={t("tr.flow.title")}
        lede={t("tr.flow.desc")}
      />

      <ol className="mt-14 grid gap-14 lg:mt-16 lg:grid-cols-3 lg:gap-10">
        {STAGES.map(({ n, Icon }, i) => {
          const last = i === STAGES.length - 1;
          return (
            <Reveal key={n} index={i} as="li" className="relative">
              {!last && (
                <>
                  <span
                    aria-hidden="true"
                    className="pointer-events-none absolute inset-x-0 bottom-[-56px] flex h-14 items-center justify-center lg:hidden"
                  >
                    <span className="absolute inset-y-0 left-1/2 w-px -translate-x-1/2 bg-gradient-to-b from-turq/0 via-turq/55 to-turq/0" />
                    <ChevronDown className="relative h-4 w-4 text-turq" strokeWidth={2.5} />
                  </span>
                  <span
                    aria-hidden="true"
                    className="pointer-events-none absolute right-[-40px] top-1/2 hidden h-10 w-10 -translate-y-1/2 items-center justify-center lg:flex"
                  >
                    <span className="absolute inset-x-0 top-1/2 h-px -translate-y-1/2 bg-gradient-to-r from-turq/0 via-turq/55 to-turq/0" />
                    <ChevronRight className="relative h-4 w-4 text-turq" strokeWidth={2.5} />
                  </span>
                </>
              )}

              <article
                className={cn(
                  "card-lift glow-edge group flex h-full flex-col rounded-[26px] p-7 sm:p-8",
                  last
                    ? "border border-turq/55 bg-grad-stage shadow-tide-glow"
                    : "border border-white/70 bg-white/85 shadow-tide backdrop-blur-sm",
                )}
              >
                <div className="flex items-start justify-between gap-4">
                  <span
                    className={cn(
                      "grid h-12 w-12 shrink-0 place-items-center rounded-card transition-colors duration-300",
                      last
                        ? "bg-grad-pill text-white shadow-glow-sm"
                        : "bg-mint text-teal-ink group-hover:bg-teal-deep group-hover:text-white",
                    )}
                  >
                    <Icon aria-hidden="true" className="h-[22px] w-[22px]" strokeWidth={1.8} />
                  </span>
                  <span className="font-display text-[13px] font-semibold tracking-[0.1em] text-teal-ink">
                    {String(n).padStart(2, "0")}
                  </span>
                </div>

                <span
                  aria-hidden="true"
                  className={cn("mt-6 block h-px w-full", last ? "bg-turq/35" : "bg-line")}
                />

                <h3 className="mt-6 font-display text-[19px] font-semibold leading-snug tracking-[-0.02em] text-deep sm:text-[20px]">
                  {t(`tr.flow.s${n}.t`)}
                </h3>
                <p className="mt-3 text-[14.5px] leading-relaxed text-ink-2">
                  {t(`tr.flow.s${n}.d`)}
                </p>
              </article>
            </Reveal>
          );
        })}
      </ol>

      <Reveal index={3}>
        <RichText
          as="p"
          className="mt-12 text-center text-[13.5px] leading-relaxed text-ink-2 lg:mt-14"
          accentClassName="text-gradient-brand"
        >
          {t("tr.flow.note")}
        </RichText>
      </Reveal>
    </Section>
  );
}
