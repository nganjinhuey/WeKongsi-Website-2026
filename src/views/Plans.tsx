"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { Check, ArrowRight } from "lucide-react";
import { useTranslation } from "@/hooks/useTranslation";
import { programFacts } from "@/data/site";
import { Section } from "@/components/ui/section";
import { Button } from "@/components/ui/button";
import PageHero from "@/components/sections/PageHero";
import FinalCta from "@/components/sections/FinalCta";
import Reveal from "@/components/ui/reveal";
import { cn } from "@/lib/utils";

/**
 * The plans hub: two panels, each a doorway to its own page.
 *
 * WeShare is the medical cost-sharing programme; WeCare is a standalone outpatient
 * plan, not a tier of it. So the panels describe rather than compare — there is no
 * better-or-worse axis between them, and a member can hold either.
 */
const PLANS = [
  {
    id: "weshare",
    name: "WeShare",
    href: "/plans/weshare",
    kindKey: "mem.plan.ws.kind",
    descKey: "mem.plan.ws.desc",
    highlightKeys: ["mem.plan.ws.h1", "mem.plan.ws.h2", "mem.plan.ws.h3"],
    image: "/images/coverage-inpatient.jpg",
    logo: "/images/weshare-logo-520.png",
    logoSize: { w: 520, h: 150 },
    /* The site's own optical rule, from HomePlans: WeShare's lockup carries the hand
       above its word and WeCare's heart sits beside it, so matching the boxes sets
       "WeCare" visibly larger. The ratio that makes both words the same height is
       4:3, and these are HomePlans' 44/33 scaled up for a full-width panel. */
    logoClass: "h-10 sm:h-[52px]",
    band: "bg-band-dark",
    /** Only WeShare has an annual limit to quote. */
    limit: true,
    imageFirst: false,
  },
  {
    id: "wecare",
    name: "WeCare",
    href: "/plans/wecare",
    kindKey: "mem.plan.wc.kind",
    descKey: "wecare.desc",
    highlightKeys: ["wecare.h1", "wecare.h2", "wecare.h3"],
    image: "/images/wecare-teleconsult.jpg",
    logo: "/images/wecare-logo-560.png",
    logoSize: { w: 560, h: 101 },
    logoClass: "h-[30px] sm:h-[39px]",
    band: "bg-band-ocean",
    limit: false,
    imageFirst: true,
  },
];

export default function Plans() {
  const { t, href } = useTranslation();

  return (
    <>
      <PageHero
        eyebrow={t("pl.hero.eyebrow")}
        title={t("pl.hero.title")}
        lede={t("pl.hero.lede")}
      />

      <Section tone="light" id="plans">
        <div className="space-y-7 lg:space-y-9">
          {PLANS.map((plan, i) => (
            <Reveal key={plan.id} index={i}>
              {/* The photograph runs to the panel's own edge rather than sitting in a
                  padded box — that full bleed is what separates a product panel from a
                  pricing card. */}
              <article
                className={cn(
                  "on-dark grain overflow-hidden rounded-xl2 border border-transparent",
                  plan.band,
                )}
              >
                <div className="grid lg:grid-cols-2">
                  <div
                    className={cn(
                      "order-2 flex flex-col justify-center p-8 sm:p-10 lg:p-14",
                      plan.imageFirst ? "lg:order-2" : "lg:order-1",
                    )}
                  >
                    {/* Unfilled. A white tint would lift the ocean panel's ground far
                        enough to put 12px type under AA on it, where the bare band
                        holds comfortably. */}
                    <span className="t-eyebrow inline-flex w-fit rounded-pill border border-white/25 px-4 py-1.5 text-white">
                      {t(plan.kindKey)}
                    </span>

                    {/* The wordmark is the heading. These are the same transparent
                        lockups the home page and both plan heroes use, and their ink
                        is dark teal — 1.8:1 on the ocean panel — so on a dark card they
                        get the white plate they were drawn for rather than a recoloured
                        copy. The alt text is what makes this an <h2> with a name. */}
                    <h2 className="mt-6">
                      <span className="inline-flex w-fit rounded-2xl bg-white px-5 py-3.5 shadow-tide">
                        <Image
                          src={plan.logo}
                          alt={plan.name}
                          width={plan.logoSize.w}
                          height={plan.logoSize.h}
                          priority
                          className={cn("w-auto", plan.logoClass)}
                        />
                      </span>
                    </h2>

                    {plan.limit && (
                      <p className="mt-4 flex items-baseline gap-2">
                        <span className="font-display text-[26px] font-semibold tracking-[-0.03em] text-turq-light sm:text-[30px]">
                          {t("mem.common.upToValue", {
                            value: `RM${programFacts.annualLimit.toLocaleString("en-MY")}`,
                          })}
                        </span>
                        <span className="text-sm text-white/90">{t("ws.limit.label")}</span>
                      </p>
                    )}

                    {/* 90%, not 80%. On #097292 white at 80% measures 4.14:1 and
                        fails; at 90% it is 4.79:1. The difference is invisible on the
                        petrol panel and is what makes one value work on both. */}
                    <p className="mt-5 max-w-lg text-[15px] leading-relaxed text-white/90">
                      {t(plan.descKey)}
                    </p>

                    <ul className="mt-8 flex flex-col gap-3.5">
                      {plan.highlightKeys.map((key) => (
                        <li key={key} className="flex items-center gap-3">
                          <span className="grid h-5 w-5 shrink-0 place-items-center rounded-full bg-white/15 text-white">
                            <Check className="h-3 w-3" />
                          </span>
                          <span className="text-[14.5px] font-semibold text-white">{t(key)}</span>
                        </li>
                      ))}
                    </ul>

                    <div className="mt-9">
                      {/* `accent`, not `primary`. The primary pill is a deep teal
                          gradient that measures 1.15:1 against the ocean panel — the
                          label would still be legible but the button would not read as
                          a button. This is the variant the design system keeps for
                          exactly that case. */}
                      <Button asChild size="lg" variant="accent">
                        <Link href={href(plan.href)}>
                          {t("pl.more")}
                          <ArrowRight className="h-5 w-5" />
                        </Link>
                      </Button>
                    </div>
                  </div>

                  <div
                    className={cn(
                      "relative order-1 min-h-[260px] sm:min-h-[320px] lg:min-h-[460px]",
                      plan.imageFirst ? "lg:order-1" : "lg:order-2",
                    )}
                  >
                    <Image
                      src={plan.image}
                      alt=""
                      fill
                      sizes="(max-width: 1024px) 100vw, 50vw"
                      className="object-cover"
                    />
                  </div>
                </div>
              </article>
            </Reveal>
          ))}
        </div>
      </Section>

      <FinalCta />
    </>
  );
}
