"use client";

import React from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { useTranslation } from "@/hooks/useTranslation";
import { featuredStory, storiesByDate } from "@/data/stories";
import { Section, Eyebrow } from "@/components/ui/section";
import { Button } from "@/components/ui/button";
import StoryCard from "@/components/sections/StoryCard";
import RichText from "@/components/RichText";
import Reveal from "@/components/ui/reveal";

/**
 * Four posts on the home page, and a way through to the rest.
 *
 * Deliberately compact — one row and a link. The home page's job is to say what We
 * Kongsi is; this is only evidence that it is a going concern with things happening in
 * it, so it stays a single row however many articles the hub grows to.
 *
 * The featured post leads, then the newest three that are not it, so the home page and
 * the index agree about what matters without the two being wired together.
 */
export default function StoriesPreview() {
  const { t, href } = useTranslation();

  const picks = [
    featuredStory,
    ...storiesByDate.filter((s) => s.slug !== featuredStory.slug).slice(0, 3),
  ];

  return (
    <Section tone="light" id="stories">
      <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
        <div className="max-w-2xl">
          <Reveal>
            <Eyebrow>{t("st.home.eyebrow")}</Eyebrow>
          </Reveal>
          <Reveal index={1}>
            <RichText as="h2" className="mt-5 t-h2 text-deep" accentClassName="text-gradient-brand">
              {t("st.home.title")}
            </RichText>
          </Reveal>
          <Reveal index={2}>
            <p className="mt-5 text-[15.5px] leading-relaxed text-ink-2">{t("st.home.lede")}</p>
          </Reveal>
        </div>

        <Reveal index={2} className="shrink-0">
          <Button asChild variant="outline">
            <Link href={href("/stories")}>
              {t("st.home.cta")}
              <ArrowRight className="h-5 w-5" />
            </Link>
          </Button>
        </Reveal>
      </div>

      <ul className="mt-12 grid gap-5 sm:grid-cols-2 lg:mt-14 lg:grid-cols-4">
        {picks.map((story, i) => (
          <Reveal key={story.slug} index={Math.min(i, 3)} as="li" className="block h-full">
            <StoryCard story={story} />
          </Reveal>
        ))}
      </ul>
    </Section>
  );
}
