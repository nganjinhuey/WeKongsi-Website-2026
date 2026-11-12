"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight } from "lucide-react";
import { useTranslation } from "@/hooks/useTranslation";
import { Section, Eyebrow } from "@/components/ui/section";
import RichText from "@/components/RichText";
import Reveal from "@/components/ui/reveal";
import Orbs from "@/components/ui/orbs";
import { cn } from "@/lib/utils";

/**
 * The two products, laid out as the Angsana reference lays out its flagship products:
 * white cards on a vibrant brand-green band, each led by the product's own logo, then
 * a short description, then a photograph, with a rule above a footer link.
 *
 * The photograph sits under the copy rather than behind it — it is there to show what
 * the product is for, not to be a texture with words on top.
 */
const PRODUCTS = [
  {
    id: "weshare",
    href: "/plans/weshare",
    forKey: "hp.ws.for",
    descKey: "hp.ws.desc",
    ctaKey: "hp.ws.cta",
    logo: "/images/weshare-logo-520.png",
    alt: "WeShare",
    // ink measured at 418x121 inside the 500x500 canvas, centred 42.6% down
    logoFrame: "h-[44px] w-[153px]",
    photo: "/images/product-weshare.jpg",
  },
  {
    id: "wecare",
    href: "/plans/wecare",
    forKey: "hp.wc.for",
    descKey: "hp.wc.desc",
    ctaKey: "hp.wc.cta",
    logo: "/images/wecare-logo-560.png",
    alt: "WeCare",
    // ink measured at 473x86, centred 45.7% down — flatter than WeShare's lockup
    logoFrame: "h-[33px] w-[183px]",
    photo: "/images/product-wecare.jpg",
  },
];

export default function HomePlans() {
  const { t, href } = useTranslation();

  return (
    <Section
      tone="light"
      id="plans"
      className="on-dark bg-band-dark py-16 lg:py-20 xl:py-24"
      backdrop={<Orbs tone="dark" />}
    >
      <div className="max-w-3xl">
        <Reveal>
          {/* Warm against the green, as the reference's amber is against its own. This
              step is pale enough to clear 4.5:1 on this band; a saturated amber is
              nearer 3:1 here and cannot carry 12px type. */}
          <Eyebrow className="text-turq-light">{t("hp.eyebrow")}</Eyebrow>
        </Reveal>
        <Reveal index={1}>
          <RichText
            as="h2"
            className="mt-6 t-h2 text-white"
            accentClassName="text-turq-light"
          >
            {t("hp.title")}
          </RichText>
        </Reveal>
      </div>

      <div className="mx-auto mt-10 grid max-w-5xl gap-6 lg:mt-12 lg:grid-cols-2">
        {PRODUCTS.map((p, i) => (
          <Reveal key={p.id} index={i}>
            <Link
              href={href(p.href)}
              className="glow-edge group on-light relative flex h-full flex-col overflow-hidden rounded-xl2 bg-white p-7 shadow-tide transition-[transform,box-shadow] duration-300 hover:-translate-y-1.5 hover:shadow-tide-glow sm:p-8"
            >
              <p className="t-eyebrow text-teal-ink">{t(p.forKey)}</p>

              {/* The trimmed, transparent lockups — not the 500x500 brand JPEGs,
                  which are wordmarks floating on a white canvas. Cropping those with
                  `object-cover` put a faintly off-white rectangle on the card behind
                  WeShare, which is what made the two look like different sizes.

                  The frames are sized to match WORDMARK height, not frame height.
                  WeShare's lockup carries the hand above its word, so its ink is 90 of
                  150 rows; WeCare's is 82 of 101. Matching the outer boxes would have
                  set "WeCare" visibly larger than "WeShare". At 44px and 33px both
                  words measure ~26.5px tall. */}
              <div className="mt-5 flex h-12 items-center">
                <div className={cn("relative", p.logoFrame)}>
                  <Image
                    src={p.logo}
                    alt={p.alt}
                    fill
                    sizes="220px"
                    className="object-contain object-left"
                  />
                </div>
              </div>

              {/* Side by side the two descriptions run to a different number of lines,
                  which starts the photographs at different heights. Reserving three
                  lines from lg up lines them up; below that the cards stack and there
                  is nothing to line up with. */}
              <p className="mt-5 text-[14.5px] leading-relaxed text-ink-2 lg:min-h-[71px]">
                {t(p.descKey)}
              </p>

              {/* One frame for both, so the cards line up: the sources are 3:2 and 16:9
                  and a shared crop takes a little from each rather than a lot from
                  one. Deliberately wide and shallow: the photograph says what the
                  product is for, and a taller frame made it the card rather than
                  part of it. */}
              <div className="img-zoom relative mb-7 mt-6 aspect-[16/7] overflow-hidden rounded-card">
                <Image
                  src={p.photo}
                  alt=""
                  fill
                  sizes="(max-width: 1024px) 92vw, 30vw"
                  className="object-cover"
                />
                <span className="sheen-host pointer-events-none absolute inset-0" />
              </div>

              <div className="mt-auto flex items-center justify-between gap-4 border-t border-mint-deep pt-5">
                <span className="text-[14.5px] font-semibold text-teal-ink">
                  {t(p.ctaKey)}
                </span>
                <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full border border-mint-deep text-teal-ink transition-all duration-300 group-hover:border-teal-ink group-hover:bg-teal-ink group-hover:text-white">
                  <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5" />
                </span>
              </div>
            </Link>
          </Reveal>
        ))}
      </div>
    </Section>
  );
}
