"use client";

import React, { useId, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { Check } from "lucide-react";
import { useTranslation } from "@/hooks/useTranslation";
import { coShare, type AgeBand } from "@/lib/weshare-math";
import { Section, Eyebrow } from "@/components/ui/section";
import RichText from "@/components/RichText";
import Reveal from "@/components/ui/reveal";

const money = (n: number, dp = 0) =>
  `RM${n.toLocaleString("en-MY", { minimumFractionDigits: dp, maximumFractionDigits: dp })}`;

const BANDS: { band: AgeBand; labelKey: string }[] = [
  { band: "0-5", labelKey: "co.age1" },
  { band: "6-45", labelKey: "co.age2" },
  { band: "46+", labelKey: "co.age3" },
];

export default function WsCoShare() {
  const { t } = useTranslation();
  const reduceMotion = useReducedMotion();
  const [band, setBand] = useState<AgeBand>("6-45");
  const [bill, setBill] = useState(2_000);
  const [gov, setGov] = useState(false);
  const billId = useId();
  const govId = useId();

  const r = coShare(bill, band, gov);
  const ratePct = `${Math.round(r.rate * 100)}%`;

  const explain = r.waived
    ? t("wsp.cos.explainGov")
    : t(r.capped ? "wsp.cos.explainCapped" : "wsp.cos.explain", {
        rate: ratePct,
        bill: money(bill),
        raw: money(r.rawCoShare, 2),
      });

  return (
    <Section tone="light" id="co-share">
      <div className="max-w-2xl">
        <Reveal>
          <Eyebrow>{t("wsp.cos.eyebrow")}</Eyebrow>
        </Reveal>
        <Reveal index={1}>
          <RichText as="h2" className="mt-5 t-h2 text-deep" accentClassName="text-gradient-brand">
            {t("wsp.cos.title")}
          </RichText>
        </Reveal>
        <Reveal index={2}>
          <p className="mt-5 text-[15.5px] font-light leading-relaxed text-ink-2">
            {t("wsp.cos.lede")}
          </p>
        </Reveal>
      </div>

      <Reveal index={1}>
        <div className="mt-12 grid gap-8 rounded-xl2 border border-line bg-white p-7 shadow-lift sm:p-9 lg:grid-cols-[1fr_0.85fr] lg:gap-14">
          <div>
            {/* Age band */}
            <fieldset>
              <legend className="text-[13.5px] font-medium text-ink-2">{t("wsp.cos.age")}</legend>
              <div className="mt-3 flex flex-wrap gap-2">
                {BANDS.map((b) => {
                  const on = b.band === band;
                  return (
                    <button
                      key={b.band}
                      type="button"
                      aria-pressed={on}
                      onClick={() => setBand(b.band)}
                      className={`rounded-pill border px-4 py-2 text-[13px] font-semibold transition-colors ${
                        on
                          ? "border-teal-ink bg-teal-ink text-white"
                          : "border-line bg-white text-ink-2 hover:border-teal/40 hover:text-teal-ink"
                      }`}
                    >
                      {t(b.labelKey)}
                    </button>
                  );
                })}
              </div>
            </fieldset>

            {/* Bill */}
            <div className="mt-8">
              <div className="flex items-baseline justify-between gap-4">
                <label htmlFor={billId} className="text-[13.5px] font-medium text-ink-2">
                  {t("wsp.cos.bill")}
                </label>
                <output htmlFor={billId} className="font-display text-[17px] font-semibold tracking-[-0.02em] text-deep">
                  {money(bill)}
                </output>
              </div>
              <input
                id={billId}
                type="range"
                min={500}
                max={100_000}
                step={500}
                value={bill}
                onChange={(e) => setBill(Number(e.target.value))}
                className="ws-range mt-3 w-full"
              />
            </div>

            {/* Government hospital */}
            <div className="mt-8 flex items-center justify-between gap-5 rounded-card border border-line bg-mint-soft px-5 py-4">
              <label htmlFor={govId} className="text-[13.5px] font-medium text-ink-2">
                {t("wsp.cos.gov")}
              </label>
              <button
                id={govId}
                type="button"
                role="switch"
                aria-checked={gov}
                onClick={() => setGov((v) => !v)}
                className={`relative h-6 w-11 shrink-0 rounded-pill transition-colors ${
                  gov ? "bg-teal-deep" : "bg-line-2"
                }`}
              >
                <span className="sr-only">{t("wsp.cos.gov")}</span>
                <motion.span
                  aria-hidden="true"
                  className="absolute top-0.5 h-5 w-5 rounded-full bg-white shadow-sm"
                  animate={{ left: gov ? 22 : 2 }}
                  transition={{ duration: reduceMotion ? 0 : 0.2, ease: "easeOut" }}
                />
              </button>
            </div>
          </div>

          {/* Result */}
          <div className="rounded-xl2 border border-line bg-mint-soft p-7">
            <p className="t-eyebrow text-ink-2">{t("wsp.cos.youpay")}</p>
            <p className="mt-2 font-display text-[clamp(36px,6vw,52px)] font-semibold leading-none tracking-[-0.04em] text-teal-ink">
              {money(r.memberPays, 2)}
            </p>

            <p className="mt-6 flex items-baseline justify-between gap-4 border-t border-line pt-5">
              <span className="text-[13.5px] text-ink-2">{t("wsp.cos.community")}</span>
              <span className="font-display text-[19px] font-semibold tracking-[-0.03em] text-deep">
                {money(r.communityShares, 2)}
              </span>
            </p>

            <p className="mt-5 text-[13.5px] font-light leading-relaxed text-ink-2">{explain}</p>
          </div>
        </div>
      </Reveal>

      <Reveal index={2}>
        <ul className="mt-6 grid gap-3 sm:grid-cols-2">
          {["r1", "r2", "r3", "r4"].map((k) => (
            <li key={k} className="flex gap-2.5 rounded-card border border-line bg-white px-5 py-4">
              <Check aria-hidden="true" className="mt-0.5 h-4 w-4 shrink-0 text-teal" strokeWidth={2.5} />
              <span className="text-[13.5px] font-light leading-relaxed text-ink-2">
                {t(`wsp.cos.${k}`)}
              </span>
            </li>
          ))}
        </ul>
      </Reveal>

    </Section>
  );
}
