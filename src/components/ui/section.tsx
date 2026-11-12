import React from "react";
import { cn } from "@/lib/utils";
import RichText from "@/components/RichText";
import Reveal from "@/components/ui/reveal";

/**
 * Section bands, following the EASY reference's rhythm.
 *
 * Dark bands carry `on-dark`, which redefines the ink/surface custom properties for
 * everything inside them (see globals.css) rather than every child branching on a prop.
 * Their backgrounds are gradients, not flat fills — a deep→teal-green ramp with a teal
 * radial bloom, which is what stops a dark section reading as a slab.
 */
export function Section({
  className,
  children,
  id,
  tone = "light",
  backdrop,
}: {
  className?: string;
  children: React.ReactNode;
  id?: string;
  tone?: "light" | "soft" | "deep" | "mint" | "cta" | "accent";
  /**
   * Full-bleed decoration, rendered as a sibling of the container rather than inside it.
   * Children are constrained to the container's max-width and padding, so a decorative
   * layer passed as a child can only cover that box — and its edge shows.
   */
  backdrop?: React.ReactNode;
}) {
  const tones = {
    light: "on-light bg-white",
    soft: "on-light bg-mint-soft",
    mint: "on-light bg-band-mint grain",
    /** A light band that still reads as a distinct section, not a continuation. */
    accent: "on-light bg-band-accent grain",
    /* `band-edge` lays a hairline along the top that is brightest at its centre, so
       the join with the section above reads as light reaching the edge of the band
       rather than as a border drawn around it. `grain` is not decoration: a gradient
       this wide bands visibly on an 8-bit display, and four per cent of noise is what
       dithers the steps away. */
    deep: "on-dark bg-band-dark grain band-edge",
    cta: "on-dark bg-band-cta grain band-edge",
  } as const;

  return (
    <section
      id={id}
      className={cn(
        /* `isolate` so a card's `halo` — which draws at z-index -1, outside its own
           box — lands behind the card and in front of the band, instead of vanishing
           underneath the page background. */
        "relative isolate overflow-hidden py-[72px] lg:py-24 xl:py-[124px]",
        tones[tone],
        className,
      )}
    >
      {backdrop}
      <div className="container relative">{children}</div>
    </section>
  );
}

export function Eyebrow({
  children,
  tone = "light",
  className,
}: {
  children: React.ReactNode;
  tone?: "light" | "dark";
  className?: string;
}) {
  return (
    <span
      className={cn(
        "t-eyebrow inline-flex items-center gap-2",
        tone === "dark" ? "text-turq-light" : "text-teal-ink",
        className,
      )}
    >
      <span className="h-1 w-1 rounded-full bg-current" />
      {children}
    </span>
  );
}

export function SectionHeading({
  eyebrow,
  title,
  lede,
  tone = "light",
  align = "center",
  className,
  accentClassName,
  rule = true,
}: {
  eyebrow?: string;
  title: string;
  lede?: string;
  tone?: "light" | "dark";
  align?: "center" | "left";
  className?: string;
  /** Overrides the accent span's classes — e.g. to stop a phrase breaking mid-way. */
  accentClassName?: string;
  /**
   * The turquoise bar that draws itself out under the heading as the section
   * arrives. On by default: it is what gives the page punctuation rather than a
   * uniform rhythm of gaps. Turn it off where a heading is already sitting on an
   * edge or inside a card.
   */
  rule?: boolean;
}) {
  return (
    <div
      className={cn(
        "flex flex-col gap-4",
        align === "center" ? "mx-auto max-w-4xl items-center text-center" : "max-w-2xl items-start",
        className,
      )}
    >
      {eyebrow && (
        <Reveal>
          <Eyebrow tone={tone}>{eyebrow}</Eyebrow>
        </Reveal>
      )}
      <Reveal index={1}>
        <RichText
          as="h2"
          className={cn(
            "font-display t-h2",
            tone === "dark" ? "text-white" : "text-deep",
          )}
          accentClassName={accentClassName ?? (tone === "dark" ? "text-gradient-light" : "text-gradient-brand")}
        >
          {title}
        </RichText>
      </Reveal>
      {lede && (
        <Reveal index={2}>
          <RichText
            as="p"
            className={cn(
              "text-[16px] leading-relaxed sm:text-[18px]",
              tone === "dark" ? "text-white/80" : "text-ink-2",
            )}
            accentClassName={tone === "dark" ? "text-gradient-light" : "text-gradient-brand"}
          >
            {lede}
          </RichText>
        </Reveal>
      )}
      {rule && (
        <Reveal index={3} className="mt-1">
          {/* The bar alone, no bloom under it. A blurred copy beneath made the rule
              read as lit, but at this size it also read as a smudge — the glow is
              wider than the thing glowing, which is the one proportion that gives a
              light effect away. The drawing-out is what the rule is for. */}
          <span
            aria-hidden="true"
            className={cn(
              "tide-bar block h-[3px] w-14 rounded-pill bg-grad-accent",
              align === "center" && "tide-bar-center",
            )}
          />
        </Reveal>
      )}
    </div>
  );
}
