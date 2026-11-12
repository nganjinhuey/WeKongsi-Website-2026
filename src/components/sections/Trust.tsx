"use client";

import React, { useRef } from "react";
import Image from "next/image";
import { motion, useInView, useReducedMotion } from "framer-motion";
import { ArrowUpRight, BadgeCheck } from "lucide-react";
import { useTranslation } from "@/hooks/useTranslation";
import { partnerLogos, hospitalLogos } from "@/data/logos";
import { Section, Eyebrow } from "@/components/ui/section";
import { Button } from "@/components/ui/button";
import LogoMarquee from "@/components/ui/logo-marquee";
import LogoRow from "@/components/ui/logo-row";
import RichText from "@/components/RichText";
import Reveal from "@/components/ui/reveal";
import Orbs from "@/components/ui/orbs";

/**
 * Trust: the Shariah certificate, then the organisations standing behind the programme.
 *
 * The document leads. A visitor should get the message in a couple of seconds — certified,
 * by whom — and then be able to go and read the thing itself; an argument about why the
 * certification counts is slower and less convincing than the certificate on the wall. So
 * the copy is two sentences and everything else is the document.
 *
 * It is shown whole, at its own A4 ratio with `object-contain`, so it cannot be cropped at
 * any card width. It used to be zoomed to its head and faded out at the foot, cutting the
 * body text mid-sentence — at a glance that reads as a rendering fault rather than as a
 * crop.
 *
 * The mount is dark because the certificate is cream and the band is near-white: on a pale
 * ground the document had nothing to sit against and the two smeared into each other.
 *
 * The expiry is not printed on the page. The certificate is dated 8 January 2026 and runs
 * to 7 January 2027 — when it is renewed, replace `CERTIFICATE` with the new scan.
 */
const CERTIFICATE = "/images/cert-shariah-2026.jpg";

/** The certificate's own ink and paper, sampled from the scan, so the cover leaf is
 *  the same stock as the page beneath it rather than a card sitting on top of one. */
const PAPER = "#FBF4DA";
const PAPER_INK = "#1F3566";

/**
 * The cover leaf, hinged on its left edge, and the shadow it casts on the page below.
 *
 * Both run off one label so the shadow retreats at exactly the rate the page lifts.
 * There is no fade on the leaf: `backface-visibility` in the stylesheet drops it at
 * ninety degrees, where it is already edge-on and nothing to look at — so the page
 * turns away rather than dissolving, which is the whole difference between a page and
 * a layer.
 */
const flip = (reduce: boolean) => {
  const s = reduce ? 0 : 1;
  const ease = [0.5, 0, 0.18, 1] as const;
  return {
    leaf: {
      closed: { rotateY: 0 },
      open: { rotateY: -168, transition: { duration: 1.7 * s, delay: 0.45 * s, ease } },
    },
    shadow: {
      closed: { opacity: 0.6, scaleX: 1 },
      open: { opacity: 0, scaleX: 0.1, transition: { duration: 1.4 * s, delay: 0.45 * s, ease } },
    },
  };
};

/**
 * One labelled rail: who they are on the left, their marks beside it.
 *
 * The marks themselves are passed in, because the right treatment depends on how many
 * there are — five fit a row, eleven do not. See LogoRow, which documents why a short
 * list must not be a marquee.
 */
function Rail({
  title,
  lede,
  children,
}: {
  title: string;
  lede: string;
  children: React.ReactNode;
}) {
  return (
    <div className="grid items-center gap-x-10 gap-y-5 py-8 lg:grid-cols-[minmax(190px,230px)_1fr] lg:py-9">
      <div>
        <h3 className="font-display text-[17px] font-semibold leading-snug tracking-[-0.02em] text-deep">
          {title}
        </h3>
        <p className="mt-1.5 text-[13.5px] leading-relaxed text-ink-2">{lede}</p>
      </div>
      {/* min-w-0 so the rail takes the leftover track width instead of its content width,
          which would push the grid wider than the band. */}
      <div className="min-w-0">{children}</div>
    </div>
  );
}

