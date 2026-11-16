"use client";

import React from "react";
import { ExternalLink, FileClock, FileText } from "lucide-react";
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
 * miniature cover, opening further on hover or keyboard focus. The page count and
 * weight are stated beside it, because a 72-page file on a phone connection is worth
 * warning someone about before they tap.
 *
 * The precedence line is the point of the section. Everything on a plan page is a
 * summary, and saying which document wins is the honest way to end one.
 *
 * Where there is an amendment log, it sits in the left column rather than as a second
 * button on the sheet. A member who has read the previous edition does not want to
 * re-read seventy-two pages to find out what moved, and that is a different errand
 * from opening the document for the first time — it needs its own sentence, which the
 * sheet has no room for.
 */
export default function GuidelinesCta({
  docKey,
  href,
  pages,
  size,
  amendment,
}: {
  /** Translation key for the document's own title. */
  docKey: string;
  href: string;
  pages: number;
  /** Human-readable file size, e.g. "1.5 MB". */
  size: string;
  /**
   * The log of what this edition changed, where one is published. Omitted on a
   * document that has not been amended, and the whole block then does not render.
   */
  amendment?: { href: string; pages: number; size: string };
}) {
  const { t } = useTranslation();

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

              {amendment && (
                <div className="mt-8 rounded-[18px] border border-line bg-mint-soft p-5">
                  <p className="flex items-center gap-2 font-display text-[14.5px] font-semibold text-deep">
                    <FileClock aria-hidden="true" className="h-4 w-4 shrink-0 text-teal-deep" />
                    {t("gl.amend.title")}
                  </p>
                  <p className="mt-2 text-[13.5px] leading-relaxed text-ink-2">
                    {t("gl.amend.desc")}
                  </p>
                  <Button asChild variant="outline" size="sm" className="mt-4">
                    <a href={amendment.href} target="_blank" rel="noopener noreferrer">
                      {t("gl.amend.cta")}
                      <ExternalLink className="h-4 w-4" />
                    </a>
                  </Button>
                  {/* "1 pages" is the kind of thing a reader notices and a writer
                      does not. The log is one page today and may not always be. */}
                  <p className="mt-3 text-[12px] text-ink-3">
                    {amendment.pages === 1
                      ? t("gl.metaOne", { size: amendment.size })
                      : t("gl.meta", { pages: String(amendment.pages), size: amendment.size })}
                  </p>
                </div>
              )}

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
