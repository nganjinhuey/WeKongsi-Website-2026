"use client";

import React, { useState } from "react";
import { Phone, Mail, MapPin, Headphones, FileText, ExternalLink, Send } from "lucide-react";
import { useTranslation } from "@/hooks/useTranslation";
import { external } from "@/lib/routes";
import { carelines } from "@/data/hospitals";
import { Section, SectionHeading } from "@/components/ui/section";
import { Button } from "@/components/ui/button";
import PageHero from "@/components/sections/PageHero";
import ContactForms from "@/components/contact/forms";
import Reveal from "@/components/ui/reveal";
import { Media } from "@/components/ui/media";

const ENQUIRY_TYPES = [
  "ct.type.membership",
  "ct.type.case",
  "ct.type.coverage",
  "ct.type.payment",
  "ct.type.partnership",
  "ct.type.media",
  "ct.type.general",
];

/**
 * Offers the browser somewhere sensible to fold a long address.
 *
 * Left alone, a line breaks where the box runs out, which on a phone put the fold in
 * the middle of a word — `emastpa.c` / `om.my`. `<wbr>` marks the ends of the address's
 * own parts as better candidates, so it folds after the @ or a dot instead. Unlike a
 * zero-width space it is an element rather than a character, so nothing is added to
 * what the reader copies and the address still pastes as itself.
 */
const breakable = (value: string) =>
  (value.match(/[^@.]*[@.]?/g) ?? [value]).filter(Boolean).map((part, i) => (
    <React.Fragment key={i}>
      {part}
      <wbr />
    </React.Fragment>
  ));

const MAPS_URL =
  "https://www.google.com/maps/search/?api=1&query=Equatorial+Plaza+Jalan+Sultan+Ismail+50250+Kuala+Lumpur";

