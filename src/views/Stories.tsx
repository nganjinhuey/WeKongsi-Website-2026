"use client";

import React, { useMemo, useState } from "react";
import Link from "next/link";
import { ArrowRight, MessageCircle } from "lucide-react";
import { useTranslation } from "@/hooks/useTranslation";
import {
  activeCategories,
  byCategory,
  featuredStory,
  storiesByDate,
  type PublishedStory,
  type StoryCategory,
} from "@/data/stories";
import { external } from "@/lib/routes";
import { Section, Eyebrow } from "@/components/ui/section";
import { Button } from "@/components/ui/button";
import PageHero from "@/components/sections/PageHero";
import StoryCard from "@/components/sections/StoryCard";
import RichText from "@/components/RichText";
import Reveal from "@/components/ui/reveal";
import Orbs from "@/components/ui/orbs";
import { cn } from "@/lib/utils";

/** How many cards the filtered grid opens on, and how many more a press adds. */
const PAGE = 6;

/** The curated rows, in the order the hub reads. Each renders only if it has posts. */
const SECTIONS: { key: string; categories: StoryCategory[] }[] = [
  { key: "member", categories: ["member"] },
  { key: "community", categories: ["community", "partnerships", "agents"] },
  { key: "governance", categories: ["governance"] },
  { key: "programme", categories: ["programme"] },
  { key: "health", categories: ["health"] },
];

type Filter = "all" | StoryCategory;

/** One curated row: a heading, a lede, up to three posts and a way to see the rest. */
function Row({
  sectionKey,
  posts,
  onSeeAll,
}: {
  sectionKey: string;
  posts: PublishedStory[];
  onSeeAll: () => void;
}) {
  const { t } = useTranslation();
  if (posts.length === 0) return null;

  return (
    <div className="mt-16 lg:mt-20">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h2 className="font-display text-[24px] font-semibold tracking-[-0.03em] text-deep sm:text-[28px]">
            {t(`st.sec.${sectionKey}.t`)}
          </h2>
          <p className="mt-2 text-[14.5px] leading-relaxed text-ink-2">
            {t(`st.sec.${sectionKey}.d`)}
          </p>
        </div>
        {posts.length > 3 && (
          <button
            type="button"
            onClick={onSeeAll}
            className="group inline-flex items-center gap-2 text-[13.5px] font-semibold text-teal-deep transition-colors hover:text-teal-ink"
          >
            {t("st.sec.all")}
            <ArrowRight
              aria-hidden="true"
              className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-0.5"
            />
          </button>
        )}
      </div>

      <ul className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {posts.slice(0, 3).map((story, i) => (
          <Reveal key={story.slug} index={Math.min(i, 3)} as="li" className="block h-full">
            <StoryCard story={story} />
          </Reveal>
        ))}
      </ul>
    </div>
  );
}

/**
 * The Stories hub.
 *
 * Two modes, one page. Browsing everything, it reads as an edited publication: a lead
 * story, the newest three, then curated rows — member stories, community and
 * partnerships, governance, programme updates, insights. Pick a category and it
 * collapses to a plain grid of that category, newest first, paged.
 *
 * That split is deliberate. Thirty-odd posts in one uninterrupted grid is an archive,
 * not a hub, and a visitor who has not chosen a subject is better served by somebody
 * having chosen for them. A visitor who HAS chosen wants a list.
 *
 * Everything reads `published` entries only, so a filter, a row or a count can never
 * advertise an article that is still a draft. A row with nothing published in it does
 * not render at all.
 */
