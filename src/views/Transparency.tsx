"use client";

import React, { useState } from "react";
import { useTranslation } from "@/hooks/useTranslation";
import {
  sharingReports,
  latestReport,
  sharingMonthOf,
  MONTH_LONG,
} from "@/data/sharing-reports";
import PageHero from "@/components/sections/PageHero";
import TrLatest from "@/components/transparency/latest";
import TrHistory from "@/components/transparency/history";
import TrFlow from "@/components/transparency/flow";
import FinalCta from "@/components/sections/FinalCta";

/**
 * The Transparency page.
 *
 * Five bands: the claim, the month in view, where the money goes, every month on one
 * line, and the close. The selected report is held here because two bands read it —
 * the header that titles itself by it, and the picker that changes it.
 *
 * The page opens on the newest report and titles itself by the month that report is
 * shared in, which `sharingMonthOf` derives from the data rather than from the clock:
 * a static export freezes whatever `new Date()` returned at build time, and a clock
 * read in the browser would drift past whatever report is actually published.
 */
export default function Transparency() {
  const { t } = useTranslation();
  const [reportId, setReportId] = useState(latestReport.id);
  const report = sharingReports.find((r) => r.id === reportId) ?? latestReport;

  const current = sharingMonthOf(latestReport);

  return (
    <>
      <PageHero
        eyebrow={t("tr.hero.eyebrow")}
        title={t("tr.hero.title")}
        lede={t("tr.hero.lede")}
        below={
          <p className="mx-auto inline-flex rounded-pill border border-white/70 bg-white/80 px-4 py-2 text-[12.5px] font-semibold text-teal-ink shadow-[0_2px_18px_-8px_rgba(18,63,70,.45)] backdrop-blur">
            {t("tr.hero.updated", {
              period: `${MONTH_LONG[current.month]} ${current.year}`,
            })}
          </p>
        }
      />

      <TrLatest report={report} onSelect={setReportId} />
      <TrHistory />
      <TrFlow />

      <FinalCta />
    </>
  );
}
