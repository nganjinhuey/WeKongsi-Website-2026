"use client";

import React from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { useTranslation } from "@/hooks/useTranslation";
import { latestReport, MONTH_SHORT } from "@/data/sharing-reports";
import { Section } from "@/components/ui/section";
import { Button } from "@/components/ui/button";
import Counter from "@/components/ui/counter";
import RichText from "@/components/RichText";
import Reveal from "@/components/ui/reveal";
import Orbs from "@/components/ui/orbs";

export default function WsTransparency() {
  const { t, href } = useTranslation();
  const month = `${MONTH_SHORT[latestReport.month]} ${latestReport.year}`;

  const figures = [
    { v: latestReport.cases, prefix: "", decimals: 0, label: "wsp.hero.cases" },
    { v: latestReport.cost, prefix: "RM", decimals: 2, label: "wsp.hero.bills" },
    { v: latestReport.active, prefix: "", decimals: 0, label: "wsp.hero.members" },
  ];

  return (
    <Section tone="cta" id="transparency-teaser" backdrop={<Orbs tone="dark" />}>
      <div className="mx-auto max-w-3xl text-center">
        <Reveal>
          <RichText as="h2" className="t-h2 text-white" accentClassName="text-gradient-light">
            {t("wsp.tr.title")}
          </RichText>
        </Reveal>
        <Reveal index={1}>
          <p className="mx-auto mt-5 max-w-xl text-[15.5px] font-light leading-relaxed text-white/72">
            {t("wsp.tr.lede")}
          </p>
        </Reveal>
      </div>

      <Reveal index={1}>
        <dl className="mx-auto mt-12 grid max-w-3xl gap-5 sm:grid-cols-3">
          {figures.map((f) => (
            <div key={f.label} className="rounded-card border border-white/12 bg-white/[0.06] px-6 py-7 text-center">
              <dt className="font-display text-[26px] font-semibold tracking-[-0.03em] text-turq sm:text-[30px]">
                <Counter value={f.v} prefix={f.prefix} decimals={f.decimals} />
              </dt>
              <dd className="mt-2 text-[13px] font-light text-white/65">{t(f.label)}</dd>
            </div>
          ))}
        </dl>
      </Reveal>

      <Reveal index={2}>
        <p className="mt-6 text-center text-[13px] text-white/55">{month}</p>
        <div className="mt-8 flex justify-center">
          <Button asChild size="lg">
            <Link href={href("/transparency")}>
              {t("wsp.tr.cta")}
              <ArrowRight className="h-5 w-5" />
            </Link>
          </Button>
        </div>
      </Reveal>
    </Section>
  );
}
