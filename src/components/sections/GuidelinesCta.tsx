"use client";

import React from "react";
import { ExternalLink, FileText } from "lucide-react";
import { useTranslation } from "@/hooks/useTranslation";
import { Section, Eyebrow } from "@/components/ui/section";
import { Button } from "@/components/ui/button";
import RichText from "@/components/RichText";
import Reveal from "@/components/ui/reveal";

/**
 * The link to a plan's Program Guidelines, as a section rather than a footnote.
 *
 * Both plan pages carry one, each pointing at its own document — they govern different
 * products and were previously sharing a single link.
 *
 * The document is drawn as a document: three fanned sheets whose front one is a
 * miniature cover, opening further on hover or keyboard focus. A row of section names
 * sits beside it, because the honest reason someone does not open a 72-page PDF is
 * that they have no idea what is in it. The page count and weight are stated for the
 * same reason — a 72-page file on a phone connection is worth warning someone about.
 *
 * The precedence line is the point of the section. Everything on a plan page is a
 * summary, and saying which document wins is the honest way to end one.
 */
export default function GuidelinesCta({
  docKey,
  contentsKey,
  href,
  pages,
  size,
}: {
  /** Translation key for the document's own title. */
  docKey: string;
  /** List-valued key naming the document's top-level sections. */
  contentsKey: string;
  href: string;
  pages: number;
  /** Human-readable file size, e.g. "1.5 MB". */
  size: string;
}) {
  const { t, tList } = useTranslation();
  const contents = tList(contentsKey);

  return (
    <Section tone="soft" id="guidelines" className="py-16 lg:py-24">
      <Reveal>
        <div className="overflow-hidden rounded-[32px] border border-line bg-white shadow-tide">
          <div className="grid gap-12 p-8 sm:p-10 lg:grid-cols-[1.15fr_0.85fr] lg:items-center lg:gap-16 lg:p-14">
            <div>
              <Eyebrow>{t("gl.eyebrow")}</Eyebrow>
              <RichText
                as="h2"
                className="mt-5 t-h2 text-[clamp(26px,2.9vw,38px)] text-deep"
                accentClassName="text-gradient-brand"
              >
                {t("gl.title")}
              </RichText>
              <p className="mt-5 max-w-xl text-[15px] leading-relaxed text-ink-2">{t("gl.lede")}</p>

              <h3 className="mt-9 t-eyebrow text-teal-ink">{t("gl.inside")}</h3>
              <ul className="mt-4 flex flex-wrap gap-2">
                {contents.map((item) => (
                  <li
                    key={item}
                    className="rounded-pill border border-line bg-white px-3.5 py-1.5 text-[13px] text-ink-2"
                  >
                    {item}
                  </li>
                ))}
              </ul>

              <p className="mt-8 text-[12.5px] leading-relaxed text-ink-3">{t("gl.note")}</p>
            </div>

            <div className="doc-stack mx-auto w-full max-w-[300px]">
              <span aria-hidden="true" className="doc-sheet doc-sheet--ghost doc-sheet--back" />
              <span aria-hidden="true" className="doc-sheet doc-sheet--ghost doc-sheet--mid" />

              <div className="doc-sheet doc-sheet--front p-7">
                <span className="grid h-12 w-12 place-items-center rounded-card bg-mint text-teal-ink">
                  <FileText aria-hidden="true" className="h-[22px] w-[22px]" strokeWidth={1.8} />
                </span>
                <p className="mt-5 font-display text-[16.5px] font-semibold leading-snug tracking-[-0.02em] text-deep">
                  {t(docKey)}
                </p>
                <p className="mt-1 text-[13px] text-ink-2">{t("gl.dated")}</p>

                {/* Ruled lines, not text: the sheet has to read as a page of prose at
                    a glance without pretending to quote the document. */}
                <div aria-hidden="true" className="mt-6 space-y-2.5">
                  <span className="doc-rule w-full" />
                  <span className="doc-rule w-[88%]" />
                  <span className="doc-rule w-[94%]" />
                  <span className="doc-rule w-[58%]" />
                </div>

                <p className="mt-6 text-[12.5px] text-ink-3">
                  {t("gl.meta", { pages: String(pages), size })}
                </p>

                <Button asChild size="sm" className="mt-5 w-full">
                  {/* Opens in a new tab rather than navigating away: the reader is
                      mid-page, and a 72-page PDF is a detour, not a destination. */}
                  <a href={href} target="_blank" rel="noopener noreferrer">
                    {t("gl.cta")}
                    <ExternalLink className="h-4 w-4" />
                  </a>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </Reveal>
    </Section>
  );
}
