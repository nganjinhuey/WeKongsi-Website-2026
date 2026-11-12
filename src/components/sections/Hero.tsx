"use client";

import React from "react";
import { useTranslation } from "@/hooks/useTranslation";
import { communityStats } from "@/data/site";
import Counter from "@/components/ui/counter";
import { cn } from "@/lib/utils";
import PageHero from "@/components/sections/PageHero";

/**
 * The homepage opening.
 *
 * A pale wash with the headline centred and the figures on a single card below it,
 * over a photograph of members. The picture sits under `.hero-veil` — the same scrim
 * the WeShare hero uses — so the band keeps the light treatment it had: dark ink on
 * near-white, the travelling `text-sheen` on the accent, and the brand wash over the
 * top rather than a dark scrim and reversed type.
 *
 * A scrim has to be paid for in contrast, so every text role here is measured on the
 * rendered composite rather than assumed. See the note in `.hero-veil`.
 */
export default function Hero() {
  const { t } = useTranslation();

  const stats = [
    { key: "impact.members", value: communityStats.totalMembers },
    {
      key: "impact.bills",
      value: communityStats.sharedAmount,
      decimals: 2,
      prefix: "RM ",
    },
    { key: "impact.hospital", value: communityStats.supportedHospitals },
    { key: "impact.clinic", value: communityStats.supportedClinics },
  ];

  return (
    <PageHero
      eyebrow={t("site.hero.eyebrow")}
      title={t("site.hero.title")}
      lede={t("site.hero.sub")}
      accentClassName="text-sheen"
      image={{
        src: "/images/home-hero.jpg",
        alt: t("site.hero.imgAlt"),
        /* The faces sit centre-right; a plain centre crop pushed them under the
           headline at wide viewports. */
        objectPosition: "58% 42%",
      }}
      below={
        /* Glass rather than a white box, so the band's glow carries through the strip
           instead of being interrupted by it — the figures are the last thing in the
           hero, and a solid panel there cut the wash in half.
           The lattice is drawn by the cells' own borders rather than by `divide-*`,
           which follows DOM order and cannot tell the end of a row from the middle of
           one: a top rule belongs on cells 3 and 4 at `sm`, and on none at `lg`. */
        <div className="glass grid rounded-xl2 px-6 py-4 sm:grid-cols-2 lg:grid-cols-4 lg:px-4 lg:py-8">
          {stats.map((stat, i) => (
            <div
              key={stat.key}
              className={cn(
                "flex flex-col items-center justify-center border-line px-2 py-6 text-center lg:py-2",
                i > 0 && "border-t sm:border-t-0 lg:border-l",
                i % 2 === 1 && "sm:border-l",
                i >= 2 && "sm:border-t lg:border-t-0",
              )}
            >
              {/* Sized to the narrowest column it must fit: at lg the four columns leave
                  ~208px, and "RM 6,337,987.89" is the longest value. nowrap makes a
                  too-large size fail loudly rather than wrapping after "RM". */}
              <div className="whitespace-nowrap text-[28px] font-extrabold leading-none tracking-[-0.035em] text-deep lg:text-[1.75rem] xl:text-[2.05rem]">
                <Counter
                  value={stat.value}
                  decimals={stat.decimals ?? 0}
                  prefix={stat.prefix ?? ""}
                />
              </div>
              <p className="mt-2.5 text-[13px] font-medium text-ink-2">
                {t(stat.key)}
              </p>
            </div>
          ))}
        </div>
      }
    />
  );
}
