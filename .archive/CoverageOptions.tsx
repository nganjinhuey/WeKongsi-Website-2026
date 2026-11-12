"use client";

import React from "react";
import { Check, X } from "lucide-react";
import { useTranslation } from "@/hooks/useTranslation";
import { Section, SectionHeading } from "@/components/ui/section";
import RichText from "@/components/RichText";
import Reveal from "@/components/ui/reveal";
import { cn } from "@/lib/utils";

/** The two packages: hospitalisation on its own, or hospitalisation plus outpatient. */
export default function CoverageOptions() {
  const { t } = useTranslation();

  const options = [
    { n: 1, range: "RM0 – RM60", featured: false, includes: [true, false] },
    { n: 2, range: "RM15 – RM75", featured: true, includes: [true, true] },
  ];

  return (
    <Section tone="light" id="choose">
      <SectionHeading
        eyebrow={t("choose.tag")}
        title={t("choose.title")}
        lede={t("choose.desc")}
      />

      <div className="mx-auto mt-14 grid max-w-4xl gap-6 lg:grid-cols-2">
        {options.map((option, i) => (
          <Reveal key={option.n} index={i}>
            <article
              className={cn(
                "flex h-full flex-col rounded-xl2 border p-8",
                option.featured
                  ? "border-teal bg-deep text-white"
                  : "border-line bg-white",
              )}
            >
              <span
                className={cn(
                  "inline-flex w-fit rounded-full px-3.5 py-1.5 text-[11px] font-bold uppercase tracking-[0.12em]",
                  option.featured ? "bg-teal text-white" : "bg-mint text-teal-deep",
                )}
              >
                {t(`choose.opt${option.n}.badge`)}
              </span>

              <h3
                className={cn(
                  "mt-5 font-display text-xl font-extrabold tracking-tight",
                  option.featured ? "text-white" : "text-deep",
                )}
              >
                {t(`choose.opt${option.n}.t`)}
              </h3>
              <p
                className={cn(
                  "mt-2 text-sm",
                  option.featured ? "text-white/60" : "text-ink-2",
                )}
              >
                {t(`choose.opt${option.n}.sub`)}
              </p>

              {option.featured && (
                <RichText
                  as="p"
                  className="mt-4 text-sm text-turq"
                  accentClassName="text-turq"
                >
                  {t("choose.opt2.addon")}
                </RichText>
              )}

              <div
                className={cn(
                  "mt-6 rounded-card p-5",
                  option.featured ? "bg-white/[0.06]" : "bg-mint-soft",
                )}
              >
                <p
                  className={cn(
                    "text-[11px] font-bold uppercase tracking-[0.12em]",
                    option.featured ? "text-white/50" : "text-ink-3",
                  )}
                >
                  {t("choose.sharing")}
                </p>
                <p className="mt-1.5 flex items-baseline gap-1.5">
                  <span
                    className={cn(
                      "font-display text-3xl font-extrabold tracking-tight",
                      option.featured ? "text-turq" : "text-teal-deep",
                    )}
                  >
                    {option.range}
                  </span>
                  <span
                    className={cn(
                      "text-sm",
                      option.featured ? "text-white/50" : "text-ink-3",
                    )}
                  >
                    {t("choose.permonth")}
                  </span>
                </p>
              </div>

              <ul className="mt-7 space-y-4">
                {[1, 2].map((f, index) => {
                  const included = option.includes[index];
                  return (
                    <li key={f} className="flex gap-3">
                      <span
                        className={cn(
                          "mt-0.5 grid h-5 w-5 shrink-0 place-items-center rounded-full",
                          included
                            ? "bg-teal/15 text-teal"
                            : option.featured
                              ? "bg-white/10 text-white/40"
                              : "bg-slate-100 text-ink-3",
                        )}
                      >
                        {included ? <Check className="h-3 w-3" /> : <X className="h-3 w-3" />}
                      </span>
                      <span>
                        <span
                          className={cn(
                            "block font-display text-sm font-bold",
                            option.featured ? "text-white" : "text-deep",
                          )}
                        >
                          {t(`choose.opt${option.n}.f${f}.t`)}
                        </span>
                        <span
                          className={cn(
                            "mt-0.5 block text-sm",
                            option.featured ? "text-white/55" : "text-ink-2",
                          )}
                        >
                          {t(`choose.opt${option.n}.f${f}.d`)}
                        </span>
                      </span>
                    </li>
                  );
                })}
              </ul>
            </article>
          </Reveal>
        ))}
      </div>
    </Section>
  );
}
