"use client";

import React, { useState } from "react";
import { useTranslation } from "@/hooks/useTranslation";
import { programFacts } from "@/data/site";
import { cn } from "@/lib/utils";

const BILL_STEPS = [50_000, 100_000, 200_000, 400_000, 600_000];
const MEMBER_STEPS = [2_000, 4_000, 6_000, 8_000, 12_000];

const ringgit = (n: number) =>
  `RM${n.toLocaleString("en-MY", { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`;

/**
 * Lets a visitor see the arithmetic behind their own contribution, including the point
 * where the RM60 cap takes over. The cap is the program's central promise, so showing it
 * being applied is more convincing than stating it.
 */
export default function SharingCalculator() {
  const { t } = useTranslation();
  const [billIndex, setBillIndex] = useState(1);
  const [memberIndex, setMemberIndex] = useState(3);

  const bills = BILL_STEPS[billIndex];
  const members = MEMBER_STEPS[memberIndex];
  const rawShare = bills / members;
  const capped = rawShare > programFacts.sharingCap;
  const share = capped ? programFacts.sharingCap : rawShare;

  return (
    <div className="rounded-xl2 border border-line bg-white p-8 shadow-float sm:p-10">
      <h3 className="font-display text-lg font-bold text-navy">{t("hiwp.calc.title")}</h3>

      <div className="mt-7 grid gap-7 sm:grid-cols-2">
        <label className="block">
          <span className="flex items-baseline justify-between gap-3">
            <span className="text-sm font-medium text-ink-2">{t("hiwp.calc.bills")}</span>
            <span className="font-display text-base font-bold text-navy">{ringgit(bills)}</span>
          </span>
          <input
            type="range"
            min={0}
            max={BILL_STEPS.length - 1}
            step={1}
            value={billIndex}
            onChange={(e) => setBillIndex(Number(e.target.value))}
            className="mt-3 w-full accent-teal"
          />
        </label>

        <label className="block">
          <span className="flex items-baseline justify-between gap-3">
            <span className="text-sm font-medium text-ink-2">{t("hiwp.calc.members")}</span>
            <span className="font-display text-base font-bold text-navy">
              {members.toLocaleString("en-MY")}
            </span>
          </span>
          <input
            type="range"
            min={0}
            max={MEMBER_STEPS.length - 1}
            step={1}
            value={memberIndex}
            onChange={(e) => setMemberIndex(Number(e.target.value))}
            className="mt-3 w-full accent-teal"
          />
        </label>
      </div>

      <div className="mt-8 rounded-card bg-mint-soft p-7 text-center">
        <p className="font-display text-4xl font-extrabold tracking-tight text-teal-deep sm:text-5xl">
          RM{share.toFixed(2)}
        </p>
        <p className="mt-2 text-sm font-medium text-ink-2">{t("hiwp.calc.result")}</p>
        <p
          className={cn(
            "mt-3 inline-flex rounded-full px-3.5 py-1.5 text-xs font-semibold",
            capped ? "bg-navy text-white" : "bg-teal/10 text-teal-deep",
          )}
        >
          {capped ? t("hiwp.calc.capped") : t("hiwp.calc.under")}
        </p>
      </div>
    </div>
  );
}
