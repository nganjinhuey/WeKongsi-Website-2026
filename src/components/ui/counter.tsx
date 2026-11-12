"use client";

import React, { useEffect, useRef, useState } from "react";
import { animate, useInView, useReducedMotion } from "framer-motion";

type Props = {
  value: number;
  decimals?: number;
  prefix?: string;
  suffix?: string;
  className?: string;
};

const format = (n: number, decimals: number) =>
  n.toLocaleString("en-MY", { minimumFractionDigits: decimals, maximumFractionDigits: decimals });

/**
 * Counts up once when the number scrolls into view.
 *
 * The final value is rendered on the server and is what a crawler or a reader with
 * reduced motion enabled sees — the animation only ever replaces an already-correct
 * number, so the figure is never missing or mid-count in the markup.
 */
export default function Counter({ value, decimals = 0, prefix = "", suffix = "", className }: Props) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });
  const reduceMotion = useReducedMotion();
  const [display, setDisplay] = useState(() => format(value, decimals));

  useEffect(() => {
    if (!inView || reduceMotion) return;
    const controls = animate(0, value, {
      duration: 1.8,
      ease: "easeOut",
      onUpdate: (latest) => setDisplay(format(latest, decimals)),
    });
    return () => controls.stop();
  }, [inView, reduceMotion, value, decimals]);

  return (
    <span ref={ref} className={className}>
      {prefix}
      {display}
      {suffix}
    </span>
  );
}
