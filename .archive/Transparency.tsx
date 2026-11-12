"use client";

import React from "react";
import Link from "next/link";
import { Wallet, Landmark, HeartHandshake, BadgeCheck, FileText, TrendingUp } from "lucide-react";
import { useTranslation } from "@/hooks/useTranslation";
import { latestReport, caseBreakdown, reportArchive, governance } from "@/data/transparency";
import { Section, SectionHeading, Eyebrow } from "@/components/ui/section";
import { Button } from "@/components/ui/button";
import PageHero from "@/components/sections/PageHero";
import FinalCta from "@/components/sections/FinalCta";
import RichText from "@/components/RichText";
import Reveal from "@/components/ui/reveal";
import { Media } from "@/components/ui/media";
import LogoRow from "@/components/ui/logo-row";
import { partnerLogos } from "@/data/logos";

const FLOW_ICONS = [Wallet, Landmark, HeartHandshake];

const rm = (n: number, decimals = 0) =>
  `RM ${n.toLocaleString("en-MY", { minimumFractionDigits: decimals, maximumFractionDigits: decimals })}`;

export default function Transparency() {
  const { t, href } = useTranslation();

  const hospitalShare = (latestReport.hospitalValue / latestReport.totalSharing) * 100;
  const clinicShare = (latestReport.clinicValue / latestReport.totalSharing) * 100;

  const headline = [
    {
      value: rm(latestReport.totalSharing),
      labelKey: "tr.summary.total",
      note: t("tr.summary.vsPrev", {
        change: latestReport.changeVsPrevious,
        month: latestReport.previousMonth,
      }),
      accent: true,
    },
    {
      value: String(latestReport.hospitalCases),
      labelKey: "tr.summary.hospitalCases",
      note: t("tr.summary.hospitalValue", { value: rm(latestReport.hospitalValue) }),
    },
    {
      value: String(latestReport.clinicCases),
      labelKey: "tr.summary.clinicCases",
      note: t("tr.summary.clinicValue", { value: rm(latestReport.clinicValue) }),
    },
    {
      value: rm(latestReport.averagePerMember, 2),
      labelKey: "tr.summary.avgPerMember",
      note: t("tr.summary.basedOn", {
        count: latestReport.activeMembers.toLocaleString("en-MY"),
      }),
    },
  ];

  return (
    <>
      <PageHero
        eyebrow={t("tr.hero.eyebrow")}
        title={t("tr.hero.title")}
        lede={t("tr.hero.lede")}
        image="/images/viz-documents.jpg"
      >
        <span className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/[0.06] px-4 py-2 text-xs text-white/65">
          <span className="h-1.5 w-1.5 rounded-full bg-turq" />
          {t("tr.hero.updated", { period: latestReport.period })}
        </span>
      </PageHero>

      {/* Money flow */}
      <Section tone="light" id="flow">
        <SectionHeading
          eyebrow={t("tr.flow.eyebrow")}
          title={t("tr.flow.title")}
          lede={t("tr.flow.desc")}
        />
        <ol className="mt-14 grid gap-6 lg:grid-cols-3">
          {[1, 2, 3].map((n, i) => {
            const Icon = FLOW_ICONS[i];
            return (
              <Reveal key={n} index={i} as="li">
                <article className="h-full rounded-card border border-line bg-white p-8">
                  <span className="grid h-12 w-12 place-items-center rounded-card bg-mint text-teal">
                    <Icon className="h-5 w-5" />
                  </span>
                  <p className="mt-6 text-[11px] font-bold uppercase tracking-[0.12em] text-teal">
                    {n} · {t(`tr.flow.s${n}.t`)}
                  </p>
                  <p className="mt-3 text-sm leading-relaxed text-ink-2">
                    {t(`tr.flow.s${n}.d`)}
                  </p>
                </article>
              </Reveal>
            );
          })}
        </ol>
        <Reveal index={3}>
          <RichText
            as="p"
            className="mt-8 rounded-card border border-teal/25 bg-mint-soft p-6 text-center text-sm leading-relaxed text-ink-2"
          >
            {t("tr.flow.note")}
          </RichText>
        </Reveal>
      </Section>

      {/* Latest monthly report */}
      <Section tone="soft" id="report">
        <SectionHeading
          eyebrow={latestReport.period}
          title={t("tr.summary.title")}
          lede={t("tr.summary.period", { period: latestReport.periodRange })}
        />

        <div className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {headline.map((stat, i) => (
            <Reveal key={stat.labelKey} index={i}>
              <article className="h-full rounded-card border border-line bg-white p-7">
                <p
                  className={
                    stat.accent
                      ? "font-display text-3xl font-extrabold tracking-tight text-teal-deep"
                      : "font-display text-3xl font-extrabold tracking-tight text-deep"
                  }
                >
                  {stat.value}
                </p>
                <p className="mt-2 text-sm font-semibold text-deep">{t(stat.labelKey)}</p>
                <p className="mt-1 text-xs text-ink-3">{stat.note}</p>
              </article>
            </Reveal>
          ))}
        </div>

        <div className="mt-8 grid gap-5 lg:grid-cols-3">
          {/* Fund utilisation */}
          <Reveal>
            <div className="h-full rounded-card border border-line bg-white p-7">
              <h3 className="font-display text-base font-bold text-deep">{t("tr.util.title")}</h3>
              <dl className="mt-5 space-y-5">
                {[
                  { labelKey: "tr.util.hospital", amount: latestReport.hospitalValue, percent: hospitalShare },
                  { labelKey: "tr.util.clinic", amount: latestReport.clinicValue, percent: clinicShare },
                ].map((row) => (
                  <div key={row.labelKey}>
                    <div className="flex items-baseline justify-between gap-3">
                      <dt className="text-sm text-ink-2">
                        {t(row.labelKey)}{" "}
                        <span className="text-ink-3">({row.percent.toFixed(1)}%)</span>
                      </dt>
                      <dd className="font-display text-sm font-bold text-deep">{rm(row.amount)}</dd>
                    </div>
                    {/* Width is computed from the figures above, so the bar can never
                        disagree with the number printed beside it. */}
                    <div className="mt-2 h-2 overflow-hidden rounded-full bg-mint">
                      <div
                        className="h-full rounded-full bg-grad-accent"
                        style={{ width: `${row.percent}%` }}
                      />
                    </div>
                  </div>
                ))}
              </dl>
              <div className="mt-6 flex items-baseline justify-between gap-3 border-t border-line pt-5">
                <span className="text-sm font-semibold text-deep">{t("tr.util.distributed")}</span>
                <span className="font-display text-lg font-extrabold text-teal-deep">
                  {rm(latestReport.totalSharing)}
                </span>
              </div>
            </div>
          </Reveal>

          {/* Contribution breakdown */}
          <Reveal index={1}>
            <div className="h-full rounded-card border border-line bg-white p-7">
              <h3 className="font-display text-base font-bold text-deep">{t("tr.contrib.title")}</h3>
              <dl className="mt-5 divide-y divide-line">
                {[
                  { labelKey: "tr.contrib.received", amount: latestReport.contributionsReceived },
                  { labelKey: "tr.contrib.admin", amount: latestReport.adminAndOperations },
                  { labelKey: "tr.contrib.pool", amount: latestReport.addedToPool },
                ].map((row) => (
                  <div key={row.labelKey} className="flex items-baseline justify-between gap-3 py-3.5">
                    <dt className="text-sm text-ink-2">{t(row.labelKey)}</dt>
                    <dd className="font-display text-sm font-bold text-deep">{rm(row.amount)}</dd>
                  </div>
                ))}
              </dl>
              <div className="mt-4 flex items-baseline justify-between gap-3 rounded-card bg-mint-soft px-4 py-3.5">
                <span className="text-sm font-semibold text-deep">{t("tr.contrib.balance")}</span>
                <span className="font-display text-base font-extrabold text-teal-deep">
                  {rm(latestReport.poolBalance)}
                </span>
              </div>
            </div>
          </Reveal>

          {/* Case summary */}
          <Reveal index={2}>
            <div className="h-full rounded-card border border-line bg-white p-7">
              <h3 className="font-display text-base font-bold text-deep">{t("tr.cases.title")}</h3>
              <dl className="mt-5 divide-y divide-line">
                {caseBreakdown.map((row) => (
                  <div key={row.labelKey} className="flex items-baseline justify-between gap-3 py-3">
                    <dt className="text-sm text-ink-2">
                      {t(row.labelKey)}{" "}
                      <span className="text-ink-3">
                        · {t("tr.cases.count", { count: row.cases })}
                      </span>
                    </dt>
                    <dd className="shrink-0 font-display text-sm font-bold text-deep">
                      {rm(row.amount)}
                    </dd>
                  </div>
                ))}
              </dl>
              <div className="mt-4 flex items-baseline justify-between gap-3 rounded-card bg-mint-soft px-4 py-3.5">
                <span className="text-sm font-semibold text-deep">
                  {t("tr.cases.total", {
                    count: caseBreakdown.reduce((sum, row) => sum + row.cases, 0),
                  })}
                </span>
                <span className="font-display text-base font-extrabold text-teal-deep">
                  {rm(latestReport.totalSharing)}
                </span>
              </div>
              <p className="mt-4 flex items-start gap-2 text-xs leading-relaxed text-ink-3">
                <TrendingUp className="mt-0.5 h-3.5 w-3.5 shrink-0 text-teal" />
                {t("tr.cases.approval", {
                  rate: latestReport.approvalRate,
                  approved: latestReport.casesApproved,
                  submitted: latestReport.casesSubmitted,
                })}
              </p>
            </div>
          </Reveal>
        </div>
      </Section>

      {/* Governance */}
      <Section tone="deep" id="governance">
        <SectionHeading
          tone="dark"
          eyebrow={t("tr.gov.eyebrow")}
          title={t("tr.gov.title")}
          lede={t("tr.gov.desc")}
        />
        <Reveal index={1}>
          <LogoRow logos={partnerLogos} tone="dark" className="mt-12" />
        </Reveal>

        <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {governance.map((item, i) => (
            <Reveal key={item.id} index={i % 3}>
              <article className="h-full rounded-card border border-white/10 bg-white/[0.04] p-7">
                <p className="text-[11px] font-bold uppercase tracking-[0.12em] text-turq">
                  {t(item.roleKey)}
                </p>
                <h3 className="mt-2 font-display text-lg font-bold text-white">{item.name}</h3>
                <p className="mt-3 text-sm leading-relaxed text-white/60">{t(item.descKey)}</p>
              </article>
            </Reveal>
          ))}
        </div>
      </Section>

      {/* Shariah certification */}
      <Section tone="light" id="certification">
        <div className="grid items-center gap-12 lg:grid-cols-[1fr_1fr] lg:gap-16">
          <div>
            <Reveal>
              <Eyebrow>{t("tr.cert.eyebrow")}</Eyebrow>
            </Reveal>
            <Reveal index={1}>
              <RichText
                as="h2"
                className="mt-6 font-display text-3xl font-extrabold leading-[1.08] tracking-tight text-deep sm:text-4xl"
              >
                {t("tr.cert.title")}
              </RichText>
            </Reveal>
            <Reveal index={2}>
              <p className="mt-3 font-display text-base font-semibold text-teal">
                {t("tr.cert.sub")}
              </p>
            </Reveal>
            <Reveal index={3}>
              <p className="mt-5 text-base leading-relaxed text-ink-2">{t("tr.cert.text")}</p>
            </Reveal>
            <Reveal index={4}>
              <Button asChild variant="outline" className="mt-8">
                <Link href={href("/contact")}>{t("tr.cert.cta")}</Link>
              </Button>
            </Reveal>
          </div>

          <Reveal index={2}>
            <div className="rounded-xl2 border border-line bg-mint-soft p-10 text-center">
              <span className="mx-auto grid h-16 w-16 place-items-center rounded-full bg-teal text-white">
                <BadgeCheck className="h-8 w-8" />
              </span>
              <p className="mt-6 font-display text-lg font-bold text-deep">
                Afsha Shariah Advisory
              </p>
              <p className="mt-1.5 text-sm text-ink-2">{t("pt.title")}</p>
            </div>
          </Reveal>
        </div>
      </Section>

      {/* Archive */}
      <Section tone="soft" id="archive">
        <SectionHeading
          eyebrow={t("tr.archive.eyebrow")}
          title={t("tr.archive.title")}
          lede={t("tr.archive.desc")}
        />

        {/* The published report pack. NOTE: this mockup has its own figures printed on
            it (Sept 2025 · RM 304,650 · 6,093 members) which do not match the April 2025
            report tabulated above — it is placeholder artwork pending a current render. */}
        <Reveal index={1}>
          <Media
            src="/images/viz-record.jpg"
            ratio="16/9"
            rounded="brand-lg"
            sizes="(max-width: 1024px) 92vw, 70vw"
            className="mx-auto mt-14 max-w-4xl border border-line bg-white"
            imageClassName="object-contain"
          />
        </Reveal>

        <div className="mt-12 overflow-hidden rounded-card border border-line bg-white">
          <ul className="divide-y divide-line">
            {reportArchive.map((entry, i) => (
              <Reveal key={entry.id} index={Math.min(i, 3)} as="li">
                <div className="flex flex-wrap items-center justify-between gap-4 p-6">
                  <div className="flex items-center gap-4">
                    <span className="grid h-10 w-10 shrink-0 place-items-center rounded-card bg-mint text-teal">
                      <FileText className="h-4 w-4" />
                    </span>
                    <div>
                      <p className="font-display text-sm font-bold text-deep">
                        {entry.annualYear
                          ? t("tr.archive.annual", { year: entry.annualYear })
                          : entry.period}
                      </p>
                      <p className="mt-0.5 text-xs text-ink-3">
                        {t(entry.averageMembers ? "tr.archive.metaAvg" : "tr.archive.meta", {
                          cases: entry.cases.toLocaleString("en-MY"),
                          members: entry.members.toLocaleString("en-MY"),
                        })}
                      </p>
                    </div>
                  </div>
                  <span className="font-display text-base font-extrabold text-teal-deep">
                    {rm(entry.amount)}
                  </span>
                </div>
              </Reveal>
            ))}
          </ul>
        </div>

        <Reveal index={2}>
          <div className="mt-8 flex flex-col items-center gap-5">
            <p className="max-w-2xl text-center text-xs leading-relaxed text-ink-3">
              {t("tr.archive.note")}
            </p>
            <Button asChild variant="outline">
              <Link href={href("/contact")}>{t("tr.archive.cta")}</Link>
            </Button>
          </div>
        </Reveal>
      </Section>

      <FinalCta />
    </>
  );
}
