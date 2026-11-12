"use client";

import React from "react";
import { useTranslation } from "@/hooks/useTranslation";
import { Section, SectionHeading } from "@/components/ui/section";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import Reveal from "@/components/ui/reveal";

const QUESTION_COUNT = 8;

export default function FaqSection({
  tone = "light",
  count = QUESTION_COUNT,
}: {
  tone?: "light" | "soft";
  count?: number;
}) {
  const { t } = useTranslation();
  const questions = Array.from({ length: count }, (_, i) => i + 1);

  return (
    <Section tone={tone} id="faq">
      <SectionHeading eyebrow={t("faq.tag")} title={t("faq.title")} />

      <div className="mx-auto mt-12 max-w-3xl lg:mt-14">
        <Accordion type="single" collapsible className="flex flex-col gap-3">
          {questions.map((n, i) => (
            <Reveal key={n} index={Math.min(i, 3)}>
              <AccordionItem value={`q${n}`}>
                <AccordionTrigger>{t(`faq.q${n}`)}</AccordionTrigger>
                <AccordionContent>{t(`faq.a${n}`)}</AccordionContent>
              </AccordionItem>
            </Reveal>
          ))}
        </Accordion>
      </div>
    </Section>
  );
}
