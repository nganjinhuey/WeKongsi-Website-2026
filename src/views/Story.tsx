"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, ArrowUpRight, Check, Clock, Info, Link2, Play, Share2 } from "lucide-react";
import { useTranslation } from "@/hooks/useTranslation";
import { findStory, relatedStories, storyDate } from "@/data/stories";
import { parseStoryBody, readingMinutes } from "@/lib/story-body";
import { SITE_URL } from "@/lib/routes";
import { Section } from "@/components/ui/section";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import RichText from "@/components/RichText";
import StoryCard from "@/components/sections/StoryCard";
import FinalCta from "@/components/sections/FinalCta";
import Reveal from "@/components/ui/reveal";
import Orbs from "@/components/ui/orbs";

/**
 * One article — the template every post is drawn with.
 *
 * Nothing here is specific to a post: the category, date, cover, body, gallery and
 * video all come from the entry in `src/data/stories.ts`, so a new article is a data
 * entry and a set of copy keys rather than a new page. The optional parts simply do
 * not render when a post has none.
 *
 * The body is a list-valued key read through `tList`, which keeps a multi-paragraph
 * article inside the translation files like every other string on the site rather
 * than as markup in a component. `parseStoryBody` turns those lines into blocks —
 * headings, bullets, quotations, a closing line — so a long piece reads as an article
 * and not as a run of undifferentiated paragraphs. The markers are documented in
 * `src/lib/story-body.ts`.
 */
/** The host a video link points at, or "" if it is not a URL this can read. */
const videoHost = (url: string) => {
  try {
    return new URL(url).hostname;
  } catch {
    return "";
  }
};

