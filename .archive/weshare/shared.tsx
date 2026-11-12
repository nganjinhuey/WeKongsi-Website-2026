"use client";

import React from "react";
import {
  BedDouble, HeartPulse, Scissors, Stethoscope, Sun, Ambulance, Smile, Wallet,
  FlaskConical, Ribbon, Bandage, Trophy, HandHeart,
} from "lucide-react";
import { useTranslation } from "@/hooks/useTranslation";
import { Section, Eyebrow } from "@/components/ui/section";
import RichText from "@/components/RichText";
import Reveal from "@/components/ui/reveal";
import SpotlightCard from "@/components/ui/spotlight-card";
import Placeholder from "@/components/ui/placeholder";

/**
 * The in-hospital benefits, as a bento rather than a uniform grid.
 *
 * `span` is the card's weight: the two with a figure still to be confirmed are given
 * the wide cells, because a placeholder that nobody notices is worse than no placeholder.
 */
const BENTO = [
  { n: 1, Icon: BedDouble, span: "sm:col-span-2", ph: "wsp.ph.roomLimit" },
  { n: 2, Icon: HeartPulse, span: "" },
  { n: 3, Icon: Scissors, span: "sm:col-span-2 lg:col-span-2" },
  { n: 4, Icon: Stethoscope, span: "sm:col-span-2" },
  { n: 5, Icon: Sun, span: "" },
  { n: 6, Icon: Ambulance, span: "" },
  { n: 7, Icon: Smile, span: "" },
  { n: 8, Icon: Wallet, span: "sm:col-span-2", ph: "wsp.ph.govDaily" },
  { n: 9, Icon: FlaskConical, span: "" },
];

const SEPARATE = [
  { n: 1, Icon: Ribbon },
  { n: 2, Icon: Bandage },
  { n: 3, Icon: Trophy, ph: "wsp.ph.sports" },
  { n: 4, Icon: HandHeart },
];

export default function WsShared() {
  const { t } = useTranslation();

  return (
    <Section tone="light" id="shared">
      <div className="max-w-2xl">
        <Reveal>
          <Eyebrow>{t("wsp.shared.eyebrow")}</Eyebrow>
        </Reveal>
        <Reveal index={1}>
          <RichText as="h2" className="mt-5 t-h2 text-deep" accentClassName="text-gradient-brand">
            {t("wsp.shared.title")}
          </RichText>
        </Reveal>
      </div>

      {/* Before → in hospital → after, as one line of travel. */}
      <Reveal index={1}>
        <ol className="mt-12 grid gap-4 lg:grid-cols-3">
          {(["before", "during", "after"] as const).map((k, i) => (
            <li
              key={k}
              className={`relative rounded-xl2 border p-7 ${
                k === "during" ? "border-teal/35 bg-mint/50" : "border-line bg-sand/50"
              }`}
            >
              <span className="t-eyebrow text-teal-ink">{String(i + 1).padStart(2, "0")}</span>
              <h3 className="mt-3 font-display text-[19px] font-semibold tracking-[-0.025em] text-deep">
                {t(`wsp.shared.${k}.t`)}
              </h3>
              <p className="mt-2.5 text-[14px] font-light leading-relaxed text-ink-2">
                {t(`wsp.shared.${k}.d`)}
              </p>
            </li>
          ))}
        </ol>
      </Reveal>

      <div className="mt-6 grid auto-rows-fr gap-4 sm:grid-cols-4">
        {BENTO.map(({ n, Icon, span, ph }, i) => (
          <Reveal key={n} index={i % 4} className={span}>
            <SpotlightCard as="article" className="h-full p-6">
              <span className="grid h-10 w-10 place-items-center rounded-card bg-mint text-teal-ink transition-transform duration-500 ease-back group-hover:-rotate-[8deg] group-hover:scale-[1.08]">
                <Icon aria-hidden="true" className="h-[18px] w-[18px]" />
              </span>
              <h3 className="mt-4 font-display text-[15.5px] font-semibold leading-snug tracking-[-0.02em] text-deep">
                {t(`wsp.b${n}.t`)}
              </h3>
              <p className="mt-2 text-[13.5px] font-light leading-relaxed text-ink-2">
                {t(`wsp.b${n}.d`)}
                {ph && (
                  <>
                    {" "}
                    <Placeholder>{t(ph)}</Placeholder>
                  </>
                )}
              </p>
            </SpotlightCard>
          </Reveal>
        ))}
      </div>

      <Reveal index={1}>
        <h3 className="mt-16 font-display text-[22px] font-semibold tracking-[-0.025em] text-deep sm:text-[26px]">
          {t("wsp.sep.title")}
        </h3>
      </Reveal>
      <div className="mt-7 grid gap-4 sm:grid-cols-2">
        {SEPARATE.map(({ n, Icon, ph }, i) => (
          <Reveal key={n} index={i % 2}>
            <SpotlightCard as="article" className="h-full p-7 sm:p-8">
              <div className="flex items-start justify-between gap-5">
                <span className="grid h-11 w-11 place-items-center rounded-card bg-mint text-teal-ink">
                  <Icon aria-hidden="true" className="h-5 w-5" />
                </span>
                <span className="font-display text-[26px] font-semibold leading-none tracking-[-0.04em] text-teal-ink">
                  {t(`wsp.sep.s${n}.v`)}
                </span>
              </div>
              <h4 className="mt-5 font-display text-[17px] font-semibold tracking-[-0.02em] text-deep">
                {t(`wsp.sep.s${n}.t`)}
              </h4>
              <p className="mt-2 text-[14px] font-light leading-relaxed text-ink-2">
                {t(`wsp.sep.s${n}.d`)}
                {ph && (
                  <>
                    {" "}
                    <Placeholder>{t(ph)}</Placeholder>
                  </>
                )}
              </p>
            </SpotlightCard>
          </Reveal>
        ))}
      </div>
    </Section>
  );
}