export default function Trust() {
  const { t } = useTranslation();

  const book = useRef<HTMLDivElement>(null);
  const reduceMotion = useReducedMotion() ?? false;
  /* Once only, and on a good share of the document being on screen — a page that
     turns while it is still half below the fold has turned for nobody. */
  const opened = useInView(book, { once: true, amount: 0.4 });
  const v = flip(reduceMotion);
  const state = opened ? "open" : "closed";

  return (
    <Section tone="light" id="trust" className="bg-wash-soft" backdrop={<Orbs />}>
      <Reveal>
        <div className="on-dark grain relative isolate overflow-hidden rounded-[32px] bg-band-dark shadow-tide-lg">
          <Orbs tone="dark" />
          {/* A lit top edge rather than a border — on a dark panel a hairline reads as a
              cut-out, light does not. */}
          <span
            aria-hidden="true"
            className="pointer-events-none absolute inset-x-0 top-0 h-px bg-edge-glow"
          />

          <div className="relative grid gap-10 p-8 sm:p-10 lg:grid-cols-[1fr_minmax(0,0.8fr)] lg:items-center lg:gap-16 lg:p-14">
            <div>
              <Eyebrow tone="dark">{t("trust.eyebrow")}</Eyebrow>

              <RichText
                as="h2"
                className="mt-5 t-h2 text-white"
                accentClassName="text-gradient-light"
              >
                {t("trust.title")}
              </RichText>

              <RichText
                as="p"
                className="mt-6 max-w-xl text-[16px] leading-relaxed text-white/80 sm:text-[17px]"
              >
                {t("trust.body")}
              </RichText>

              <Button asChild variant="accent" size="lg" className="mt-9">
                {/* The certificate is a scan, so it opens in a new tab rather than
                    navigating away from the page that cites it. */}
                <a href={CERTIFICATE} target="_blank" rel="noopener noreferrer">
                  {t("trust.viewCert")}
                  <ArrowUpRight className="h-5 w-5" />
                </a>
              </Button>
            </div>

            {/* The document is also the link. Capped well under its track: A4 is tall, so
                every 100px of width here costs 141px of height. */}
            <div
              ref={book}
              className="cert-book mx-auto w-full max-w-[300px] sm:max-w-[360px] lg:max-w-[400px]"
            >
              <a
                href={CERTIFICATE}
                target="_blank"
                rel="noopener noreferrer"
                className="group relative block focus-visible:outline-none"
              >
                <span className="relative block aspect-[990/1400] overflow-hidden rounded-[14px] bg-white shadow-card-dark ring-1 ring-white/20 transition-transform duration-500 ease-out group-hover:-translate-y-2 group-focus-visible:-translate-y-2 group-focus-visible:ring-[3px] group-focus-visible:ring-turq-light">
                  <Image
                    src={CERTIFICATE}
                    alt={t("trust.certAlt")}
                    fill
                    sizes="(min-width: 1024px) 400px, 80vw"
                    className="object-contain"
                  />

                  {/* The shadow the lifting cover throws across the page. Clipped by the
                      page's own rounded box, so it never spills onto the mount. */}
                  <motion.span
                    aria-hidden="true"
                    variants={v.shadow}
                    initial="closed"
                    animate={state}
                    className="pointer-events-none absolute inset-0 origin-left bg-gradient-to-r from-black/75 via-black/25 to-transparent"
                  />
                </span>

                {/* The cover. Blank on purpose — a sheet of the certificate's own stock
                    with its rule and a seal, and no text at all, so it cannot be mistaken
                    for a second document. Decorative throughout, and never a hit target:
                    the link underneath stays clickable even mid-turn. */}
                <motion.span
                  aria-hidden="true"
                  variants={v.leaf}
                  initial="closed"
                  animate={state}
                  style={{ backgroundColor: PAPER }}
                  className="cert-leaf pointer-events-none absolute inset-0 overflow-hidden rounded-[14px] shadow-card-dark ring-1 ring-white/20"
                >
                  <span
                    className="absolute inset-[13px] rounded-[5px] border"
                    style={{ borderColor: `${PAPER_INK}66` }}
                  />
                  <span
                    className="absolute inset-[18px] rounded-[3px] border"
                    style={{ borderColor: `${PAPER_INK}33` }}
                  />
                  <span className="absolute inset-0 grid place-items-center">
                    <span
                      className="grid h-[84px] w-[84px] place-items-center rounded-full border-[1.5px]"
                      style={{ borderColor: `${PAPER_INK}4D`, color: `${PAPER_INK}59` }}
                    >
                      <BadgeCheck className="h-9 w-9" strokeWidth={1.3} />
                    </span>
                  </span>
                  {/* Shading at the hinge, so the leaf reads as bound rather than loose. */}
                  <span className="absolute inset-y-0 left-0 w-12 bg-gradient-to-r from-black/20 to-transparent" />
                </motion.span>
              </a>
            </div>
          </div>
        </div>
      </Reveal>

      {/* The backing, as two rails in a panel of their own. On the bare wash they were
          loose rows under a hairline; in a white box they read as the band's second
          object, which is what they are. */}
      <Reveal index={1}>
        <div className="relative mt-8 overflow-hidden rounded-[32px] border border-line bg-white px-7 shadow-tide sm:px-9 lg:mt-10 lg:px-12">
          <div className="divide-y divide-line">
            <Rail title={t("partners.title")} lede={t("partners.lede")}>
              <LogoRow logos={partnerLogos} className="justify-center lg:justify-between" />
            </Rail>
            <Rail title={t("pt.paneltitle")} lede={t("partners.hospitalsLede")}>
              <LogoMarquee logos={hospitalLogos} speed="58s" reverse />
            </Rail>
          </div>
        </div>
      </Reveal>
    </Section>
  );
}
