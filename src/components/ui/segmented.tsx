"use client";

import React, { useId } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { cn } from "@/lib/utils";

export type SegmentedOption<T extends string> = { value: T; label: string };

/**
 * A pill of two or three mutually exclusive choices, with the selection sliding
 * between them.
 *
 * The slide is a `layoutId`, not a transition on a positioned element, so the pill
 * travels between buttons of different widths without either of them knowing the
 * other's size. `useId` keys it, because two of these on one page sharing a
 * `layoutId` would animate into each other.
 *
 * Buttons with `aria-pressed`, not a radiogroup: these are not a form field being
 * filled in, they change what is already on screen. The group is labelled, because
 * "Per payment" on its own does not say what it is per payment *of*.
 *
 * White on `grad-pill` is 4.80:1 at its lightest stop; the resting label is `ink-2`,
 * which measures 6.33:1 on the 70%-white container over the accent band.
 */
export default function Segmented<T extends string>({
  options,
  value,
  onChange,
  label,
  className,
}: {
  options: readonly SegmentedOption<T>[];
  value: T;
  onChange: (next: T) => void;
  label: string;
  className?: string;
}) {
  const layoutId = useId();
  const reduceMotion = useReducedMotion();

  return (
    <div
      role="group"
      aria-label={label}
      className={cn(
        "inline-flex rounded-pill border border-white/70 bg-white/70 p-1.5 shadow-tide backdrop-blur-sm",
        className,
      )}
    >
      {options.map((option) => {
        const selected = option.value === value;
        return (
          <button
            key={option.value}
            type="button"
            onClick={() => onChange(option.value)}
            aria-pressed={selected}
            className="relative rounded-pill px-5 py-2.5 text-[14px] font-semibold transition-colors duration-200 focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-teal-deep focus-visible:ring-offset-2 sm:px-6"
          >
            {selected && (
              <motion.span
                aria-hidden="true"
                layoutId={layoutId}
                className="absolute inset-0 rounded-pill bg-grad-pill shadow-glow-sm"
                transition={
                  reduceMotion ? { duration: 0 } : { type: "spring", stiffness: 420, damping: 36 }
                }
              />
            )}
            <span className={cn("relative", selected ? "text-white" : "text-ink-2")}>
              {option.label}
            </span>
          </button>
        );
      })}
    </div>
  );
}
