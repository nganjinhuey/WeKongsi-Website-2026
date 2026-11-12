"use client";

import React from "react";
import { FileText, Landmark, HandHeart, ShieldCheck } from "lucide-react";
import { useTranslation } from "@/hooks/useTranslation";
import { Section, Eyebrow } from "@/components/ui/section";
import RichText from "@/components/RichText";
import Reveal from "@/components/ui/reveal";
import Orbs from "@/components/ui/orbs";

const PROMISES = [
  { n: 1, Icon: FileText },
  { n: 2, Icon: Landmark },
  { n: 3, Icon: HandHeart },
  { n: 4, Icon: ShieldCheck },
] as const;

/**
 * Four promises, where four values used to be.
 *
 * "Mutual Aid. Transparency. Integrity. Member First." is what every organisation on
 * earth writes, and it commits to nothing — nobody has ever published a value card
 * saying they are against integrity. Each of these says instead what the programme
 * actually does, in a form a member could hold it to: a report every month, a pool
 * the company cannot reach, no profit taken from sharing, and outside parties doing
 * the marking.
 *
 * Every one of them is a fact already published on the Transparency page. None is a
 * sentiment.
 */
export default function AbPromises() {
  const { t } = useTranslation();

  return (
    <Section tone="accent" id="promises" backdrop={<Orbs />}>
      <div className="mx-auto max-w-2xl text-center">
        <Reveal>
          <Eyebrow className="justify-center">{t("ab.values.eyebrow")}</Eyebrow>
        </Reveal>
        <Reveal index={1}>
          <RichText as="h2" className="mt-5 t-h2 text-deep" accentClassName="text-gradient-brand">
            {t("ab.values.title")}
          </RichText>
        </Reveal>
      </div>

      <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:mt-14">
        {PROMISES.map(({ n, Icon }, i) => (
          <Reveal key={n} index={Math.min(i, 3)} className="h-full">
            <article className="card-lift glow-edge sheen-host group relative flex h-full gap-5 overflow-hidden rounded-[26px] border border-white/70 bg-white p-7 shadow-tide hover:shadow-tide-glow sm:p-8">
              <span className="relative z-10 grid h-12 w-12 shrink-0 place-items-center rounded-card bg-mint text-teal-ink transition-colors duration-300 group-hover:bg-teal-deep group-hover:text-white">
                <Icon aria-hidden="true" className="h-[22px] w-[22px]" strokeWidth={1.8} />
              </span>
              <div className="relative z-10 min-w-0">
                <h3 className="font-display text-[18px] font-semibold leading-snug tracking-[-0.02em] text-deep">
                  {t(`ab.values.v${n}.t`)}
                </h3>
                <p className="mt-2.5 text-[14.5px] leading-relaxed text-ink-2">
                  {t(`ab.values.v${n}.d`)}
                </p>
              </div>
            </article>
          </Reveal>
        ))}
      </div>
    </Section>
  );
}
