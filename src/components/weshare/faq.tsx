"use client";

import React from "react";
import { weshareFaq } from "@/data/faq";
import FaqTabs from "@/components/sections/FaqTabs";

/**
 * WeShare's own questions, by category.
 *
 * These used to be the FAQ page's groups rendered in full — six headings and twenty
 * rows in one column, on a page that had already answered most of them. The set is now
 * WeShare's alone, and the FAQ page carries the general questions instead.
 */
export default function WsxFaq() {
  return (
    <FaqTabs
      ns="wsq"
      groups={weshareFaq}
      eyebrowKey="wsq.eyebrow"
      titleKey="wsq.title"
      ledeKey="wsq.lede"
    />
  );
}
