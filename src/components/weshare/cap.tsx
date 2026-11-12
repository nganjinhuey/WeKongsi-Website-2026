"use client";

import React, { useEffect, useId, useRef, useState } from "react";
import { motion, useInView, useReducedMotion } from "framer-motion";
import { ArrowDown, Info } from "lucide-react";
import { useTranslation } from "@/hooks/useTranslation";
import { programFacts } from "@/data/site";
import { latestReport, sharingReports } from "@/data/sharing-reports";
import { monthlyShare, SHARING_CAP } from "@/lib/weshare-math";
import { Section, Eyebrow } from "@/components/ui/section";
import RichText from "@/components/RichText";
import Reveal from "@/components/ui/reveal";
import Orbs from "@/components/ui/orbs";

const money = (n: number, dp = 0) =>
  `RM${n.toLocaleString("en-MY", { minimumFractionDigits: dp, maximumFractionDigits: dp })}`;
const count = (n: number) => n.toLocaleString("en-MY");

/**
 * The slider ranges.
 *
 * Both are set from what the programme actually does, not from what makes a big
 * number. The worst month on record is a little over half a million ringgit and the
 * membership has never passed ten thousand, so a slider that ran to thirty thousand
 * members spent most of its travel in territory the programme has never been in — and
 * a reader who drags a control into fiction learns nothing from where it lands.
 */
const BILLS_MAX = 800_000;
const BILLS_STEP = 5_000;
const MEMBERS_MIN = 1_000;
const MEMBERS_MAX = 10_000;
const MEMBERS_STEP = 250;

const snap = (n: number, step: number, min = 0, max = Infinity) =>
  Math.min(max, Math.max(min, Math.round(n / step) * step));

/**
 * Where the opening run lands: the most recent real month in which the division came
 * out at least half as much again as the cap.
 *
 * It has to be a month the cap visibly bit, or the demonstration demonstrates nothing
 * — October 2026 divides to RM60.65, and a bar that arrives one per cent past the mark
 * reads as a rounding error rather than as a ceiling. Derived rather than written down
 * so it follows the reports instead of drifting from them, and it falls back to the
 * latest month if no such month exists.
 */
const demoMonth =
  [...sharingReports].reverse().find((r) => r.cost / r.active >= SHARING_CAP * 1.4) ?? latestReport;

const LANDING = {
  bills: snap(demoMonth.cost, BILLS_STEP, 0, BILLS_MAX),
  members: snap(demoMonth.active, MEMBERS_STEP, MEMBERS_MIN, MEMBERS_MAX),
};

/** How long the opening run takes, and the ease it runs on. */
const RUN_MS = 1700;
const easeOut = (p: number) => 1 - Math.pow(1 - p, 3);

function Slider({
  label,
  value,
  min,
  max,
  step,
  onChange,
  onTakeOver,
  display,
  auto,
}: {
  label: string;
  value: number;
  min: number;
  max: number;
  step: number;
  onChange: (n: number) => void;
  /** Called the instant the reader touches the control, so the run stands down. */
  onTakeOver: () => void;
  display: string;
  auto: boolean;
}) {
  const id = useId();
  const pct = ((value - min) / (max - min)) * 100;

  return (
    <div>
      <div className="flex items-baseline justify-between gap-4">
        <label htmlFor={id} className="text-[13.5px] font-medium text-ink-2">
          {label}
        </label>
        {/* `tabular-nums` is not a nicety here: without it the readout reflows on every
            frame of the run and the whole row jitters. */}
        <output
          htmlFor={id}
          className="font-display text-[20px] font-semibold tabular-nums tracking-[-0.025em] text-deep"
        >
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
        data-auto={auto}
        onChange={(e) => {
          onTakeOver();
          onChange(Number(e.target.value));
        }}
        onPointerDown={onTakeOver}
        onKeyDown={onTakeOver}
        className="ws-range mt-3.5"
        /* Nudged by half a thumb at each end so the fill meets the thumb's centre. */
        style={{ "--pct": `calc(${pct}% + ${11 - (pct / 100) * 22}px)` } as React.CSSProperties}
      />
    </div>
  );
}

/**
 * The cap, shown by letting the reader drive the arithmetic — after the widget has
 * driven it once itself.
 *
 * The section makes one claim: your share moves, and then it stops. A pair of sliders
 * sitting still makes that claim in text and leaves the demonstration to whoever
 * bothers to drag something. So the first time the widget comes into view it runs
 * itself up to a real month, the readout climbs, the bar crosses the ceiling and
 * halts — and then it hands over. Any touch, drag or key during the run stands the run
 * down immediately rather than fighting the reader for the control.
 *
 * Under `prefers-reduced-motion` there is no run at all: the widget simply opens on
 * the month it would have landed on, which is the same information without the motion.
 *
 * The maths lives in `weshare-math.ts` and is unit-tested, because these are claims
 * about members' money: the month's approved expenses divided across active members,
 * held at the cap, with the balance carried forward. Nothing here invents a rule — it
 * is the same calculation the programme publishes each month.
 */
