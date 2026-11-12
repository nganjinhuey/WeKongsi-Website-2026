"use client";

import React, { useState } from "react";
import Image from "next/image";
import { useTranslation } from "@/hooks/useTranslation";
import { leaders } from "@/data/site";
import { Section, SectionHeading } from "@/components/ui/section";
import Reveal from "@/components/ui/reveal";
import { cn } from "@/lib/utils";

const initials = (name: string) =>
  name
    .split(" ")
    .slice(0, 2)
    .map((w) => w[0])
    .join("");

/**
 * The leadership, as an expanding row of portraits.
 *
 * One panel is open at a time and carries the name and role; the rest stand as tall
 * slivers beside it. It is a better use of a wide band than seven equal headshots —
 * the row reads as one group photograph rather than a directory, and the open panel
 * gives whoever you are reading about the space a portrait actually wants.
 *
 * Three things keep it honest rather than merely clever:
 *
 *  - Every name and role is in the DOM at all times, faded rather than removed, so a
 *    screen reader walks all seven and never meets a nameless image.
 *  - The panels are buttons, and open on focus as well as hover, so the row is
 *    keyboard-navigable and works on a touch screen where there is no hover at all.
 *  - It only becomes an accordion from two columns up. On a phone seven slivers would
 *    be 50px wide, so it falls back to the plain grid with captions underneath.
 *
 * `flex-grow` is the only animated property, and it is the one the reference moves.
 */
export default function AbTeam() {
  const { t } = useTranslation();
  const [active, setActive] = useState(0);

  return (
    <Section tone="deep" id="team">
      <SectionHeading
        tone="dark"
        eyebrow={t("ab.team.eyebrow")}
        title={t("ab.team.title")}
        lede={t("ab.team.desc")}
      />

      {/* ---------- Two columns up: the accordion ---------- */}
      <Reveal index={1}>
        <ul className="mt-14 hidden gap-3 sm:flex lg:mt-16">
          {leaders.map((person, i) => {
            const open = active === i;
            return (
              <li
                key={person.id}
                className={cn(
                  "min-w-0 transition-[flex-grow] duration-500 ease-back motion-reduce:transition-none",
                  open ? "flex-[2.6]" : "flex-[1]",
                )}
              >
                <button
                  type="button"
                  onMouseEnter={() => setActive(i)}
                  onFocus={() => setActive(i)}
                  onClick={() => setActive(i)}
                  aria-pressed={open}
                  className="group relative block h-[420px] w-full overflow-hidden rounded-[22px] text-left focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-turq focus-visible:ring-offset-4 focus-visible:ring-offset-deep-band lg:h-[520px]"
                >
                  {person.image ? (
                    <Image
                      src={person.image}
                      alt=""
                      fill
                      sizes="(min-width: 1024px) 420px, 50vw"
                      className="object-cover object-top"
                    />
                  ) : (
                    <span className="grid h-full w-full place-items-center bg-white/10 font-display text-[34px] font-semibold text-turq-light">
                      {initials(person.name)}
                    </span>
                  )}

                  {/* The scrim only exists under the caption, and only on the panel
                      that is open — darkening a sliver nobody is reading would just
                      dim six faces to light one. */}
                  <span
                    aria-hidden="true"
                    className={cn(
                      "absolute inset-x-0 bottom-0 h-2/5 bg-gradient-to-t from-deep-deeper via-deep-deeper/70 to-transparent transition-opacity duration-500",
                      open ? "opacity-100" : "opacity-0",
                    )}
                  />

                  <span
                    className={cn(
                      "absolute inset-x-0 bottom-0 p-5 transition-opacity duration-300 lg:p-6",
                      open ? "opacity-100 delay-150" : "opacity-0",
                    )}
                  >
                    <span className="block whitespace-nowrap font-display text-[19px] font-semibold tracking-[-0.025em] text-white lg:text-[22px]">
                      {person.name}
                    </span>
                    <span className="mt-1 block whitespace-nowrap text-[13px] text-white/85 lg:text-[14px]">
                      {t(person.roleKey)}
                    </span>
                  </span>
                </button>
              </li>
            );
          })}
        </ul>
      </Reveal>

      <Reveal index={2}>
        <p className="mt-6 hidden text-center text-[13px] text-white/70 sm:block">
          {t("ab.team.hint")}
        </p>
      </Reveal>

      {/* ---------- Phones: the plain grid ---------- */}
      <ul className="mt-12 grid grid-cols-2 gap-4 sm:hidden">
        {leaders.map((person, i) => (
          <Reveal key={person.id} index={Math.min(i, 3)} as="li" className="block">
            <figure>
              <div className="relative aspect-[3/4] overflow-hidden rounded-[18px] bg-white/10">
                {person.image ? (
                  <Image
                    src={person.image}
                    alt=""
                    fill
                    sizes="46vw"
                    className="object-cover object-top"
                  />
                ) : (
                  <span className="grid h-full w-full place-items-center font-display text-[30px] font-semibold text-turq-light">
                    {initials(person.name)}
                  </span>
                )}
              </div>
              <figcaption className="mt-3">
                <p className="font-display text-[14.5px] font-semibold leading-snug tracking-[-0.02em] text-white">
                  {person.name}
                </p>
                <p className="mt-1 text-[12.5px] leading-snug text-white/75">
                  {t(person.roleKey)}
                </p>
              </figcaption>
            </figure>
          </Reveal>
        ))}
      </ul>
    </Section>
  );
}