export default function Stories() {
  const { t, href } = useTranslation();
  const [filter, setFilter] = useState<Filter>("all");
  const [shown, setShown] = useState(PAGE);

  const browsing = filter === "all";

  const list = useMemo(
    () => (browsing ? [] : storiesByDate.filter((s) => s.category === filter)),
    [filter, browsing],
  );

  /* Paging resets where the filter changes rather than by watching its value — the
     page is a consequence of changing the filter, not of it having a value. */
  const pick = (next: Filter) => {
    setFilter(next);
    setShown(PAGE);
    document.getElementById("stories")?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const visible = list.slice(0, shown);
  const filters: Filter[] = ["all", ...activeCategories];

  /* The lead is pulled out of the rows while browsing; under a filter it goes back in,
     because inside a category of three it is just a card that happens to be bigger. */
  const rest = storiesByDate.filter((s) => s.slug !== featuredStory.slug);

  return (
    <>
      <PageHero
        eyebrow={t("st.hero.eyebrow")}
        title={t("st.hero.title")}
        lede={t("st.hero.lede")}
      />

      <Section tone="soft" id="stories" backdrop={<Orbs />}>
        {/* ---- Explore by category ---- */}
        <Reveal>
          <div
            role="group"
            aria-label={t("st.filter.label")}
            className="flex flex-wrap justify-center gap-2.5"
          >
            {filters.map((f) => {
              const selected = filter === f;
              return (
                <button
                  key={f}
                  type="button"
                  onClick={() => pick(f)}
                  aria-pressed={selected}
                  className={cn(
                    "rounded-pill px-4 py-2.5 text-[14px] font-medium transition-colors duration-200 focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-teal-deep focus-visible:ring-offset-2",
                    selected
                      ? "bg-grad-pill text-white shadow-glow-sm"
                      : "border border-line bg-white text-ink-2 hover:bg-mint hover:text-teal-ink",
                  )}
                >
                  {t(f === "all" ? "st.filter.all" : `st.filter.${f}`)}
                </button>
              );
            })}
          </div>
        </Reveal>

        {browsing ? (
          <>
            {/* ---- The lead ---- */}
            <Reveal index={1}>
              <div className="mt-12 lg:mt-14">
                <Eyebrow className="justify-center">{t("st.featured.label")}</Eyebrow>
                <div className="mt-6">
                  <StoryCard story={featuredStory} wide />
                </div>
              </div>
            </Reveal>

            {/* ---- Latest, then the curated rows ---- */}
            <div className="mt-16 lg:mt-20">
              <h2 className="font-display text-[24px] font-semibold tracking-[-0.03em] text-deep sm:text-[28px]">
                {t("st.latest.title")}
              </h2>
              <ul className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                {rest.slice(0, 3).map((story, i) => (
                  <Reveal key={story.slug} index={Math.min(i, 3)} as="li" className="block h-full">
                    <StoryCard story={story} index={i} />
                  </Reveal>
                ))}
              </ul>
            </div>

            {SECTIONS.map((section) => (
              <Row
                key={section.key}
                sectionKey={section.key}
                posts={section.categories.flatMap(byCategory)}
                onSeeAll={() => pick(section.categories[0])}
              />
            ))}
          </>
        ) : (
          /* ---- One category, newest first ---- */
          <div className="mt-12 lg:mt-14">
            <div className="flex flex-wrap items-baseline justify-between gap-4">
              <h2 className="font-display text-[24px] font-semibold tracking-[-0.03em] text-deep sm:text-[28px]">
                {t(`st.filter.${filter}`)}
              </h2>
              {list.length > visible.length && (
                <p aria-live="polite" className="text-[13.5px] font-semibold text-ink-2">
                  {t("st.count", { shown: visible.length, count: list.length })}
                </p>
              )}
            </div>

            {list.length === 0 ? (
              <p className="mt-10 rounded-card border border-line bg-white p-10 text-center text-ink-2">
                {t("st.none")}
              </p>
            ) : (
              <>
                <ul className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                  {visible.map((story, i) => (
                    <Reveal key={story.slug} index={Math.min(i, 3)} as="li" className="block h-full">
                      <StoryCard story={story} index={i} />
                    </Reveal>
                  ))}
                </ul>

                {list.length > visible.length && (
                  <div className="mt-10 flex justify-center">
                    <Button variant="outline" onClick={() => setShown((n) => n + PAGE)}>
                      {t("st.more")}
                    </Button>
                  </div>
                )}
              </>
            )}
          </div>
        )}
      </Section>

      {/* ---- Stay connected ---- */}
      <Section tone="deep" id="follow" backdrop={<Orbs tone="dark" />}>
        <div className="mx-auto max-w-2xl text-center">
          <Reveal>
            <span className="mx-auto grid h-12 w-12 place-items-center rounded-card bg-white/10 text-turq-light">
              <MessageCircle aria-hidden="true" className="h-5 w-5" />
            </span>
          </Reveal>
          <Reveal index={1}>
            <RichText as="h2" className="mt-6 t-h2 text-white" accentClassName="text-gradient-light">
              {t("st.cta.title")}
            </RichText>
          </Reveal>
          <Reveal index={2}>
            <p className="mt-5 text-[15.5px] leading-relaxed text-white/80">{t("st.cta.lede")}</p>
          </Reveal>
          <Reveal index={3}>
            <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
              <Button asChild variant="accent" size="lg">
                <a href={external.facebook} target="_blank" rel="noopener noreferrer">
                  {t("st.cta.follow")}
                </a>
              </Button>
              <Button asChild variant="ghostLight" size="lg">
                <a href={external.whatsapp} target="_blank" rel="noopener noreferrer">
                  {t("st.cta.chat")}
                </a>
              </Button>
            </div>
          </Reveal>
          <Reveal index={3}>
            <p className="mt-8">
              <Link
                href={href("/transparency")}
                className="text-[13.5px] font-semibold text-turq-light hover:text-turq-glow"
              >
                {t("tr.report.download")}
              </Link>
            </p>
          </Reveal>
        </div>
      </Section>
    </>
  );
}
