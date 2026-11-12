"use client";

import React, { useState } from "react";
import { ArrowRight, Check, Tag } from "lucide-react";
import { useTranslation } from "@/hooks/useTranslation";
import { external } from "@/lib/routes";
import { programFacts } from "@/data/site";
import { panelCounts } from "@/data/hospitals";
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

/** Which figure the cards lead with. See the note on the toggle below. */
type View = "pay" | "month";

/**
 * The three cards' ink, in one place.
 *
 * They escalate deliberately — white, then a mint gradient, then a lit dark band —
 * because all three buy the same membership and the only thing a reader can usefully
 * be told at a glance is which one costs least. Colour is doing the work a feature
 * list would otherwise have to fake.
 *
 * The grounds are solid, not translucent. All three were washes over the accent band
 * to begin with, and on a mint band a pale mint card is not a card — the white one at
 * 85% and `grad-stage` both dissolved into the ground they were sitting on. White is
 * now white and the middle one is `grad-card-mint`, two steps deeper than the band.
 *
 * Every pairing was measured against its own ground: `ink-2` holds 4.93:1 at the
 * palest corner of the middle card, and `turq-light` and `white/70` on the dark band
 * are the ceiling `band-dark` was tuned to carry.
 */
const SKINS = {
  m: {
    card: "border border-line bg-white shadow-tide",
    name: "text-deep",
    price: "text-deep",
    priceSize: "text-[clamp(38px,4.2vw,48px)]",
    sub: "text-ink-2",
    rule: "light",
    was: "text-ink-2",
    year: "text-deep",
    pill: "bg-mint text-ink-2",
    btn: "outline",
  },
  q: {
    card: "border border-white/60 bg-grad-card-mint shadow-tide",
    name: "text-deep",
    price: "text-deep",
    priceSize: "text-[clamp(38px,4.2vw,48px)]",
    sub: "text-ink-2",
    rule: "glass",
    was: "text-ink-2",
    year: "text-deep",
    pill: "bg-white/80 text-teal-ink",
    btn: "outline",
  },
  y: {
    card: "on-dark grain bg-band-dark shadow-tide-lg",
    name: "text-white",
    price: "text-white",
    priceSize: "text-[clamp(40px,4.6vw,52px)]",
    sub: "text-white/70",
    rule: "dark",
    was: "text-white/65",
    year: "text-turq-light",
    pill: "glass-dark text-turq-light",
    btn: "accent",
  },
} as const;

/**
 * What membership costs.
 *
 * Three prices for one product. They are not tiers and must not look like tiers: all
 * three buy exactly the same membership, and the only difference is how often payment
 * falls due. That is why the four things a membership includes sit in one strip under
 * the row rather than being repeated down three columns — a feature list printed three
 * times is a reader's cue that the columns differ, and here they do not.
 *
 * So the argument for paying less often is made with arithmetic instead, in two
 * places. Below the fold of each card, under its own rule, is what a year costs
 * against the struck-through RM480 a year of monthly payments; the annual card's
 * saving is exactly three months of membership, and says so.
 *
 * Above it is the toggle, which is the same argument made instantly. **Per payment**
 * shows what is actually charged and when — RM40, RM100, RM360. **Per month** divides
 * each by its own term and lines the three up on a single unit: RM40.00, RM33.33,
 * RM30.00. Neither view is the true one and neither is allowed to stand alone, so
 * whichever is in the headline, the other is the line underneath it: a monthly figure
 * never appears without "Billed RM360 every 12 months" below it, because a monthly
 * figure set as *the* price is a monthly subscription, and two of these are not.
 *
 * The annual card is the lit dark one, lifted out of the row at desktop. Everything
 * about it — the ground, the turquoise ink, the solid button — exists so the cheapest
 * option is also the one the eye lands on.
 *
 * Every figure is derived here from the three stored prices, so none can drift from
 * them. All three were checked against the We Kongsi Program Guidelines (November
 * 2026): "Monthly Payment - RM40, Quarterly Payment - RM100, Annual Payment - RM360."
 *
 * The monthly sharing contribution is deliberately not described here. It is the other
 * payment entirely, it varies with the month, and it has its own section earlier on the
 * page — folding it into a pricing card would read as part of the price.
 */
