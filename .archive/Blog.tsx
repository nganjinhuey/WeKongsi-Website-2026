"use client";

import React, { useState } from "react";
import Link from "next/link";
import { FileText, MessageCircle } from "lucide-react";
import { useTranslation } from "@/hooks/useTranslation";
import { blogPosts, blogTopics, type BlogTopic } from "@/data/posts";
import { external } from "@/lib/routes";
import { Section, SectionHeading } from "@/components/ui/section";
import { Button } from "@/components/ui/button";
import PageHero from "@/components/sections/PageHero";
import RichText from "@/components/RichText";
import Reveal from "@/components/ui/reveal";
import { Media } from "@/components/ui/media";
import { cn } from "@/lib/utils";

const TOPIC_KEY: Record<BlogTopic, string> = {
  announcements: "bl.topic.announcements",
  education: "bl.topic.education",
  stories: "bl.topic.stories",
  shariah: "bl.topic.shariah",
  healthcare: "bl.topic.healthcare",
};

export default function Blog() {
  const { t, href } = useTranslation();
  const [topic, setTopic] = useState<BlogTopic | "all">("all");

  const posts = topic === "all" ? blogPosts : blogPosts.filter((post) => post.topic === topic);

  return (
    <>
      <PageHero
        eyebrow={t("bl.hero.eyebrow")}
        title={t("bl.hero.title")}
        lede={t("bl.hero.lede")}
        image="/images/event-kongsisihat.jpg"
      />

      <Section tone="light" id="posts">
        <SectionHeading
          eyebrow={t("bl.topics.eyebrow")}
          title={t("bl.topics.title")}
          align="left"
        />

        <Reveal index={2}>
          <div className="mt-8 flex flex-wrap gap-2.5" role="tablist" aria-label={t("bl.topic.all")}>
            {(["all", ...blogTopics] as const).map((value) => {
              const active = topic === value;
              return (
                <button
                  key={value}
                  type="button"
                  role="tab"
                  aria-selected={active}
                  onClick={() => setTopic(value)}
                  className={cn(
                    "rounded-full border px-4 py-2 text-sm font-medium transition-colors",
                    active
                      ? "border-teal bg-teal text-white"
                      : "border-line bg-white text-ink-2 hover:border-teal hover:text-teal",
                  )}
                >
                  {t(value === "all" ? "bl.topic.all" : TOPIC_KEY[value])}
                </button>
              );
            })}
          </div>
        </Reveal>

        {posts.length > 0 ? (
          <div className="mt-10 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {posts.map((post, i) => {
              const card = (
                <article className="card-lift flex h-full flex-col overflow-hidden rounded-card border border-line bg-white">
                  {post.image && (
                    <Media
                      src={post.image}
                      ratio="16/9"
                      rounded="brand"
                      sizes="(max-width: 768px) 100vw, 33vw"
                      className="rounded-b-none"
                    />
                  )}
                  <div className="flex flex-1 flex-col p-7">
                  <div className="flex items-center gap-3">
                    <span className="rounded-full bg-mint px-3 py-1 text-[11px] font-bold uppercase tracking-[0.1em] text-teal-deep">
                      {t(TOPIC_KEY[post.topic])}
                    </span>
                    {!post.href && (
                      <span className="text-[11px] font-semibold uppercase tracking-wider text-ink-3">
                        {t("bl.upcoming")}
                      </span>
                    )}
                  </div>
                  <h3 className="mt-5 font-display text-lg font-bold leading-snug text-deep">
                    {t(post.titleKey)}
                  </h3>
                  <p className="mt-3 flex-1 text-sm leading-relaxed text-ink-2">
                    {t(post.summaryKey)}
                  </p>
                  </div>
                </article>
              );

              return (
                <Reveal key={post.id} index={i % 3}>
                  {post.href ? (
                    <Link href={post.href} className="block h-full">
                      {card}
                    </Link>
                  ) : (
                    card
                  )}
                </Reveal>
              );
            })}
          </div>
        ) : (
          <Reveal>
            <div className="mt-10 rounded-card border border-line bg-mint-soft p-12 text-center">
              <span className="mx-auto grid h-12 w-12 place-items-center rounded-card bg-white text-teal">
                <FileText className="h-5 w-5" />
              </span>
              <h3 className="mt-5 font-display text-lg font-bold text-deep">
                {t("bl.empty.title")}
              </h3>
              <p className="mx-auto mt-2.5 max-w-md text-sm leading-relaxed text-ink-2">
                {t("bl.empty.desc")}
              </p>
            </div>
          </Reveal>
        )}
      </Section>

      <Section tone="deep" id="subscribe">
        <Reveal>
          <div className="mx-auto max-w-2xl text-center">
            <span className="mx-auto grid h-12 w-12 place-items-center rounded-card bg-teal text-white">
              <MessageCircle className="h-5 w-5" />
            </span>
            <p className="mt-6 text-[11px] font-bold uppercase tracking-[0.14em] text-turq">
              {t("bl.sub.eyebrow")}
            </p>
            <RichText
              as="h2"
              className="mt-3 font-display text-2xl font-extrabold tracking-tight text-white sm:text-3xl"
              accentClassName="text-gradient-light"
            >
              {t("bl.sub.title")}
            </RichText>
            <p className="mt-4 text-base leading-relaxed text-white/70">{t("bl.sub.desc")}</p>
            <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
              <Button asChild size="lg">
                <a href={external.whatsapp} target="_blank" rel="noopener noreferrer">
                  {t("bl.sub.whatsapp")}
                </a>
              </Button>
              <Button asChild variant="ghostLight" size="lg">
                <Link href={href("/contact")}>{t("bl.sub.contact")}</Link>
              </Button>
            </div>
          </div>
        </Reveal>
      </Section>
    </>
  );
}
