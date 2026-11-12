import React from "react";
import Image from "next/image";
import { cn } from "@/lib/utils";

/**
 * A card that rests on one long soft shadow and lifts on hover.
 *
 * Four things happen on the way up, and each is doing different work: the turquoise
 * bar wipes across the top edge (where the card begins), a gradient ring fades in
 * along the leading corner (which card the pointer is on), a band of light crosses
 * the surface once (that it is a surface at all) and a bloom spills out from behind
 * it (that it has risen off the page). Any one of them alone reads as a tooltip
 * effect; together they read as the card being picked up.
 *
 * `logo` is for cards that stand for an organisation rather than an idea: the mark
 * sits in its own slot above the name, at a fixed height so logos of different
 * proportions line up on one baseline. The slot is 88px and the mark 56px — the
 * partner set runs from a 420×156 lockup to a 420×420 square, and at 42px the
 * square ones rendered as a smudge.
 */
export default function FeatureCard({
  Icon,
  logo,
  title,
  children,
  badge,
  className,
}: {
  Icon?: React.ComponentType<{ className?: string }>;
  logo?: { src: string; alt: string };
  title: string;
  children?: React.ReactNode;
  badge?: string;
  className?: string;
}) {
  return (
    <article
      className={cn(
        /* The glow on hover is a box-shadow rather than the `halo` pseudo-element:
           `overflow-hidden` has to stay — it is what keeps the 3px top bar inside the
           card's radius — and a pseudo-element drawn outside the box would be clipped
           by it, where a shadow is not. */
        "card-lift card-bar glow-edge sheen-host group relative flex h-full flex-col overflow-hidden rounded-card border border-line bg-white p-7 shadow-tide hover:shadow-tide-glow",
        className,
      )}
    >
      {logo && (
        /* White, not a tinted tile. Every partner mark ships on its own white canvas,
           so a mint slot framed each one in a visible white rectangle — the logo
           looked pasted on rather than placed. On white it sits directly on the card
           and the slot disappears, which is what a logo slot should do. */
        <div className="mb-6 flex h-[88px] items-center justify-center rounded-xl2 bg-white px-6">
          <div className="relative h-[56px] w-full">
            <Image
              src={logo.src}
              alt={logo.alt}
              fill
              sizes="200px"
              className="object-contain transition-transform duration-500 ease-back group-hover:scale-[1.04]"
            />
          </div>
        </div>
      )}

      {Icon && (
        <span className="grid h-11 w-11 shrink-0 place-items-center rounded-card bg-mint text-teal-ink transition-transform duration-500 ease-back group-hover:-rotate-[8deg] group-hover:scale-[1.08]">
          <Icon className="h-5 w-5" />
        </span>
      )}

      <div className={cn("flex items-start justify-between gap-3", Icon && "mt-5")}>
        <h3 className="font-display text-[17px] font-semibold leading-snug tracking-[-0.02em] text-deep">
          {title}
        </h3>
        {badge && (
          <span className="shrink-0 rounded-pill bg-mint px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.1em] text-teal-ink">
            {badge}
          </span>
        )}
      </div>

      {children && (
        <div className="relative mt-3 text-[14.5px] leading-relaxed text-ink-2">{children}</div>
      )}
    </article>
  );
}
