"use client";

import React from "react";
import { motion, useInView, useReducedMotion } from "framer-motion";
import { ArrowUpRight, IdCard, CalendarClock, FileX2 } from "lucide-react";
import { useTranslation } from "@/hooks/useTranslation";
import { external } from "@/lib/routes";
import { Section, Eyebrow } from "@/components/ui/section";
import RichText from "@/components/RichText";
import Reveal from "@/components/ui/reveal";
import Placeholder from "@/components/ui/placeholder";

/** The waiting periods, in days, drawn to scale against the longest one. */
const WAITS = [
  { key: "w1", days: 1 },
  { key: "w2", days: 90 },
  { key: "w3", days: 90 },
  { key: "w4", days: 180 },
  { key: "w5", days: 180 },
];
const LONGEST = Math.max(...WAITS.map((w) => w.days));

/** Bars that grow to their true proportion once the card is on screen. */
function WaitBars() {
  const { t } = useTranslation();
  const ref = React.useRef<HTMLUListElement>(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });
  const reduceMotion = useReducedMotion();

  return (
    <ul ref={ref} className="mt-6 space-y-4">
      {WAITS.map((w, i) => (
        <li key={w.key}>
          <p className="text-[13px] font-light leading-snug text-ink-2">
            {t(`wsp.join.wait.${w.key}`)}
          </p>
          <div className="mt-1.5 h-2 w-full overflow-hidden rounded-pill bg-mint-deep">
            <motion.span
              className="block h-full rounded-pill bg-teal"
              initial={{ width: reduceMotion ? `${(w.days / LONGEST) * 100}%` : 0 }}
              animate={inView ? { width: `${(w.days / LONGEST) * 100}%` } : undefined}
              transition={{ duration: reduceMotion ? 0 : 0.7, delay: reduceMotion ? 0 : i * 0.08, ease: [0.22, 0.61, 0.36, 1] }}
            />
          </div>
        </li>
      ))}
    </ul>
  );
}

export default function WsJoin() {
  const { t } = useTranslation();

  const eligibility = [
    { labelKey: "wsp.join.elig.age", ph: "wsp.ph.entryAge" },
    { labelKey: "wsp.join.elig.renew", ph: "wsp.ph.renewAge" },
    { labelKey: "wsp.join.elig.who", ph: "wsp.ph.who" },
    { labelKey: "wsp.join.elig.health", ph: "wsp.ph.health" },
    { labelKey: "wsp.join.elig.pre", ph: "wsp.ph.pre" },
  ];

  return (
    <Section tone="soft" id="before-you-join">
      <div className="max-w-2xl">
        <Reveal>
          <Eyebrow>{t("wsp.join.eyebrow")}</Eyebrow>
        </Reveal>
        <Reveal index={1}>
          <RichText as="h2" className="mt-5 t-h2 text-deep" accentClassName="text-gradient-brand">
            {t("wsp.join.title")}
          </RichText>
        </Reveal>
      </div>

      <div className="mt-12 grid gap-5 lg:grid-cols-3">
        <Reveal>
          <article className="h-full rounded-xl2 border border-line bg-white p-7">
            <span className="grid h-11 w-11 place-items-center rounded-card bg-mint text-teal-ink">
              <IdCard aria-hidden="true" className="h-5 w-5" />
            </span>
            <h3 className="mt-5 font-display text-[17px] font-semibold tracking-[-0.02em] text-deep">
              {t("wsp.join.elig.t")}
            </h3>
            <dl className="mt-5 space-y-3.5">
              {eligibility.map((e) => (
                <div key={e.labelKey} className="border-b border-line pb-3.5 last:border-0 last:pb-0">
                  <dt className="text-[13px] font-light text-ink-2">{t(e.labelKey)}</dt>
                  <dd className="mt-1.5">
                    <Placeholder>{t(e.ph)}</Placeholder>
                  </dd>
                </div>
              ))}
            </dl>
          </article>
        </Reveal>

        <Reveal index={1}>
          <article className="h-full rounded-xl2 border border-line bg-white p-7">
            <span className="grid h-11 w-11 place-items-center rounded-card bg-mint text-teal-ink">
              <CalendarClock aria-hidden="true" className="h-5 w-5" />
            </span>
            <h3 className="mt-5 font-display text-[17px] font-semibold tracking-[-0.02em] text-deep">
              {t("wsp.join.wait.t")}
            </h3>
            <WaitBars />
          </article>
        </Reveal>

        <Reveal index={2}>
          <article className="flex h-full flex-col rounded-xl2 border border-line bg-white p-7">
            <span className="grid h-11 w-11 place-items-center rounded-card bg-mint text-teal-ink">
              <FileX2 aria-hidden="true" className="h-5 w-5" />
            </span>
            <h3 className="mt-5 font-display text-[17px] font-semibold tracking-[-0.02em] text-deep">
              {t("wsp.join.excl.t")}
            </h3>
            <p className="mt-5">
              <Placeholder>{t("wsp.ph.excl")}</Placeholder>
            </p>
            <div className="mt-auto pt-6">
              <a
                href={external.guidelines}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-[14px] font-semibold text-teal-ink underline-offset-4 hover:underline"
              >
                {t("wsp.join.excl.link")}
                <ArrowUpRight aria-hidden="true" className="h-4 w-4" />
              </a>
              <p className="mt-3">
                <Placeholder>{t("wsp.ph.guidelines")}</Placeholder>
              </p>
            </div>
          </article>
        </Reveal>
      </div>
    </Section>
  );
}