export default function WsxPricing() {
  const { t } = useTranslation();
  const [view, setView] = useState<View>("pay");

  const { membershipMonthly: m, membershipQuarterly: q, membershipYearly: y } = programFacts;

  /** What a year costs at the monthly rate — the baseline the other two discount from. */
  const baseline = m * 12;

  /* `per` is the per-month equivalent, `year` the twelve-month total. */
  const PLANS = [
    { k: "m", price: m, per: m, year: baseline, best: false },
    { k: "q", price: q, per: q / 3, year: q * 4, best: false },
    { k: "y", price: y, per: y / 12, year: y, best: true },
  ] as const;

  const VIEWS = [
    { value: "pay", label: t("wsx.price.view.pay") },
    { value: "month", label: t("wsx.price.view.month") },
  ] as const;

  const INCLUDED = [
    { k: "inc1", vars: { amount: money(programFacts.annualLimit) } },
    { k: "inc2", vars: { count: panelCounts.total, states: panelCounts.states } },
    { k: "inc3", vars: {} },
    { k: "inc4", vars: { amount: money(programFacts.cobMonthly) } },
  ] as const;

  /**
   * The saving as a sentence. A saving that happens to be a whole number of monthly
   * payments is worth saying out loud — RM120 is three months — but only when it
   * divides exactly, so a future price change cannot turn it into "2.75 months free".
   */
  const savingLabel = (year: number) => {
    const saved = baseline - year;
    const months = saved / m;
    return Number.isInteger(months) && months >= 1
      ? t("wsx.price.saveFree", { amount: money(saved), months })
      : t("wsx.price.save", { amount: money(saved) });
  };

  return (
    <Section tone="accent" id="pricing" backdrop={<Orbs />}>
      <div className="mx-auto max-w-3xl text-center">
        <Reveal>
          {/* The badge, rather than the site's bare eyebrow: this section opens with a
              control instead of a rule, and an eyebrow with nothing under it until the
              heading left the top of the block looking unanchored. */}
          <span className="inline-flex items-center gap-2 rounded-pill border border-white/70 bg-white/70 px-4 py-2 shadow-tide backdrop-blur-sm">
            <Tag aria-hidden="true" className="h-3.5 w-3.5 text-teal-deep" strokeWidth={2.2} />
            <span className="t-eyebrow text-teal-ink">{t("wsx.price.eyebrow")}</span>
          </span>
        </Reveal>
        <Reveal index={1}>
          <RichText as="h2" className="mt-6 t-h2 text-deep" accentClassName="text-gradient-brand">
            {t("wsx.price.title")}
          </RichText>
        </Reveal>
        <Reveal index={2}>
          <p className="mt-5 text-[15.5px] leading-relaxed text-ink-2 sm:text-base">
            {t("wsx.price.lede")}
          </p>
        </Reveal>
        <Reveal index={3}>
          <div className="mt-9 flex justify-center">
            <Segmented
              options={VIEWS}
              value={view}
              onChange={setView}
              label={t("wsx.price.viewLabel")}
            />
          </div>
        </Reveal>
      </div>

      <div className="mt-12 grid gap-5 lg:mt-16 lg:grid-cols-3 lg:items-stretch">
        {PLANS.map(({ k, price, per, year, best }, i) => {
          const s = SKINS[k];
          const monthly = view === "month";
          return (
            /* The featured card breaks the row at desktop rather than sitting in it.
               The negative margin alone only shifts it up — the height has to grow by
               the same 48px for it to extend past the row at both ends, which is what
               makes it read as lifted out rather than misaligned. */
            <Reveal
              key={k}
              index={Math.min(i, 3)}
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
                    {/* A lit top edge rather than a border: on a dark ground a hairline
                        reads as a cut-out, light does not. */}
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
                      {t(`wsx.price.${k}.name`)}
                    </h3>
                    {best && (
                      <span className="shrink-0 rounded-pill bg-turq-light px-3 py-1 text-[10.5px] font-bold uppercase tracking-[0.1em] text-on-accent">
                        {t("wsx.price.best")}
                      </span>
                    )}
                  </div>

                  {/* `key` on both figures, so the toggle replays the rise rather than
                      swapping the text in place. */}
                  {/* A floor the tallest of the three sets, so the featured card's
                      larger figure does not push its button 5px out of line with the
                      other two. */}
                  <p className="mt-5 flex min-h-[52px] flex-wrap items-baseline gap-x-2.5">
                    <span
                      key={view}
                      className={cn(
                        "price-swap font-display font-semibold leading-none tracking-[-0.045em]",
                        s.priceSize,
                        s.price,
                      )}
                    >
                      {monthly ? money2(per) : money(price)}
                    </span>
                    <span className={cn("text-[14px]", s.sub)}>
                      {monthly ? t("wsx.price.perUnit") : t(`wsx.price.${k}.per`)}
                    </span>
                  </p>

                  <p key={`${view}-sub`} className={cn("price-swap mt-3 text-[13.5px]", s.sub)}>
                    {monthly
                      ? t("wsx.price.billed", {
                          amount: money(price),
                          cadence: t(`wsx.price.${k}.per`),
                        })
                      : t("wsx.price.perMonth", { amount: money2(per) })}
                  </p>

                  <div className="mt-8">
                    <Button asChild size="lg" variant={s.btn} className="w-full">
                      <a href={external.join} target="_blank" rel="noopener noreferrer">
                        {t("wsx.price.cta")}
                        <ArrowRight className="h-5 w-5" />
                      </a>
                    </Button>
                  </div>

                  {/* The year's arithmetic, under its own rule — the slower argument,
                      below the one the toggle makes instantly. */}
                  <RuleLabel tone={s.rule} className="mt-8">
                    {t("wsx.price.yearLabel")}
                  </RuleLabel>

                  <p className="mt-6 flex flex-wrap items-baseline gap-x-3">
                    {year < baseline && (
                      <s className={cn("text-[15px] font-medium", s.was)}>{money(baseline)}</s>
                    )}
                    <span
                      className={cn(
                        "font-display text-[23px] font-semibold tracking-[-0.03em]",
                        s.year,
                      )}
                    >
                      {money(year)}
                    </span>
                  </p>

                  <p
                    className={cn(
                      "mt-4 inline-flex self-start rounded-pill px-3.5 py-1.5 text-[13px] font-semibold",
                      s.pill,
                    )}
                  >
                    {year < baseline ? savingLabel(year) : t("wsx.price.m.pill")}
                  </p>
                </div>
              </article>
            </Reveal>
          );
        })}
      </div>

      {/* One strip, not three columns — see the note at the top of the file. */}
      <Reveal index={2}>
        <div className="mt-10 rounded-[28px] border border-line bg-white p-8 shadow-tide sm:p-9 lg:mt-14">
          <RuleLabel className="mx-auto max-w-xl">{t("wsx.price.incTitle")}</RuleLabel>
          <ul className="mt-8 grid gap-x-10 gap-y-4 sm:grid-cols-2">
            {INCLUDED.map(({ k, vars }) => (
              <li key={k} className="flex items-start gap-3 text-[14.5px] leading-snug text-ink-2">
                <span
                  aria-hidden="true"
                  className="mt-[1px] grid h-[19px] w-[19px] shrink-0 place-items-center rounded-full bg-teal-deep text-white"
                >
                  <Check className="h-[11px] w-[11px]" strokeWidth={3.2} />
                </span>
                {t(`wsx.price.${k}`, vars)}
              </li>
            ))}
          </ul>
        </div>
      </Reveal>

      <Reveal index={3}>
        <p className="mx-auto mt-12 max-w-3xl text-center text-[12.5px] leading-relaxed text-ink-2">
          {t("wsx.price.note")}
        </p>
      </Reveal>
    </Section>
  );
}
