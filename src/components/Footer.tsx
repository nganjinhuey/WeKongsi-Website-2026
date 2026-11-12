"use client";

import React from "react";
import Link from "next/link";
import Logo from "@/components/Logo";
import { Mail, Phone, MapPin } from "lucide-react";
import { useTranslation } from "@/hooks/useTranslation";
import { external } from "@/lib/routes";

const Facebook = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" className="h-4 w-4" aria-hidden="true">
    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
  </svg>
);

const Instagram = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" className="h-4 w-4" aria-hidden="true">
    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
  </svg>
);

const LinkedIn = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" className="h-4 w-4" aria-hidden="true">
    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
  </svg>
);

export default function Footer() {
  const { t, href } = useTranslation();

  const columns = [
    {
      heading: t("site.footer.program"),
      links: [
        { label: "WeShare", path: "/plans/weshare" },
        { label: "WeCare", path: "/plans/wecare" },
        { label: t("site.footer.transparencyReports"), path: "/transparency" },
        { label: t("site.footer.hospitalInfo"), path: "/hospital-info" },
        { label: t("site.footer.clinicInfo"), path: "/clinic-info" },
        { label: t("site.footer.stories"), path: "/stories" },
      ],
    },
    {
      heading: t("site.footer.company"),
      links: [
        { label: t("site.footer.aboutUs"), path: "/about" },
        { label: t("nav.faq"), path: "/faq" },
        { label: t("nav.contact"), path: "/contact" },
      ],
    },
  ];

  const socials = [
    { href: external.facebook, label: "Facebook", Icon: Facebook },
    { href: external.instagram, label: "Instagram", Icon: Instagram },
    { href: external.linkedin, label: "LinkedIn", Icon: LinkedIn },
  ];

  return (
    <footer className="on-dark bg-band-cta text-white">
      <div className="container py-16 lg:py-20">
        <div className="grid gap-12 lg:grid-cols-[1.5fr_1fr_1fr_1.3fr]">
          <div className="max-w-sm">
            <Logo tone="dark" />
            <p className="mt-5 text-sm leading-relaxed text-white/80">{t("site.footer.tagline")}</p>
            <div className="mt-6 flex gap-3">
              {socials.map(({ href: url, label, Icon }) => (
                <a
                  key={label}
                  href={url}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  className="grid h-9 w-9 place-items-center rounded-full bg-white/10 text-white/80 transition-colors hover:bg-teal hover:text-white"
                >
                  <Icon />
                </a>
              ))}
            </div>
          </div>

          {columns.map((column) => (
            <div key={column.heading}>
              <h3 className="font-display text-sm font-semibold uppercase tracking-[0.12em] text-turq-light">
                {column.heading}
              </h3>
              <ul className="mt-5 space-y-3">
                {column.links.map((link) => (
                  <li key={link.path + link.label}>
                    <Link
                      href={href(link.path)}
                      className="text-sm text-white/80 transition-colors hover:text-white"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          <div>
            <h3 className="font-display text-sm font-semibold uppercase tracking-[0.12em] text-turq-light">
              {t("site.footer.getInTouch")}
            </h3>
            <ul className="mt-5 space-y-4 text-sm text-white/80">
              <li>
                <a
                  href={`mailto:${external.email}`}
                  className="flex items-start gap-3 transition-colors hover:text-white"
                >
                  <Mail className="mt-0.5 h-4 w-4 shrink-0 text-turq-light" />
                  {external.email}
                </a>
              </li>
              <li>
                <a
                  href={external.phoneHref}
                  className="flex items-start gap-3 transition-colors hover:text-white"
                >
                  <Phone className="mt-0.5 h-4 w-4 shrink-0 text-turq-light" />
                  {external.phone}
                </a>
              </li>
              <li className="flex items-start gap-3">
                <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-turq-light" />
                <span>
                  <span className="block font-semibold text-white/85">
                    {t("site.footer.companyName")}
                  </span>
                  {t("site.footer.address")}
                </span>
              </li>
            </ul>
          </div>
        </div>

        {/* The regulatory disclaimer is load-bearing: We Kongsi is a cost-sharing
            community, not an insurer, and the distinction has to be visible on every
            page rather than buried on one. */}
        <p className="mt-14 rounded-card border border-white/10 bg-white/[0.04] p-6 text-xs leading-relaxed text-white/80">
          <strong className="font-semibold text-white/80">{t("site.footer.noteLabel")}</strong>{" "}
          {t("site.footer.note")}
        </p>

        <div className="mt-8 flex flex-col gap-4 border-t border-white/10 pt-8 text-xs text-white/80 sm:flex-row sm:items-center sm:justify-between">
          <p>{t("site.footer.copyright", { year: new Date().getFullYear() })}</p>
          <p className="flex flex-wrap items-center gap-x-3 gap-y-2">
            <span className="cursor-default">{t("site.footer.privacy")}</span>
            <span aria-hidden="true">·</span>
            <span className="cursor-default">{t("site.footer.terms")}</span>
            <span aria-hidden="true">·</span>
            <a
              href={external.guidelinesWeshare}
              target="_blank"
              rel="noopener noreferrer"
              className="transition-colors hover:text-white"
            >
              {t("footer.guidelines")}
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}
