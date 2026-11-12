"use client";

import React from "react";
import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import { ArrowRight, FileCheck2, Users, Wallet, Hospital } from "lucide-react";
import { useTranslation } from "@/hooks/useTranslation";
import { external } from "@/lib/routes";
import { programFacts } from "@/data/site";
import { panelCounts } from "@/data/hospitals";
import { latestReport, MONTH_SHORT } from "@/data/sharing-reports";
import { monthlyShare } from "@/lib/weshare-math";
import { Button } from "@/components/ui/button";
import Aurora from "@/components/ui/aurora";
import Counter from "@/components/ui/counter";
import RichText from "@/components/RichText";

const money = (n: number, dp = 0) =>
  `RM${n.toLocaleString("en-MY", { minimumFractionDigits: dp, maximumFractionDigits: dp })}`;

const STEPS = [
  { key: "wsp.hero.f1", Icon: Hospital },
  { key: "wsp.hero.f2", Icon: FileCheck2 },
  { key: "wsp.hero.f3", Icon: Users },
  { key: "wsp.hero.f4", Icon: Wallet },
];

/**
 * The four stages a bill passes through, with a token that travels along them.
 *
 * The token is one element moving across a track rather than four that fade in turn:
 * the point being made is that a single bill becomes everyone's small share, and only
 * a continuous movement says that. It shrinks as it passes the third stage, which is
 * where the splitting happens.
 */
function FlowStrip() {
  const { t } = useTranslation();
  const reduceMotion = useReducedMotion();

  return (
    <div className="relative">
      <ol className="relative grid grid-cols-2 gap-x-4 gap-y-6 sm:grid-cols-4 sm:gap-x-3">
        {/* The rail the token runs along. Hidden on the stacked layout, where a
            horizontal journey would be a lie. */}
        <span
          aria-hidden="true"
          className="absolute left-[12.5%] right-[12.5%] top-6 hidden h-px bg-line-2 sm:block"
        />
        {!reduceMotion && (
          <motion.span
            aria-hidden="true"
            className="absolute top-[18px] hidden h-3 w-3 rounded-sm bg-teal shadow-glow-sm sm:block"
            initial={{ left: "12.5%", scale: 1, borderRadius: 3 }}
            animate={{
              left: ["12.5%", "37.5%", "62.5%", "87.5%", "87.5%"],
              scale: [1, 1, 0.9, 0.45, 0.45],
              opacity: [1, 1, 1, 1, 0],
            }}
            transition={{ duration: 6, times: [0, 0.28, 0.56, 0.84, 1], repeat: Infinity, ease: "easeInOut" }}
            style={{ marginLeft: -6 }}
          />
        )}

        {STEPS.map(({ key, Icon }, i) => (
          <li key={key} className="relative text-center">
            <span className="mx-auto grid h-12 w-12 place-items-center rounded-xl border border-line bg-white text-teal-ink shadow-sm">
              <Icon aria-hidden="true" className="h-5 w-5" strokeWidth={1.75} />
            </span>
            <p className="mt-3 text-[13px] font-medium leading-snug text-deep">{t(key)}</p>
            <span className="sr-only">{i + 1}</span>
          </li>
        ))}
      </ol>
    </div>
  );
}

