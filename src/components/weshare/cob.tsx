"use client";

import React from "react";
import Image from "next/image";
import { ArrowUpRight, CalendarCheck, Receipt, Video } from "lucide-react";
import { useTranslation } from "@/hooks/useTranslation";
import { programFacts } from "@/data/site";
import { external } from "@/lib/routes";
import { Section } from "@/components/ui/section";
import { Button } from "@/components/ui/button";
import RichText from "@/components/RichText";
import Reveal from "@/components/ui/reveal";
import Orbs from "@/components/ui/orbs";

const money = (n: number) => `RM${n.toLocaleString("en-MY")}`;

/** The three things the add-on actually gives you, keyed to the wsx.cob.f1–f3 copy. */
const FEATURES = [
  { k: "f1", Icon: CalendarCheck, vars: { count: programFacts.cobEpisodesPerYear } },
  { k: "f2", Icon: Receipt, vars: { amount: money(programFacts.cobPerEpisode) } },
  { k: "f3", Icon: Video, vars: {} },
] as const;

/**
 * The outpatient add-on, as a lit panel on a white band.
 *
 * Everything either side of this section is pale, and the add-on kept disappearing
 * into that — it read as one more paragraph about the plan rather than as something a
 * member chooses. A dark panel inset in a white band is the one move that makes an
 * optional extra look optional and extra at once: it is visibly not part of the plan's
 * own run of sections, which is exactly what it is.
 *
 * The panel carries its own `on-dark` scope, so the ink tokens inside it flip without
 * the band around it changing. Its mesh is `band-dark`, whose turquoise bloom was held
 * at the largest alpha the type on it survives — see tailwind.config.ts.
 */
export default function WsxCob() {
  const { t } = useTranslation();

  return (
    <Section tone="light" id="cob" className="py-16 lg:py-24">
      <Reveal>
        <div className="on-dark grain relative isolate overflow-hidden rounded-[32px] bg-band-dark p-7 shadow-tide-lg sm:p-10 lg:p-14">
          <Orbs tone="dark" className="opacity-80" />

          <div className="relative grid gap-10 lg:grid-cols-[1.15fr_0.85fr] lg:items-center lg:gap-14">
            <div>
              {/* The benefit's own name first, in full and with its acronym, because
                  everything below calls it COB and the section used to introduce the
                  term halfway down a paragraph. "Optional add-on" is the quieter of
                  the two chips: it qualifies the thing, it does not name it. */}
              <div className="flex flex-wrap items-center gap-2">
                <span className="inline-flex rounded-pill bg-turq-light px-3.5 py-1.5 text-[10.5px] font-bold uppercase tracking-[0.12em] text-on-accent">
                  {t("wsx.cob.eyebrow")}
                </span>
                <span className="glass-dark inline-flex rounded-pill px-3.5 py-1.5 text-[10.5px] font-bold uppercase tracking-[0.14em] text-white/80">
                  {t("wsx.cob.addon")}
                </span>
              </div>

              <RichText
                as="h2"
                /* `t-h2` is sized for a heading that owns the row; in half a panel it
                   ran to three lines, so the ceiling comes down to 40px — the size
                   at which "WeShare Members Can Enjoy" clears the column. Balance is
                   turned off with it: the copy already carries a break after "Enjoy",
                   and `text-wrap: balance` was overriding that intent — evening the
                   line lengths against the accent line by splitting "WeShare Members
                   Can Enjoy" in half and stranding "Can Enjoy" on its own. */
                className="mt-5 t-h2 text-[clamp(27px,2.85vw,40px)] text-white [text-wrap:initial]"
                accentClassName="text-turq-light"
              >
                {t("wsx.cob.title")}
              </RichText>

              <p className="mt-5 max-w-xl text-[15.5px] leading-relaxed text-white/80">
                {t("wsx.cob.lede")}
              </p>

              {/* The price on its own glass, because it is the one number that decides
                  whether a reader keeps going — and beside it the way to the terms,
                  since everything on this panel is a summary of them. */}
              <div className="mt-8 flex flex-wrap items-center gap-4">
                <div className="glass-dark inline-flex flex-wrap items-baseline gap-x-3 gap-y-1 rounded-xl2 px-5 py-4">
                  <span className="font-display text-[38px] font-semibold leading-none tracking-[-0.04em] text-turq-light">
                    {money(programFacts.cobMonthly)}
                  </span>
                  <span className="text-[13.5px] leading-snug text-white/80">
                    {t("wsx.cob.permonth", { days: programFacts.waitingPeriodDays })}
                  </span>
                </div>

                {/* The COB pages live outside this app on the same domain, so this is
                    an absolute link in a new tab rather than an internal route. */}
                <Button asChild variant="accent">
                  <a href={external.cobGuideline} target="_blank" rel="noopener noreferrer">
                    {t("wsx.cob.guideline")}
                    <ArrowUpRight className="h-5 w-5" />
                  </a>
                </Button>
              </div>
            </div>

            {/* A turquoise bloom behind the photograph rather than a border around it:
                on a dark ground a hairline reads as a cut-out, light does not. */}
            <div className="relative">
              <span
                aria-hidden="true"
                className="pointer-events-none absolute inset-6 -z-10 rounded-[40px] bg-[radial-gradient(closest-side,rgba(37,182,165,.45),transparent_75%)] blur-[44px]"
              />
              <div className="img-zoom group relative aspect-[4/3] overflow-hidden rounded-[24px] shadow-card-dark">
                <Image
                  src="/images/wecare-teleconsult.jpg"
                  alt={t("wsx.cob.imgAlt")}
                  fill
                  sizes="(min-width: 1024px) 460px, 92vw"
                  className="object-cover"
                />
                <span className="sheen-host pointer-events-none absolute inset-0" />
              </div>
            </div>
          </div>

          <dl className="relative mt-10 grid gap-4 lg:mt-14 lg:grid-cols-3 lg:gap-5">
            {FEATURES.map(({ k, Icon, vars }, i) => (
              <Reveal key={k} index={i} className="h-full">
                {/* Light cards on the dark panel. `on-light` restores the ink and
                    surface tokens inside them, so anything nested reads against paper
                    rather than inheriting the panel's dark scope. */}
                <div className="on-light flex h-full gap-4 rounded-card bg-white p-5 shadow-card-dark">
                  <span className="grid h-10 w-10 shrink-0 place-items-center rounded-card bg-mint text-teal-ink">
                    <Icon aria-hidden="true" className="h-5 w-5" strokeWidth={1.8} />
                  </span>
                  <div className="min-w-0">
                    <dt className="font-display text-[15.5px] font-semibold leading-snug tracking-[-0.015em] text-deep">
                      {t(`wsx.cob.${k}.t`, vars)}
                    </dt>
                    <dd className="mt-1.5 text-[13.5px] leading-relaxed text-ink-2">
                      {t(`wsx.cob.${k}.d`)}
                    </dd>
                  </div>
                </div>
              </Reveal>
            ))}
          </dl>

          {/* Said plainly, because COB and WeCare are easy to confuse and one of them
              is a standalone plan sold on its own page. */}
          <p className="relative mt-8 border-t border-white/15 pt-6 text-[12.5px] leading-relaxed text-white/80">
            {t("wsx.cob.footnote")}
          </p>
        </div>
      </Reveal>
    </Section>
  );
}
