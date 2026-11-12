"use client";

import React from "react";
import { useTranslation } from "@/hooks/useTranslation";
import { partners } from "@/data/site";
import { Section, SectionHeading } from "@/components/ui/section";
import FeatureCard from "@/components/ui/feature-card";
import FinalCta from "@/components/sections/FinalCta";
import Reveal from "@/components/ui/reveal";
import AbHero from "@/components/about/hero";
import AbMission from "@/components/about/mission";
import AbName from "@/components/about/name";
import AbContribution from "@/components/about/contribution";
import AbPromises from "@/components/about/promises";
import AbTeam from "@/components/about/team";

/**
 * The About page.
 *
 * Seven bands, in the order asked for: who we are, why the name, what we are here for,
 * what the community has done, what we will not bend on, the people, and the partners
 * who check our work.
 *
 * Grounds alternate so no two neighbours read the same: the team photograph, white,
 * accent, mint, white, deep, cool white.
 *
 * Every photograph is the company's own — the team, the signing, the certificate, the
 * days out. For a page whose whole argument is "this is a real community of real
 * Malaysians", a stock photograph would undercut the sentence it was illustrating.
 */
export default function About() {
  const { t } = useTranslation();

  return (
    <>
      <AbHero />
      <AbName />
      <AbMission />

      <AbContribution />
      <AbPromises />
      <AbTeam />

      {/* Who checks the work */}
      <Section tone="soft" id="partners">
        <SectionHeading
          eyebrow={t("ab.partners.eyebrow")}
          title={t("ab.partners.title")}
          lede={t("ab.partners.desc")}
        />
        <div className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {partners.map((p, i) => (
            <Reveal key={p.id} index={i % 3}>
              <FeatureCard
                title={p.name}
                badge={t(p.roleKey)}
                logo={{ src: p.logo, alt: p.name }}
              >
                {t(p.descKey)}
              </FeatureCard>
            </Reveal>
          ))}
        </div>
      </Section>

      <FinalCta />
    </>
  );
}
