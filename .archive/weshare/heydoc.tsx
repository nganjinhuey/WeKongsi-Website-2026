"use client";

import React from "react";
import { motion, useInView, useReducedMotion } from "framer-motion";
import { useTranslation } from "@/hooks/useTranslation";
import { programFacts } from "@/data/site";
import { Section } from "@/components/ui/section";
import RichText from "@/components/RichText";
import Reveal from "@/components/ui/reveal";

const CHAT = [
  { key: "wsp.heydoc.chat1", from: "member" as const },
  { key: "wsp.heydoc.chat2", from: "doctor" as const },
  { key: "wsp.heydoc.chat3", from: "member" as const },
];

/**
 * A phone showing a consultation arriving message by message.
 *
 * Drawn rather than photographed: the alternative was a stock photo of someone holding
 * a phone, which shows the device and not the thing being sold. It plays once when it
 * reaches the screen, and with reduced motion every message is simply already there.
 */
function PhoneMock() {
  const ref = React.useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });
  const reduceMotion = useReducedMotion();
  const { t } = useTranslation();

  return (
    <div ref={ref} className="mx-auto w-full max-w-[290px]">
      <div className="rounded-[2rem] border border-line bg-white p-3 shadow-lift">
        <div className="relative overflow-hidden rounded-[1.5rem] bg-mint-soft px-4 pb-6 pt-5">
          <span aria-hidden="true" className="mx-auto mb-5 block h-1.5 w-16 rounded-pill bg-line-2" />
          <ul className="space-y-3">
            {CHAT.map((m, i) => (
              <motion.li
                key={m.key}
                initial={reduceMotion ? false : { opacity: 0, y: 10 }}
                animate={inView ? { opacity: 1, y: 0 } : undefined}
                transition={{ duration: reduceMotion ? 0 : 0.4, delay: reduceMotion ? 0 : 0.3 + i * 0.5 }}
                className={m.from === "member" ? "flex justify-end" : "flex justify-start"}
              >
                <span
                  className={`max-w-[85%] rounded-2xl px-3.5 py-2.5 text-[12.5px] leading-snug ${
                    m.from === "member"
                      ? "rounded-br-sm bg-teal-ink text-white"
                      : "rounded-bl-sm border border-line bg-white text-ink-2"
                  }`}
                >
                  {t(m.key)}
                </span>
              </motion.li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}

export default function WsHeydoc() {
  const { t } = useTranslation();

  return (
    <Section tone="light" id="heydoc">
      <div className="grid items-center gap-12 lg:grid-cols-[1.05fr_0.95fr] lg:gap-16">
        <div>
          <Reveal>
            <span className="inline-flex rounded-pill bg-sand px-3.5 py-1.5 text-[10.5px] font-bold uppercase tracking-[0.12em] text-deep">
              {t("wsp.heydoc.pill")}
            </span>
          </Reveal>
          <Reveal index={1}>
            <RichText as="h2" className="mt-5 t-h2 text-deep" accentClassName="text-gradient-brand">
              {t("wsp.heydoc.title")}
            </RichText>
          </Reveal>
          <Reveal index={2}>
            <p className="mt-5 max-w-xl text-[15.5px] font-light leading-relaxed text-ink-2">
              {t("wsp.heydoc.lede")}
            </p>
          </Reveal>
          <Reveal index={3}>
            <p className="mt-6 flex flex-wrap items-baseline gap-x-2">
              <span className="font-display text-[40px] font-semibold leading-none tracking-[-0.04em] text-teal-ink">
                RM{programFacts.cobMonthly}
              </span>
              <span className="text-[15px] text-ink-2">{t("wsp.heydoc.permonth")}</span>
            </p>
          </Reveal>

          <div className="mt-9 grid gap-4 sm:grid-cols-2">
            {[1, 2, 3, 4].map((n, i) => (
              <Reveal key={n} index={i % 2}>
                <div className="h-full rounded-card border border-line bg-mint-soft p-5">
                  <h3 className="font-display text-[14.5px] font-semibold leading-snug tracking-[-0.02em] text-deep">
                    {t(`wsp.heydoc.f${n}.t`)}
                  </h3>
                  <p className="mt-2 text-[13px] font-light leading-relaxed text-ink-2">
                    {t(`wsp.heydoc.f${n}.d`)}
                  </p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>

        <Reveal index={1}>
          <PhoneMock />
        </Reveal>
      </div>
    </Section>
  );
}
