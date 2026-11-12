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
    dark: true,
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
    dark: false,
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
                  "overflow-hidden rounded-xl2 border",
                  plan.dark ? "on-dark border-transparent bg-band-dark" : "on-light border-line bg-white",
                )}
              >
                <div className="grid lg:grid-cols-2">
                  <div
                    className={cn(
                      "order-2 flex flex-col justify-center p-8 sm:p-10 lg:p-14",
                      plan.imageFirst ? "lg:order-2" : "lg:order-1",
                    )}
                  >
                    <span
                      className={cn(
                        "t-eyebrow inline-flex w-fit rounded-pill px-4 py-1.5",
                        plan.dark ? "bg-white/10 text-turq-light" : "bg-mint text-teal-ink",
                      )}
                    >
                      {t(plan.kindKey)}
                    </span>

                    <h2
                      className={cn(
                        "mt-6 font-display t-tile",
                        plan.dark ? "text-white" : "text-deep",
                      )}
                    >
                      {plan.name}
                    </h2>

                    {plan.dark && (
                      <p className="mt-4 flex items-baseline gap-2">
                        <span className="font-display text-[26px] font-semibold tracking-[-0.03em] text-turq-light sm:text-[30px]">
                          {t("mem.common.upToValue", {
                            value: `RM${programFacts.annualLimit.toLocaleString("en-MY")}`,
                          })}
                        </span>
                        <span className="text-sm text-white/80">{t("ws.limit.label")}</span>
                      </p>
                    )}

                    <p
                      className={cn(
                        "mt-5 max-w-lg text-[15px] leading-relaxed",
                        plan.dark ? "text-white/80" : "text-ink-2",
                      )}
                    >
                      {t(plan.descKey)}
                    </p>

                    <ul className="mt-8 flex flex-col gap-3.5">
                      {plan.highlightKeys.map((key) => (
                        <li key={key} className="flex items-center gap-3">
                          <span
                            className={cn(
                              "grid h-5 w-5 shrink-0 place-items-center rounded-full",
                              plan.dark ? "bg-teal/25 text-turq-light" : "bg-teal/15 text-teal-deep",
                            )}
                          >
                            <Check className="h-3 w-3" />
                          </span>
                          <span
                            className={cn(
                              "text-[14.5px] font-semibold",
                              plan.dark ? "text-white" : "text-deep",
                            )}
                          >
                            {t(key)}
                          </span>
                        </li>
                      ))}
                    </ul>

                    <div className="mt-9">
                      <Button asChild size="lg" variant={plan.dark ? "primary" : "outline"}>
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
