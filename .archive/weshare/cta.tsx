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
import Aurora from "@/components/ui/aurora";

export default function WsCta() {
  const { t, href } = useTranslation();

  return (
    <Section tone="soft" id="join" backdrop={<Aurora className="opacity-70" />}>
      <div className="mx-auto max-w-3xl text-center">
        <Reveal>
          <RichText as="h2" className="t-h2 text-deep" accentClassName="text-gradient-brand">
            {t("wsp.cta.title")}
          </RichText>
        </Reveal>
        <Reveal index={1}>
          <div className="mt-9 flex flex-wrap justify-center gap-3">
            <Button asChild size="lg">
              <a href={external.join} target="_blank" rel="noopener noreferrer">
                {t("wsp.cta.join")}
                <ArrowRight className="h-5 w-5" />
              </a>
            </Button>
            <Button asChild size="lg" variant="outline">
              <Link href={href("/transparency")}>{t("wsp.cta.reports")}</Link>
            </Button>
          </div>
        </Reveal>
      </div>
    </Section>
  );
}
