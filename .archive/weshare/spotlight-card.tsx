"use client";

import React, { useRef } from "react";
import { motion, useMotionTemplate, useMotionValue, useReducedMotion } from "framer-motion";
import { cn } from "@/lib/utils";

/**
 * A card that lights up under the pointer.
 *
 * The glow follows the cursor through motion values rather than React state, so moving
 * across the card does not re-render it. With reduced motion, or on touch where there
 * is no pointer to follow, the glow is simply never mounted.
 */
export default function SpotlightCard({
  children,
  className,
  as: Tag = "div",
}: {
  children: React.ReactNode;
  className?: string;
  as?: React.ElementType;
}) {
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const ref = useRef<HTMLElement>(null);
  const reduceMotion = useReducedMotion();

  const background = useMotionTemplate`radial-gradient(420px circle at ${x}px ${y}px, rgba(0,191,174,.16), transparent 72%)`;

  return (
    <Tag
      ref={ref}
      onPointerMove={(e: React.PointerEvent) => {
        if (e.pointerType === "touch") return;
        const r = (e.currentTarget as HTMLElement).getBoundingClientRect();
        x.set(e.clientX - r.left);
        y.set(e.clientY - r.top);
      }}
      className={cn(
        "card-lift group relative overflow-hidden rounded-xl2 border border-line bg-white",
        className,
      )}
    >
      {!reduceMotion && (
        <motion.span
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
          style={{ background }}
        />
      )}
      <span className="relative block h-full">{children}</span>
    </Tag>
  );
}
