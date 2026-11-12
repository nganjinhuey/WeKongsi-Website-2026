"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { useTranslation } from "@/hooks/useTranslation";
import { storyDate, type PublishedStory } from "@/data/stories";
import { cn } from "@/lib/utils";

/**
 * One story, as a card — the single place a post is drawn.
 *
 * The index, the related row at the foot of an article and the homepage preview all
 * use this, so a change to how a post looks is one change rather than three. `wide`
 * is the featured treatment: the picture beside the copy instead of above it, which
 * is what makes one cell lead a grid without needing a different component.
 */
export default function StoryCard({
  story,
  wide = false,
  index = 0,
}: {
  story: PublishedStory;
  wide?: boolean;
  index?: number;
}) {
  const { t, href } = useTranslation();
  const date = storyDate(story.date);
  /** Covers that carry type are fitted, not filled. See the note on the frame below. */
  const fits = story.coverFit === "artwork" || story.coverFit === "document";

  return (
    <Link
      href={href(`/stories/${story.slug}`)}
      className={cn(
        "card-lift glow-edge group flex h-full overflow-hidden rounded-[26px] border border-line bg-white shadow-tide hover:shadow-tide-glow",
        wide ? "flex-col lg:flex-row" : "flex-col",
      )}
    >
      {/* A photograph fills the cell, and the featured one stretches to the card's
          height. A cover that carries type does neither — it sits in a fixed 16:10
          frame and is fitted inside it, because a cropped headline is a broken one. */}
      <div
        className={cn(
          "img-zoom relative shrink-0 overflow-hidden",
          fits ? "aspect-[16/10] bg-mint-soft" : "aspect-[16/10]",
          wide && (fits ? "lg:w-[54%] lg:self-center" : "lg:aspect-auto lg:w-[54%]"),
        )}
      >
        <Image
          src={story.cover}
          alt=""
          fill
          /* The first cards are above the fold on the index; the rest are not, and a
             post added in two years should not quietly make the page slower. */
          priority={index < 2}
          sizes={wide ? "(min-width: 1024px) 54vw, 92vw" : "(min-width: 1024px) 31vw, 92vw"}
          className={fits ? "object-contain" : "object-cover"}
        />
        <span className="sheen-host pointer-events-none absolute inset-0" />
      </div>

      <div className={cn("flex flex-1 flex-col p-6 sm:p-7", wide && "lg:justify-center lg:p-10")}>
        <div className="flex flex-wrap items-center gap-2.5">
          <span className="rounded-pill bg-mint px-3 py-1 text-[11.5px] font-bold uppercase tracking-[0.1em] text-teal-ink">
            {t(`st.filter.${story.category}`)}
          </span>
          {date && <span className="text-[12.5px] font-medium text-ink-3">{date}</span>}
        </div>

        <h3
          className={cn(
            "mt-4 font-display font-semibold leading-snug tracking-[-0.025em] text-deep",
            wide ? "text-[23px] sm:text-[28px]" : "text-[18px]",
          )}
        >
          {t(story.titleKey)}
        </h3>
        <p
          className={cn(
            "mt-3 leading-relaxed text-ink-2",
            wide ? "text-[15px] sm:text-[15.5px]" : "text-[14px]",
          )}
        >
          {t(story.excerptKey)}
        </p>

        <span className="mt-5 inline-flex items-center gap-2 text-[13.5px] font-semibold text-teal-deep transition-colors group-hover:text-teal-ink">
          {t("st.read")}
          <ArrowRight
            aria-hidden="true"
            className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-0.5"
          />
        </span>
      </div>
    </Link>
  );
}
