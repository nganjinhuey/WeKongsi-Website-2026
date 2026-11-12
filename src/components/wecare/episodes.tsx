"use client";

import React from "react";
import Image from "next/image";
import { Building2, Pill, Receipt, Video } from "lucide-react";
import { useTranslation } from "@/hooks/useTranslation";
import { wecareFacts } from "@/data/site";
import { Section, SectionHeading } from "@/components/ui/section";
import Reveal from "@/components/ui/reveal";
import Orbs from "@/components/ui/orbs";

const money = (n: number) => `RM${n.toLocaleString("en-MY")}`;

/**
 * The two kinds. One of each, every quarter — which is the whole section.
 *
 * Each carries a photograph of the thing it is, because "Medicine Episode" and
 * "Clinic Visit Episode" are terms this programme invented and a reader meeting them
 * for the first time has nothing to picture. The pictures are the definition; the
 * caption underneath is the footnote.
 */
const KINDS = [
  { k: "m", Icon: Pill, src: "/images/wecare-telemedicine.jpg" },
  { k: "c", Icon: Building2, src: "/images/coverage-clinic.jpg" },
] as const;

/**
 * 1 + 1 — the only thing on this page a visitor has to understand.
 *
 * The earlier version of this section explained the Care Episode system in prose and
 * a ledger, and it was correct and nobody would have read it. This one is a sum. Two
 * tiles, a plus between them, an equals underneath: one for medicine, one for a
 * clinic visit, two a quarter, eight a year. The arithmetic does the explaining, and
 * the copy is reduced to captions on it.
 *
 * A quarterly ledger used to sit under the sum — four cards showing the balance
 * building 1+1 through 4+4. It was accurate, and it was one mechanism too many on a
 * page whose whole job is to be simple, so it is gone. Roll-over is still answered in
 * the FAQ, where someone who wants that detail goes looking for it.
 *
 * Motion is `.pop-in` in globals.css: the tiles land as the section arrives. It is
 * keyed off the parent `Reveal` and gated on `html.js`, so with JavaScript blocked
 * the figure is simply drawn finished.
 */
