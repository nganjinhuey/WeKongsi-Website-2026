"use client";

import React from "react";
import WsxHero from "@/components/weshare/hero";
import WsxHow from "@/components/weshare/how";
import WsxBenefits from "@/components/weshare/benefits";
import WsxPricing from "@/components/weshare/pricing";
import WsxCap from "@/components/weshare/cap";
import WsxCob from "@/components/weshare/cob";
import WsxEligibility from "@/components/weshare/eligibility";
import Testimonials from "@/components/sections/Testimonials";
import WsxFaq from "@/components/weshare/faq";
import GuidelinesCta from "@/components/sections/GuidelinesCta";
import WsxCta from "@/components/weshare/cta";
import { external } from "@/lib/routes";
import { guidelineDocs } from "@/data/site";

/**
 * The WeShare plan page.
 *
 * Eleven bands, each its own component under `components/weshare/`, alternating ground
 * so no two neighbours read the same: mint hero → deep green mechanism → soft-mint
 * benefits → white calculator → white COB → accent pricing → washed eligibility → deep
 * green stories → cool-white guidelines → white FAQ → deep green close.
 *
 * Pricing sits directly before eligibility on purpose: a reader who has just seen what
 * the community shares, what their monthly share is capped at and what the outpatient
 * add-on costs is being asked, in order, what it costs and then whether they can join.
 * Every other section on the page is about the sharing contribution — the part that
 * varies — so the pricing band is left to describe the membership fee alone.
 *
 * The carousel is the home page's, passed a dark tone and this page's headings, rather
 * than a second implementation of the same scroll-snap behaviour.
 */
export default function WeShare() {
  return (
    <>
      <WsxHero />
      <WsxHow />
      <WsxBenefits />
      <WsxCap />
      <WsxCob />
      <WsxPricing />
      <WsxEligibility />
      <Testimonials
        tone="deep"
        eyebrowKey="wsx.ts.eyebrow"
        titleKey="wsx.ts.title"
        ledeKey="wsx.ts.lede"
      />
      <GuidelinesCta
        docKey="gl.docWeshare"
        contentsKey="gl.ws.contents"
        href={external.guidelinesWeshare}
        pages={guidelineDocs.weshare.pages}
        size={guidelineDocs.weshare.size}
      />
      <WsxFaq />
      <WsxCta />
    </>
  );
}
