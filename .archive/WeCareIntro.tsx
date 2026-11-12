"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Video, Building2, CircleCheck } from "lucide-react";
import { useTranslation } from "@/hooks/useTranslation";
import { Section, Eyebrow } from "@/components/ui/section";
import { Button } from "@/components/ui/button";
import RichText from "@/components/RichText";
import Reveal from "@/components/ui/reveal";
import { external } from "@/lib/routes";

/**
 * A short promotional banner for WeCare — a standalone outpatient plan, not an extension
 * of WeShare.
 *
 * Follows the supplied banner layout (inset image on the left, copy on the right) but in
 * the light theme the rest of the page uses: a white-to-mint card rather than the
 * reference's deep-to-teal ground.
 *
 * Deliberately thin on detail: no pricing, episode counts or quarterly allocations. Its
 * job is to send an interested visitor to the WeCare page, not to explain the plan, and
 * keeping it brief is also what stops it competing with the WeShare sections around it.
 */
const HIGHLIGHTS = [
  { n: 1, Icon: Video },
  { n: 2, Icon: Building2 },
  { n: 3, Icon: CircleCheck },
];

export default function WeCareIntro() {
  const { t, href } = useTranslation();

  // Its own band, with edges. WeCare is a separate plan, and on the near-white run of
  // sections around it the previous mint was indistinguishable — it began on exactly the
  // colour the section above ends on.
  return (
    <Section tone="accent" id="wecare" className="border-y border-teal/20">
      <Reveal>
        <div className="rounded-xl2 border border-teal/15 bg-white p-6 sm:p-8 lg:p-10">
          <div className="grid items-center gap-8 lg:grid-cols-[46fr_54fr] lg:gap-12">
            {/* Inset rather than bleeding to the card edge, as in the reference. Ordered
                second on phones so the headline and CTA are what land first. */}
            <div className="order-2 lg:order-1">
              <div className="relative aspect-[4/3] overflow-hidden rounded-card">
                <Image
                  src="/images/wecare-telemedicine.jpg"
                  alt=""
                  fill
                  sizes="(max-width: 1024px) 92vw, 42vw"
                  className="object-cover object-[62%_center]"
                />
              </div>
            </div>

            <div className="order-1 lg:order-2">
              <Eyebrow>{t("wecare.badge")}</Eyebrow>

              <RichText
                as="h2"
                className="mt-5 font-display text-[27px] font-extrabold leading-[1.1] tracking-tight text-deep sm:text-[32px] lg:text-[36px]"
                accentClassName="text-gradient-brand"
              >
                {t("wecare.title")}
              </RichText>

              <p className="mt-4 max-w-xl text-[15.5px] leading-relaxed text-ink-2 sm:text-base">
                {t("wecare.desc")}
              </p>

              {/* The reference anchors this column with a headline figure. That slot holds
                  the three plan highlights instead — this banner is not allowed to carry
                  pricing, episode counts or allocations. */}
              <ul className="mt-7 flex flex-col gap-2.5">
                {HIGHLIGHTS.map(({ n, Icon }) => (
                  <li key={n} className="flex items-center gap-2.5">
                    <Icon
                      aria-hidden="true"
                      className="h-[18px] w-[18px] shrink-0 text-teal-deep"
                      strokeWidth={1.75}
                    />
                    <span className="text-[14.5px] font-medium text-deep">{t(`wecare.h${n}`)}</span>
                  </li>
                ))}
              </ul>

              <div className="mt-8">
                <Button asChild size="lg">
                  <Link href={href(external.wecare)}>
                    {t("wecare.cta")}
                    <ArrowRight className="h-5 w-5" />
                  </Link>
                </Button>
                <p className="mt-3 text-[13px] text-ink-3">{t("wecare.note")}</p>
              </div>
            </div>
          </div>
        </div>
      </Reveal>
    </Section>
  );
}
