"use client";

import React, { useMemo, useState } from "react";
import Image from "next/image";
import { Phone, MapPin, Search, X, PhoneCall } from "lucide-react";
import { useTranslation } from "@/hooks/useTranslation";
import {
  panelHospitals,
  panelStates,
  panelCounts,
  carelines,
} from "@/data/hospitals";
import { external } from "@/lib/routes";
import { Section, SectionHeading, Eyebrow } from "@/components/ui/section";
import { Button } from "@/components/ui/button";
import PageHero from "@/components/sections/PageHero";
import FinalCta from "@/components/sections/FinalCta";
import Reveal from "@/components/ui/reveal";
import RichText from "@/components/RichText";
import { cn } from "@/lib/utils";

type Sector = "all" | "private" | "government";

/**
 * A quick-find for the e-MAS panel.
 *
 * The whole list is in the bundle and filtered in the browser: 299 rows is small
 * enough that a round trip per keystroke would be slower than the filter itself, and
 * it keeps the page working as a static export with no API behind it.
 */
export default function HospitalInfo() {
  const { t } = useTranslation();
  const [sector, setSector] = useState<Sector>("all");
  const [state, setState] = useState("");
  const [query, setQuery] = useState("");

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    return panelHospitals.filter(
      (h) =>
        (sector === "all" || h.sector === sector) &&
        (!state || h.state === state) &&
        (!q ||
          h.name.toLowerCase().includes(q) ||
          h.city.toLowerCase().includes(q)),
    );
  }, [sector, state, query]);

  const filtered = sector !== "all" || state !== "" || query !== "";

  const stats = [
    { value: String(panelCounts.private), labelKey: "hi.stat.private" },
    { value: String(panelCounts.government), labelKey: "hi.stat.government" },
    { value: String(panelCounts.states), labelKey: "hi.stat.states" },
  ];

  const sectors: { id: Sector; labelKey: string }[] = [
    { id: "all", labelKey: "hi.filter.all" },
    { id: "private", labelKey: "hi.filter.private" },
    { id: "government", labelKey: "hi.filter.government" },
  ];

  return (
    <>
      <PageHero
        eyebrow={t("hi.hero.eyebrow")}
        title={t("hi.hero.title")}
        lede={t("hi.hero.lede")}
        below={
          /* The size of the panel is the hero's claim, so it belongs in the hero —
             as its own white band it read as the first thing on the page rather than
             the last thing in the banner.

             Glass rather than a solid panel, as on the home page: the band's glow
             carries through the strip instead of being cut in half by it. The lattice
             is drawn by the cells' own left borders, which at `sm` and up is always
             the right rule because the three cells are always one row. */
          <dl className="glass mx-auto grid max-w-3xl rounded-xl2 px-6 py-2 sm:grid-cols-3">
            {stats.map((s, i) => (
              <div
                key={s.labelKey}
                className={cn(
                  "border-line px-4 py-6 text-center",
                  i > 0 && "border-t sm:border-l sm:border-t-0",
                )}
              >
                <dt className="font-display text-[30px] font-semibold leading-none tracking-[-0.03em] text-teal-ink">
                  {s.value}
                </dt>
                <dd className="mt-2.5 text-[13.5px] text-ink-2">{t(s.labelKey)}</dd>
              </div>
            ))}
          </dl>
        }
      />

      {/* Whose panel this is, before the list of it.
          A directory of 299 hospitals raises the question of where the list comes from,
          and the answer is the same for every row — so it is said once, above the list,
          rather than repeated as a badge on each card.

          The mark is a colour-on-white JPEG, so `mix-blend-multiply` drops its white box
          into the card it sits on; that is why the card is white and not the band's mint,
          and why the band carries the colour instead. */}
      <Section tone="mint" id="administrator" className="py-14 lg:py-16 xl:py-20">
        <Reveal>
          {/* Held well under the container. At full width the copy ran out two hundred
              pixels short of the card's own edge, which read as a column that had failed
              to fill rather than as a line that had finished. */}
          <div className="mx-auto grid max-w-5xl items-center gap-9 rounded-[28px] border border-line bg-white p-8 shadow-tide sm:p-10 lg:grid-cols-[minmax(0,280px)_1fr] lg:gap-14 lg:p-12">
            <Image
              src="/images/partner-emas.jpg"
              alt={t("hi.emas.logoAlt")}
              width={420}
              height={171}
              sizes="300px"
              priority
              className="mx-auto h-auto w-full max-w-[220px] object-contain mix-blend-multiply sm:max-w-[260px] lg:max-w-none"
            />

            <div className="text-center lg:text-left">
              <Eyebrow className="justify-center lg:justify-start">
                {t("hi.emas.eyebrow")}
              </Eyebrow>
              <RichText
                as="h2"
                className="mt-4 font-display text-[clamp(23px,2.5vw,31px)] font-semibold leading-tight tracking-[-0.03em] text-deep"
                /* Unbreakable: at phone width the line fell inside the brand name and
                   left "MAS." stranded on its own, which reads as a typo rather than as
                   a wrap. Held whole, the line simply breaks before it. */
                accentClassName="text-gradient-brand whitespace-nowrap"
              >
                {t("hi.emas.title")}
              </RichText>
              <p className="mx-auto mt-4 max-w-xl text-[15px] leading-relaxed text-ink-2 lg:mx-0">
                {t("hi.emas.body")}
              </p>
            </div>
          </div>
        </Reveal>
      </Section>

      <Section tone="light" id="directory">
        <div>
          <SectionHeading
            title={t("hi.find.title")}
          />

          {/* Filters */}
          <Reveal index={1}>
            <div className="mt-10 flex flex-col gap-4 rounded-card border border-line bg-mint-soft p-5 lg:flex-row lg:items-center">
              <div
                role="group"
                aria-label={t("hi.filter.all")}
                className="flex rounded-pill border border-line bg-white p-1"
              >
                {sectors.map((s) => (
                  <button
                    key={s.id}
                    type="button"
                    onClick={() => setSector(s.id)}
                    aria-pressed={sector === s.id}
                    className={cn(
                      "rounded-pill px-5 py-2 text-[14px] font-semibold transition-colors",
                      sector === s.id
                        ? "bg-teal-ink text-white"
                        : "text-ink-2 hover:text-teal-ink",
                    )}
                  >
                    {t(s.labelKey)}
                  </button>
                ))}
              </div>

              <label className="flex-1">
                <span className="sr-only">{t("hi.filter.state")}</span>
                <select
                  value={state}
                  onChange={(e) => setState(e.target.value)}
                  className="h-12 w-full rounded-pill border border-line bg-white px-5 text-[14.5px] text-deep focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-deep"
                >
                  <option value="">{t("hi.filter.allStates")}</option>
                  {panelStates.map((s) => (
                    <option key={s} value={s}>
                      {s}
                    </option>
                  ))}
                </select>
              </label>

              <label className="relative flex-1">
                <span className="sr-only">{t("hi.filter.search")}</span>
                <Search
                  aria-hidden="true"
                  className="pointer-events-none absolute left-5 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-3"
                />
                <input
                  type="search"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder={t("hi.filter.placeholder")}
                  className="h-12 w-full rounded-pill border border-line bg-white pl-12 pr-5 text-[14.5px] text-deep placeholder:text-ink-3 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-deep"
                />
              </label>
            </div>
          </Reveal>

          <div className="mt-6 flex items-center justify-between gap-4">
            <p
              aria-live="polite"
              className="text-[14px] font-semibold text-ink-2"
            >
              {t("hi.filter.results", { count: results.length })}
            </p>
            {filtered && (
              <button
                type="button"
                onClick={() => {
                  setSector("all");
                  setState("");
                  setQuery("");
                }}
                className="inline-flex items-center gap-1.5 text-[13.5px] font-semibold text-teal-ink hover:underline"
              >
                <X className="h-3.5 w-3.5" />
                {t("hi.filter.clear")}
              </button>
            )}
          </div>

          {results.length === 0 ? (
            <p className="mt-10 rounded-card border border-line bg-white p-10 text-center text-ink-2">
              {t("hi.filter.none")}
            </p>
          ) : (
            <ul className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
              {results.map((h) => (
                <li
                  key={`${h.sector}-${h.name}-${h.city}`}
                  className="card-lift flex h-full flex-col rounded-card border border-line bg-white p-6"
                >
                  <div className="flex items-start justify-between gap-3">
                    <h3 className="font-display text-[15.5px] font-semibold leading-snug tracking-[-0.01em] text-deep">
                      {h.name}
                    </h3>
                    <span
                      className={cn(
                        "shrink-0 rounded-pill px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.1em]",
                        h.sector === "private"
                          ? "bg-mint text-teal-ink"
                          : "bg-deep/[0.07] text-ink-2",
                      )}
                    >
                      {t(
                        h.sector === "private"
                          ? "hi.filter.private"
                          : "hi.filter.government",
                      )}
                    </span>
                  </div>

                  <p className="mt-3 flex items-start gap-2 text-[13.5px] text-ink-2">
                    <MapPin
                      aria-hidden="true"
                      className="mt-0.5 h-3.5 w-3.5 shrink-0 text-teal-deep"
                    />
                    {h.city}, {h.state}
                  </p>

                  {h.phone && (
                    <p className="mt-1.5 flex items-start gap-2 text-[13.5px] text-ink-2">
                      <Phone
                        aria-hidden="true"
                        className="mt-0.5 h-3.5 w-3.5 shrink-0 text-teal-deep"
                      />
                      {h.phone}
                    </p>
                  )}

                  {h.notes && (
                    <p className="mt-3 rounded-[10px] bg-mint-soft px-3 py-2 text-[12.5px] leading-snug text-ink-2">
                      {h.notes}
                    </p>
                  )}
                </li>
              ))}
            </ul>
          )}

          <Reveal index={2}>
            <RichText
              as="p"
              className="mt-8 rounded-card border border-line bg-white p-6 text-[14px] leading-relaxed text-ink-2"
            >
              {`**${t("hi.dir.noteLabel")}** ${t("hi.dir.note")}`}
            </RichText>
          </Reveal>
        </div>
      </Section>

      {/* Using the panel */}
      <Section tone="soft" id="how-to-use">
        <SectionHeading
          eyebrow={t("hi.steps.eyebrow")}
          title={t("hi.steps.title")}
          lede={t("hi.steps.desc")}
        />
        <ol className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {[1, 2, 3, 4].map((n, i) => (
            <Reveal key={n} index={i} as="li">
              <div className="card-lift card-bar relative h-full overflow-hidden rounded-card border border-line bg-white p-7">
                <span className="grid h-9 w-9 place-items-center rounded-full bg-mint font-display text-sm font-bold text-teal-ink">
                  {n}
                </span>
                <h3 className="mt-5 font-display text-[16.5px] font-semibold tracking-[-0.02em] text-deep">
                  {t(`hi.s${n}.t`)}
                </h3>
                <p className="mt-3 text-[14px] leading-relaxed text-ink-2">
                  {t(`hi.s${n}.d`)}
                </p>
              </div>
            </Reveal>
          ))}
        </ol>

        <Reveal index={4}>
          <div className="mt-10 flex flex-col items-center gap-4 rounded-card border border-line bg-white p-8 text-center sm:flex-row sm:justify-between sm:text-left">
            <div>
              <h3 className="font-display text-[17px] font-semibold tracking-[-0.02em] text-deep">
                {t("hi.verify.title").replace("[[", "").replace("]]", "")}
              </h3>
              <p className="mt-2 max-w-xl text-[14px] leading-relaxed text-ink-2">
                {t("hi.verify.desc")}
              </p>
            </div>
            <div className="flex shrink-0 flex-col gap-3 sm:flex-row">
              <Button asChild variant="outline">
                <a href={carelines.emas.href}>
                  <PhoneCall className="h-5 w-5" />
                  {t("hi.verify.careline")}
                </a>
              </Button>
              <Button asChild>
                <a
                  href={external.whatsapp}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {t("hi.verify.whatsapp")}
                </a>
              </Button>
            </div>
          </div>
        </Reveal>
      </Section>

      <FinalCta />
    </>
  );
}