export default function WsHero() {
  const { t, href } = useTranslation();
  const share = monthlyShare(latestReport.cost, latestReport.active, programFacts.sharingCap);
  const month = `${MONTH_SHORT[latestReport.month]} ${latestReport.year}`;

  const stats = [
    { v: programFacts.annualLimit, prefix: "RM", label: "wsp.hero.s1" },
    { v: programFacts.sharingCap, prefix: "RM", label: "wsp.hero.s2" },
    { v: panelCounts.total, prefix: "", label: "wsp.hero.s3" },
    { v: programFacts.waitingPeriodDays, prefix: "", suffix: "-day", label: "wsp.hero.s4" },
  ];

  return (
    <section className="relative overflow-hidden bg-mint-soft pb-16 pt-[104px] lg:pb-20 lg:pt-[136px]">
      <Aurora />

      <div className="container relative">
        <div className="grid gap-12 lg:grid-cols-[1.1fr_0.9fr] lg:items-center lg:gap-14">
          <div>
            <span className="inline-flex items-center rounded-pill border border-line bg-white/80 px-3.5 py-1.5 text-[11.5px] font-semibold uppercase tracking-[0.1em] text-teal-ink backdrop-blur">
              {t("wsp.hero.pill")}
            </span>

            {/* Transform only, no fade: an element at opacity 0 is not eligible for LCP
                until it becomes visible, which would make the headline wait on hydration. */}
            <RichText
              as="h1"
              className="mt-6 t-display animate-[rise_.8s_cubic-bezier(.22,.61,.36,1)_both] text-deep motion-reduce:animate-none"
              accentClassName="text-gradient-brand"
            >
              {t("wsp.hero.title")}
            </RichText>

            <p className="mt-6 max-w-xl text-[16px] font-light leading-relaxed text-ink-2 sm:text-[17.5px]">
              {t("wsp.hero.lede")}
            </p>

            <div className="mt-8 flex flex-wrap gap-3">
              <Button asChild size="lg">
                <a href={external.join} target="_blank" rel="noopener noreferrer">
                  {t("wsp.cta.join")}
                  <ArrowRight className="h-5 w-5" />
                </a>
              </Button>
              <Button asChild size="lg" variant="outline">
                <Link href={href("/transparency")}>{t("nav.transparency")}</Link>
              </Button>
            </div>
          </div>

          {/* The newest published month, so the claim above it is checkable immediately. */}
          <div className="relative">
            <div className="rounded-xl2 border border-line bg-white/85 p-7 shadow-lift backdrop-blur-sm sm:p-8">
              <p className="t-eyebrow text-teal-ink">{t("wsp.hero.latest")}</p>
              <p className="mt-1 font-display text-[22px] font-semibold tracking-[-0.03em] text-deep">
                {month}
              </p>

              <dl className="mt-6 grid grid-cols-2 gap-x-5 gap-y-5">
                <div>
                  <dt className="sr-only">{t("wsp.hero.cases")}</dt>
                  <dd className="font-display text-[26px] font-semibold tracking-[-0.03em] text-deep">
                    <Counter value={latestReport.cases} />
                  </dd>
                  <dd className="mt-0.5 text-[12.5px] text-ink-2">{t("wsp.hero.cases")}</dd>
                </div>
                <div>
                  <dt className="sr-only">{t("wsp.hero.members")}</dt>
                  <dd className="font-display text-[26px] font-semibold tracking-[-0.03em] text-deep">
                    <Counter value={latestReport.active} />
                  </dd>
                  <dd className="mt-0.5 text-[12.5px] text-ink-2">{t("wsp.hero.members")}</dd>
                </div>
                <div className="col-span-2">
                  <dt className="sr-only">{t("wsp.hero.bills")}</dt>
                  <dd className="font-display text-[26px] font-semibold tracking-[-0.03em] text-deep">
                    <Counter value={latestReport.cost} decimals={2} prefix="RM" />
                  </dd>
                  <dd className="mt-0.5 text-[12.5px] text-ink-2">{t("wsp.hero.bills")}</dd>
                </div>
              </dl>

              <RichText
                as="p"
                className="mt-6 border-t border-line pt-5 text-[13.5px] leading-relaxed text-ink-2"
              >
                {t("wsp.hero.capline", {
                  raw: money(share.rawShare, 2),
                  paid: money(share.perMember, 2),
                })}
              </RichText>
            </div>
          </div>
        </div>

        <div className="mt-14 rounded-xl2 border border-line bg-white/70 p-7 backdrop-blur-sm lg:mt-16 lg:p-9">
          <h2 className="sr-only">{t("wsp.hero.flow.title")}</h2>
          <FlowStrip />
        </div>

        <dl className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {stats.map((s) => (
            <div key={s.label} className="rounded-card border border-line bg-white/70 px-6 py-6 backdrop-blur-sm">
              <dt className="font-display text-[26px] font-semibold tracking-[-0.03em] text-teal-ink sm:text-[30px]">
                <Counter value={s.v} prefix={s.prefix} suffix={s.suffix ?? ""} />
              </dt>
              <dd className="mt-2 text-[13px] font-light leading-snug text-ink-2">{t(s.label)}</dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}
