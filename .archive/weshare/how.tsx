"use client";

import React, { useEffect, useRef, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { useTranslation } from "@/hooks/useTranslation";
import { Section, Eyebrow } from "@/components/ui/section";
import RichText from "@/components/RichText";
import Reveal from "@/components/ui/reveal";
import Orbs from "@/components/ui/orbs";

const STEPS = [1, 2, 3, 4];

/**
 * The stage that sits beside the steps, drawn in four states.
 *
 * All four states are always in the DOM and cross-faded, rather than mounted and
 * unmounted — swapping elements made the stage flicker on fast scrolls, and keeping
 * them means the layout is measured once.
 */
function Stage({ active }: { active: number }) {
  const reduceMotion = useReducedMotion();
  const show = (n: number) => ({
    opacity: active === n ? 1 : 0,
    scale: reduceMotion ? 1 : active === n ? 1 : 0.96,
  });
  const t = { duration: reduceMotion ? 0 : 0.45, ease: [0.22, 0.61, 0.36, 1] as const };

  return (
    <div
      aria-hidden="true"
      className="relative aspect-square w-full max-w-[420px] overflow-hidden rounded-xl2 border border-white/12 bg-white/[0.04]"
    >
      {/* 1 — one bill */}
      <motion.div animate={show(1)} transition={t} className="absolute inset-0 grid place-items-center">
        <span className="h-32 w-24 rounded-lg border-2 border-turq/60 bg-white/10 sm:h-40 sm:w-30" />
      </motion.div>

      {/* 2 — the same bill, checked */}
      <motion.div animate={show(2)} transition={t} className="absolute inset-0 grid place-items-center">
        <span className="relative h-32 w-24 rounded-lg border-2 border-turq/60 bg-white/10 sm:h-40 sm:w-30">
          <span className="absolute -bottom-3 -right-3 grid h-11 w-11 place-items-center rounded-full bg-turq text-[18px] font-bold text-deep-band">
            &#10003;
          </span>
        </span>
      </motion.div>

      {/* 3 — split into many */}
      <motion.div animate={show(3)} transition={t} className="absolute inset-0 grid place-items-center p-10">
        <span className="grid grid-cols-6 gap-1.5">
          {Array.from({ length: 36 }, (_, i) => (
            <motion.span
              key={i}
              className="aspect-square rounded-[3px] bg-turq/70"
              animate={active === 3 && !reduceMotion ? { opacity: [0, 1] } : { opacity: 1 }}
              transition={{ duration: 0.3, delay: reduceMotion ? 0 : i * 0.012 }}
            />
          ))}
        </span>
      </motion.div>

      {/* 4 — one small share */}
      <motion.div animate={show(4)} transition={t} className="absolute inset-0 grid place-items-center">
        <span className="grid h-24 w-24 place-items-center rounded-xl bg-turq font-display text-[22px] font-semibold tracking-[-0.03em] text-deep-band">
          RM60
        </span>
      </motion.div>
    </div>
  );
}

export default function WsHow() {
  const { t } = useTranslation();
  const [active, setActive] = useState(1);
  const refs = useRef<(HTMLLIElement | null)[]>([]);

  useEffect(() => {
    const nodes = refs.current.filter(Boolean) as HTMLLIElement[];
    if (!nodes.length || typeof IntersectionObserver === "undefined") return;
    const io = new IntersectionObserver(
      (entries) => {
        // The step nearest the middle of the viewport wins, so scrolling either way
        // lands on the one the reader is actually looking at.
        const visible = entries.filter((e) => e.isIntersecting);
        if (!visible.length) return;
        const best = visible.reduce((a, b) => (a.intersectionRatio >= b.intersectionRatio ? a : b));
        const n = Number((best.target as HTMLElement).dataset.step);
        if (n) setActive(n);
      },
      { rootMargin: "-45% 0px -45% 0px", threshold: [0, 0.5, 1] },
    );
    nodes.forEach((n) => io.observe(n));
    return () => io.disconnect();
  }, []);

  return (
    <Section tone="deep" id="how" backdrop={<Orbs tone="dark" />}>
      <div className="max-w-2xl">
        <Reveal>
          <Eyebrow tone="dark">{t("wsp.how.eyebrow")}</Eyebrow>
        </Reveal>
        <Reveal index={1}>
          <RichText as="h2" className="mt-5 t-h2 text-white" accentClassName="text-gradient-light">
            {t("wsp.how.title")}
          </RichText>
        </Reveal>
      </div>

      <div className="mt-14 grid gap-10 lg:grid-cols-2 lg:gap-16">
        <div className="lg:sticky lg:top-28 lg:h-fit lg:self-start">
          <Stage active={active} />
        </div>

        <ol className="space-y-5">
          {STEPS.map((n) => (
            <li
              key={n}
              data-step={n}
              ref={(el) => {
                refs.current[n - 1] = el;
              }}
              className={`rounded-card border p-6 transition-colors duration-500 sm:p-7 ${
                active === n ? "border-turq/40 bg-white/[0.09]" : "border-white/10 bg-white/[0.04]"
              }`}
            >
              <div className="flex items-baseline gap-4">
                <span
                  className={`font-display text-[28px] font-semibold leading-none tracking-[-0.04em] transition-colors duration-500 ${
                    active === n ? "text-turq" : "text-turq/70"
                  }`}
                >
                  {String(n).padStart(2, "0")}
                </span>
                <h3 className="font-display text-[17px] font-semibold tracking-[-0.02em] text-white">
                  {t(`wsp.how.s${n}.t`)}
                </h3>
              </div>
              <p className="mt-3 text-[14.5px] font-light leading-relaxed text-white/80">
                {t(`wsp.how.s${n}.d`)}
              </p>
            </li>
          ))}
        </ol>
      </div>
    </Section>
  );
}
