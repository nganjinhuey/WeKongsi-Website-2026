"use client";

import React from "react";
import Image from "next/image";
import { Clock, MapPin, ShieldCheck } from "lucide-react";
import { useTranslation } from "@/hooks/useTranslation";
import { wecareFacts } from "@/data/site";
import { clinicCounts } from "@/data/clinics";
import { Section, Eyebrow } from "@/components/ui/section";
import RichText from "@/components/RichText";
import Reveal from "@/components/ui/reveal";
import Orbs from "@/components/ui/orbs";

const money = (n: number) => `RM${n.toLocaleString("en-MY")}`;

/**
 * The three steps, each with the one hard fact that makes it convenient.
 *
 * The prose says what happens; the chip says what it costs you in time, distance or
 * paperwork — which is the part that actually sells an outpatient subscription. Every
 * figure is live: the teleconsultation hours and the per-episode cap from
 * `wecareFacts`, and the panel size from the clinic directory, so the claim and the
 * list a reader can go and search are the same number.
 */
const STEPS = [
  { n: 1, Icon: Clock, vars: { hours: wecareFacts.teleHours } },
  { n: 2, Icon: MapPin, vars: { count: clinicCounts.total.toLocaleString("en-MY") } },
  { n: 3, Icon: ShieldCheck, vars: { amount: money(wecareFacts.perEpisodeCap) } },
] as const;

/**
 * How you actually use it.
 *
 * The section's job is to make WeCare feel near at hand, so it is built around the
 * absence of the things that make ordinary outpatient care a chore: the appointment,
 * the queue, the claim form. The lede says that outright and each step carries the
 * proof beside it rather than leaving the reader to infer it.
 *
 * It stays one sentence per step. The step list is not where a visitor learns the
 * mechanism — the Care Episode figure below is — and saying it twice made the page
 * read like a manual.
 *
 * The photograph is the teleconsultation, which is step one and the promise in the
 * hero. It used to be the medicine delivery, which is the same subject as the tile
 * directly below it in the Care Episodes figure; two sections running on one picture
 * read as a page that had run out of them.
 */
export default function WcxHow() {
  const { t } = useTranslation();

  return (
    <Section tone="mint" id="how" backdrop={<Orbs />} className="py-[72px] lg:py-20 xl:py-24">
      <div className="grid gap-12 lg:grid-cols-[46fr_54fr] lg:items-center lg:gap-16">
        <Reveal>
          {/* A turquoise bloom behind the photograph rather than a frame around it. */}
          <div className="relative">
            <span
              aria-hidden="true"
              className="pointer-events-none absolute inset-8 -z-10 rounded-[40px] bg-[radial-gradient(closest-side,rgba(37,182,165,.38),transparent_75%)] blur-[44px]"
            />
            <div className="img-zoom group relative aspect-[4/3] overflow-hidden rounded-[28px] shadow-tide-lg sm:aspect-square">
              <Image
                src="/images/wecare-teleconsult.jpg"
                alt={t("wcx.how.imgAlt")}
                fill
                sizes="(min-width: 1024px) 46vw, 92vw"
                className="object-cover"
              />
              <span className="sheen-host pointer-events-none absolute inset-0" />
            </div>
          </div>
        </Reveal>

        <div>
          <Reveal>
            <Eyebrow>{t("wcx.how.eyebrow")}</Eyebrow>
          </Reveal>
          <Reveal index={1}>
            <RichText as="h2" className="mt-5 t-h2 text-deep" accentClassName="text-gradient-brand">
              {t("wcx.how.title")}
            </RichText>
          </Reveal>
          <Reveal index={2}>
            <p className="mt-5 max-w-lg text-[15.5px] leading-relaxed text-ink-2">
              {t("wcx.how.lede")}
            </p>
          </Reveal>

          <ol className="mt-9">
            {STEPS.map(({ n, Icon, vars }, i) => (
              <Reveal key={n} index={Math.min(i + 1, 3)} as="li" className="relative block">
                {/* The rail runs from this numeral to the next one, so the last step
                    has none — there is nothing after it to reach. */}
                {i < STEPS.length - 1 && (
                  <span
                    aria-hidden="true"
                    className="absolute bottom-0 left-[23px] top-[52px] w-[2px] rounded-pill bg-gradient-to-b from-turq/70 to-turq/10"
                  />
                )}
                <div className="flex gap-5 pb-8 last:pb-0">
                  {/* A filled node, not an outlined one. These are the spine of the
                      section and at 42px of white with a hairline they read as empty
                      circles the rail happens to pass through. */}
                  <span className="relative z-10 grid h-12 w-12 shrink-0 place-items-center rounded-full bg-grad-pill font-display text-[15px] font-bold tracking-[-0.01em] text-white shadow-glow-sm ring-4 ring-white/70">
                    {String(n).padStart(2, "0")}
                  </span>
                  <div className="min-w-0 pt-1">
                    <h3 className="font-display text-[18px] font-semibold leading-snug tracking-[-0.02em] text-deep sm:text-[19px]">
                      {t(`wcx.how.s${n}.t`)}
                    </h3>
                    <p className="mt-1.5 text-[14.5px] leading-relaxed text-ink-2">
                      {t(`wcx.how.s${n}.d`)}
                    </p>
                    {/* The hard fact, beside the sentence rather than inside it: time,
                        distance, paperwork — the three things this plan removes. */}
                    <p className="mt-3 inline-flex items-center gap-2 rounded-pill border border-white/70 bg-white/80 py-1.5 pl-2.5 pr-3.5 text-[12.5px] font-semibold text-teal-ink shadow-tide backdrop-blur-sm">
                      <Icon aria-hidden="true" className="h-3.5 w-3.5" strokeWidth={2.2} />
                      {t(`wcx.how.s${n}.chip`, vars)}
                    </p>
                  </div>
                </div>
              </Reveal>
            ))}
          </ol>
        </div>
      </div>
    </Section>
  );
}
