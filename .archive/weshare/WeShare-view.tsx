"use client";

import React from "react";
import WsHero from "@/components/weshare/hero";
import WsMarquee from "@/components/weshare/marquee";
import WsWhat from "@/components/weshare/what";
import WsHow from "@/components/weshare/how";
import WsCalculator from "@/components/weshare/calculator";
import WsShared from "@/components/weshare/shared";
import WsCoShare from "@/components/weshare/co-share";
import WsJoin from "@/components/weshare/join";
import WsHeydoc from "@/components/weshare/heydoc";
import WsTransparency from "@/components/weshare/transparency";
import WsFaq from "@/components/weshare/faq";
import WsCta from "@/components/weshare/cta";

/**
 * The WeShare plan page.
 *
 * Each band is its own component under `components/weshare/`, and the order here is the
 * argument: what it is, what it is not, how it works, what you would actually pay, what
 * is shared, what you pay on admission, what to know before joining, the optional
 * add-on, the published record, the questions, the ask.
 *
 * No two consecutive bands share a layout — split lockup, marquee, two columns, sticky
 * scroll, calculator, bento, calculator again but different, three cards, phone mock,
 * centred figures, accordion. That alternation is the reason the page does not read as
 * a document.
 */
export default function WeShare() {
  return (
    <>
      <WsHero />
      <WsMarquee />
      <WsWhat />
      <WsHow />
      <WsCalculator />
      <WsShared />
      <WsCoShare />
      <WsJoin />
      <WsHeydoc />
      <WsTransparency />
      <WsFaq />
      <WsCta />
    </>
  );
}
