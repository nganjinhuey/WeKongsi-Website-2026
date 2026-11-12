"use client";

import React, { useId, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { useTranslation } from "@/hooks/useTranslation";
import { programFacts } from "@/data/site";
import { latestReport } from "@/data/sharing-reports";
import { monthlyShare, SHARING_CAP } from "@/lib/weshare-math";
import { Section, Eyebrow } from "@/components/ui/section";
import RichText from "@/components/RichText";
import Reveal from "@/components/ui/reveal";
import Placeholder from "@/components/ui/placeholder";

const money = (n: number, dp = 0) =>
  `RM${n.toLocaleString("en-MY", { minimumFractionDigits: dp, maximumFractionDigits: dp })}`;
const count = (n: number) => n.toLocaleString("en-MY");

const BILLS_MAX = 1_500_000;
const MEMBERS_MIN = 1_000;
const MEMBERS_MAX = 30_000;

/** The preset months, as figures rather than copy — the labels are the translated part. */
const PRESETS = [
  { key: "quiet", bills: 100_000, members: 8_000 },
  { key: "actual", bills: Math.round(latestReport.cost), members: latestReport.active },
  { key: "heavy", bills: 800_000, members: 8_000 },
  { key: "none", bills: 0, members: 8_000 },
];

function Slider({
  label,
  value,
  min,
  max,
  step,
  onChange,
  display,
}: {
  label: string;
  value: number;
  min: number;
  max: number;
  step: number;
  onChange: (n: number) => void;
  display: string;
}) {
  const id = useId();
  return (
    <div>
      <div className="flex items-baseline justify-between gap-4">
        <label htmlFor={id} className="text-[13.5px] font-medium text-ink-2">
          {label}
        </label>
        <output htmlFor={id} className="font-display text-[17px] font-semibold tracking-[-0.02em] text-deep">
          {display}
        </output>
      </div>
      <input
        id={id}
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="ws-range mt-3 w-full"
      />
    </div>
  );
}

export default function WsCalculator() {
  const { t } = useTranslation();
  const reduceMotion = useReducedMotion();
  const [bills, setBills] = useState(PRESETS[1].bills);
  const [members, setMembers] = useState(PRESETS[1].members);

  const r = monthlyShare(bills, members, programFacts.sharingCap);
  const pct = Math.min(100, (r.perMember / SHARING_CAP) * 100);

  const explain =
    bills <= 0
      ? t("wsp.calc.explainNone")
      : t(r.capped ? "wsp.calc.explainOver" : "wsp.calc.explainUnder", {
          bills: money(bills),
          members: count(members),
          share: money(r.rawShare, 2),
        });

  return (
    <Section tone="soft" id="calculator">
      <div className="mx-auto max-w-2xl text-center">
        <Reveal>
          <Eyebrow>{t("wsp.calc.eyebrow")}</Eyebrow>
        </Reveal>
        <Reveal index={1}>
          <RichText as="h2" className="mt-5 t-h2 text-deep" accentClassName="text-gradient-brand">
            {t("wsp.calc.title")}
          </RichText>
        </Reveal>
        <Reveal index={2}>
          <p className="mt-4 text-[15.5px] font-light leading-relaxed text-ink-2">
            {t("wsp.calc.lede")}
          </p>
        </Reveal>
      </div>

      <Reveal index={1}>
        <div className="mt-12 grid gap-8 rounded-xl2 border border-line bg-white p-7 shadow-lift sm:p-9 lg:grid-cols-[1fr_0.9fr] lg:gap-14">
          {/* Controls */}
          <div>
            <div className="flex flex-wrap gap-2">
              {PRESETS.map((p) => {
                const on = p.bills === bills && p.members === members;
                return (
                  <button
                    key={p.key}
                    type="button"
                    aria-pressed={on}
                    onClick={() => {
                      setBills(p.bills);
                      setMembers(p.members);
                    }}
                    className={`rounded-pill border px-3.5 py-1.5 text-[12.5px] font-semibold transition-colors ${
                      on
                        ? "border-teal-ink bg-teal-ink text-white"
                        : "border-line bg-white text-ink-2 hover:border-teal/40 hover:text-teal-ink"
                    }`}
                  >
                    {t(`wsp.calc.preset.${p.key}`)}
                  </button>
                );
              })}
            </div>

            <div className="mt-8 space-y-7">
              <Slider
                label={t("wsp.calc.bills")}
                value={bills}
                min={0}
                max={BILLS_MAX}
                step={5_000}
                onChange={setBills}
                display={money(bills)}
              />
              <Slider
                label={t("wsp.calc.members")}
                value={members}
                min={MEMBERS_MIN}
                max={MEMBERS_MAX}
                step={250}
                onChange={setMembers}
                display={count(members)}
              />
            </div>
          </div>

          {/* Result */}
          <div className="rounded-xl2 border border-line bg-mint-soft p-7">
            <p className="t-eyebrow text-ink-2">{t("wsp.calc.youpay")}</p>
            <motion.p
              key={r.perMember}
              initial={reduceMotion ? false : { opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.28, ease: [0.22, 0.61, 0.36, 1] }}
              className="mt-2 font-display text-[clamp(40px,7vw,60px)] font-semibold leading-none tracking-[-0.04em] text-teal-ink"
            >
              {money(r.perMember, 2)}
            </motion.p>

            {/* The cap, drawn. The bar fills to the share and stops dead at the cap. */}
            <div className="mt-7">
              <div className="relative h-2.5 w-full rounded-pill bg-mint-deep">
                <motion.span
                  className="absolute inset-y-0 left-0 rounded-pill bg-teal"
                  animate={{ width: `${pct}%` }}
                  transition={{ duration: reduceMotion ? 0 : 0.45, ease: [0.22, 0.61, 0.36, 1] }}
                />
                {/* The cap as a standing tick, not just the end of the track — otherwise
                    it only reads as a limit in the one case where the bar is already full. */}
                <span
                  aria-hidden="true"
                  className="absolute -top-1 right-0 h-[18px] w-0.5 rounded-pill bg-deep"
                />
              </div>
              <p className="mt-2 flex justify-end text-[11.5px] font-semibold uppercase tracking-[0.08em] text-ink-2">
                {t("wsp.calc.capMarker")}
              </p>
            </div>

            <p className="mt-5 text-[13.5px] font-light leading-relaxed text-ink-2">{explain}</p>

            {r.capped && (
              <p className="mt-5 flex items-baseline justify-between gap-4 border-t border-line pt-4">
                <span className="text-[13px] text-ink-2">{t("wsp.calc.carried")}</span>
                <span className="font-display text-[17px] font-semibold text-deep">
                  {money(r.carriedTotal, 2)}
                </span>
              </p>
            )}
          </div>
        </div>
      </Reveal>

      {/* Real month-by-month history is not wired up yet, so it is marked rather than faked. */}
      <Reveal index={2}>
        <div className="mt-6 rounded-xl2 border border-dashed border-line-2 bg-white/60 p-7 text-center">
          <p className="font-display text-[15px] font-semibold text-deep">
            {t("wsp.calc.historyTitle")}
          </p>
          <p className="mt-3">
            <Placeholder>{t("wsp.ph.history")}</Placeholder>
          </p>
        </div>
      </Reveal>
    </Section>
  );
}