export default function Contact() {
  const { t } = useTranslation();
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    type: "",
    subject: "",
    message: "",
  });

  const set = (field: keyof typeof form) => (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>,
  ) => setForm((prev) => ({ ...prev, [field]: event.target.value }));

  /**
   * There is no form backend, so the submission composes a mailto: the same behaviour
   * the existing site has. Building the body here rather than in the href keeps the
   * fields out of the URL until the visitor actually submits, and `encodeURIComponent`
   * is what stops a line break or an ampersand in the message truncating the email.
   */
  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const lines = [
      `${t("ct.form.name")}: ${form.name}`,
      `${t("ct.form.email")}: ${form.email}`,
      form.phone ? `${t("ct.form.phone")}: ${form.phone}` : null,
      form.type ? `${t("ct.form.type")}: ${form.type}` : null,
      "",
      form.message,
    ].filter(Boolean);

    const subject = encodeURIComponent(form.subject || t("ct.form.submit"));
    const body = encodeURIComponent(lines.join("\n"));
    window.location.href = `mailto:${external.email}?subject=${subject}&body=${body}`;
  };

  const fieldClass =
    "mt-2 w-full rounded-card border border-line bg-white px-4 py-3 text-sm text-deep outline-none transition-colors placeholder:text-ink-3 focus:border-teal focus:ring-2 focus:ring-teal/20";
  const labelClass = "block text-sm font-semibold text-deep";

  const details = [
    {
      id: "general",
      Icon: Phone,
      titleKey: "ct.details.general",
      value: external.phone,
      href: external.phoneHref,
      noteKey: "ct.details.generalNote",
      noteHref: external.whatsapp,
    },
    {
      id: "email",
      Icon: Mail,
      titleKey: "footer.email",
      value: external.email,
      href: `mailto:${external.email}`,
      noteKey: "ct.details.emailNote",
    },
    /* The two e-MAS rows sit together, because a member who needs one often needs to
       know about the other: the line answers questions about an admission, the mailbox
       is where the Guarantee Letter request for it is raised. */
    {
      id: "emas",
      Icon: Headphones,
      titleKey: "ct.details.emasTitle",
      value: carelines.emas.number,
      href: carelines.emas.href,
      noteKey: "ct.details.emasNote",
    },
    {
      id: "emas-gl",
      /* A document, not an envelope. The general enquiry row two above this one is
         already an email, and two identical envelopes would stop the icons telling
         the rows apart — which is the only job they have here. */
      Icon: FileText,
      titleKey: "ct.details.glTitle",
      value: carelines.emas.gl,
      href: `mailto:${carelines.emas.gl}`,
      noteKey: "ct.details.glNote",
    },
    {
      id: "micare",
      Icon: Headphones,
      titleKey: "footer.micare",
      value: carelines.micare.number,
      href: carelines.micare.href,
      noteKey: "ct.details.micareNote",
    },
  ];

  return (
    <>
      <PageHero
        eyebrow={t("ct.hero.eyebrow")}
        title={t("ct.hero.title")}
        lede={t("ct.hero.lede")}
      />

      <Section tone="light" id="contact">
        <div className="grid gap-12 lg:grid-cols-[1.15fr_.85fr] lg:gap-16">
          {/* Form */}
          <div>
            <SectionHeading
              eyebrow={t("ct.form.eyebrow")}
              title={t("ct.form.title")}
              lede={t("ct.form.desc", { email: external.email })}
              align="left"
            />

            <Reveal index={2}>
              <form onSubmit={handleSubmit} className="mt-9 grid gap-5 sm:grid-cols-2">
                <label className="sm:col-span-1">
                  <span className={labelClass}>
                    {t("ct.form.name")} <span className="text-teal-deep">*</span>
                  </span>
                  <input
                    required
                    type="text"
                    name="name"
                    value={form.name}
                    onChange={set("name")}
                    className={fieldClass}
                  />
                </label>

                <label className="sm:col-span-1">
                  <span className={labelClass}>
                    {t("ct.form.email")} <span className="text-teal-deep">*</span>
                  </span>
                  <input
                    required
                    type="email"
                    name="email"
                    value={form.email}
                    onChange={set("email")}
                    className={fieldClass}
                  />
                </label>

                <label className="sm:col-span-1">
                  <span className={labelClass}>{t("ct.form.phone")}</span>
                  <input
                    type="tel"
                    name="phone"
                    value={form.phone}
                    onChange={set("phone")}
                    className={fieldClass}
                  />
                </label>

                <label className="sm:col-span-1">
                  <span className={labelClass}>{t("ct.form.type")}</span>
                  <select
                    name="type"
                    value={form.type}
                    onChange={set("type")}
                    className={fieldClass}
                  >
                    <option value="">{t("ct.form.typePlaceholder")}</option>
                    {ENQUIRY_TYPES.map((key) => (
                      <option key={key} value={t(key)}>
                        {t(key)}
                      </option>
                    ))}
                  </select>
                </label>

                <label className="sm:col-span-2">
                  <span className={labelClass}>
                    {t("ct.form.subject")} <span className="text-teal-deep">*</span>
                  </span>
                  <input
                    required
                    type="text"
                    name="subject"
                    value={form.subject}
                    onChange={set("subject")}
                    className={fieldClass}
                  />
                </label>

                <label className="sm:col-span-2">
                  <span className={labelClass}>
                    {t("ct.form.message")} <span className="text-teal-deep">*</span>
                  </span>
                  <textarea
                    required
                    name="message"
                    rows={6}
                    value={form.message}
                    onChange={set("message")}
                    className={`${fieldClass} resize-y`}
                  />
                </label>

                <div className="sm:col-span-2">
                  <Button type="submit" size="lg">
                    <Send className="h-4 w-4" />
                    {t("ct.form.submit")}
                  </Button>
                  <p className="mt-4 text-xs text-ink-3">{t("ct.form.note")}</p>
                </div>
              </form>
            </Reveal>
          </div>

          {/* Details */}
          {/* `min-w-0`: a grid item defaults to `min-width: auto`, which refuses to
              shrink below its min-content width — and `break-words` does NOT reduce
              min-content, so the e-MAS Guarantee Letter address sized this column to
              the whole unbroken token and the band's `overflow-hidden` clipped it off
              the right edge on a phone. With the floor removed the column takes the
              width it is given and the address wraps. */}
          <div className="min-w-0">
            <SectionHeading
              eyebrow={t("ct.details.eyebrow")}
              title={t("ct.details.title")}
              align="left"
            />

            <ul className="mt-9 space-y-4">
              {details.map((item, i) => (
                <Reveal key={item.id} index={Math.min(i, 3)} as="li">
                  <div className="flex gap-4 rounded-card border border-line bg-mint-soft p-6">
                    <span className="grid h-11 w-11 shrink-0 place-items-center rounded-card bg-white text-teal-deep">
                      <item.Icon className="h-5 w-5" />
                    </span>
                    <div className="min-w-0">
                      <p className="text-[11px] font-bold uppercase tracking-[0.1em] text-ink-3">
                        {t(item.titleKey)}
                      </p>
                      <a
                        href={item.href}
                        className="mt-1 block break-words font-display text-base font-semibold text-deep transition-colors hover:text-teal-deep"
                      >
                        {breakable(item.value)}
                      </a>
                      {item.noteHref ? (
                        <a
                          href={item.noteHref}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="mt-0.5 inline-flex items-center gap-1 text-xs text-teal-deep hover:underline"
                        >
                          {t(item.noteKey)}
                          <ExternalLink className="h-3 w-3" />
                        </a>
                      ) : (
                        <p className="mt-0.5 text-xs text-ink-2">{t(item.noteKey)}</p>
                      )}
                    </div>
                  </div>
                </Reveal>
              ))}

              <Reveal index={3} as="li">
                <div className="flex gap-4 rounded-card border border-line bg-deep p-6 text-white">
                  <span className="grid h-11 w-11 shrink-0 place-items-center rounded-card bg-white/10 text-turq-light">
                    <MapPin className="h-5 w-5" />
                  </span>
                  <div>
                    <p className="text-[11px] font-bold uppercase tracking-[0.1em] text-white/45">
                      {t("ct.details.office")}
                    </p>
                    <p className="mt-1.5 text-sm leading-relaxed text-white/75">
                      {t("site.footer.companyName")}, {t("site.footer.address")}
                    </p>
                    <a
                      href={MAPS_URL}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-3 inline-flex items-center gap-1 text-xs text-turq-light hover:underline"
                    >
                      {t("ct.details.maps")}
                      <ExternalLink className="h-3 w-3" />
                    </a>
                  </div>
                </div>
              </Reveal>
            </ul>

            <Reveal index={4} className="mt-4 block">
              <ContactForms />
            </Reveal>

            <Reveal index={4}>
              <Media
                src="/images/coverage-clinic.jpg"
                ratio="16/9"
                rounded="brand"
                sizes="(max-width: 1024px) 90vw, 36vw"
                className="mt-6"
              />
            </Reveal>

            <Reveal index={5}>
              {/* The link used to go to the site's own front page, back to where the
                  reader already is. Now that joining runs through a referrer it goes
                  to the chat that reaches one. */}
              <p className="mt-6 text-sm text-ink-2">
                {t("ct.details.join")}{" "}
                <a
                  href={external.whatsapp}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-semibold text-teal-deep hover:underline"
                >
                  {t("footer.whatsapp")}
                </a>
              </p>
            </Reveal>
          </div>
        </div>
      </Section>
    </>
  );
}
