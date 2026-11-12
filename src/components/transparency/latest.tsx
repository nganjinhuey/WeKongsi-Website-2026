"use client";

import React from "react";
import {
  ArrowDownRight,
  ArrowUpRight,
  Download,
  FileText,
  Minus,
  ShieldCheck,
} from "lucide-react";
import { useTranslation } from "@/hooks/useTranslation";
import { programFacts } from "@/data/site";
import {
  sharingReports,
  previousReport,
  MONTH_LONG,
  type SharingReport,
} from "@/data/sharing-reports";
import { external } from "@/lib/routes";
import { Section, Eyebrow } from "@/components/ui/section";
import { Button } from "@/components/ui/button";
import RichText from "@/components/RichText";
import Reveal from "@/components/ui/reveal";
import Orbs from "@/components/ui/orbs";
import { cn } from "@/lib/utils";

const ringgit = (n: number, dp = 2) =>
  `RM${n.toLocaleString("en-MY", { minimumFractionDigits: dp, maximumFractionDigits: dp })}`;
const count = (n: number) => n.toLocaleString("en-MY");

/**
 * A report names the month it is shared in, so the heading and the report label are
 * the same string — see `sharingMonthOf`. They are kept as one function rather than
 * two that happen to agree.
 */
const reportLabel = (r: SharingReport) => `${MONTH_LONG[r.month]} ${r.year}`;

/**
 * The month in view, as one report rather than five cards.
 *
 * The title is the month members are sharing in, which is the month the report is
 * named for — a reader who lands in November is looking for November and finds it.
 * The heading follows the selection, so picking an older report moves it too.
 *
 * Everything below the heading is a single panel, because it is a single document.
 * It used to be a floating picker bar, then two cards, then three more, all white on
 * a white band — five objects of three sizes with nothing holding them together, so
 * the eye had to reassemble the report before it could read it. Now the panel has the
 * structure a report has: a header that says which one and offers the PDF, the two
 * figures that matter divided down the middle, and the membership it was divided
 * across along the foot.
 *
 * The hairlines between the cells are the panel's own background showing through a
 * 1px gap rather than borders per edge, so every cell stays rectangular at every
 * breakpoint and the grid can reflow without a rule ending up on the outside.
 *
 * The member's figure is the lit one. It is the only number on this page that came
 * out of their account, and at `text-gradient-brand` on a mint ground it is what the
 * eye lands on before the six-figure total beside it.
 */
