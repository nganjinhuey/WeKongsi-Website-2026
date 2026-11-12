"use client";

import React, { useMemo, useState } from "react";
import { LineChart, Table2 } from "lucide-react";
import { useTranslation } from "@/hooks/useTranslation";
import {
  sharingReports,
  sharingTotals,
  latestReport,
  MONTH_SHORT,
  type SharingReport,
} from "@/data/sharing-reports";
import { Section, Eyebrow } from "@/components/ui/section";
import SharingChart, { type Measure } from "@/components/sections/SharingChart";
import RichText from "@/components/RichText";
import Reveal from "@/components/ui/reveal";
import { cn } from "@/lib/utils";

const ringgit = (n: number, dp = 2) =>
  `RM${n.toLocaleString("en-MY", { minimumFractionDigits: dp, maximumFractionDigits: dp })}`;

const periodLabel = (r: SharingReport) => `${MONTH_SHORT[r.month]} ${r.year}`;

/** The default view is the two most recent years; the rest is a click away. */
const RECENT_FROM = 2025;

/**
 * The measures the line can show.
 *
 * Active members was one of them and is not any more: it is a membership figure, not
 * a sharing figure, and on a page about what the community shared it invited the one
 * reading nobody should take — cost against headcount, as though the line were a rate.
 *
 * `cell` is how each measure is written in the table, so the header and the body are
 * generated from the same list. They were not, and dropping a measure from the header
 * left the body a column wider than it.
 */
const MEASURES: { id: Measure; labelKey: string; cell: (r: SharingReport) => string }[] = [
  { id: "cost", labelKey: "tr.chart.m.cost", cell: (r) => ringgit(r.cost) },
  { id: "cases", labelKey: "tr.chart.m.cases", cell: (r) => r.cases.toLocaleString("en-MY") },
];

/**
 * Every month on one line.
 *
 * The controls sit in one row above the plot, which is where a filter belongs — the
 * measure switch on the left because it changes what the line is, the range and the
 * table view on the right because they change how much of it you see. The table is
 * the same data, kept because a line cannot be read to the ringgit and somebody
 * always needs the ringgit.
 */
export default function TrHistory() {
  const { t } = useTranslation();
  const [measure, setMeasure] = useState<Measure>("cost");
  const [allTime, setAllTime] = useState(false);
  const [asTable, setAsTable] = useState(false);

  const rows = useMemo(
    () => (allTime ? sharingReports : sharingReports.filter((r) => r.year >= RECENT_FROM)),
    [allTime],
  );

  const measureLabel = t(MEASURES.find((m) => m.id === measure)!.labelKey);

  return (
    <Section tone="soft" id="history">
      <div className="mx-auto max-w-2xl text-center">
        <Reveal>
          <Eyebrow className="justify-center">{t("tr.chart.eyebrow")}</Eyebrow>
        </Reveal>
        <Reveal index={1}>
          <RichText as="h2" className="mt-5 t-h2 text-deep" accentClassName="text-gradient-brand">
            {t("tr.chart.title")}
          </RichText>
        </Reveal>
        <Reveal index={2}>
          <p className="mt-5 text-[15.5px] leading-relaxed text-ink-2">
            {t("tr.chart.total", {
              value: ringgit(sharingTotals.cost, 0),
              months: String(sharingTotals.months),
            })}
          </p>
        </Reveal>
      </div>

      <Reveal index={2}>
        <div className="mt-12 rounded-[28px] border border-line bg-white p-5 shadow-tide sm:p-7 lg:mt-14">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div
              role="group"
              /* Static: the group is still "Measure" whichever one is pressed. */
              aria-label={t("tr.chart.measure")}
              className="flex flex-wrap rounded-pill border border-line bg-mint-soft p-1"
            >
              {MEASURES.map((m) => (
                <button
                  key={m.id}
                  type="button"
                  onClick={() => setMeasure(m.id)}
                  aria-pressed={measure === m.id}
                  className={cn(
                    "rounded-pill px-4 py-2 text-[13.5px] font-semibold transition-colors",
                    measure === m.id ? "bg-teal-ink text-white" : "text-ink-2 hover:text-teal-ink",
                  )}
                >
                  {t(m.labelKey)}
                </button>
              ))}
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setAllTime((v) => !v)}
                aria-pressed={allTime}
                className={cn(
                  "rounded-pill border px-4 py-2 text-[13.5px] font-semibold transition-colors",
                  allTime
                    ? "border-teal-ink bg-teal-ink text-white"
                    : "border-line bg-white text-ink-2 hover:border-teal-ink hover:text-teal-ink",
                )}
              >
                {allTime ? t("tr.chart.rangeAll") : `${RECENT_FROM}–${latestReport.year}`}
              </button>
              <button
                type="button"
                onClick={() => setAsTable((v) => !v)}
                className="inline-flex items-center gap-1.5 rounded-pill border border-line bg-white px-4 py-2 text-[13.5px] font-semibold text-ink-2 transition-colors hover:border-teal-ink hover:text-teal-ink"
              >
                {asTable ? (
                  <LineChart className="h-4 w-4" />
                ) : (
                  <Table2 className="h-4 w-4" />
                )}
                {asTable ? t("tr.chart.showChart") : t("tr.chart.showTable")}
              </button>
            </div>
          </div>

          <div className="mt-6">
            {asTable ? (
              <div className="max-h-[420px] overflow-auto rounded-card border border-line">
                <table className="w-full border-collapse text-left text-[13.5px]">
                  <thead className="sticky top-0 bg-mint-soft">
                    <tr>
                      <th scope="col" className="px-4 py-3 font-display font-semibold text-deep">
                        {t("tr.chart.month")}
                      </th>
                      {MEASURES.map((m) => (
                        <th
                          key={m.id}
                          scope="col"
                          className="px-4 py-3 text-right font-display font-semibold text-deep"
                        >
                          {t(m.labelKey)}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {[...rows].reverse().map((r, i) => (
                      <tr
                        key={r.id}
                        className={cn("border-t border-line", i % 2 === 1 && "bg-mint-soft/40")}
                      >
                        <th scope="row" className="px-4 py-2.5 font-medium text-ink-2">
                          {periodLabel(r)}
                        </th>
                        {MEASURES.map((m) => (
                          <td
                            key={m.id}
                            className="px-4 py-2.5 text-right tabular-nums text-deep"
                          >
                            {m.cell(r)}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <SharingChart rows={rows} measure={measure} label={measureLabel} />
            )}
          </div>
        </div>
      </Reveal>
    </Section>
  );
}
