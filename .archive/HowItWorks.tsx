"use client";

import React from "react";
import {
  Stethoscope,
  ClipboardCheck,
  Landmark,
  CreditCard,
  Settings2,
  Users,
  FileText,
  AlertTriangle,
  Wallet,
  ShieldCheck,
  Eye,
  HeartHandshake,
} from "lucide-react";
import { useTranslation } from "@/hooks/useTranslation";
import { Section, SectionHeading, Eyebrow } from "@/components/ui/section";
import PageHero from "@/components/sections/PageHero";
import SharingCalculator from "@/components/sections/SharingCalculator";
import CoverageOptions from "@/components/sections/CoverageOptions";
import AutoTopUp from "@/components/sections/AutoTopUp";
import CoShare from "@/components/sections/CoShare";
import FinalCta from "@/components/sections/FinalCta";
import RichText from "@/components/RichText";
import Reveal from "@/components/ui/reveal";
import { Media } from "@/components/ui/media";
import LogoRow from "@/components/ui/logo-row";
import { partnerLogos } from "@/data/logos";

const PARTNERS = [
  { name: "HEYDOC Health", roleKey: "hiwp.partners.role.outpatient", descKey: "hiwp.partners.heydoc", Icon: Stethoscope },
  { name: "eMAS", roleKey: "hiwp.partners.role.tpa", descKey: "hiwp.partners.emas", Icon: ClipboardCheck },
  { name: "Palladium Trustee", roleKey: "hiwp.partners.role.trustee", descKey: "hiwp.partners.palladium", Icon: Landmark },
  { name: "Curlec", roleKey: "hiwp.partners.role.payments", descKey: "hiwp.partners.curlec", Icon: CreditCard },
  { name: "Kita Kongsi Sdn Bhd", roleKey: "hiwp.partners.role.administrator", descKey: "hiwp.partners.kitakongsi", Icon: Settings2 },
  { name: null, nameKey: "hiwp.partners.communityName", roleKey: "hiwp.partners.role.members", descKey: "hiwp.partners.community", Icon: Users },
];

const WHY_ICONS = [Wallet, ShieldCheck, Eye, HeartHandshake];

