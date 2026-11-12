"use client";

import React from "react";
import Link from "next/link";
import { ArrowRight, ExternalLink, Minus } from "lucide-react";
import { useTranslation } from "@/hooks/useTranslation";
import { external } from "@/lib/routes";
import { Section, Eyebrow } from "@/components/ui/section";
import RichText from "@/components/RichText";
import Reveal from "@/components/ui/reveal";

/**
 * Where the plan stops.
 *
 * Only the exclusions — what IS included was said four sections ago, and repeating it
 * here as a facing column turned an honest list into a comparison table nobody asked
 * for. A plan candid about its edges is easier to trust than one that buries them,
 * so this gets a heading of its own rather than a footnote.
 *
 * Dashes, not crosses, and the same ink as everything else. Nine red crosses reads as
 * a warning about the product; these are simply its edges.
 *
 * Hospitalisation is the first line anyone looks for here, so WeShare sits beside the
 * list — finding it missing with no idea what does cover it is the one way this
 * section could leave someone worse informed than they arrived.
 */
export default function WcxLimits() {
  const { t, tList, href } = useTranslation();
  const excluded = tList("wcx.out.list");

  return (
    <Section tone="soft" id="limits" className="py-[72px] lg:py-20 xl:py-24">
      <div className="grid gap-12 lg:grid-cols-[1fr_1fr] lg:gap-16">
        <div>
          <Reveal>
            <Eyebrow>{t("wcx.out.eyebrow")}</Eyebrow>
          </Reveal>
          <Reveal index={1}>
            <RichText as="h2" className="mt-5 t-h2 text-deep" accentClassName="text-gradient-brand">
              {t("wcx.out.title")}
            </RichText>
          </Reveal>
          <Reveal index={2}>
            <p className="mt-5 max-w-lg text-[16px] leading-relaxed text-ink-2">
              {t("wcx.out.lede")}
            </p>
          </Reveal>

          <Reveal index={3}>
            <div className="mt-8 rounded-[24px] border border-line bg-white p-7 shadow-tide sm:p-8">
              <h3 className="font-display text-[17px] font-semibold leading-snug tracking-[-0.02em] text-deep">
                {t("wcx.out.ws.t")}
              </h3>
              <p className="mt-3 text-[13.5px] leading-relaxed text-ink-2">{t("wcx.out.ws.d")}</p>
              <Link
                href={href("/plans/weshare")}
                className="mt-5 inline-flex items-center gap-2 text-[14px] font-semibold text-teal-deep transition-colors hover:text-teal-ink"
              >
                {t("wcx.out.ws.cta")}
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </Reveal>
        </div>

        <Reveal index={1}>
          <ul className="divide-y divide-line border-y border-line">
            {excluded.map((item) => (
              <li
                key={item}
                className="row-tide flex items-center gap-4 py-4 text-[14.5px] leading-snug text-ink-2"
              >
                <span className="relative z-10 grid h-6 w-6 shrink-0 place-items-center rounded-full bg-mint text-ink-2">
                  <Minus aria-hidden="true" className="h-3 w-3" strokeWidth={3} />
                </span>
                <span className="relative z-10">{item}</span>
              </li>
            ))}
          </ul>
        </Reveal>
      </div>

      <Reveal index={2}>
        <div className="mt-12 flex flex-col gap-4 border-t border-line pt-8 lg:flex-row lg:items-end lg:justify-between lg:gap-10">
          <p className="max-w-3xl text-[12.5px] leading-relaxed text-ink-2">
            {t("wcx.out.disclaimer")}
          </p>
          <a
            href={external.guidelinesWecare}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex shrink-0 items-center gap-2 text-[14px] font-semibold text-teal-deep transition-colors hover:text-teal-ink"
          >
            {t("wcx.out.link")}
            <ExternalLink className="h-4 w-4" />
          </a>
        </div>
      </Reveal>
    </Section>
  );
}
