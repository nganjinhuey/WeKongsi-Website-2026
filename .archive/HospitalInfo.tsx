"use client";

import React from "react";
import { IdCard, FileCheck2, Landmark, PhoneCall, Info, MessageCircle } from "lucide-react";
import { useTranslation } from "@/hooks/useTranslation";
import { panelRegions, carelines } from "@/data/hospitals";
import { external } from "@/lib/routes";
import { Section, SectionHeading } from "@/components/ui/section";
import { Button } from "@/components/ui/button";
import PageHero from "@/components/sections/PageHero";
import FinalCta from "@/components/sections/FinalCta";
import Reveal from "@/components/ui/reveal";
import { Media } from "@/components/ui/media";
import LogoMarquee from "@/components/ui/logo-marquee";
import { hospitalLogos } from "@/data/logos";

const STEP_ICONS = [IdCard, FileCheck2, Landmark, PhoneCall];

export default function HospitalInfo() {
  const { t } = useTranslation();

  return (
    <>
      <PageHero
        eyebrow={t("hi.hero.eyebrow")}
        title={t("hi.hero.title")}
        lede={t("hi.hero.lede")}
        image="/images/coverage-diagnostics.jpg"
      />

      {/* Four-step path */}
      <Section tone="light" id="steps">
        <SectionHeading
          eyebrow={t("hi.steps.eyebrow")}
          title={t("hi.steps.title")}
          lede={t("hi.steps.desc")}
        />
        <ol className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {[1, 2, 3, 4].map((n, i) => {
            const Icon = STEP_ICONS[i];
            return (
              <Reveal key={n} index={i} as="li">
                <article className="h-full rounded-card border border-line bg-white p-7">
                  <span className="grid h-11 w-11 place-items-center rounded-card bg-mint text-teal">
                    <Icon className="h-5 w-5" />
                  </span>
                  <h3 className="mt-5 font-display text-base font-bold leading-snug text-deep">
                    {n}. {t(`hi.s${n}.t`)}
                  </h3>
                  <p className="mt-3 text-sm leading-relaxed text-ink-2">{t(`hi.s${n}.d`)}</p>
                </article>
              </Reveal>
            );
          })}
        </ol>
      </Section>

      {/* Directory */}
      <Section tone="soft" id="directory">
        <SectionHeading
          eyebrow={t("hi.dir.eyebrow")}
          title={t("hi.dir.title")}
          lede={t("hi.dir.desc")}
        />

        <Reveal index={1}>
          <LogoMarquee logos={hospitalLogos} speed="50s" className="mt-12" />
        </Reveal>

        <Reveal>
          <p className="mx-auto mt-12 flex max-w-3xl gap-3 rounded-card border border-amber-200 bg-amber-50 p-6 text-sm leading-relaxed text-ink-2">
            <Info className="mt-0.5 h-4 w-4 shrink-0 text-amber-600" />
            <span>
              <strong className="font-semibold text-deep">{t("hi.dir.noteLabel")}</strong>{" "}
              {t("hi.dir.note")}
            </span>
          </p>
        </Reveal>

        <div className="mt-12 space-y-8">
          {panelRegions.map((region, i) => (
            <Reveal key={region.id} index={Math.min(i, 3)}>
              <div className="overflow-hidden rounded-card border border-line bg-white">
                <h3 className="border-b border-line bg-mint-soft px-6 py-4 font-display text-base font-bold text-deep">
                  {t(region.headingKey)}
                </h3>
                {/* Scrolls inside its own container so the page body never scrolls sideways. */}
                <div className="overflow-x-auto">
                  <table className="w-full min-w-[420px] border-collapse text-left">
                    <thead>
                      <tr className="border-b border-line">
                        <th
                          scope="col"
                          className="px-6 py-3 text-[11px] font-bold uppercase tracking-[0.1em] text-ink-3"
                        >
                          {t("hi.dir.hospital")}
                        </th>
                        <th
                          scope="col"
                          className="px-6 py-3 text-[11px] font-bold uppercase tracking-[0.1em] text-ink-3"
                        >
                          {t("hi.dir.location")}
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {region.hospitals.map((hospital) => (
                        <tr
                          key={`${hospital.name}-${hospital.location}`}
                          className="border-b border-line last:border-0"
                        >
                          <td className="px-6 py-3.5 text-sm font-medium text-deep">
                            {hospital.name}
                          </td>
                          <td className="px-6 py-3.5 text-sm text-ink-2">
                            {hospital.location}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </Section>

      {/* Verify before admission */}
      <Section tone="deep" id="verify">
        <Reveal>
          <Media
            src="/images/viz-network.jpg"
            ratio="16/9"
            rounded="brand-lg"
            sizes="(max-width: 1024px) 90vw, 60vw"
            className="mx-auto mb-14 max-w-3xl border border-white/10 bg-deep-deeper"
            imageClassName="object-contain"
          />
        </Reveal>
        <div className="mx-auto max-w-3xl text-center">
          <SectionHeading
            tone="dark"
            eyebrow={t("hi.verify.eyebrow")}
            title={t("hi.verify.title")}
            lede={t("hi.verify.desc")}
          />
          <Reveal index={3}>
            <div className="mt-9 flex flex-col justify-center gap-3 sm:flex-row">
              <Button asChild size="lg">
                <a href={external.whatsapp} target="_blank" rel="noopener noreferrer">
                  <MessageCircle className="h-5 w-5" />
                  {t("hi.verify.whatsapp")}
                </a>
              </Button>
              <Button asChild variant="ghostLight" size="lg">
                <a href={carelines.emas.href}>
                  <PhoneCall className="h-5 w-5" />
                  {t("hi.verify.careline")}
                </a>
              </Button>
            </div>
          </Reveal>
          <Reveal index={4}>
            <p className="mt-8 text-sm text-white/55">{t("hi.verify.portal")}</p>
          </Reveal>
        </div>
      </Section>

      <FinalCta />
    </>
  );
}
