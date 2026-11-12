"use client";

import React from "react";
import { Check, X } from "lucide-react";
import { useTranslation } from "@/hooks/useTranslation";
import { Section, Eyebrow } from "@/components/ui/section";
import RichText from "@/components/RichText";
import Reveal from "@/components/ui/reveal";
import Placeholder from "@/components/ui/placeholder";

/**
 * What WeShare is, set directly against what it is not.
 *
 * The two columns are deliberately the same size and sit side by side: the distinction
 * from insurance is the single thing a first-time reader most needs, and burying the
 * "is not" half under the "is" half would let it be skimmed past.
 */
export default function WsWhat() {
  const { t } = useTranslation();

  return (
    <Section tone="light" id="what">
      <div className="mx-auto max-w-3xl text-center">
        <Reveal>
          <Eyebrow>{t("wsp.what.eyebrow")}</Eyebrow>
        </Reveal>
        <Reveal index={1}>
          <RichText as="h2" className="mt-5 t-h2 text-deep" accentClassName="text-gradient-brand">
            {t("wsp.what.title")}
          </RichText>
        </Reveal>
      </div>

      <div className="mt-12 grid gap-5 lg:grid-cols-2">
        <Reveal>
          <div className="h-full rounded-xl2 border border-teal/30 bg-mint/40 p-7 sm:p-8">
            <h3 className="flex items-center gap-2.5 font-display text-[18px] font-semibold tracking-[-0.02em] text-deep">
              <span className="grid h-7 w-7 place-items-center rounded-full bg-teal text-white">
                <Check aria-hidden="true" className="h-4 w-4" strokeWidth={3} />
              </span>
              {t("wsp.what.isTitle")}
            </h3>
            <ul className="mt-6 space-y-4">
              {["is1", "is2", "is3"].map((k) => (
                <li key={k} className="flex gap-3 border-b border-teal/15 pb-4 last:border-0 last:pb-0">
                  <Check aria-hidden="true" className="mt-0.5 h-4 w-4 shrink-0 text-teal-deep" strokeWidth={2.5} />
                  <span className="text-[14.5px] font-light leading-relaxed text-ink-2">
                    {t(`wsp.what.${k}`)}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </Reveal>

        <Reveal index={1}>
          <div className="h-full rounded-xl2 border border-line bg-sand/60 p-7 sm:p-8">
            <h3 className="flex items-center gap-2.5 font-display text-[18px] font-semibold tracking-[-0.02em] text-deep">
              <span className="grid h-7 w-7 place-items-center rounded-full bg-ink-3 text-white">
                <X aria-hidden="true" className="h-4 w-4" strokeWidth={3} />
              </span>
              {t("wsp.what.isntTitle")}
            </h3>
            <ul className="mt-6 space-y-4">
              {["isnt1", "isnt2", "isnt3"].map((k) => (
                <li key={k} className="flex gap-3 border-b border-line pb-4 last:border-0 last:pb-0">
                  <X aria-hidden="true" className="mt-0.5 h-4 w-4 shrink-0 text-ink-3" strokeWidth={2.5} />
                  <span className="text-[14.5px] font-light leading-relaxed text-ink-2">
                    {t(`wsp.what.${k}`)}
                    {k === "isnt1" && (
                      <>
                        {" "}
                        <Placeholder>{t("wsp.ph.compliance")}</Placeholder>
                      </>
                    )}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </Reveal>
      </div>
    </Section>
  );
}