export default function WsxCap() {
  const { t } = useTranslation();
  const reduceMotion = useReducedMotion();

  const host = useRef<HTMLDivElement>(null);
  const inView = useInView(host, { once: true, amount: 0.3 });

  const [bills, setBills] = useState(0);
  const [members, setMembers] = useState(MEMBERS_MIN);
  const [auto, setAuto] = useState(true);

  /* A ref as well as state: the run reads it inside a rAF callback, where a state
     value captured at effect time would be stale for the rest of the run. */
  const handedOver = useRef(false);
  const takeOver = () => {
    handedOver.current = true;
    setAuto(false);
  };

  useEffect(() => {
    if (!inView || handedOver.current) return;

    /* Reduced motion is the same run with no duration: the first frame computes a
       progress of 1 and the widget simply opens on the month it would have arrived
       at. One path rather than two, and nothing is set synchronously inside the
       effect either way. */
    const duration = reduceMotion ? 0 : RUN_MS;
    let raf = 0;
    const start = performance.now();

    const tick = (now: number) => {
      if (handedOver.current) return;
      const e = duration === 0 ? 1 : easeOut(Math.min(1, (now - start) / duration));
      setBills(snap(LANDING.bills * e, BILLS_STEP, 0, BILLS_MAX));
      setMembers(
        snap(
          MEMBERS_MIN + (LANDING.members - MEMBERS_MIN) * e,
          MEMBERS_STEP,
          MEMBERS_MIN,
          MEMBERS_MAX,
        ),
      );
      if (e < 1) raf = requestAnimationFrame(tick);
      else setAuto(false);
    };

    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [inView, reduceMotion]);

  const r = monthlyShare(bills, members, programFacts.sharingCap);

  /* The bar is the raw share split at the cap, so both parts are shares of the same
     whole. Drawn against an absolute scale instead, a worse month shrank the teal
     segment while the figure beside it stayed at RM60, which read as the opposite of
     what had happened. */
  const scaleMax = Math.max(SHARING_CAP, r.rawShare);
  const paidPct = (r.perMember / scaleMax) * 100;
  const carriedPct = Math.max(0, 100 - paidPct);

  const verdict = bills <= 0 ? "wsx.cap.none" : r.capped ? "wsx.cap.capped" : "wsx.cap.under";
  const spring = { duration: reduceMotion ? 0 : 0.45, ease: [0.22, 0.61, 0.36, 1] as const };

  return (
    <Section tone="soft" id="cap" backdrop={<Orbs />}>
      <div className="mx-auto max-w-3xl text-center">
        <Reveal>
          <Eyebrow className="justify-center">{t("wsx.cap.eyebrow")}</Eyebrow>
        </Reveal>
        <Reveal index={1}>
          <RichText as="h2" className="mt-5 t-h2 text-deep" accentClassName="text-gradient-brand">
            {t("wsx.cap.title")}
          </RichText>
        </Reveal>
        <Reveal index={2}>
          <p className="mx-auto mt-5 max-w-2xl text-[15.5px] leading-relaxed text-ink-2">
            {t("wsx.cap.lede")}
          </p>
        </Reveal>
      </div>

      <Reveal index={1}>
        <div
          ref={host}
          className="relative mt-12 overflow-hidden rounded-[32px] border border-line bg-white shadow-tide-lg lg:mt-16"
        >
          <div className="grid lg:grid-cols-[0.86fr_1.14fr]">
            {/* ---- Controls ---- */}
            <div className="border-b border-line p-7 sm:p-9 lg:border-b-0 lg:border-r">
              <div className="space-y-9">
                <Slider
                  label={t("wsx.cap.bills")}
                  value={bills}
                  min={0}
                  max={BILLS_MAX}
                  step={BILLS_STEP}
                  onChange={setBills}
                  onTakeOver={takeOver}
                  display={money(bills)}
                  auto={auto}
                />
                <Slider
                  label={t("wsx.cap.members")}
                  value={members}
                  min={MEMBERS_MIN}
                  max={MEMBERS_MAX}
                  step={MEMBERS_STEP}
                  onChange={setMembers}
                  onTakeOver={takeOver}
                  display={count(members)}
                  auto={auto}
                />
              </div>

              {/* The hint only appears once the widget has stopped moving: offered while
                  the thumbs are still travelling it would be an instruction to interrupt
                  the thing the reader is watching. */}
              <motion.p
                aria-live="polite"
                initial={false}
                animate={{ opacity: auto ? 0 : 1 }}
                transition={{ duration: reduceMotion ? 0 : 0.4 }}
                className="mt-7 text-[13px] font-medium text-teal-deep"
              >
                {t("wsx.cap.drag")}
              </motion.p>

              <p className="mt-7 flex gap-2.5 rounded-card border border-line bg-mint-soft p-4 text-[12.5px] leading-relaxed text-ink-2">
                <Info aria-hidden="true" className="mt-0.5 h-4 w-4 shrink-0 text-teal-ink" />
                {t("wsx.cap.note")}
              </p>
            </div>

            {/* ---- Readout ---- */}
            {/* The one tinted surface in the panel. A white readout beside white controls
                made the whole card one flat sheet; the stage gradient separates the half
                that is read from the half that is driven, without a second border. */}
            <div className="relative bg-grad-stage p-7 sm:p-9">
              <div className="grid items-start gap-6 sm:grid-cols-[1fr_auto_1fr] sm:gap-4">
                <div>
                  <p className="t-eyebrow text-ink-2">{t("wsx.cap.before")}</p>
                  <p className="mt-2.5 font-display text-[clamp(26px,3.4vw,34px)] font-semibold leading-none tabular-nums tracking-[-0.04em] text-ink-3">
                    {money(r.rawShare, 2)}
                  </p>
                  <p className="mt-2 text-[12.5px] text-ink-2">{t("wsx.cap.beforeNote")}</p>
                </div>

                {/* The reduction, drawn. Down on a stacked phone layout, across on a
                    desktop row — the arrow has to point the way the eye travels or it
                    contradicts the layout it sits in. */}
                <span
                  aria-hidden="true"
                  className="grid h-9 w-9 shrink-0 place-items-center self-center justify-self-start rounded-full border border-line bg-white/80 text-teal-deep sm:justify-self-center"
                >
                  <ArrowDown className="h-4 w-4 sm:-rotate-90" strokeWidth={2.2} />
                </span>

                <div>
                  <p className="t-eyebrow text-teal-ink">{t("wsx.cap.after")}</p>
                  <motion.p
                    key={r.perMember}
                    initial={reduceMotion ? false : { opacity: 0, y: 5 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.22 }}
                    className="text-gradient-brand mt-2.5 font-display text-[clamp(36px,5vw,50px)] font-semibold leading-none tabular-nums tracking-[-0.045em]"
                  >
                    {money(r.perMember, 2)}
                  </motion.p>
                  <p className="mt-2 text-[12.5px] text-ink-2">{t("wsx.cap.afterNote")}</p>
                </div>
              </div>

              {/* One bar, split at the cap: what you share lit, what the cap holds back
                  hatched beyond it. Two stacked bars were unreadable whenever the
                  overshoot was small — a 1% overshoot drew as two identical bars.

                  The 2px gap between the segments is the panel showing through, not a
                  border: two fills that meet edge to edge read as one shape whatever
                  their colours. */}
              <div className="mt-9">
                <div className="relative h-6 w-full overflow-hidden rounded-pill bg-mint-deep ring-1 ring-inset ring-line">
                  <motion.span
                    aria-hidden="true"
                    className="absolute inset-y-0 right-0 bg-[repeating-linear-gradient(135deg,rgba(49,90,120,.45)_0_6px,transparent_6px_12px)]"
                    animate={{ width: `${carriedPct}%` }}
                    transition={spring}
                  />
                  <motion.span
                    aria-hidden="true"
                    className="absolute inset-y-0 left-0 rounded-pill bg-grad-pill shadow-glow-sm"
                    animate={{ width: `calc(${paidPct}% - ${paidPct > 0 && carriedPct > 0 ? 2 : 0}px)` }}
                    transition={spring}
                  />
                </div>

                {/* Each segment is labelled with its own figure rather than the legend
                    carrying a "RM60 cap" marker off to the right — the bar's right-hand
                    end is the raw share, not the cap, so a cap label parked there named
                    the wrong edge. The carried entry appears only when there is a
                    carried segment to name. */}
                <p className="mt-3.5 flex flex-wrap items-center gap-x-6 gap-y-2 text-[11.5px] font-semibold uppercase tracking-[0.08em] text-ink-2">
                  <span className="flex items-center gap-2">
                    <span aria-hidden="true" className="h-2.5 w-2.5 rounded-sm bg-grad-pill" />
                    {t("wsx.cap.yourShare")}
                    <span className="tabular-nums text-teal-ink">{money(r.perMember, 2)}</span>
                  </span>
                  {r.capped && (
                    <span className="flex items-center gap-2">
                      <span
                        aria-hidden="true"
                        className="h-2.5 w-2.5 rounded-sm bg-[repeating-linear-gradient(135deg,rgba(49,90,120,.6)_0_3px,transparent_3px_6px)] ring-1 ring-line"
                      />
                      {t("wsx.cap.carriedShort")}
                      <span className="tabular-nums text-deep">
                        {money(r.carriedPerMember, 2)}
                      </span>
                    </span>
                  )}
                </p>
              </div>

              <p className="mt-8 border-t border-line-2 pt-6 text-[14px] leading-relaxed text-ink-2">
                {t(verdict)}
              </p>

              {r.capped && (
                <p className="mt-4 flex items-baseline justify-between gap-4">
                  <span className="text-[13px] text-ink-2">{t("wsx.cap.carried")}</span>
                  <span className="font-display text-[17px] font-semibold tabular-nums text-deep">
                    {money(r.carriedTotal, 2)}
                  </span>
                </p>
              )}
            </div>
          </div>
        </div>
      </Reveal>
    </Section>
  );
}
