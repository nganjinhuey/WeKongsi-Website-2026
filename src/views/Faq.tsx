"use client";

import React from "react";
import Link from "next/link";
import { ArrowRight, HeartPulse, MessageCircle, ShieldPlus } from "lucide-react";
import { useTranslation } from "@/hooks/useTranslation";
import { external } from "@/lib/routes";
import { generalFaq } from "@/data/faq";
import { Section, SectionHeading } from "@/components/ui/section";
import { Button } from "@/components/ui/button";
import PageHero from "@/components/sections/PageHero";
import FaqTabs from "@/components/sections/FaqTabs";
import Reveal from "@/components/ui/reveal";
import { Media } from "@/components/ui/media";

/**
 * The two plan pages, as a pair of cards.
 *
 * This page used to carry every question on the site, including each plan's own, which
 * left a visitor reading about WeCare's Care Episodes while trying to work out whether
 * to join at all. The plan-specific sets now live on the plan pages; this is the
 * signpost to them.
 */
const PLANS = [
  { k: "ws", path: "/plans/weshare", Icon: ShieldPlus },
  { k: "wc", path: "/plans/wecare", Icon: HeartPulse },
] as const;

export default function Faq() {
  const { t, href } = useTranslation();

  return (
    <>
      <PageHero
        eyebrow={t("faqp.hero.eyebrow")}
        title={t("faqp.hero.title")}
        lede={t("faqp.hero.lede")}
      />

      <FaqTabs
        ns="gq"
        groups={generalFaq}
        eyebrowKey="gq.eyebrow"
        titleKey="gq.title"
        ledeKey="gq.lede"
        id="general"
      />

      <Section tone="soft" id="by-plan">
        <SectionHeading
          eyebrow={t("faqp.route.eyebrow")}
          title={t("faqp.route.title")}
          lede={t("faqp.route.lede")}
        />

        <div className="mx-auto mt-12 grid max-w-4xl gap-5 lg:grid-cols-2">
          {PLANS.map(({ k, path, Icon }, i) => (
            <Reveal key={k} index={i} className="h-full">
              <Link
                href={href(path)}
                className="card-lift glow-edge group flex h-full flex-col rounded-[26px] border border-line bg-white p-8 shadow-tide"
              >
                <span className="grid h-12 w-12 place-items-center rounded-card bg-mint text-teal-ink">
                  <Icon aria-hidden="true" className="h-[22px] w-[22px]" strokeWidth={1.8} />
                </span>
                <h3 className="mt-6 font-display text-[19px] font-semibold tracking-[-0.025em] text-deep">
                  {t(`faqp.route.${k}.t`)}
                </h3>
                <p className="mt-3 text-[14.5px] leading-relaxed text-ink-2">
                  {t(`faqp.route.${k}.d`)}
                </p>
                <span className="mt-6 inline-flex items-center gap-2 text-[14px] font-semibold text-teal-deep transition-colors group-hover:text-teal-ink">
                  {t(`faqp.route.${k}.cta`)}
                  <ArrowRight className="h-4 w-4" />
                </span>
              </Link>
            </Reveal>
          ))}
        </div>
      </Section>

      <Section tone="deep" id="still-questions">
        <Reveal>
          <div className="mx-auto max-w-2xl text-center">
            <Media
              src="/images/life-welcome.jpg"
              ratio="16/9"
              rounded="brand-lg"
              sizes="(max-width: 1024px) 90vw, 42rem"
              className="mb-10 border border-white/10"
            />
            <span className="mx-auto grid h-12 w-12 place-items-center rounded-card bg-teal text-white">
              <MessageCircle className="h-5 w-5" />
            </span>
            <h2 className="mt-6 font-display text-2xl font-semibold tracking-[-0.025em] text-white sm:text-3xl">
              {t("faqp.still.title")}
            </h2>
            <p className="mt-4 text-base leading-relaxed text-white/80">{t("faqp.still.desc")}</p>
            <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
              <Button asChild size="lg">
                <Link href={href("/contact")}>{t("footer.contactus")}</Link>
              </Button>
              <Button asChild variant="ghostLight" size="lg">
                <a href={external.whatsapp} target="_blank" rel="noopener noreferrer">
                  {t("footer.whatsapp")}
                </a>
              </Button>
            </div>
          </div>
        </Reveal>
      </Section>
    </>
  );
}