export default function WcxEpisodes() {
  const { t } = useTranslation();

  return (
    <Section tone="deep" id="episodes" backdrop={<Orbs tone="dark" />}>
      <SectionHeading
        tone="dark"
        eyebrow={t("wcx.ep.eyebrow")}
        title={t("wcx.ep.title")}
        lede={t("wcx.ep.lede")}
      />

      {/* ---------- The sum ---------- */}
      <Reveal index={1}>
        <div className="mx-auto mt-14 max-w-4xl lg:mt-16">
          <div className="flex flex-col items-stretch gap-5 sm:flex-row sm:items-stretch sm:gap-4">
            {KINDS.map(({ k, Icon, src }, i) => (
              <React.Fragment key={k}>
                {i > 0 && (
                  <span
                    aria-hidden="true"
                    className="pop-in shrink-0 self-center font-display text-[44px] font-light leading-none text-turq-light sm:text-[56px]"
                    style={{ "--i": 1 } as React.CSSProperties}
                  >
                    +
                  </span>
                )}
                <div
                  className="pop-in glass-dark img-zoom group flex-1 overflow-hidden rounded-[26px]"
                  style={{ "--i": i * 2 } as React.CSSProperties}
                >
                  <div className="relative aspect-[16/10] overflow-hidden">
                    <Image
                      src={src}
                      alt={t(`wcx.ep.${k}.alt`)}
                      fill
                      sizes="(min-width: 640px) 420px, 92vw"
                      className="object-cover"
                    />
                    {/* A scrim at the foot, not across the frame: the numeral needs a
                        dark ground under it and the photograph needs to stay a
                        photograph everywhere else. Written as an explicit gradient
                        because Tailwind's three-stop `via` sits at the midpoint, which
                        put half the scrim over the faces.

                        The stops are set to the numeral, not by eye. It is 88px on a
                        ~262px frame, so it occupies the bottom 27%, and a bright patch
                        of photograph there measured 2.15:1 against `turq-light` — under
                        the 3:1 a figure that size needs. Held near-opaque to 20% and
                        still at 0.45 by 38%, the worst case comes out at 8:1, and the
                        faces sit above 60% where the scrim is already gone. */}
                    <span
                      aria-hidden="true"
                      className="absolute inset-0 bg-[linear-gradient(to_top,#071D22_0%,rgba(7,29,34,0.92)_20%,rgba(7,29,34,0.45)_38%,rgba(7,29,34,0.1)_52%,transparent_66%)]"
                    />
                    {/* The numeral is still the point — "1" is what the reader should
                        leave with — so it sits on the picture at display size rather
                        than queueing below it. */}
                    <span className="absolute bottom-0 left-6 font-display text-[76px] font-semibold leading-[0.82] tracking-[-0.05em] text-turq-light sm:text-[88px]">
                      1
                    </span>
                  </div>

                  <div className="flex items-start gap-3.5 p-6 sm:p-7">
                    <span className="grid h-10 w-10 shrink-0 place-items-center rounded-card bg-white/10 text-turq-light">
                      <Icon aria-hidden="true" className="h-5 w-5" strokeWidth={1.8} />
                    </span>
                    <div className="min-w-0">
                      <h3 className="font-display text-[17.5px] font-semibold leading-snug tracking-[-0.02em] text-white">
                        {t(`wcx.ep.${k}.t`)}
                      </h3>
                      <p className="mt-1.5 text-[13.5px] leading-relaxed text-white/80">
                        {t(`wcx.ep.${k}.d`)}
                      </p>
                    </div>
                  </div>
                </div>
              </React.Fragment>
            ))}
          </div>

          <div
            className="pop-in mt-7 flex flex-wrap items-center justify-center gap-x-4 gap-y-2 text-center"
            style={{ "--i": 3 } as React.CSSProperties}
          >
            <span
              aria-hidden="true"
              className="font-display text-[34px] font-light leading-none text-turq-light"
            >
              =
            </span>
            <p className="font-display text-[19px] font-semibold tracking-[-0.025em] text-white sm:text-[21px]">
              {t("wcx.ep.sum")}
            </p>
            <span className="rounded-pill border border-turq/45 px-3 py-1 text-[12px] font-semibold uppercase tracking-[0.1em] text-turq-light">
              {t("wcx.ep.year", { count: wecareFacts.episodesPerYear })}
            </span>
          </div>
        </div>
      </Reveal>

      {/* ---------- The two rules the figure does not show ---------- */}
      <div className="mx-auto mt-16 grid max-w-4xl gap-4 lg:mt-20 lg:grid-cols-2 lg:gap-5">
        {([
          { k: "free", Icon: Video, vars: {} },
          { k: "cap", Icon: Receipt, vars: { amount: money(wecareFacts.perEpisodeCap) } },
        ] as const).map(({ k, Icon, vars }, i) => (
          <Reveal key={k} index={i} className="h-full">
            <div className="glass-dark flex h-full gap-4 rounded-card p-6">
              <span className="grid h-10 w-10 shrink-0 place-items-center rounded-card bg-white/10 text-turq-light">
                <Icon aria-hidden="true" className="h-5 w-5" strokeWidth={1.8} />
              </span>
              <div className="min-w-0">
                <p className="font-display text-[15.5px] font-semibold leading-snug tracking-[-0.015em] text-white">
                  {t(`wcx.ep.${k}.t`, vars)}
                </p>
                <p className="mt-1.5 text-[13.5px] leading-relaxed text-white/80">
                  {t(`wcx.ep.${k}.d`)}
                </p>
              </div>
            </div>
          </Reveal>
        ))}
      </div>
    </Section>
  );
}
