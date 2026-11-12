"use client";

import React, { useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight, Play, ArrowRight, ExternalLink } from "lucide-react";
import { useTranslation } from "@/hooks/useTranslation";
import { testimonials, type Testimonial } from "@/data/site";
import { Section, SectionHeading } from "@/components/ui/section";
import Reveal from "@/components/ui/reveal";
import Orbs from "@/components/ui/orbs";
import VideoDialog, { youtubeEmbed } from "@/components/ui/video-dialog";
import { cn } from "@/lib/utils";

/**
 * Member stories as a scroll-snap carousel.
 *
 * Only testimonials with a published photograph appear: each card is built around a
 * real member image, and a card without one would be a quote in a box pretending to be
 * a story. They run in the order they are listed, which is newest first — the row used
 * to be re-sorted to put videos in front, but nearly every story has one now, so that
 * only pushed the newest arrivals to the back.
 *
 * Built on native scroll-snap rather than a carousel library: it gives real swipe and
 * keyboard scrolling for free, degrades to a plain scrollable row without JavaScript,
 * and the arrows just scroll it by one page.
 */
/**
 * The watch control's classes, shared by the two forms it takes. The `after:inset-0`
 * is the important part: it stretches the control over the whole card, which is what
 * makes the card clickable while leaving exactly one tab stop and one accessible name.
 */
const WATCH =
  "inline-flex shrink-0 items-center gap-1 text-[13.5px] font-semibold text-teal-ink outline-none transition-colors hover:text-teal-deep after:absolute after:inset-0 after:z-10 after:rounded-xl2 after:content-[''] focus-visible:after:ring-2 focus-visible:after:ring-teal focus-visible:after:ring-offset-2";

