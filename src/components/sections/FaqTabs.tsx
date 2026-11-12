"use client";

import React, { useRef, useState } from "react";
import { useTranslation } from "@/hooks/useTranslation";
import type { FaqGroup } from "@/data/faq";
import { Section, Eyebrow } from "@/components/ui/section";
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "@/components/ui/accordion";
import RichText from "@/components/RichText";
import Reveal from "@/components/ui/reveal";
import { cn } from "@/lib/utils";

/**
 * One question set, shown a category at a time.
 *
 * Every FAQ on the site used to be one long column — six headings and twenty-odd rows
 * stacked under each other, which is a wall whether or not the answers are good. A
 * visitor arrives with a question of one kind, so the categories come first and only
 * the chosen one is rendered.
 *
 * It is a real tablist, not a row of buttons: arrow keys move between tabs with focus
 * following, Home and End jump to the ends, and the panel is labelled by its tab. The
 * accordion is remounted with the group as its key so a question left open in one
 * category does not leave the next one opening at row three.
 */
export default function FaqTabs({
  ns,
  groups,
  eyebrowKey,
  titleKey,
  ledeKey,
  tone = "light",
  id = "faq",
  footer,
}: {
  /** Translation namespace holding this set's copy, e.g. `"wsq"`. */
  ns: string;
  groups: FaqGroup[];
  eyebrowKey: string;
  titleKey: string;
  ledeKey?: string;
  tone?: "light" | "soft";
  id?: string;
  /** Rendered under the accordion — usually a line about where to ask anything else. */
  footer?: React.ReactNode;
}) {
  const { t } = useTranslation();
  const [active, setActive] = useState(0);
  const tabs = useRef<(HTMLButtonElement | null)[]>([]);

  const group = groups[active];

  const onKeyDown = (e: React.KeyboardEvent) => {
    const last = groups.length - 1;
    const next =
      e.key === "ArrowRight" || e.key === "ArrowDown"
        ? (active + 1) % groups.length
        : e.key === "ArrowLeft" || e.key === "ArrowUp"
          ? (active + groups.length - 1) % groups.length
          : e.key === "Home"
            ? 0
            : e.key === "End"
              ? last
              : -1;
    if (next < 0) return;
    e.preventDefault();
    setActive(next);
    tabs.current[next]?.focus();
  };

  return (
    <Section tone={tone} id={id}>
      <div className="mx-auto max-w-2xl text-center">
        <Reveal>
          <Eyebrow className="justify-center">{t(eyebrowKey)}</Eyebrow>
        </Reveal>
        <Reveal index={1}>
          <RichText as="h2" className="mt-5 t-h2 text-deep" accentClassName="text-gradient-brand">
            {t(titleKey)}
          </RichText>
        </Reveal>
        {ledeKey && (
          <Reveal index={2}>
            <p className="mt-5 text-[15.5px] leading-relaxed text-ink-2">{t(ledeKey)}</p>
          </Reveal>
        )}
      </div>

      <Reveal index={1}>
        <div
          role="tablist"
          aria-label={t(titleKey).replace(/\[\[|\]\]|\*\*/g, "")}
          onKeyDown={onKeyDown}
          className="mt-10 flex flex-wrap justify-center gap-2.5"
        >
          {groups.map((g, i) => {
            const selected = i === active;
            return (
              <button
                key={g.id}
                ref={(el) => {
                  tabs.current[i] = el;
                }}
                type="button"
                role="tab"
                id={`${ns}-tab-${g.id}`}
                aria-selected={selected}
                aria-controls={`${ns}-panel-${g.id}`}
                /* Roving tabindex: one stop for the whole tablist, then arrow keys. */
                tabIndex={selected ? 0 : -1}
                onClick={() => setActive(i)}
                className={cn(
                  "rounded-pill px-4 py-2.5 text-[14px] font-medium transition-colors duration-200 focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-teal-deep focus-visible:ring-offset-2",
                  selected
                    ? "bg-grad-pill text-white shadow-glow-sm"
                    : "border border-line bg-white text-ink-2 hover:bg-mint hover:text-teal-ink",
                )}
              >
                {t(`${ns}.${g.id}.label`)}
              </button>
            );
          })}
        </div>
      </Reveal>

      <div
        role="tabpanel"
        id={`${ns}-panel-${group.id}`}
        aria-labelledby={`${ns}-tab-${group.id}`}
        className="mx-auto mt-10 max-w-3xl"
      >
        <Accordion key={group.id} type="single" collapsible className="flex flex-col gap-3">
          {Array.from({ length: group.count }, (_, i) => i + 1).map((q, i) => (
            <Reveal key={q} index={Math.min(i, 3)}>
              <AccordionItem value={`${group.id}-${q}`}>
                <AccordionTrigger>{t(`${ns}.${group.id}.q${q}`)}</AccordionTrigger>
                <AccordionContent>{t(`${ns}.${group.id}.a${q}`)}</AccordionContent>
              </AccordionItem>
            </Reveal>
          ))}
        </Accordion>

        {footer}
      </div>
    </Section>
  );
}
