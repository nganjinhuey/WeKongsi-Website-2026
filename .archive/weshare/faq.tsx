"use client";

import React from "react";
import { useTranslation } from "@/hooks/useTranslation";
import { Section } from "@/components/ui/section";
import {
  Accordion, AccordionItem, AccordionTrigger, AccordionContent,
} from "@/components/ui/accordion";
import RichText from "@/components/RichText";
import Reveal from "@/components/ui/reveal";
import Placeholder from "@/components/ui/placeholder";

/** Questions, with the ones whose answer is still incomplete carrying a placeholder. */
const QUESTIONS = [
  { n: 1 },
  { n: 2, ph: "wsp.ph.fee" },
  { n: 3, ph: "wsp.ph.carried" },
  { n: 4 },
  { n: 5 },
  { n: 6 },
  { n: 7 },
];

export default function WsFaq() {
  const { t } = useTranslation();

  return (
    <Section tone="light" id="faq">
      <div className="mx-auto max-w-2xl text-center">
        <Reveal>
          <RichText as="h2" className="t-h2 text-deep" accentClassName="text-gradient-brand">
            {t("wsp.faq.title")}
          </RichText>
        </Reveal>
      </div>

      <Reveal index={1}>
        <div className="mx-auto mt-12 max-w-3xl">
          <Accordion type="single" collapsible className="divide-y divide-line border-y border-line">
            {QUESTIONS.map(({ n, ph }) => (
              <AccordionItem key={n} value={`q${n}`} className="border-0">
                <AccordionTrigger className="py-5 text-left font-display text-[16px] font-semibold tracking-[-0.02em] text-deep hover:no-underline sm:text-[17px]">
                  {t(`wsp.faq.q${n}`)}
                </AccordionTrigger>
                <AccordionContent className="pb-6 text-[14.5px] font-light leading-relaxed text-ink-2">
                  {t(`wsp.faq.a${n}`)}
                  {ph && (
                    <span className="mt-3 block">
                      <Placeholder>{t(ph)}</Placeholder>
                    </span>
                  )}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </Reveal>
    </Section>
  );
}