export default function HowItWorks() {
  const { t } = useTranslation();

  return (
    <>
      <PageHero
        eyebrow={t("hiwp.hero.eyebrow")}
        title={t("hiwp.hero.title")}
        lede={t("hiwp.hero.lede")}
        image="/images/coverage-clinic.jpg"
      />

      {/* The model */}
      <Section tone="light" id="model">
        <SectionHeading
          eyebrow={t("hiwp.model.eyebrow")}
          title={t("hiwp.model.title")}
          lede={t("hiwp.model.desc")}
        />
        <div className="mt-14 grid gap-6 lg:grid-cols-3">
          {[1, 2, 3].map((n, i) => (
            <Reveal key={n} index={i}>
              <article className="h-full rounded-card border border-line bg-white p-8 shadow-card">
                <span className="inline-flex rounded-full bg-mint px-3 py-1 text-[11px] font-bold uppercase tracking-[0.12em] text-teal-deep">
                  {`0${n}`}
                </span>
                <h3 className="mt-5 font-display text-lg font-bold text-navy">
                  {t(`hiwp.model.s${n}.t`)}
                </h3>
                <p className="mt-3 text-sm leading-relaxed text-ink-2">
                  {t(`hiwp.model.s${n}.d`)}
                </p>
              </article>
            </Reveal>
          ))}
        </div>
      </Section>

      {/* Who makes it work */}
      <Section tone="soft" id="partners">
        <SectionHeading
          eyebrow={t("hiwp.partners.eyebrow")}
          title={t("hiwp.partners.title")}
          lede={t("hiwp.partners.desc")}
        />
        <Reveal index={1}>
          <LogoRow logos={partnerLogos} className="mt-12" />
        </Reveal>

        <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {PARTNERS.map(({ name, nameKey, roleKey, descKey, Icon }, i) => (
            <Reveal key={descKey} index={i % 3}>
              <article className="flex h-full flex-col rounded-card border border-line bg-white p-7">
                <span className="grid h-11 w-11 place-items-center rounded-card bg-navy text-white">
                  <Icon className="h-5 w-5" />
                </span>
                <p className="mt-6 text-[11px] font-bold uppercase tracking-[0.12em] text-teal">
                  {t(roleKey)}
                </p>
                <h3 className="mt-1.5 font-display text-lg font-bold text-navy">
                  {name ?? t(nameKey!)}
                </h3>
                <p className="mt-3 text-sm leading-relaxed text-ink-2">{t(descKey)}</p>
              </article>
            </Reveal>
          ))}
        </div>
      </Section>

      {/* The sharing journey */}
      <Section tone="light" id="journey">
        <SectionHeading
          eyebrow={t("hiwp.journey.eyebrow")}
          title={t("hiwp.journey.title")}
          lede={t("hiwp.journey.desc")}
        />

        <Reveal index={1}>
          <div className="mt-12 grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
            {[
              "/images/life-welcome.jpg",
              "/images/life-consult.jpg",
              "/images/coverage-inpatient.jpg",
              "/images/viz-report.jpg",
            ].map((src, i) => (
              <Media key={src} src={src} ratio="4/3" sizes="(max-width: 1024px) 46vw, 23vw"
                className={i % 2 === 1 ? "lg:translate-y-6" : undefined} />
            ))}
          </div>
        </Reveal>

        <ol className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {[1, 2, 3, 4, 5, 6, 7].map((n, i) => (
            <Reveal key={n} index={i % 4} as="li">
              <div className="relative h-full rounded-card border border-line bg-white p-6">
                <span className="grid h-9 w-9 place-items-center rounded-full bg-grad-accent font-display text-sm font-bold text-white">
                  {n}
                </span>
                <h3 className="mt-5 font-display text-base font-bold leading-snug text-navy">
                  {t(`hiwp.journey.s${n}.t`)}
                </h3>
                <p className="mt-2.5 text-sm leading-relaxed text-ink-2">
                  {t(`hiwp.journey.s${n}.d`)}
                </p>
              </div>
            </Reveal>
          ))}
        </ol>

        <div className="mt-12 grid gap-5 lg:grid-cols-2">
          <Reveal>
            <div className="flex h-full gap-4 rounded-card border border-line bg-mint-soft p-7">
              <FileText className="h-5 w-5 shrink-0 text-teal" />
              <div>
                <RichText
                  as="h3"
                  className="font-display text-base font-bold leading-snug text-navy"
                >
                  {t("hiwp.journey.publishTitle")}
                </RichText>
                <p className="mt-3 text-sm leading-relaxed text-ink-2">
                  {t("hiwp.journey.publishDesc")}
                </p>
              </div>
            </div>
          </Reveal>
          <Reveal index={1}>
            <div className="flex h-full gap-4 rounded-card border border-amber-200 bg-amber-50 p-7">
              <AlertTriangle className="h-5 w-5 shrink-0 text-amber-600" />
              <div>
                <h3 className="font-display text-base font-bold text-navy">
                  {t("hiwp.journey.emergencyTitle")}
                </h3>
                <p className="mt-3 text-sm leading-relaxed text-ink-2">
                  {t("hiwp.journey.emergencyDesc")}
                </p>
              </div>
            </div>
          </Reveal>
        </div>
      </Section>

      {/* Everyday outpatient care */}
      <Section tone="navy" id="everyday">
        <SectionHeading
          tone="dark"
          eyebrow={t("hiwp.everyday.eyebrow")}
          title={t("hiwp.everyday.title")}
          lede={t("hiwp.everyday.desc")}
        />
        <Reveal index={1}>
          <Media
            src="/images/app-in-hand.jpg"
            ratio="16/9"
            rounded="brand-lg"
            sizes="(max-width: 1024px) 92vw, 60vw"
            className="mx-auto mt-14 max-w-3xl border border-white/10"
          />
        </Reveal>

        <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {[1, 2, 3, 4].map((n, i) => (
            <Reveal key={n} index={i}>
              <article className="h-full rounded-card border border-white/10 bg-white/[0.04] p-7">
                <p className="font-display text-xl font-extrabold tracking-tight text-turq">
                  {t(`hiwp.everyday.f${n}.v`)}
                </p>
                <h3 className="mt-2 font-display text-sm font-bold uppercase tracking-wide text-white">
                  {t(`hiwp.everyday.f${n}.t`)}
                </h3>
                <p className="mt-3 text-sm leading-relaxed text-white/60">
                  {t(`hiwp.everyday.f${n}.d`)}
                </p>
              </article>
            </Reveal>
          ))}
        </div>
      </Section>

      {/* Not insurance — two contracts */}
      <Section tone="light" id="not-insurance">
        <SectionHeading
          eyebrow={t("hiwp.notins.eyebrow")}
          title={t("hiwp.notins.title")}
          lede={t("hiwp.notins.desc")}
        />
        <div className="mt-14 grid gap-6 lg:grid-cols-2">
          {[1, 2].map((n, i) => (
            <Reveal key={n} index={i}>
              <article className="h-full rounded-card border border-line bg-mint-soft p-8">
                <p className="text-[11px] font-bold uppercase tracking-[0.12em] text-teal-deep">
                  {t(`hiwp.notins.c${n}.label`)}
                </p>
                <h3 className="mt-3 font-display text-xl font-bold text-navy">
                  {t(`hiwp.notins.c${n}.t`)}
                </h3>
                <p className="mt-4 text-sm leading-relaxed text-ink-2">
                  {t(`hiwp.notins.c${n}.d`)}
                </p>
              </article>
            </Reveal>
          ))}
        </div>
      </Section>

      {/* Community sharing + calculator */}
      <Section tone="soft" id="cost-sharing">
        <div className="grid gap-14 lg:grid-cols-[1fr_1fr] lg:gap-16">
          <div>
            <Reveal>
              <RichText
                as="h2"
                className="font-display text-3xl font-extrabold leading-[1.08] tracking-tight text-navy sm:text-4xl"
              >
                {t("hiwp.share.title")}
              </RichText>
            </Reveal>
            <Reveal index={1}>
              <p className="mt-5 text-base leading-relaxed text-ink-2">
                {t("hiwp.share.desc")}
              </p>
            </Reveal>

            <ol className="mt-9 space-y-4">
              {[1, 2, 3].map((n, i) => (
                <Reveal key={n} index={i} as="li">
                  <div className="flex gap-4 rounded-card border border-line bg-white p-5">
                    <span className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-mint font-display text-sm font-bold text-teal-deep">
                      {n}
                    </span>
                    <div>
                      <h3 className="font-display text-sm font-bold text-navy">
                        {t(`hiwp.share.s${n}.t`)}
                      </h3>
                      <p className="mt-1.5 text-sm leading-relaxed text-ink-2">
                        {t(`hiwp.share.s${n}.d`)}
                      </p>
                    </div>
                  </div>
                </Reveal>
              ))}
            </ol>
          </div>

          <Reveal index={2}>
            <SharingCalculator />
          </Reveal>
        </div>

        <div className="mt-16">
          <Reveal>
            <Eyebrow>{t("hiwp.share.whyTitle")}</Eyebrow>
          </Reveal>
          <div className="mt-7 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {[1, 2, 3, 4].map((n, i) => {
              const Icon = WHY_ICONS[i];
              return (
                <Reveal key={n} index={i}>
                  <article className="h-full rounded-card border border-line bg-white p-6">
                    <Icon className="h-5 w-5 text-teal" />
                    <h3 className="mt-4 font-display text-sm font-bold text-navy">
                      {t(`hiwp.share.w${n}.t`)}
                    </h3>
                    <p className="mt-2 text-sm leading-relaxed text-ink-2">
                      {t(`hiwp.share.w${n}.d`)}
                    </p>
                  </article>
                </Reveal>
              );
            })}
          </div>
        </div>
      </Section>

      <CoverageOptions />
      <AutoTopUp />
      <CoShare />
      <FinalCta />
    </>
  );
}
