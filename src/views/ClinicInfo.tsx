"use client";

import React, { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import { Clock, Loader2, MapPin, Phone, PhoneCall, Search, X } from "lucide-react";
import { useTranslation } from "@/hooks/useTranslation";
import {
  clinicCounts,
  clinicStates,
  loadClinics,
  splitHours,
  type Clinic,
} from "@/data/clinics";
import { carelines } from "@/data/hospitals";
import { external } from "@/lib/routes";
import { Section, SectionHeading, Eyebrow } from "@/components/ui/section";
import { Button } from "@/components/ui/button";
import PageHero from "@/components/sections/PageHero";
import FinalCta from "@/components/sections/FinalCta";
import Reveal from "@/components/ui/reveal";
import RichText from "@/components/RichText";
import { cn } from "@/lib/utils";

/**
 * How many cards are rendered at once, and how many more a press adds.
 *
 * The filter runs over all 4,709 rows — that is microseconds — but rendering them is
 * 4,709 DOM subtrees, which is seconds. "All states, no search" is the page's opening
 * state and also its worst case, so the list is always paged.
 */
const PAGE = 60;

/**
 * A Malaysian landline or mobile as a dialable href.
 *
 * The panel list writes numbers for people — `03-22736349`, `012-6019436` — and a
 * phone directory that cannot be tapped on a phone is half a directory. Anything that
 * does not look like a local number is returned as-is rather than guessed at: an
 * extension or a second number mangled into a `tel:` is worse than plain text.
 */
function telHref(phone: string): string | null {
  const digits = phone.replace(/[^\d]/g, "");
  if (digits.length < 9 || digits.length > 11) return null;
  if (!digits.startsWith("0")) return null;
  return `tel:+60${digits.slice(1)}`;
}

/** One clinic, as a card. */
function ClinicCard({ clinic, hoursLabel }: { clinic: Clinic; hoursLabel: string }) {
  const tel = telHref(clinic.phone);
  const hours = splitHours(clinic.hours);

  return (
    <li className="card-lift flex h-full flex-col rounded-card border border-line bg-white p-6">
      <h3 className="font-display text-[15.5px] font-semibold leading-snug tracking-[-0.01em] text-deep">
        {clinic.name}
      </h3>

      <p className="mt-3 flex items-start gap-2 text-[13.5px] leading-snug text-ink-2">
        <MapPin aria-hidden="true" className="mt-0.5 h-3.5 w-3.5 shrink-0 text-teal-deep" />
        <span>
          {clinic.address}
          {/* Collapsed where the town is the state — 39 rows are filed in a town of
              the same name, and "Kuala Lumpur, Kuala Lumpur" reads as a bug. */}
          <span className="mt-1 block font-medium text-ink-3">
            {clinic.town === clinic.state ? clinic.state : `${clinic.town}, ${clinic.state}`}
          </span>
        </span>
      </p>

      <p className="mt-2.5 flex items-start gap-2 text-[13.5px] text-ink-2">
        <Phone aria-hidden="true" className="mt-0.5 h-3.5 w-3.5 shrink-0 text-teal-deep" />
        {tel ? (
          <a href={tel} className="font-medium text-teal-ink hover:underline">
            {clinic.phone}
          </a>
        ) : (
          clinic.phone
        )}
      </p>

      {/* Hours last and set apart: it is the longest field and the one a reader checks
          only after they have decided the clinic is near enough to be worth checking. */}
      <div className="mt-4 rounded-[10px] bg-mint-soft px-3.5 py-3">
        <p className="flex items-center gap-1.5 text-[10.5px] font-bold uppercase tracking-[0.1em] text-teal-ink">
          <Clock aria-hidden="true" className="h-3 w-3" />
          {hoursLabel}
        </p>
        <dl className="mt-2 space-y-1">
          {hours.map(({ days, time }, i) => (
            <div key={i} className="flex flex-wrap items-baseline gap-x-2 text-[12.5px] leading-snug">
              {days && <dt className="font-semibold text-deep">{days}</dt>}
              <dd className="text-ink-2">{time}</dd>
            </div>
          ))}
        </dl>
      </div>
    </li>
  );
}

/**
 * The MiCare GP panel, as a searchable directory.
 *
 * The hospital page keeps its 299 rows in the bundle; this one cannot — see
 * `src/data/clinics.ts` for why 4,709 clinics are fetched instead. That is the only
 * structural difference between the two pages, and it is invisible except for the
 * moment the list is loading.
 */
export default function ClinicInfo() {
  const { t } = useTranslation();

  const [clinics, setClinics] = useState<Clinic[] | null>(null);
  const [failed, setFailed] = useState(false);
  const [state, setState] = useState("");
  const [query, setQuery] = useState("");
  const [shown, setShown] = useState(PAGE);

  useEffect(() => {
    const ac = new AbortController();
    loadClinics(ac.signal)
      .then(setClinics)
      .catch((e: unknown) => {
        if ((e as Error)?.name !== "AbortError") setFailed(true);
      });
    return () => ac.abort();
  }, []);

  const results = useMemo(() => {
    if (!clinics) return [];
    const q = query.trim().toLowerCase();
    return clinics.filter(
      (c) =>
        (!state || c.state === state) &&
        (!q ||
          c.name.toLowerCase().includes(q) ||
          c.town.toLowerCase().includes(q) ||
          c.address.toLowerCase().includes(q)),
    );
  }, [clinics, state, query]);

  /* Every filter change goes back to the first page, so a narrowed search never opens
     halfway down a list whose top the reader has not seen. Done in the handlers rather
     than by watching the values: the page is a consequence of changing a filter, not of
     the filter having a particular value. */
  const pickState = (v: string) => {
    setState(v);
    setShown(PAGE);
  };
  const pickQuery = (v: string) => {
    setQuery(v);
    setShown(PAGE);
  };
  const clearFilters = () => {
    setState("");
    setQuery("");
    setShown(PAGE);
  };

  const filtered = state !== "" || query !== "";
  const visible = results.slice(0, shown);

  const stats = [
    { value: clinicCounts.total.toLocaleString("en-MY"), labelKey: "ci.stat.clinics" },
    { value: String(clinicCounts.towns), labelKey: "ci.stat.towns" },
    { value: String(clinicCounts.states), labelKey: "ci.stat.states" },
  ];

  return (
    <>
      <PageHero
        eyebrow={t("ci.hero.eyebrow")}
        title={t("ci.hero.title")}
        lede={t("ci.hero.lede")}
        below={
          /* The same glass strip the hospital page uses, and for the same reason: the
             size of the panel is the hero's claim, so it belongs in the banner. */
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

      {/* Whose panel this is, before the list of it — the counterpart to the e-MAS band
          on the hospital page. The mark is a PNG with its own transparency, so unlike
          the e-MAS JPEG it needs no blend mode to lose a white box. */}
      <Section tone="mint" id="administrator" className="py-14 lg:py-16 xl:py-20">
        <Reveal>
          <div className="mx-auto grid max-w-5xl items-center gap-9 rounded-[28px] border border-line bg-white p-8 shadow-tide sm:p-10 lg:grid-cols-[minmax(0,260px)_1fr] lg:gap-14 lg:p-12">
            <Image
              src="/images/partner-micare.png"
              alt={t("ci.micare.logoAlt")}
              width={420}
              height={127}
              sizes="260px"
              priority
              className="mx-auto h-auto w-full max-w-[200px] object-contain sm:max-w-[240px] lg:max-w-none"
            />

            <div className="text-center lg:text-left">
              <Eyebrow className="justify-center lg:justify-start">
                {t("ci.micare.eyebrow")}
              </Eyebrow>
              <RichText
                as="h2"
                className="mt-4 font-display text-[clamp(23px,2.5vw,31px)] font-semibold leading-tight tracking-[-0.03em] text-deep"
                accentClassName="text-gradient-brand whitespace-nowrap"
              >
                {t("ci.micare.title")}
              </RichText>
              <p className="mx-auto mt-4 max-w-xl text-[15px] leading-relaxed text-ink-2 lg:mx-0">
                {t("ci.micare.body")}
              </p>
            </div>
          </div>
        </Reveal>
      </Section>

      <Section tone="light" id="directory">
        <SectionHeading title={t("ci.find.title")} />

        <Reveal index={1}>
          <div className="mt-10 flex flex-col gap-4 rounded-card border border-line bg-mint-soft p-5 lg:flex-row lg:items-center">
            <label className="lg:w-[260px]">
              <span className="sr-only">{t("ci.filter.state")}</span>
              <select
                value={state}
                onChange={(e) => pickState(e.target.value)}
                className="h-12 w-full rounded-pill border border-line bg-white px-5 text-[14.5px] text-deep focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-deep"
              >
                <option value="">{t("ci.filter.allStates")}</option>
                {clinicStates.map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
            </label>

            <label className="relative flex-1">
              <span className="sr-only">{t("ci.filter.search")}</span>
              <Search
                aria-hidden="true"
                className="pointer-events-none absolute left-5 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-3"
              />
              <input
                type="search"
                value={query}
                onChange={(e) => pickQuery(e.target.value)}
                placeholder={t("ci.filter.placeholder")}
                className="h-12 w-full rounded-pill border border-line bg-white pl-12 pr-5 text-[14.5px] text-deep placeholder:text-ink-3 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-deep"
              />
            </label>
          </div>
        </Reveal>

        {failed ? (
          <p className="mt-10 rounded-card border border-line bg-white p-10 text-center text-[14.5px] leading-relaxed text-ink-2">
            {t("ci.state.error")}
          </p>
        ) : !clinics ? (
          <p className="mt-10 flex items-center justify-center gap-3 rounded-card border border-line bg-white p-10 text-center text-[14.5px] text-ink-2">
            <Loader2 aria-hidden="true" className="h-4 w-4 animate-spin text-teal-deep" />
            {t("ci.state.loading")}
          </p>
        ) : (
          <>
            <div className="mt-6 flex items-center justify-between gap-4">
              <p aria-live="polite" className="text-[14px] font-semibold text-ink-2">
                {results.length > visible.length
                  ? t("ci.filter.showing", {
                      shown: visible.length.toLocaleString("en-MY"),
                      count: results.length.toLocaleString("en-MY"),
                    })
                  : t("ci.filter.results", { count: results.length.toLocaleString("en-MY") })}
              </p>
              {filtered && (
                <button
                  type="button"
                  onClick={clearFilters}
                  className="inline-flex items-center gap-1.5 text-[13.5px] font-semibold text-teal-ink hover:underline"
                >
                  <X className="h-3.5 w-3.5" />
                  {t("ci.filter.clear")}
                </button>
              )}
            </div>

            {results.length === 0 ? (
              <p className="mt-10 rounded-card border border-line bg-white p-10 text-center text-ink-2">
                {t("ci.filter.none")}
              </p>
            ) : (
              <>
                <ul className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                  {visible.map((c) => (
                    <ClinicCard
                      key={`${c.name}|${c.address}`}
                      clinic={c}
                      hoursLabel={t("ci.card.hours")}
                    />
                  ))}
                </ul>

                {results.length > visible.length && (
                  <div className="mt-8 flex justify-center">
                    <Button variant="outline" onClick={() => setShown((n) => n + PAGE)}>
                      {t("ci.filter.more")}
                    </Button>
                  </div>
                )}
              </>
            )}
          </>
        )}

        <Reveal index={2}>
          <RichText
            as="p"
            className="mt-10 rounded-card border border-line bg-white p-6 text-[14px] leading-relaxed text-ink-2"
          >
            {`**${t("ci.noteLabel")}** ${t("ci.note")}`}
          </RichText>
        </Reveal>
      </Section>

      <Section tone="soft" id="check">
        <Reveal>
          <div className="mx-auto flex max-w-4xl flex-col items-center gap-5 rounded-card border border-line bg-white p-8 text-center sm:flex-row sm:justify-between sm:gap-8 sm:text-left">
            <div>
              <h2 className="font-display text-[17px] font-semibold tracking-[-0.02em] text-deep">
                {t("ci.verify.title")}
              </h2>
              <p className="mt-2 max-w-xl text-[14px] leading-relaxed text-ink-2">
                {t("ci.verify.desc")}
              </p>
            </div>
            <div className="flex shrink-0 flex-col gap-3 sm:flex-row">
              <Button asChild variant="outline">
                <a href={carelines.micare.href}>
                  <PhoneCall className="h-5 w-5" />
                  {t("ci.verify.careline")}
                </a>
              </Button>
              <Button asChild>
                <a href={external.whatsapp} target="_blank" rel="noopener noreferrer">
                  {t("ci.verify.whatsapp")}
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
