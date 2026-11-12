"use client";

import React, { useEffect, useRef } from "react";
import { cn } from "@/lib/utils";

type RevealProps = {
  children: React.ReactNode;
  className?: string;
  /** Stagger index — each step delays the entrance by 90ms. */
  index?: number;
  as?: React.ElementType;
  /**
   * Adds a clearing blur to the rise. Reserved for a section that deserves an
   * entrance — it forces a containing block and repaints the whole subtree, which is
   * wasted on a row of small cards.
   */
  blur?: boolean;
};

/**
 * The site's single scroll-entrance primitive. Everything below the fold uses it, so the
 * page has one motion vocabulary rather than a different easing per section.
 *
 * The hidden state lives in CSS behind `html.js` (see app/globals.css), not in an inline
 * `opacity: 0`. That distinction matters: an inline hidden state ships in the server HTML,
 * so if JavaScript is blocked, fails, or simply has not run yet, every section below the
 * hero is an invisible blank. Gating on a class that a blocking inline script adds before
 * first paint means the page degrades to fully visible, with no flash when JS is present.
 *
 * Above-the-fold headings deliberately do NOT use this — an element at opacity 0 is
 * ignored for LCP until it becomes visible, so the hero animates on transform only.
 */
export default function Reveal({
  children,
  className,
  index = 0,
  as: Tag = "div",
  blur = false,
}: RevealProps) {
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;

    // Older browsers without IntersectionObserver simply keep the visible state.
    if (typeof IntersectionObserver === "undefined") {
      node.classList.add("is-revealed");
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          entry.target.classList.add("is-revealed");
          observer.unobserve(entry.target);
        }
      },
      { rootMargin: "0px 0px -80px 0px" },
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  return (
    <Tag
      ref={ref}
      className={cn("reveal", blur && "reveal-blur", className)}
      style={index ? ({ "--reveal-delay": `${index * 90}ms` } as React.CSSProperties) : undefined}
    >
      {children}
    </Tag>
  );
}
