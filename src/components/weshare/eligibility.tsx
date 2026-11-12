"use client";

import React from "react";
import { CalendarRange, HeartPulse, MapPin, UserRoundCheck } from "lucide-react";
import { useTranslation } from "@/hooks/useTranslation";
import { eligibilityFacts } from "@/data/site";
import { Section, Eyebrow } from "@/components/ui/section";
import RichText from "@/components/RichText";
import Reveal from "@/components/ui/reveal";
import Aurora from "@/components/ui/aurora";

/**
 * Who may join, and when sharing starts.
 *
 * Two movements, because they answer two different questions. The first is the entry
 * test — age, nationality, health at enrolment — which is either true of you or not.
 * The second is the clock, which is a different shape of fact: not whether you qualify
 * but how long each kind of support waits. Running them together as one undifferentiated
 * checklist, as this section used to, made the reader work out which was which.
 *
 * Nothing here is inferred. The entry criteria and the three waiting periods are the
 * ones the Program Guidelines state, and the figures come from `eligibilityFacts`, so
 * the copy holds the sentence and the data holds the number.
 */

const CRITERIA = [
  { k: "c1", Icon: CalendarRange },
  { k: "c2", Icon: MapPin },
  { k: "c3", Icon: HeartPulse },
  /* Last, because it is about the account rather than the person covered by it — and
     because the note underneath picks the account up and carries on. */
  { k: "c4", Icon: UserRoundCheck },
] as const;

/** The three stops on the clock, in days from the day membership starts. */
const STOPS = [
  { k: "t1", day: 1 },
  { k: "t2", day: eligibilityFacts.commonIllnessDays },
  { k: "t3", day: eligibilityFacts.specifiedIllnessDays },
] as const;

