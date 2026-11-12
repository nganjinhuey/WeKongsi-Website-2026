"use client";

import React from "react";
import Image from "next/image";
import { HandHeart, Eye, ShieldCheck, Users, Target, Compass } from "lucide-react";
import { useTranslation } from "@/hooks/useTranslation";
import { leaders, partners, milestones } from "@/data/site";
import { Section, SectionHeading } from "@/components/ui/section";
import PageHero from "@/components/sections/PageHero";
import FinalCta from "@/components/sections/FinalCta";
import Reveal from "@/components/ui/reveal";
import { Media } from "@/components/ui/media";
import LogoRow from "@/components/ui/logo-row";
import { partnerLogos } from "@/data/logos";

const VALUE_ICONS = [HandHeart, Eye, ShieldCheck, Users];

const initials = (name: string) =>
  name
    .split(/\s+/)
    .filter((part) => /^[A-Za-z]/.test(part))
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join("");

export default function About() {
  const { t } = useTranslation();

  return (
    <>
      <PageHero
        eyebrow={t("ab.hero.eyebrow")}
        title={t("ab.hero.title")}
        lede={t("ab.hero.lede")}
        image="/images/team-group.jpg"
      >
        {/* Only the one figure the source site actually states. The second stat on the
            old page was an unfilled "[TBD]" placeholder and is left out rather than
            invented. */}
        <div className="inline-flex items-baseline gap-3 rounded-card border border-white/12 bg-white/[0.05] px-6 py-4">
          <span className="font-display text-3xl font-extrabold tracking-tight text-turq">
            3+
          </span>
          <span className="text-sm text-white/65">{t("ab.hero.years")}</span>
        </div>
      </PageHero>

      {/* Mission & vision */}
      <Section tone="light" id="mission">
        <SectionHeading
          eyebrow={t("ab.mv.eyebrow")}
          title={t("ab.mv.title")}
          align="center"
        />

        <div className="mt-14 grid gap-6 lg:grid-cols-2">
          <Reveal>
            <article className="h-full rounded-xl2 border border-line bg-mint-soft p-8 sm:p-10">
              <span className="grid h-12 w-12 place-items-center rounded-card bg-teal text-white">
                <Target className="h-5 w-5" />
              </span>
              <h3 className="mt-6 font-display text-xl font-bold text-deep">
                {t("ab.mv.missionLabel")}
              </h3>
              <p className="mt-4 text-base leading-relaxed text-ink-2">
                {t("ab.mv.mission")}
              </p>
            </article>
          </Reveal>
          <Reveal index={1}>
            <article className="h-full rounded-xl2 border border-line bg-deep p-8 text-white sm:p-10">
              <span className="grid h-12 w-12 place-items-center rounded-card bg-teal text-white">
                <Compass className="h-5 w-5" />
              </span>
              <h3 className="mt-6 font-display text-xl font-bold">{t("ab.mv.visionLabel")}</h3>
              <p className="mt-4 text-base leading-relaxed text-white/70">{t("ab.mv.vision")}</p>
            </article>
          </Reveal>
        </div>

        <Reveal index={2}>
          <div className="mt-14 grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
            {[
              "/images/event-anniversary.jpg",
              "/images/event-kongsisihat.jpg",
              "/images/event-heal.jpg",
              "/images/event-heydoc.jpg",
            ].map((src, i) => (
              <Media key={src} src={src} ratio="4/3" sizes="(max-width: 1024px) 46vw, 23vw"
                className={i % 2 === 1 ? "lg:translate-y-6" : undefined} />
            ))}
          </div>
        </Reveal>

        <div className="mt-20">
          <Reveal>
            <h3 className="text-center font-display text-2xl font-extrabold tracking-tight text-deep">
              {t("ab.values.title")}
            </h3>
          </Reveal>
          <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {[1, 2, 3, 4].map((n, i) => {
              const Icon = VALUE_ICONS[i];
              return (
                <Reveal key={n} index={i}>
                  <article className="h-full rounded-card border border-line bg-white p-7">
                    <span className="grid h-11 w-11 place-items-center rounded-card bg-mint text-teal">
                      <Icon className="h-5 w-5" />
                    </span>
                    <h4 className="mt-5 font-display text-base font-bold text-deep">
                      {t(`ab.values.v${n}.t`)}
                    </h4>
                    <p className="mt-2.5 text-sm leading-relaxed text-ink-2">
                      {t(`ab.values.v${n}.d`)}
                    </p>
                  </article>
                </Reveal>
              );
            })}
          </div>
        </div>
      </Section>

      {/* Journey */}
      <Section tone="soft" id="journey">
        <SectionHeading
          eyebrow={t("ab.journey.eyebrow")}
          title={t("ab.journey.title")}
          lede={t("ab.journey.desc")}
        />

        {/* A single vertical rail on large screens, stacked cards below it. The rail is
            decorative, so it is hidden from assistive tech — the <ol> carries the order. */}
        <div className="relative mt-14">
          <span
            aria-hidden="true"
            className="absolute left-[15px] top-2 hidden h-[calc(100%-1rem)] w-px bg-line lg:block"
          />
          <ol className="space-y-5">
            {milestones.map(({ n, badge }, i) => (
              <Reveal key={n} index={Math.min(i, 3)} as="li">
                <div className="relative lg:pl-14">
                  <span
                    aria-hidden="true"
                    className="absolute left-0 top-6 hidden h-8 w-8 place-items-center rounded-full border-4 border-[#f7faf9] bg-grad-accent font-display text-[11px] font-bold text-white lg:grid"
                  >
                    {n}
                  </span>
                  <article className="rounded-card border border-line bg-white p-7">
                    <div className="flex flex-wrap items-center gap-3">
                      <span className="rounded-full bg-mint px-3.5 py-1.5 text-[11px] font-bold uppercase tracking-[0.12em] text-teal-deep">
                        {t(`ab.j${n}.when`)}
                      </span>
                      {badge && (
                        <span className="rounded-full border border-line px-3.5 py-1.5 text-[11px] font-semibold text-ink-2">
                          {t(`ab.j${n}.badge`)}
                        </span>
                      )}
                    </div>
                    <h3 className="mt-4 font-display text-lg font-bold text-deep">
                      {t(`ab.j${n}.t`)}
                    </h3>
                    <p className="mt-2.5 max-w-3xl text-sm leading-relaxed text-ink-2">
                      {t(`ab.j${n}.d`)}
                    </p>
                  </article>
                </div>
              </Reveal>
            ))}
          </ol>
        </div>
      </Section>

      {/* Leadership */}
      <Section tone="light" id="leadership">
        <SectionHeading
          eyebrow={t("ab.team.eyebrow")}
          title={t("ab.team.title")}
          lede={t("ab.team.desc")}
        />
        <div className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {leaders.map((leader, i) => (
            <Reveal key={leader.id} index={i % 4}>
              <article className="h-full overflow-hidden rounded-card border border-line bg-white text-center">
                <div className="relative aspect-[4/5] w-full bg-mint-soft">
                  {"image" in leader && leader.image ? (
                    <Image
                      src={leader.image}
                      alt={leader.name}
                      fill
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                      className="object-cover object-top"
                    />
                  ) : (
                    <span className="absolute inset-0 grid place-items-center font-display text-4xl font-extrabold text-teal/35">
                      {initials(leader.name)}
                    </span>
                  )}
                </div>
                <div className="p-6">
                  <h3 className="font-display text-base font-bold leading-snug text-deep">
                    {leader.name}
                  </h3>
                  <p className="mt-1.5 text-xs leading-relaxed text-ink-2">
                    {t(leader.roleKey)}
                  </p>
                </div>
              </article>
            </Reveal>
          ))}
        </div>
      </Section>

      {/* Partners */}
      <Section tone="soft" id="partners">
        <SectionHeading
          eyebrow={t("ab.partners.eyebrow")}
          title={t("ab.partners.title")}
          lede={t("ab.partners.desc")}
        />
        <Reveal index={1}>
          <LogoRow logos={partnerLogos} className="mt-12" />
        </Reveal>

        <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {partners.map((partner, i) => (
            <Reveal key={partner.id} index={i % 3}>
              <article className="h-full rounded-card border border-line bg-white p-7">
                <p className="text-[11px] font-bold uppercase tracking-[0.12em] text-teal">
                  {t(partner.roleKey)}
                </p>
                <h3 className="mt-2 font-display text-lg font-bold text-deep">{partner.name}</h3>
                <p className="mt-3 text-sm leading-relaxed text-ink-2">
                  {t(partner.descKey)}
                </p>
              </article>
            </Reveal>
          ))}
        </div>
      </Section>

      <FinalCta />
    </>
  );
}
