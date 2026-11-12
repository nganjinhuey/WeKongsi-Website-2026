"use client";

import React from "react";
import { Download, Scale } from "lucide-react";
import { useTranslation } from "@/hooks/useTranslation";
import { external } from "@/lib/routes";
import { Button } from "@/components/ui/button";

/**
 * The two Section 7.C forms, as one card in the contact column.
 *
 * The Guidelines do not recognise a Dispute or an Appeal raised by phone or by chat —
 * only one that arrives on the right form, by email, with its documents attached. That
 * is the whole of what this card has to say, and it says it beside the phone numbers
 * rather than in a band of its own: the formal route matters enormously to the few
 * people who need it and not at all to everyone else, so it should be findable without
 * being announced.
 *
 * The fourteen-day line is the one fact worth the space. Everything else about the
 * procedure is in the forms themselves, which is where someone filling one in will
 * look for it.
 */
const FORMS = [
  /* A Dispute first, an Appeal only after one has been decided. */
  { id: "dispute", href: external.formDispute },
  { id: "appeal", href: external.formAppeal },
] as const;

export default function ContactForms() {
  const { t } = useTranslation();

  return (
    <div className="rounded-card border border-line bg-mint-soft p-6">
      <div className="flex items-center gap-3">
        <span className="grid h-10 w-10 shrink-0 place-items-center rounded-card bg-white text-teal-deep">
          {/* Scales rather than a gavel. An appeal here is a second reading by a
              committee, not a hearing. */}
          <Scale aria-hidden="true" className="h-[18px] w-[18px]" strokeWidth={1.8} />
        </span>
        <h3 className="font-display text-[16px] font-semibold tracking-[-0.02em] text-deep">
          {t("ct.forms.title")}
        </h3>
      </div>

      <p className="mt-4 text-[13.5px] leading-relaxed text-ink-2">{t("ct.forms.lede")}</p>

      <div className="mt-5 flex flex-col gap-2.5 sm:flex-row">
        {FORMS.map((form) => (
          <Button key={form.id} asChild variant="outline" size="sm" className="flex-1">
            <a href={form.href} download>
              <Download className="h-4 w-4" />
              {t(`ct.forms.${form.id}.cta`)}
            </a>
          </Button>
        ))}
      </div>
    </div>
  );
}
