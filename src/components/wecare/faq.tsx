"use client";

import React from "react";
import { wecareFaq } from "@/data/faq";
import FaqTabs from "@/components/sections/FaqTabs";

/**
 * WeCare's own questions, by category.
 *
 * A visitor arrives wondering about one thing — what an episode is, what it costs,
 * what happens if they stop — so the categories come first and only the chosen one is
 * rendered. The Guidelines, for everything else, are the section directly above.
 */
export default function WcxFaq() {
  return (
    <FaqTabs
      ns="wcq"
      groups={wecareFaq}
      eyebrowKey="wcq.eyebrow"
      titleKey="wcq.title"
      ledeKey="wcq.lede"
      tone="soft"
    />
  );
}
