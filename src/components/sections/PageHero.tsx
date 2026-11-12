"use client";

import React from "react";
import Image from "next/image";
import { motion, useReducedMotion } from "framer-motion";
import RichText from "@/components/RichText";
import { Eyebrow } from "@/components/ui/section";
import Orbs from "@/components/ui/orbs";
import { cn } from "@/lib/utils";

/**
 * The banner every page opens with.
 *
 * Follows the Angsana reference: a pale wash rather than a photograph or a dark band,
 * the headline centred and set large with its key phrase in the brand gradient, and
 * nothing else competing for the first screen. A photograph behind a headline costs a
 * scrim, and a scrim costs contrast — this way the type is simply ink on near-white.
 *
 * Entrance is transform-only. The h1 here is the LCP element on every inner page, and
 * an element at opacity 0 is not eligible for LCP until it becomes visible.

 */
export default function PageHero({
  eyebrow,
  title,
  lede,
  children,
  below,
  image,
  accentClassName = "text-gradient-brand",
  className,
}: {
  eyebrow?: string;
  title: string;
  lede?: string;
  children?: React.ReactNode;
  /** Sits under the copy, full width — the homepage puts its figures strip here. */
  below?: React.ReactNode;
  /**
   * Optional photograph behind the wash. It goes under `.hero-veil`, the same scrim
   * the WeShare hero uses — a white pool over the copy, the palette's own ramp so the
   * picture reads as part of the band, and a fade to white at the foot. Every alpha
   * in it was set by measuring rendered contrast, so the type stays dark on near-white
   * rather than the band flipping to a dark treatment.
   */
  image?: { src: string; alt: string; objectPosition?: string };
  /** Overrides the accent treatment — the homepage uses the travelling sweep. */
  accentClassName?: string;
  className?: string;
}) {
  const reduceMotion = useReducedMotion();

  const rise = {
    hidden: { y: reduceMotion ? 0 : 20 },
    show: (i: number) => ({
      y: 0,
      transition: { duration: 0.8, delay: 0.05 + i * 0.1, ease: [0.16, 1, 0.3, 1] as const },
    }),
  };

  return (
    <section
      className={cn("on-light bg-hero-soft grain relative isolate overflow-hidden", className)}
    >
      {image && (
        <>
          <Image
            src={image.src}
            alt={image.alt}
            fill
            priority
            sizes="100vw"
            className="-z-20 object-cover"
            style={{ objectPosition: image.objectPosition ?? "50% 50%" }}
          />
          <div aria-hidden="true" className="hero-veil absolute inset-0 -z-10" />
        </>
      )}

      <Orbs />

      {/* A turquoise pool under the foot of the band, below everything there is to
          read. It breathes on a 7s loop, which is the one piece of motion here that
          is not scroll-driven — the band is never quite the same twice. The white
          pool that lifts the ground behind the headline is part of `bg-hero-soft`
          itself rather than a layer here, so every hero gets it. */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute bottom-[-10%] left-1/2 -z-10 h-[46%] w-[min(760px,80vw)] -translate-x-1/2 animate-pulse-glow rounded-[50%] bg-[radial-gradient(closest-side,rgba(37,182,165,.26),transparent_72%)] blur-[48px] motion-reduce:animate-none"
      />

      <div className="container relative pb-16 pt-32 text-center sm:pb-20 sm:pt-36 lg:pb-24 lg:pt-40">
        {eyebrow && (
          <motion.div custom={0} variants={rise} initial="hidden" animate="show">
            <Eyebrow className="justify-center">{eyebrow}</Eyebrow>
          </motion.div>
        )}

        <motion.div custom={1} variants={rise} initial="hidden" animate="show">
          <RichText
            as="h1"
            className={cn("t-display mx-auto max-w-5xl text-deep", eyebrow && "mt-6")}
            accentClassName={accentClassName}
          >
            {title}
          </RichText>
        </motion.div>

        {lede && (
          <motion.p
            custom={2}
            variants={rise}
            initial="hidden"
            animate="show"
            className={cn(
              "mx-auto mt-6 max-w-2xl text-[17px] leading-relaxed sm:text-lg",
              /* Over a photograph the lede measured 4.69:1 on `ink-2` — passing, but
                 with nothing to spare if a crop shifts. Petrol buys the headroom in
                 the ink rather than in the scrim, which is the cheaper place to find
                 it: raising the veil costs the picture, darkening the type does not. */
              image ? "font-medium text-ink" : "text-ink-2",
            )}
          >
            {lede}
          </motion.p>
        )}

        {children && (
          <motion.div
            custom={3}
            variants={rise}
            initial="hidden"
            animate="show"
            className="mt-9 flex flex-col items-center gap-3 sm:flex-row sm:justify-center"
          >
            {children}
          </motion.div>
        )}

        {below && <div className="mt-14">{below}</div>}
      </div>
    </section>
  );
}