export default function Testimonials({
  tone = "mint",
  eyebrowKey = "ts.tag",
  titleKey = "ts.title",
  ledeKey = "ts.desc",
}: {
  /** "deep" puts the carousel on a dark band; "mint" is the home page treatment. */
  tone?: "mint" | "deep";
  eyebrowKey?: string;
  titleKey?: string;
  ledeKey?: string;
} = {}) {
  const dark = tone === "deep";
  const { t } = useTranslation();

  const stories = testimonials.filter((s) => s.image);

  const [playing, setPlaying] = useState<Testimonial | null>(null);
  const trackRef = useRef<HTMLUListElement>(null);
  const [page, setPage] = useState(0);
  const [pages, setPages] = useState(1);

  const measure = useCallback(() => {
    const el = trackRef.current;
    if (!el) return;
    setPages(Math.max(1, Math.round(el.scrollWidth / el.clientWidth)));
    setPage(Math.round(el.scrollLeft / el.clientWidth));
  }, []);

  useEffect(() => {
    const el = trackRef.current;
    if (!el) return;
    measure();
    el.addEventListener("scroll", measure, { passive: true });
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    return () => {
      el.removeEventListener("scroll", measure);
      ro.disconnect();
    };
  }, [measure]);

  const scrollBy = (dir: 1 | -1) => {
    const el = trackRef.current;
    if (el) el.scrollBy({ left: dir * el.clientWidth, behavior: "smooth" });
  };

  return (
    <Section
      tone={dark ? "deep" : "soft"}
      id="testimonials"
      className={dark ? undefined : "bg-band-mint"}
      backdrop={<Orbs tone={dark ? "dark" : "light"} />}
    >
      <SectionHeading
        tone={dark ? "dark" : "light"}
        eyebrow={t(eyebrowKey)}
        title={t(titleKey)}
        lede={t(ledeKey)}
      />

      <Reveal index={1}>
        <ul
          ref={trackRef}
          className="mt-14 flex snap-x snap-mandatory gap-6 overflow-x-auto pb-2 [-ms-overflow-style:none] [scrollbar-width:none] lg:mt-16 [&::-webkit-scrollbar]:hidden"
        >
          {stories.map((s) => (
            <li
              key={s.id}
              className="w-[86%] shrink-0 snap-start sm:w-[47%] lg:w-[calc((100%-3rem)/3)]"
            >
              {/* A story with a video is clickable across the whole card, but the button
                  below is the only focusable control: its ::after is what covers the
                  card, so there is one tab stop and one accessible name. */}
              <article
                className={cn(
                  "group relative flex h-full flex-col overflow-hidden rounded-xl2 border border-line bg-white",
                  s.video && "card-lift",
                )}
              >
                <div className="relative aspect-[4/3] overflow-hidden bg-mint">
                  <Image
                    src={s.image as string}
                    alt={s.name}
                    fill
                    sizes="(max-width: 640px) 86vw, (max-width: 1024px) 47vw, 30vw"
                    className={cn(
                      "object-cover transition-transform duration-500",
                      s.video && "group-hover:scale-[1.03]",
                    )}
                  />
                  {s.video && (
                    <span className="absolute inset-0 grid place-items-center bg-deep/15 transition-colors group-hover:bg-deep/25">
                      <span className="grid h-14 w-14 place-items-center rounded-full bg-white/95 transition-transform duration-300 group-hover:scale-105">
                        <Play className="ml-0.5 h-5 w-5 fill-deep text-deep" />
                      </span>
                    </span>
                  )}
                </div>

                <div className="flex flex-1 flex-col p-6 lg:p-7">
                  <h3 className="font-display text-[17px] font-semibold leading-snug tracking-[-0.02em] text-deep">
                    {t(s.headlineKey)}
                  </h3>
                  <p className="mt-3 text-[14.5px] leading-relaxed text-ink-2 [display:-webkit-box] [overflow:hidden] [-webkit-box-orient:vertical] [-webkit-line-clamp:3]">
                    {t(s.quoteKey)}
                  </p>

                  <div className="mt-auto flex items-end justify-between gap-4 pt-6">
                    <span className="min-w-0">
                      <span className="block font-display text-[14.5px] font-semibold text-deep">
                        {s.name}
                      </span>
                      <span className="mt-0.5 block text-[13px] text-ink-3">{t(s.metaKey)}</span>
                    </span>
                    {s.video &&
                      (youtubeEmbed(s.video) ? (
                        <button type="button" onClick={() => setPlaying(s)} className={WATCH}>
                          {t("ts.watch")}
                          <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
                        </button>
                      ) : (
                        /* Nothing here can embed a Facebook video, and a play button
                           that opens an empty lightbox is worse than no button. The
                           card opens the post itself instead, which is why this one
                           carries the external-link mark rather than the arrow. */
                        <a
                          href={s.video}
                          target="_blank"
                          rel="noopener noreferrer"
                          className={WATCH}
                        >
                          {t("ts.watch")}
                          <ExternalLink className="h-3.5 w-3.5" />
                        </a>
                      ))}
                  </div>
                </div>
              </article>
            </li>
          ))}
        </ul>
      </Reveal>

      <Reveal index={2}>
        <div className="mt-10 flex items-center justify-center gap-6">
          <button
            type="button"
            onClick={() => scrollBy(-1)}
            aria-label={t("ts.prev")}
            disabled={page === 0}
            className="grid h-11 w-11 place-items-center rounded-full border border-line bg-white text-deep transition-all hover:border-teal hover:text-teal-ink disabled:opacity-35 disabled:hover:border-line disabled:hover:text-deep"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>

          <ul className="flex items-center gap-2" aria-hidden="true">
            {Array.from({ length: pages }, (_, i) => (
              <li
                key={i}
                className={cn(
                  "h-1.5 rounded-full transition-all duration-300",
                  i === page ? "w-6 bg-teal" : dark ? "w-1.5 bg-white/30" : "w-1.5 bg-deep/20",
                )}
              />
            ))}
          </ul>

          <button
            type="button"
            onClick={() => scrollBy(1)}
            aria-label={t("ts.next")}
            disabled={page >= pages - 1}
            className="grid h-11 w-11 place-items-center rounded-full border border-line bg-white text-deep transition-all hover:border-teal hover:text-teal-ink disabled:opacity-35 disabled:hover:border-line disabled:hover:text-deep"
          >
            <ChevronRight className="h-5 w-5" />
          </button>
        </div>
      </Reveal>

      <VideoDialog
        url={playing?.video ?? null}
        title={playing ? `${playing.name} — ${t(playing.headlineKey)}` : ""}
        closeLabel={t("ts.closeVideo")}
        portrait={playing?.videoPortrait ?? false}
        onClose={() => setPlaying(null)}
      />
    </Section>
  );
}