export default function WsxEligibility() {
  const { t } = useTranslation();

  const ages = {
    min: eligibilityFacts.entryAgeMin,
    max: eligibilityFacts.entryAgeMax,
    owner: eligibilityFacts.ownerAgeMin,
  };
  const accident = `RM${eligibilityFacts.accidentLimit.toLocaleString("en-MY")}`;

  return (
    <Section
      tone="soft"
      id="eligibility"
      className="bg-wash-soft"
      backdrop={<Aurora className="opacity-60" />}
    >
      <div className="grid gap-12 lg:grid-cols-[0.92fr_1.08fr] lg:items-center lg:gap-16">
        <div>
          <Reveal>
            <Eyebrow>{t("wsx.elig.eyebrow")}</Eyebrow>
          </Reveal>
          <Reveal index={1}>
            <RichText as="h2" className="mt-5 t-h2 text-deep" accentClassName="text-gradient-brand">
              {t("wsx.elig.title")}
            </RichText>
          </Reveal>
          <Reveal index={2}>
            <p className="mt-5 max-w-lg text-[15.5px] leading-relaxed text-ink-2">
              {t("wsx.elig.lede", ages)}
            </p>
          </Reveal>
        </div>

        <Reveal index={1}>
          <div className="card-lift glow-edge rounded-[28px] border border-white/70 bg-white p-7 shadow-tide hover:shadow-tide-glow sm:p-9">
            <h3 className="font-display text-[17px] font-semibold tracking-[-0.02em] text-deep">
              {t("wsx.elig.who.title")}
            </h3>
            <span aria-hidden="true" className="mt-5 block h-[2px] w-full rounded-pill bg-grad-accent" />
            <ul className="mt-6 divide-y divide-line">
              {CRITERIA.map(({ k, Icon }) => (
                <li key={k} className="row-tide flex gap-4 py-5 first:pt-0 last:pb-0">
                  <span className="relative z-10 mt-0.5 grid h-9 w-9 shrink-0 place-items-center rounded-card bg-mint text-teal-ink">
                    <Icon aria-hidden="true" className="h-[18px] w-[18px]" strokeWidth={1.9} />
                  </span>
                  <span className="relative z-10">
                    <span className="block font-display text-[15px] font-semibold tracking-[-0.01em] text-deep">
                      {t(`wsx.elig.${k}.t`, ages)}
                    </span>
                    <span className="mt-1.5 block text-[13.5px] leading-relaxed text-ink-2">
                      {t(`wsx.elig.${k}.d`, ages)}
                    </span>
                  </span>
                </li>
              ))}
            </ul>
            <p className="mt-6 border-t border-line pt-5 text-[12.5px] leading-relaxed text-ink-2">
              {t("wsx.elig.who.note")}
            </p>
          </div>
        </Reveal>
      </div>

      {/* The clock. Its own movement, centred, so it reads as a figure rather than as
          a fourth row of the card above it. */}
      <div className="mt-20 lg:mt-28">
        <div className="mx-auto max-w-2xl text-center">
          <Reveal>
            <Eyebrow className="justify-center">{t("wsx.elig.tl.eyebrow")}</Eyebrow>
          </Reveal>
          <Reveal index={1}>
            <h3 className="mt-4 font-display text-[26px] font-semibold tracking-[-0.03em] text-deep sm:text-[32px]">
              {t("wsx.elig.tl.title")}
            </h3>
          </Reveal>
          <Reveal index={2}>
            <p className="mt-4 text-[15px] leading-relaxed text-ink-2">{t("wsx.elig.tl.lede")}</p>
          </Reveal>
        </div>

        {/* One list, read in one order, laid out two ways: the rail runs down the left
            on a phone and across the top from three columns up. Each step owns the
            segment that leaves it — see `.tl-seg` in globals.css — so the line draws
            itself stop by stop as the cards arrive, and the last step has no segment
            because there is nothing after it to reach. */}
        <ol className="relative mt-14 grid gap-10 lg:mt-16 lg:grid-cols-3 lg:gap-8">
          {STOPS.map(({ k, day }, i) => (
            <li key={k} className="relative pl-16 lg:pl-0 lg:pt-[72px] lg:text-center">
              <Reveal index={i + 1} className="pointer-events-none absolute inset-0">
                {i < STOPS.length - 1 && (
                  <span
                    aria-hidden="true"
                    /* Mobile: down from this node into the gap, reaching the next
                       node's top edge. Desktop: across, one column plus one gap wide,
                       which lands on the next node's centre. */
                    className="absolute bottom-[-2.5rem] left-[19px] top-10 w-[2px] lg:bottom-auto lg:left-1/2 lg:right-[calc(-50%-2rem)] lg:top-[19px] lg:h-[2px] lg:w-auto"
                  >
                    <span className="tl-seg block h-full w-full rounded-pill bg-grad-accent" />
                  </span>
                )}
                {/* Position on the wrapper, scale on the node: the two would otherwise
                    be the same CSS property fighting over one element. */}
                <span
                  aria-hidden="true"
                  className="absolute left-0 top-0 lg:left-1/2 lg:-translate-x-1/2"
                >
                  <span className="tl-node grid h-10 w-10 place-items-center rounded-full border-2 border-turq/45 bg-white shadow-glow-sm">
                    <span className="block h-3.5 w-3.5 rounded-full bg-grad-accent" />
                  </span>
                </span>
              </Reveal>

              <Reveal index={i + 1}>
                <div className="card-lift glow-edge relative rounded-[22px] border border-white/70 bg-white p-6 shadow-tide hover:shadow-tide-glow sm:p-7">
                  {/* The day sits in a chip rather than as a line of text: it is the one
                      thing on the card that belongs to the rail above it. */}
                  <span className="inline-flex rounded-pill bg-mint px-3 py-1 font-display text-[12px] font-semibold uppercase tracking-[0.14em] text-teal-ink">
                    {t("wsx.elig.tl.day", { n: day })}
                  </span>
                  <h4 className="mt-3 font-display text-[19px] font-semibold tracking-[-0.02em] text-deep">
                    {t(`wsx.elig.${k}.t`)}
                  </h4>
                  <p className="mt-2.5 text-[14px] leading-relaxed text-ink-2">
                    {t(`wsx.elig.${k}.d`, { amount: accident })}
                  </p>
                </div>
              </Reveal>
            </li>
          ))}
        </ol>

        <Reveal index={3}>
          <p className="mt-10 text-center text-[12.5px] text-ink-2">{t("wsx.elig.note")}</p>
        </Reveal>
      </div>
    </Section>
  );
}
