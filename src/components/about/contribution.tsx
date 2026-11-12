"use client";

import React from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { useTranslation } from "@/hooks/useTranslation";
import { communityStats } from "@/data/site";
import { sharingTotals } from "@/data/sharing-reports";
import { Section, SectionHeading } from "@/components/ui/section";
import Counter from "@/components/ui/counter";
import { Button } from "@/components/ui/button";
import Reveal from "@/components/ui/reveal";
import Orbs from "@/components/ui/orbs";
import { cn } from "@/lib/utils";

/**
 * What the community has done — the figures, then the posts.
 *
 * The numbers come first because they are the claim and the posts are the colour. All
 * four are derived from the published sharing reports rather than written down, so
 * they move when the next report lands and can never flatter.
 *
 * The posts that used to run underneath are now `/stories`, which can filter them and
 * be added to. This section keeps the claim and hands the reader on.
 */

export default function AbContribution() {
  const { t, href } = useTranslation();

  const figures = [
    { k: "members", value: communityStats.totalMembers },
    { k: "shared", value: sharingTotals.cost, prefix: "RM ", decimals: 0 },
    { k: "cases", value: sharingTotals.cases },
    { k: "reports", value: sharingTotals.months },
  ];

  return (
    <Section tone="mint" id="contribution" backdrop={<Orbs />}>
      <SectionHeading
        eyebrow={t("ab.contrib.eyebrow")}
        title={t("ab.contrib.title")}
        lede={t("ab.contrib.lede")}
      />

      <dl className="glass mt-14 grid w-full rounded-xl2 px-6 py-4 sm:grid-cols-2 lg:mt-16 lg:grid-cols-4 lg:px-4 lg:py-8">
        {figures.map((f, i) => (
          <div
            key={f.k}
            className={cn(
              "flex flex-col items-center justify-center border-line px-2 py-6 text-center lg:py-2",
              i > 0 && "border-t sm:border-t-0 lg:border-l",
              i % 2 === 1 && "sm:border-l",
              i >= 2 && "sm:border-t lg:border-t-0",
            )}
          >
            <dt className="whitespace-nowrap text-[28px] font-extrabold leading-none tracking-[-0.035em] text-deep lg:text-[1.75rem] xl:text-[2.05rem]">
              <Counter value={f.value} decimals={f.decimals ?? 0} prefix={f.prefix ?? ""} />
            </dt>
            <dd className="mt-2.5 text-[13px] font-medium text-ink-2">{t(`ab.contrib.${f.k}`)}</dd>
          </div>
        ))}
      </dl>

      {/* The posts that used to sit here — health days, partnerships, member stories
          — are a page of their own now. What stays is the claim; the colour is one
          click away, where it can be filtered and added to. */}
      <Reveal index={1}>
        <div className="mt-14 flex justify-center lg:mt-16">
          <Button asChild variant="outline" size="lg">
            <Link href={href("/stories")}>
              {t("ab.contrib.storiesCta")}
              <ArrowRight className="h-5 w-5" />
            </Link>
          </Button>
        </div>
      </Reveal>
    </Section>
  );
}
