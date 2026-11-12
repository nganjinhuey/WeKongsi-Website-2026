"use client";

import React, { useState } from "react";
import { Info } from "lucide-react";
import { useTranslation } from "@/hooks/useTranslation";
import { communityStats } from "@/data/site";
import Counter from "@/components/ui/counter";
import Reveal from "@/components/ui/reveal";

export default function StatsBar() {
  const { t } = useTranslation();
  const [open, setOpen] = useState(false);

  const stats = [
    { key: "impact.members", value: communityStats.totalMembers, breakdown: true },
    { key: "impact.bills", value: communityStats.sharedAmount, decimals: 2, prefix: "RM " },
    { key: "impact.hospital", value: communityStats.supportedHospitals },
    { key: "impact.clinic", value: communityStats.supportedClinics },
  ];

  return (
    <section className="relative z-20">
      {/* Pulled up over the hero so the card straddles the photograph's bottom edge. */}
      <div className="container -mt-24 sm:-mt-28 lg:-mt-32">
        <Reveal>
          {/* `divide-*` draws the rules between columns without a trailing edge on the
              last one, and it follows the same breakpoints as the grid — so the dividers
              can never appear across a wrap boundary. */}
          <div className="grid divide-y divide-line rounded-xl2 border border-line bg-white px-6 py-4 shadow-lift sm:grid-cols-2 sm:divide-y-0 sm:[&>*:nth-child(3)]:border-t sm:[&>*:nth-child(3)]:border-line sm:[&>*:nth-child(4)]:border-t sm:[&>*:nth-child(4)]:border-line sm:[&>*:nth-child(odd)]:border-r sm:[&>*:nth-child(odd)]:border-line lg:grid-cols-4 lg:divide-x lg:px-4 lg:py-8 lg:[&>*]:border-0">
            {stats.map((stat) => (
              <div
                key={stat.key}
                className="flex flex-col items-center justify-center px-2 py-6 text-center lg:py-2"
              >
                {/* Sized to the narrowest column it must fit in: at lg the four columns
                    leave ~208px of content width, and "RM 4,548,932.85" is the longest
                    value. Too large and it wraps after "RM", which drops that column's
                    label below the other three and breaks the row's alignment.
                    whitespace-nowrap makes that failure loud rather than silent. */}
                <div className="whitespace-nowrap font-display text-3xl font-extrabold leading-none tracking-tight text-deep sm:text-[1.75rem] lg:text-[1.6rem] xl:text-[2rem]">
                  <Counter
                    value={stat.value}
                    decimals={stat.decimals ?? 0}
                    prefix={stat.prefix ?? ""}
                  />
                </div>

                {/* The info affordance is balanced by an equal spacer on the opposite
                    side, so the label text stays centred under its number AND the
                    label-plus-icon group stays symmetric in the cell. Absolutely
                    positioning the icon centres the text but makes the visible group look
                    shunted right; laying it out inline centres the group but pushes the
                    text off-centre. The spacer gets both. */}
                <div className="mt-2.5 flex items-center justify-center gap-1.5">
                  {stat.breakdown && <span aria-hidden="true" className="h-5 w-5 shrink-0" />}
                  <span className="text-sm font-medium text-ink-2">{t(stat.key)}</span>
                  {stat.breakdown && (
                    <span className="relative shrink-0">
                      <button
                        type="button"
                        onClick={() => setOpen((v) => !v)}
                        onBlur={() => setOpen(false)}
                        aria-label={t("site.impact.breakdown")}
                        aria-expanded={open}
                        className="grid h-5 w-5 place-items-center rounded-full text-ink-3 transition-colors hover:text-teal"
                      >
                        <Info className="h-3.5 w-3.5" />
                      </button>
                      {open && (
                        <span
                          role="status"
                          className="absolute left-1/2 top-7 z-30 w-64 -translate-x-1/2 rounded-card border border-line bg-white p-4 text-left shadow-float"
                        >
                          <span className="flex items-baseline justify-between gap-3 text-xs text-ink-2">
                            {t("site.impact.waiting")}
                            <b className="font-display text-sm text-deep">
                              {communityStats.membersInWaitingPeriod.toLocaleString("en-MY")}
                            </b>
                          </span>
                          <span className="mt-2 flex items-baseline justify-between gap-3 text-xs text-ink-2">
                            {t("site.impact.active")}
                            <b className="font-display text-sm text-deep">
                              {communityStats.activeMembers.toLocaleString("en-MY")}
                            </b>
                          </span>
                        </span>
                      )}
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </Reveal>
      </div>
    </section>
  );
}
