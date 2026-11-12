"use client";

import React from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { useTranslation } from "@/hooks/useTranslation";
import { external } from "@/lib/routes";
import { Section } from "@/components/ui/section";
import { Button } from "@/components/ui/button";
import RichText from "@/components/RichText";
import Reveal from "@/components/ui/reveal";
import Orbs from "@/components/ui/orbs";

export default function WcxCta() {
  const { t, href } = useTranslation();

  return (
    <Section tone="cta" id="join" backdrop={<Orbs tone="dark" />}>
      <div className="mx-auto max-w-3xl text-center">
        <Reveal>
          <RichText as="h2" className="t-h2 text-white" accentClassName="text-gradient-light">
            {t("wcx.cta.title")}
          </RichText>
        </Reveal>
        <Reveal index={1}>
          <p className="mx-auto mt-5 max-w-xl text-[15.5px] leading-relaxed text-white/80">
            {t("wcx.cta.lede")}
          </p>
        </Reveal>
        <Reveal index={2}>
          <div className="mt-9 flex flex-wrap justify-center gap-3">
            <Button asChild size="lg">
              <a href={external.join} target="_blank" rel="noopener noreferrer">
                {t("wcx.cta.b1")}
                <ArrowRight className="h-5 w-5" />
              </a>
            </Button>
            {/* The guidelines got a section of their own directly above this band, so
                the secondary action here is the FAQ — as it is on the WeShare close. */}
            <Button asChild size="lg" variant="ghostLight">
              <Link href={href("/faq")}>{t("wcx.cta.b2")}</Link>
            </Button>
          </div>
        </Reveal>
      </div>
    </Section>
  );
}
