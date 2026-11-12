"use client";

import React from "react";
import Link from "next/link";
import { ArrowRight, Check } from "lucide-react";
import { useTranslation } from "@/hooks/useTranslation";
import { external } from "@/lib/routes";
import { Button } from "@/components/ui/button";
import RichText from "@/components/RichText";
import { Eyebrow } from "@/components/ui/section";
import Reveal from "@/components/ui/reveal";

export default function FinalCta() {
  const { t, href } = useTranslation();

  return (
    <section className="on-dark band-edge grain relative isolate overflow-hidden bg-band-hero py-20 sm:py-24 lg:py-28">
      {/* The band's own mesh blooms turquoise from the top right at the largest alpha
          the white-on-petrol copy survives. This pool is therefore at the BOTTOM,
          where the base ramp runs down to #0A272E and there is headroom to spend:
          the glow rises behind the buttons and the trust line instead of compositing
          on top of a bloom that is already at its ceiling. */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute bottom-[-24%] left-1/2 h-[62%] w-[min(1100px,98vw)] -translate-x-1/2 animate-pulse-glow rounded-[50%] bg-[radial-gradient(closest-side,rgba(37,182,165,.34),transparent_72%)] blur-[52px] motion-reduce:animate-none"
      />

      <div className="container relative flex flex-col items-center text-center">
        <Reveal>
          <Eyebrow tone="dark">{t("site.cta.eyebrow")}</Eyebrow>
        </Reveal>
        <Reveal index={1}>
          <RichText
            as="h2"
            className="mt-6 max-w-3xl t-h2 text-white"
            accentClassName="text-gradient-light"
          >
            {t("cta.title")}
          </RichText>
        </Reveal>
        <Reveal index={2}>
          <p className="mt-5 max-w-xl text-base leading-relaxed text-white/80 sm:text-lg">
            {t("cta.desc")}
          </p>
        </Reveal>

        <Reveal index={3}>
          <div className="mt-9 flex flex-col gap-3 sm:flex-row">
            <Button asChild size="lg">
              <a href={external.join} target="_blank" rel="noopener noreferrer">
                {t("site.cta.become")}
                <ArrowRight className="h-5 w-5" />
              </a>
            </Button>
            <Button asChild variant="ghostLight" size="lg">
              <Link href={href("/faq")}>{t("site.cta.readFaq")}</Link>
            </Button>
          </div>
        </Reveal>

        <Reveal index={4}>
          {/* 14px, so the trust line needs the full 4.5:1. White at 65% measured
              4.1:1 once the band's blooms were turned up; 80% holds 5.3:1 at the
              band's brightest point. The band got brighter, so the ink had to too. */}
          <ul className="mt-11 flex flex-wrap justify-center gap-x-7 gap-y-3">
            {["cta.trust1", "cta.trust2", "cta.trust3"].map((key) => (
              <li key={key} className="flex items-center gap-2 text-sm text-white/80">
                <Check className="h-4 w-4 shrink-0 text-turq-light" />
                {t(key)}
              </li>
            ))}
          </ul>
        </Reveal>
      </div>
    </section>
  );
}
