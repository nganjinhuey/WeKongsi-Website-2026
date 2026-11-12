"use client";

import React, { useState } from "react";
import { ArrowRight, Check, Tag } from "lucide-react";
import { useTranslation } from "@/hooks/useTranslation";
import { external } from "@/lib/routes";
import { wecareFacts } from "@/data/site";
import { Section } from "@/components/ui/section";
import { Button } from "@/components/ui/button";
import RichText from "@/components/RichText";
import Reveal from "@/components/ui/reveal";
import Orbs from "@/components/ui/orbs";
import RuleLabel from "@/components/ui/rule-label";
import Segmented from "@/components/ui/segmented";
import { cn } from "@/lib/utils";

const money = (n: number) => `RM${n.toLocaleString("en-MY")}`;
const money2 = (n: number) =>
  `RM${n.toLocaleString("en-MY", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

/** The four things that are true of both options, keyed to wcx.price.f1–f4. */
const FACTS = ["f1", "f2", "f3", "f4"] as const;

/** Which figure the cards lead with — see the note on the toggle below. */
type View = "pay" | "month";

/**
 * The two cards' ink, measured against their own grounds.
 *
 * White, then a lit dark band — the same escalation the WeShare prices use, so a
 * reader who has seen one page recognises the other. The dark card's pairings are the
 * ones `band-dark` was tuned to carry: `turq-light` at 4.68:1 against its brightest
 * point, `white/80` above that, and `on-accent` on a turquoise fill at 9.81:1, where
 * white would be 2.0:1.
 */
const SKINS = {
  q: {
    card: "border border-line bg-white shadow-tide",
    name: "text-deep",
    price: "text-deep",
    sub: "text-ink-2",
    fact: "text-ink-2",
    tick: "bg-teal-deep text-white",
    rule: "light",
    btn: "outline",
  },
  y: {
    card: "on-dark grain bg-band-dark shadow-tide-lg",
    name: "text-white",
    price: "text-white",
    sub: "text-white/70",
    fact: "text-white/80",
    tick: "bg-turq-light text-on-accent",
    rule: "dark",
    btn: "accent",
  },
} as const;

/**
 * Two prices for one product.
 *
 * They are not tiers: both buy exactly the same cover and the same entitlement, and
 * the only difference is how often payment falls due. So both cards carry the same
 * four facts, at the same weight, under the same rule — a shorter list on one of them
 * would be a reader's cue that it buys less, and it does not.
 *
 * What the annual card gets instead is the ground. It is the lit dark one, lifted out
 * of the row at desktop, and it is marked with the saving rather than with a word like
 * "premium": RM20 is a fact derived from the two stored prices, and it is the whole of
 * the difference between them.
 *
 * The toggle is the same argument made faster. **Per payment** shows what is actually
 * charged and when; **per month** divides each by its own term and lines the two up on
 * one unit. Whichever is in the headline, the other is the line beneath it, because a
 * monthly figure set as *the* price is a monthly subscription and the annual option is
 * not one — RM13.33 never appears without "Billed RM160 every 12 months" under it.
 */
export default function WcxPricing() {
  const { t } = useTranslation();
  const [view, setView] = useState<View>("pay");

  const monthly = wecareFacts.yearly / 12;
  const saving = wecareFacts.quarterly * 4 - wecareFacts.yearly;

  const PLANS = [
    { k: "q", price: wecareFacts.quarterly, per: wecareFacts.quarterly / 3, best: false, vars: {} },
    {
      k: "y",
      price: wecareFacts.yearly,
      per: monthly,
      best: true,
      vars: { monthly: money2(monthly) },
    },
  ] as const;

  const VIEWS = [
    { value: "pay", label: t("wcx.price.view.pay") },
    { value: "month", label: t("wcx.price.view.month") },
  ] as const;

  return (
    <Section tone="accent" id="pricing" backdrop={<Orbs />}>
      <div className="mx-auto max-w-2xl text-center">
        <Reveal>
          <span className="inline-flex items-center gap-2 rounded-pill border border-white/70 bg-white/70 px-4 py-2 shadow-tide backdrop-blur-sm">
            <Tag aria-hidden="true" className="h-3.5 w-3.5 text-teal-deep" strokeWidth={2.2} />
            <span className="t-eyebrow text-teal-ink">{t("wcx.price.eyebrow")}</span>
          </span>
        </Reveal>
        <Reveal index={1}>
          <RichText as="h2" className="mt-6 t-h2 text-deep" accentClassName="text-gradient-brand">
            {t("wcx.price.title")}
          </RichText>
        </Reveal>
        <Reveal index={2}>
          <p className="mt-5 text-[16px] leading-relaxed text-ink-2 sm:text-[17px]">
            {t("wcx.price.lede")}
          </p>
        </Reveal>
        <Reveal index={3}>
          <div className="mt-9 flex justify-center">
            <Segmented
              options={VIEWS}
              value={view}
              onChange={setView}
              label={t("wcx.price.viewLabel")}
            />
          </div>
        </Reveal>
      </div>

      <div className="mx-auto mt-12 grid max-w-4xl gap-5 lg:mt-16 lg:grid-cols-2 lg:items-stretch">
        {PLANS.map(({ k, price, per, best, vars }, i) => {
          const s = SKINS[k];
          const asMonth = view === "month";
          return (
            <Reveal
              key={k}
              index={i}
              className={cn("h-full", best && "lg:-my-6 lg:h-[calc(100%+3rem)]")}
            >
              <article
                className={cn(
                  "card-lift glow-edge relative isolate flex h-full flex-col overflow-hidden rounded-[28px] p-8 sm:p-9",
                  s.card,
                )}
              >
                {best && (
                  <>
                    <Orbs tone="dark" className="opacity-70" />
                    <span
                      aria-hidden="true"
                      className="pointer-events-none absolute inset-x-0 top-0 h-px bg-edge-glow"
                    />
                  </>
                )}

                <div className="relative flex h-full flex-col">
                  <div className="flex min-h-[28px] items-center justify-between gap-3">
                    <h3
                      className={cn(
                        "font-display text-[19px] font-semibold tracking-[-0.025em]",
                        s.name,
                      )}
                    >
                      {t(`wcx.price.${k}.name`)}
                    </h3>
                    {best && (
                      <span className="shrink-0 rounded-pill bg-turq-light px-3 py-1 text-[10.5px] font-bold uppercase tracking-[0.1em] text-on-accent">
                        {t("wcx.price.y.badge", { save: money(saving) })}
                      </span>
                    )}
                  </div>

                  {/* `key` on both figures, so the toggle replays the rise rather than
                      swapping the text in place. */}
                  <p className="mt-5 flex flex-wrap items-baseline gap-x-2.5">
                    <span
                      key={view}
                      className={cn(
                        "price-swap font-display text-[clamp(40px,4.8vw,54px)] font-semibold leading-none tracking-[-0.045em]",
                        s.price,
                      )}
                    >
                      {asMonth ? money2(per) : money(price)}
                    </span>
                    <span className={cn("text-[14px]", s.sub)}>
                      {asMonth ? t("wcx.price.perUnit") : t(`wcx.price.${k}.per`)}
                    </span>
                  </p>

                  {/* A floor of two lines: the notes are two lines and the billed lines
                      are one, and without it the whole row jumps on every toggle. */}
                  <p
                    key={`${view}-sub`}
                    className={cn("price-swap mt-3 min-h-[44px] text-[13.5px] leading-relaxed", s.sub)}
                  >
                    {asMonth
                      ? t("wcx.price.billed", {
                          amount: money(price),
                          cadence: t(`wcx.price.${k}.per`),
                        })
                      : t(`wcx.price.${k}.note`, vars)}
                  </p>

                  <div className="mt-7">
                    <Button asChild size="lg" variant={s.btn} className="w-full">
                      <a href={external.join} target="_blank" rel="noopener noreferrer">
                        {t("wcx.price.cta")}
                        <ArrowRight className="h-5 w-5" />
                      </a>
                    </Button>
                  </div>

                  <RuleLabel tone={s.rule} className="mt-8">
                    {t("wcx.price.incTitle")}
                  </RuleLabel>

                  <ul className="mt-6 space-y-3.5">
                    {FACTS.map((f) => (
                      <li key={f} className={cn("flex items-start gap-3 text-[14.5px]", s.fact)}>
                        <span
                          aria-hidden="true"
                          className={cn(
                            "mt-[1px] grid h-[19px] w-[19px] shrink-0 place-items-center rounded-full",
                            s.tick,
                          )}
                        >
                          <Check className="h-[11px] w-[11px]" strokeWidth={3.2} />
                        </span>
                        {t(`wcx.price.${f}`)}
                      </li>
                    ))}
                  </ul>
                </div>
              </article>
            </Reveal>
          );
        })}
      </div>

      <Reveal index={2}>
        <p className="mx-auto mt-16 max-w-3xl text-center text-[12.5px] leading-relaxed text-ink-2">
          {t("wcx.price.note", { amount: money(wecareFacts.reactivation) })}
        </p>
      </Reveal>
    </Section>
  );
}
