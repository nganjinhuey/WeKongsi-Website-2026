"use client";

import React, { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { Globe, ChevronDown } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { LANGUAGES, LANGUAGE_LABELS, LANGUAGE_SHORT, localisePath } from "@/lib/i18n";
import { cn } from "@/lib/utils";

export default function LanguageSwitcher({ tone = "light" }: { tone?: "light" | "dark" }) {
  const { language, basePath } = useLanguage();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const onPointerDown = (event: MouseEvent) => {
      if (ref.current && !ref.current.contains(event.target as Node)) setOpen(false);
    };
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    document.addEventListener("mousedown", onPointerDown);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("mousedown", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [open]);

  // Nothing to switch between while only one language ships. Returning null here
  // rather than removing the component from the header means the control comes back
  // on its own the moment another language is added to LANGUAGES.
  if (LANGUAGES.length < 2) return null;

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-haspopup="menu"
        aria-expanded={open}
        aria-label={LANGUAGE_LABELS[language]}
        className={cn(
          "flex items-center gap-1.5 rounded-full border px-3 py-2 text-sm font-medium transition-colors",
          tone === "dark"
            ? "border-white/25 text-white hover:bg-white/10"
            : "border-deep/12 text-deep hover:border-teal hover:text-teal-deep",
        )}
      >
        <Globe className="h-4 w-4" />
        <span>{LANGUAGE_SHORT[language]}</span>
        <ChevronDown className={cn("h-3.5 w-3.5 transition-transform", open && "rotate-180")} />
      </button>

      {open && (
        <ul
          role="menu"
          className="absolute right-0 z-50 mt-2 w-48 overflow-hidden rounded-card border border-line bg-white py-1 shadow-float"
        >
          {LANGUAGES.map((code) => (
            <li key={code} role="none">
              {/* Switching language keeps the visitor on the page they were reading —
                  basePath is the current route with its language prefix stripped. */}
              <Link
                role="menuitem"
                href={localisePath(basePath, code)}
                onClick={() => setOpen(false)}
                className={cn(
                  "block px-4 py-2.5 text-sm transition-colors hover:bg-mint-soft",
                  code === language ? "font-semibold text-teal-deep" : "text-deep",
                )}
              >
                {LANGUAGE_LABELS[code]}
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
