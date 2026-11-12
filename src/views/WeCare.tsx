"use client";

import React from "react";
import WcxHero from "@/components/wecare/hero";
import WcxBenefits from "@/components/wecare/benefits";
import WcxHow from "@/components/wecare/how";
import WcxEpisodes from "@/components/wecare/episodes";
import WcxConditions from "@/components/wecare/conditions";
import WcxPricing from "@/components/wecare/pricing";
import WcxLimits from "@/components/wecare/limits";
import WcxFaq from "@/components/wecare/faq";
import GuidelinesCta from "@/components/sections/GuidelinesCta";
import WcxCta from "@/components/wecare/cta";
import { external } from "@/lib/routes";
import { guidelineDocs } from "@/data/site";

/**
 * The WeCare plan page.
 *
 * Ten bands under `components/wecare/`, in the order a stranger needs them: what it
 * is → what you get → how you use it → **1 + 1** → what it treats → what it costs →
 * where it stops → the full terms → questions → join.
 *
 * The Care Episode figure sits in the middle of the page and owns the only dark band,
 * because it is the one thing a visitor has to understand. Everything either side of
 * it is deliberately thin — a line per benefit, a line per step — so that by the time
 * the sum arrives the reader has spent no attention on anything else.
 *
 * Grounds alternate so no two neighbours read the same: wash → white → mint → deep →
 * white → accent → cool white → cool white → white → deep.
 *
 * Every figure is read from `wecareFacts`, and nothing here is inferred: the scope,
 * prices, entitlements and limits are the ones the WeCare Program Guidelines state.
 */
export default function WeCare() {
  return (
    <>
      <WcxHero />
      <WcxBenefits />
      <WcxHow />
      <WcxEpisodes />
      <WcxConditions />
      <WcxPricing />
      <WcxLimits />
      <GuidelinesCta
        docKey="gl.docWecare"
        contentsKey="gl.wc.contents"
        href={external.guidelinesWecare}
        pages={guidelineDocs.wecare.pages}
        size={guidelineDocs.wecare.size}
      />
      <WcxFaq />
      <WcxCta />
    </>
  );
}
