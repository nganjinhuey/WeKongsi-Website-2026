"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight } from "lucide-react";
import { useTranslation } from "@/hooks/useTranslation";
import { external } from "@/lib/routes";
import { communityStats } from "@/data/site";
import { Button } from "@/components/ui/button";
import Counter from "@/components/ui/counter";
import RichText from "@/components/RichText";
import { cn } from "@/lib/utils";

/**
 * The hero: the community is the ground, the proposition stands on it.
 *
 * The headline names the product rather than a feeling — share hospital costs, support
 * each other — because a visitor who lands here has about three seconds to work out
 * what WeShare is, and "stronger together" is true of a great many things.
 *
 * The figures are the home page's, read from the same `communityStats` and labelled
 * with the same keys. They are the community's own record, which is the right thing to
 * put under a claim about a community; the plan's limits are a different argument and
 * belong further down the page, where there is room to qualify them.
 *
 * The type stays dark. The header is hardcoded to its light treatment and carries a
 * dark WeKongsi wordmark, and the WeShare lockup here is dark teal on transparent; a
 * white-type hero would mean reversing both marks and the navigation with them. The
 * picture comes up to the type instead — see `.hero-veil` in globals.css.
 */
export default function WsxHero() {
  const { t, href } = useTranslation();

  const stats = [
    { key: "impact.members", value: communityStats.totalMembers },
    { key: "impact.bills", value: communityStats.sharedAmount, decimals: 2, prefix: "RM " },
    { key: "impact.hospital", value: communityStats.supportedHospitals },
    { key: "impact.clinic", value: communityStats.supportedClinics },
  ];

  return (
    <section className="relative isolate overflow-hidden pb-14 pt-[100px] lg:pb-16 lg:pt-[124px]">
      {/* The ground. `priority` because this is the largest thing above the fold and
          the LCP candidate; `object-[50%_40%]` holds the faces in the upper half,
          where the veil is weakest and they are still legible as people. */}
      <Image
        src="/images/weshare-community.jpg"
        alt={t("wsx.hero.imgAlt")}
        fill
        priority
        sizes="100vw"
        className="-z-20 object-cover object-[50%_40%]"
      />
      <div aria-hidden="true" className="hero-veil absolute inset-0 -z-10" />

      {/* Grain over the veil, not under it: four per cent of noise is what dithers an
          eight-bit gradient's steps away, and the veil is where the banding is. */}
      <div aria-hidden="true" className="grain absolute inset-0 -z-10" />

      <div className="container relative flex flex-col items-center text-center">
        {/* The source ships as teal artwork on an opaque white canvas; this derivative
            is keyed, trimmed to the lockup and cut to 520px. The counters in "We" and
            "Share" are transparent, which is the other reason this band stays light —
            on a dark ground they would fill with the photograph. */}
        <Image
          src="/images/weshare-logo-520.png"
          alt="WeShare"
          width={520}
          height={150}
          priority
          className="h-auto w-[164px] sm:w-[192px]"
        />

        <span className="mt-6 inline-flex items-center rounded-pill border border-white/70 bg-white/85 px-3.5 py-1.5 text-[11.5px] font-semibold uppercase tracking-[0.1em] text-teal-ink shadow-[0_2px_18px_-8px_rgba(18,63,70,.45)] backdrop-blur">
          {t("wsx.hero.eyebrow")}
        </span>

        {/* The accent runs the home page's travelling sheen rather than a static
            gradient, so both heroes open the same way. Every stop in that ramp is dark
            enough to carry a headline — which is why the light moves through petrol,
            ocean teal and steel rather than through the brand's turquoise, where the
            word would sit at 2.4:1 on this ground.

            Transform only, no fade: an element at opacity 0 is not eligible for LCP
            until it becomes visible, which would make the headline wait on
            hydration. */}
        <RichText
          as="h1"
          className="mt-6 max-w-5xl t-display animate-[rise_.8s_cubic-bezier(.22,.61,.36,1)_both] text-[clamp(34px,6.2vw,76px)] text-deep motion-reduce:animate-none"
          accentClassName="text-sheen"
        >
          {t("wsx.hero.title")}
        </RichText>

        <p className="mt-6 max-w-[62ch] text-[15.5px] font-medium leading-relaxed text-ink sm:text-[16.5px]">
          {t("wsx.hero.lede")}
        </p>

        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <Button asChild size="lg">
            <a href={external.join} target="_blank" rel="noopener noreferrer">
              {t("wsp.cta.join")}
              <ArrowRight className="h-5 w-5" />
            </a>
          </Button>
          <Button asChild size="lg" variant="outline">
            <Link href={href("/plans/weshare") + "#how"}>{t("wsx.hero.cta2")}</Link>
          </Button>
        </div>

        {/* The same figures strip the home page carries, down to the class list:
            `.glass` over the band rather than a flat panel, so the ground still shows
            through it, and the lattice drawn by the cells' own borders rather than by
            `divide-*`, which follows DOM order and cannot tell the end of a row from
            the middle of one — a top rule belongs on cells 3 and 4 at `sm`, and on
            none at `lg`. Two heroes showing the same four numbers should not be two
            different objects. */}
        <dl className="glass mt-12 grid w-full rounded-xl2 px-6 py-4 sm:grid-cols-2 lg:mt-14 lg:grid-cols-4 lg:px-4 lg:py-8">
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
              {/* Sized to the narrowest column it must fit: at lg the four columns
                  leave ~208px, and "RM 6,337,987.89" is the longest value. nowrap
                  makes a too-large size fail loudly rather than wrapping after "RM". */}
              <dt className="whitespace-nowrap text-[28px] font-extrabold leading-none tracking-[-0.035em] text-deep lg:text-[1.75rem] xl:text-[2.05rem]">
                <Counter value={stat.value} decimals={stat.decimals ?? 0} prefix={stat.prefix ?? ""} />
              </dt>
              <dd className="mt-2.5 text-[13px] font-medium text-ink-2">{t(stat.key)}</dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}