export default function Story({ slug }: { slug: string }) {
  const { t, tList, href } = useTranslation();
  const [copied, setCopied] = useState(false);
  const story = findStory(slug);

  // The route list is generated from the same data, so an unknown slug cannot be
  // reached by a visitor — this is the guard that keeps the type honest.
  if (!story) return null;

  const date = storyDate(story.date);
  const related = relatedStories(slug);
  const url = `${SITE_URL}/stories/${slug}`;
  const body = tList(story.bodyKey);
  const blocks = parseStoryBody(body);

  return (
    <>
      <Section tone="soft" className="pt-[104px] lg:pt-[132px]" backdrop={<Orbs />}>
        <article className="mx-auto max-w-3xl">
          <Reveal>
            <Link
              href={href("/stories")}
              className="group inline-flex items-center gap-2 text-[13.5px] font-semibold text-teal-deep transition-colors hover:text-teal-ink"
            >
              <ArrowLeft
                aria-hidden="true"
                className="h-4 w-4 transition-transform duration-200 group-hover:-translate-x-0.5"
              />
              {t("st.back")}
            </Link>
          </Reveal>

          <Reveal index={1}>
            <div className="mt-7 flex flex-wrap items-center gap-3">
              <span className="rounded-pill bg-mint px-3 py-1 text-[11.5px] font-bold uppercase tracking-[0.1em] text-teal-ink">
                {t(`st.filter.${story.category}`)}
              </span>
              {date && (
                <time dateTime={story.date} className="text-[13px] font-medium text-ink-2">
                  {date}
                </time>
              )}
              <span className="text-[13px] text-ink-3">{t(story.authorKey ?? "st.author")}</span>
              <span className="inline-flex items-center gap-1.5 text-[13px] text-ink-3">
                <Clock aria-hidden="true" className="h-3.5 w-3.5" />
                {t("st.readMins", { count: readingMinutes(body) })}
              </span>
            </div>

            <h1 className="mt-5 font-display text-[clamp(30px,4.4vw,48px)] font-semibold leading-[1.1] tracking-[-0.035em] text-deep">
              {t(story.titleKey)}
            </h1>
            {/* The standfirst. Set in the display face a step up from body copy, because
                its job is to tell a reader what the next thousand words are about and
                let them decide — not to be the first of them. */}
            <RichText
              as="p"
              className="mt-6 font-display text-[18px] font-medium leading-[1.6] text-ink-2 sm:text-[19px]"
              accentClassName="text-gradient-brand"
            >
              {t(story.excerptKey)}
            </RichText>
          </Reveal>
        </article>

        <Reveal index={2}>
          {/* A document is portrait and has to be legible, so it gets a narrow 4:3
              mount. Artwork is already 16:9 and only needs to not be cropped. A
              photograph fills the frame. */}
          <figure
            className={cn(
              "mx-auto mt-12",
              story.coverFit === "document" ? "max-w-xl" : "max-w-4xl",
            )}
          >
            <div
              className={cn(
                "relative overflow-hidden rounded-[28px] shadow-tide-lg",
                story.coverFit === "document"
                  ? "aspect-[4/3] bg-mint-soft p-5 sm:p-7"
                  : "aspect-[16/9]",
                story.coverFit === "artwork" && "bg-mint-soft",
              )}
            >
              <Image
                src={story.cover}
                alt={t(story.coverAltKey)}
                fill
                priority
                sizes="(min-width: 1024px) 56rem, 92vw"
                className={cn(
                  story.coverFit === "document"
                    ? "object-contain p-5 sm:p-7"
                    : story.coverFit === "artwork"
                      ? "object-contain"
                      : "object-cover",
                )}
              />
            </div>
          </figure>
        </Reveal>

        {/* ---- The body ---- */}
        <div className="mx-auto mt-12 max-w-3xl">
          {blocks.map((block, i) => {
            const rise = Math.min(i, 3);
            /* `first:` is useless here — each block is the only child of its own
               <Reveal>, so the variant would match every one of them. */
            const lead = i === 0;

            if (block.kind === "heading") {
              return (
                <Reveal key={i} index={rise}>
                  {/* A heading that opens the article needs no gap above it — the
                      lede and the cover have already done that work. */}
                  <RichText
                    as="h2"
                    className={cn(
                      "font-display text-[22px] font-semibold leading-snug tracking-[-0.03em] text-deep sm:text-[26px]",
                      lead ? "mt-0" : "mt-12",
                    )}
                    accentClassName="text-gradient-brand"
                  >
                    {block.text}
                  </RichText>
                </Reveal>
              );
            }

            if (block.kind === "list") {
              return (
                <Reveal key={i} index={rise}>
                  <ul className="mt-6 space-y-4 rounded-[22px] border border-line bg-mint-soft p-6 sm:p-7">
                    {block.items.map((item, j) => (
                      <li key={j} className="flex items-start gap-3">
                        <span
                          aria-hidden="true"
                          className="mt-[5px] grid h-[18px] w-[18px] shrink-0 place-items-center rounded-full bg-teal-deep text-white"
                        >
                          <Check className="h-[10px] w-[10px]" strokeWidth={3.2} />
                        </span>
                        <RichText as="span" className="text-[15.5px] leading-[1.7] text-ink-2">
                          {item}
                        </RichText>
                      </li>
                    ))}
                  </ul>
                </Reveal>
              );
            }

            if (block.kind === "quote") {
              return (
                <Reveal key={i} index={rise}>
                  {/* A member's own words, kept verbatim. The turquoise rule rather than
                      a quotation glyph: the marks are already in the text. */}
                  <blockquote className="mt-8 border-l-[3px] border-turq pl-6 sm:pl-7">
                    <RichText
                      as="p"
                      className="font-display text-[19px] font-medium leading-[1.55] tracking-[-0.015em] text-deep sm:text-[21px]"
                    >
                      {block.text}
                    </RichText>
                  </blockquote>
                </Reveal>
              );
            }

            if (block.kind === "close") {
              return (
                <Reveal key={i} index={rise}>
                  <RichText
                    as="p"
                    className="mt-10 rounded-[22px] bg-grad-stage p-7 text-center font-display text-[18px] font-semibold leading-snug tracking-[-0.02em] text-deep sm:text-[20px]"
                    accentClassName="text-gradient-brand"
                  >
                    {block.text}
                  </RichText>
                </Reveal>
              );
            }

            return (
              <Reveal key={i} index={rise}>
                <RichText
                  as="p"
                  className={cn("text-[16.5px] leading-[1.75] text-ink-2", lead ? "mt-0" : "mt-6")}
                >
                  {block.text}
                </RichText>
              </Reveal>
            );
          })}

          {/* A total hospital bill is not what the community shared. The brief is
              explicit that the two must never be conflated, so every member story
              carries the distinction rather than relying on the prose to imply it. */}
          {story.category === "member" && (
            <Reveal index={2}>
              <p className="mt-10 flex gap-3 rounded-card border border-line bg-mint-soft p-5 text-[13px] leading-relaxed text-ink-2">
                <Info aria-hidden="true" className="mt-0.5 h-4 w-4 shrink-0 text-teal-ink" />
                {t("st.billNote")}
              </p>
            </Reveal>
          )}

          {/* ---- The member's own video, where there is one ---- */}
          {story.video && (
            <Reveal index={2}>
              <div className="mt-10 rounded-[26px] border border-line bg-white p-6 shadow-tide sm:p-7">
                <p className="text-[13.5px] leading-relaxed text-ink-2">{t("st.videoNote")}</p>
                <Button asChild variant="outline" className="mt-5">
                  <a href={story.video} target="_blank" rel="noopener noreferrer">
                    <Play className="h-4 w-4" />
                    {/* Almost every member video is on the We Kongsi YouTube channel
                        and the button says so, because naming the destination is the
                        difference between a link someone trusts and one they do not.
                        One story is on Facebook, so it has to say that instead. */}
                    {t(/(^|\.)facebook\.com$/.test(videoHost(story.video)) ? "st.watchFb" : "st.watch")}
                    <ArrowUpRight className="h-4 w-4" />
                  </a>
                </Button>
              </div>
            </Reveal>
          )}

          {/* ---- Further photographs, where there are any ---- */}
          {story.gallery?.length ? (
            <Reveal index={3}>
              <div className="mt-10 grid gap-5 sm:grid-cols-2">
                {story.gallery.map((shot) => (
                  <div
                    key={shot.src}
                    className="img-zoom group relative aspect-[4/3] overflow-hidden rounded-[22px] shadow-tide"
                  >
                    <Image
                      src={shot.src}
                      alt={t(shot.altKey)}
                      fill
                      sizes="(min-width: 640px) 24rem, 92vw"
                      className="object-cover"
                    />
                  </div>
                ))}
              </div>
            </Reveal>
          ) : null}
        </div>
      </Section>

      {/* ---- Share ----
          Two links and a copy button rather than a script: a third-party share widget
          would put a tracker on an article about transparency. The links are the
          networks' own documented share URLs and open in a new tab. */}
      <Section tone="light" className="py-10 lg:py-12">
        <div className="mx-auto flex max-w-3xl flex-wrap items-center gap-4">
          <span className="inline-flex items-center gap-2 text-[13.5px] font-semibold text-ink-2">
            <Share2 aria-hidden="true" className="h-4 w-4" />
            {t("st.share")}
          </span>
          <div className="flex flex-wrap gap-2.5">
            <a
              href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-pill border border-line bg-white px-4 py-2 text-[13px] font-semibold text-teal-ink transition-colors hover:bg-mint"
            >
              Facebook
            </a>
            <a
              href={`https://wa.me/?text=${encodeURIComponent(`${t(story.titleKey)} ${url}`)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-pill border border-line bg-white px-4 py-2 text-[13px] font-semibold text-teal-ink transition-colors hover:bg-mint"
            >
              WhatsApp
            </a>
            <button
              type="button"
              onClick={() => {
                navigator.clipboard?.writeText(url).then(
                  () => setCopied(true),
                  () => setCopied(false),
                );
              }}
              className="inline-flex items-center gap-1.5 rounded-pill border border-line bg-white px-4 py-2 text-[13px] font-semibold text-teal-ink transition-colors hover:bg-mint"
            >
              {copied ? (
                <Check aria-hidden="true" className="h-3.5 w-3.5" />
              ) : (
                <Link2 aria-hidden="true" className="h-3.5 w-3.5" />
              )}
              {t(copied ? "st.share.copied" : "st.share.copy")}
            </button>
          </div>
        </div>
      </Section>

      {/* ---- What to read next ---- */}
      {related.length > 0 && (
        <Section tone="light" id="related">
          <h2 className="font-display text-[24px] font-semibold tracking-[-0.03em] text-deep sm:text-[28px]">
            {t("st.related")}
          </h2>
          <ul className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {related.map((other, i) => (
              <Reveal key={other.slug} index={Math.min(i, 3)} as="li" className="block h-full">
                <StoryCard story={other} />
              </Reveal>
            ))}
          </ul>

          <div className="mt-10">
            <Button asChild variant="outline">
              <Link href={href("/stories")}>
                <ArrowLeft className="h-4 w-4" />
                {t("st.back")}
              </Link>
            </Button>
          </div>
        </Section>
      )}

      <FinalCta />
    </>
  );
}
