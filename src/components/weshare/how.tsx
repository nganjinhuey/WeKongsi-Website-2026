"use client";

import React from "react";
import { ChevronDown, ChevronRight, HandCoins, HeartHandshake, UserPlus } from "lucide-react";
import { useTranslation } from "@/hooks/useTranslation";
import { Section, Eyebrow } from "@/components/ui/section";
import RichText from "@/components/RichText";
import Reveal from "@/components/ui/reveal";
import { cn } from "@/lib/utils";

/**
 * The sharing journey, told from the member's seat.
 *
 * Three stages on one connected line: you join, you contribute, and the community
 * carries the cost when it is anyone's turn — including yours. Not three identical
 * cards, and no process diagram: the chevrons in the gaps say this is a sequence, and
 * the last panel is the only one that is not white, so the destination looks like a
 * destination without needing a heavier border or a bigger box.
 *
 * Everything here describes sharing, never cover. Nothing promises that any month
 * brings a payment, or that an approved expense is the whole bill — the note under the
 * row carries the eligibility qualifier rather than hiding it in a stage's last line,
 * where it would read as small print attached to the good news.
 */

const STAGES = [
  { n: 1, Icon: UserPlus },
  { n: 2, Icon: HandCoins },
  { n: 3, Icon: HeartHandshake },
] as const;

export default function WsxHow() {
  const { t } = useTranslation();

  return (
    <Section tone="mint" id="how">
      <div className="mx-auto max-w-3xl text-center">
        <Reveal>
          <Eyebrow className="justify-center">{t("wsx.how.eyebrow")}</Eyebrow>
        </Reveal>
        <Reveal index={1}>
          <RichText
            as="h2"
            className="mt-5 t-h2 text-deep"
            accentClassName="text-gradient-brand"
          >
            {t("wsx.how.title")}
          </RichText>
        </Reveal>
        <Reveal index={2}>
          <p className="mt-5 text-[15.5px] leading-relaxed text-ink-2 sm:text-base">
            {t("wsx.how.lede")}
          </p>
        </Reveal>
      </div>

      {/* The gaps are sized to the connectors, not the other way round: each chevron is
          absolutely placed in the gutter beside its own panel, so the line between two
          stages belongs to the stage it leaves and arrives with it. */}
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
                  className={cn(
                    "mt-6 block h-px w-full",
                    last ? "bg-turq/35" : "bg-line",
                  )}
                />

                <h3 className="mt-6 font-display text-[19px] font-semibold leading-snug tracking-[-0.02em] text-deep sm:text-[20px]">
                  {t(`wsx.how.s${n}.t`)}
                </h3>
                <p className="mt-3 text-[14.5px] leading-relaxed text-ink-2">
                  {t(`wsx.how.s${n}.d`)}
                </p>
              </article>
            </Reveal>
          );
        })}
      </ol>

      <Reveal index={3}>
        <p className="mt-10 text-center text-[12.5px] leading-relaxed text-ink-2 lg:mt-12">
          {t("wsx.how.note")}
        </p>
      </Reveal>
    </Section>
  );
}