export default function TrLatest({
  report,
  onSelect,
}: {
  report: SharingReport;
  onSelect: (id: string) => void;
}) {
  const { t } = useTranslation();

  const prev = previousReport(report);
  const delta = prev ? (report.cost - prev.cost) / prev.cost : null;
  const DeltaIcon = delta === null || delta === 0 ? Minus : delta > 0 ? ArrowUpRight : ArrowDownRight;

  const support = [
    {
      k: "cases",
      label: t("tr.summary.hospitalCases"),
      value: count(report.cases),
      note: t("tr.metric.casesNote"),
    },
    {
      k: "active",
      label: t("tr.metric.active"),
      value: count(report.active),
      note: t("tr.metric.activeNote"),
    },
    {
      k: "members",
      label: t("tr.metric.members"),
      value: count(report.members),
      note: t("tr.metric.membersNote"),
    },
  ];

  return (
    <Section tone="soft" id="latest" backdrop={<Orbs />}>
      <div className="mx-auto max-w-2xl text-center">
        <Reveal>
          <Eyebrow className="justify-center">{t("tr.latest.eyebrow")}</Eyebrow>
        </Reveal>
        <Reveal index={1}>
          <RichText as="h2" className="mt-5 t-h2 text-deep" accentClassName="text-gradient-brand">
            {t("tr.latest.title", { period: reportLabel(report) })}
          </RichText>
        </Reveal>
        <Reveal index={2}>
          <p className="mt-5 text-[15.5px] leading-relaxed text-ink-2 sm:text-base">
            {t("tr.latest.lede", { report: reportLabel(report) })}
          </p>
        </Reveal>
      </div>

      <Reveal index={1}>
        <div className="relative mt-12 overflow-hidden rounded-[32px] border border-line bg-line shadow-tide-lg lg:mt-14">
          {/* ---- Header: which report, and the document itself ---- */}
          <div className="flex flex-col gap-4 bg-mint-soft p-5 sm:flex-row sm:items-center sm:gap-5 sm:p-6">
            <span className="hidden h-11 w-11 shrink-0 place-items-center rounded-card bg-white text-teal-ink shadow-tide sm:grid">
              <FileText aria-hidden="true" className="h-5 w-5" strokeWidth={1.8} />
            </span>

            <label className="flex min-w-0 flex-1 flex-col gap-2 sm:flex-row sm:items-center sm:gap-3">
              <span className="shrink-0 text-[12px] font-bold uppercase tracking-[0.1em] text-ink-2">
                {t("tr.report.select")}
              </span>
              <select
                value={report.id}
                onChange={(e) => onSelect(e.target.value)}
                className="h-12 w-full min-w-0 rounded-pill border border-line bg-white px-5 font-display text-[15px] font-semibold text-deep transition-colors hover:border-teal-deep focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-deep sm:max-w-[260px]"
              >
                {[...sharingReports].reverse().map((r) => (
                  <option key={r.id} value={r.id}>
                    {reportLabel(r)}
                  </option>
                ))}
              </select>
            </label>

            {report.pdf ? (
              <Button asChild className="shrink-0">
                <a href={report.pdf} download>
                  <Download className="h-5 w-5" />
                  {t("tr.report.download")}
                </a>
              </Button>
            ) : (
              <p className="shrink-0 text-[13px] text-ink-3">{t("tr.report.noPdf")}</p>
            )}
          </div>

          {/* ---- The two figures the page exists for ----
              `gap-px` on a `bg-line` panel: the rules are the panel showing through. */}
          <div className="grid gap-px lg:grid-cols-2">
            <div className="flex flex-col bg-white p-8 sm:p-10">
              <p className="t-eyebrow text-ink-2">{t("tr.latest.sharedLabel")}</p>
              <p className="mt-4 font-display text-[clamp(34px,4.4vw,46px)] font-semibold leading-none tracking-[-0.04em] tabular-nums text-deep">
                {ringgit(report.cost)}
              </p>
              <div className="mt-5">
                {prev && delta !== null ? (
                  <span
                    className={cn(
                      "inline-flex items-center gap-1.5 rounded-pill px-3 py-1.5 text-[12.5px] font-semibold",
                      /* Not a verdict. A month that shared less is not a better month —
                         it is a month fewer members needed help — so both directions
                         wear the same neutral chip and only the arrow differs. */
                      "bg-mint text-teal-ink",
                    )}
                  >
                    <DeltaIcon aria-hidden="true" className="h-3.5 w-3.5" strokeWidth={2.5} />
                    {delta === 0
                      ? t("tr.latest.flat", { month: reportLabel(prev) })
                      : t("tr.summary.vsPrev", {
                          change: `${delta > 0 ? "+" : "−"}${Math.abs(delta * 100).toFixed(1)}%`,
                          month: reportLabel(prev),
                        })}
                  </span>
                ) : (
                  <span className="inline-flex rounded-pill bg-mint px-3 py-1.5 text-[12.5px] font-semibold text-teal-ink">
                    {t("tr.latest.first")}
                  </span>
                )}
              </div>
              <p className="mt-auto pt-7 text-[12.5px] leading-relaxed text-ink-3">
                {t("tr.metric.costNote")}
              </p>
            </div>

            <div className="relative flex flex-col bg-grad-stage p-8 sm:p-10">
              <p className="t-eyebrow text-teal-ink">{t("tr.latest.perLabel")}</p>
              <p className="text-gradient-brand mt-4 font-display text-[clamp(40px,5.4vw,58px)] font-semibold leading-none tracking-[-0.045em] tabular-nums">
                {ringgit(report.perMember)}
              </p>
              {/* Mirrors the change chip beside it, so the two rows line up — and says
                  the thing a member actually wants from this figure, which is not what
                  it was but what it can ever be. */}
              <div className="mt-5">
                <span className="inline-flex items-center gap-1.5 rounded-pill bg-white/75 px-3 py-1.5 text-[12.5px] font-semibold text-teal-ink">
                  <ShieldCheck aria-hidden="true" className="h-3.5 w-3.5" strokeWidth={2.2} />
                  {t("tr.latest.capNote", { amount: ringgit(programFacts.sharingCap, 0) })}
                </span>
              </div>
              <p className="mt-auto pt-7 text-[12.5px] leading-relaxed text-ink-2">
                {t("tr.latest.perNote", { count: count(report.active) })}
              </p>
            </div>
          </div>

          {/* ---- The membership those two were divided across ---- */}
          <dl className="grid gap-px border-t border-line sm:grid-cols-3">
            {support.map((m) => (
              <div key={m.k} className="bg-white px-8 py-6">
                <dt className="text-[12.5px] font-semibold text-ink-2">{m.label}</dt>
                <dd className="mt-2.5 font-display text-[26px] font-semibold leading-none tracking-[-0.035em] tabular-nums text-deep">
                  {m.value}
                </dd>
                <dd className="mt-2 text-[12px] leading-snug text-ink-3">{m.note}</dd>
              </div>
            ))}
          </dl>
        </div>
      </Reveal>

      {/* The outpatient add-on reports separately, so it gets its own line rather than
          a cell inside a hospitalisation report it is not part of. */}
      <Reveal index={2}>
        <div className="mt-5 flex flex-col items-start gap-5 rounded-[26px] border border-line bg-white p-6 shadow-tide sm:flex-row sm:items-center sm:justify-between sm:p-7">
          <div className="flex items-start gap-4">
            <span className="grid h-11 w-11 shrink-0 place-items-center rounded-card bg-mint text-teal-ink">
              <FileText aria-hidden="true" className="h-5 w-5" strokeWidth={1.8} />
            </span>
            <div>
              <p className="t-eyebrow text-teal-ink">{t("tr.cob.eyebrow")}</p>
              <h3 className="mt-1.5 font-display text-[16.5px] font-semibold tracking-[-0.02em] text-deep">
                {t("tr.cob.title")}
              </h3>
              <p className="mt-1.5 max-w-xl text-[13.5px] leading-relaxed text-ink-2">
                {t("tr.cob.desc")}
              </p>
            </div>
          </div>

          {/* Lives outside this app on the same domain, so an absolute link in a new
              tab rather than an internal route. */}
          <Button asChild variant="outline" className="shrink-0">
            <a href={external.cobUtilisation} target="_blank" rel="noopener noreferrer">
              {t("tr.cob.cta")}
              <ArrowUpRight className="h-5 w-5" />
            </a>
          </Button>
        </div>
      </Reveal>
    </Section>
  );
}
