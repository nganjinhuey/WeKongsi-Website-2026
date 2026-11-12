"use client";

import React, { useEffect, useRef, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Menu, X, ArrowRight, ChevronDown, Hospital, Stethoscope } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { useTranslation } from "@/hooks/useTranslation";
import { useLanguage } from "@/contexts/LanguageContext";
import { external } from "@/lib/routes";
import LanguageSwitcher from "@/components/LanguageSwitcher";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type MenuItem = {
  path: string;
  /** A proper noun, printed as-is — "WeShare" is not a translation. */
  name?: string;
  /** Or a translated label, for items whose name is ordinary words. */
  labelKey?: string;
  descKey: string;
  Icon?: LucideIcon;
};

type MenuDef = {
  key: string;
  /**
   * The page the trigger goes to on a second press, if the menu has one behind it.
   * Plans does; Healthcare Network does not — it is a grouping of two pages and has
   * no page of its own, so its trigger is a plain toggle. Sending a second press to
   * a route that does not exist would 404.
   */
  hub?: string;
  /** The routes that make this trigger read as the current page. */
  owns: readonly string[];
  items: readonly MenuItem[];
  /** The "see everything" link under the items, where there is a hub to see. */
  allKey?: string;
};

/**
 * The two dropdowns in the bar.
 *
 * They are declared rather than written out twice. A second bespoke menu would have
 * meant a second piece of open state, a second outside-click effect, a second ref and
 * two near-identical blocks of JSX — which is four places for the two to drift apart.
 */
const MENUS: Record<string, MenuDef> = {
  plans: {
    key: "nav.plans",
    hub: "/plans",
    owns: ["/plans", "/plans/weshare", "/plans/wecare"],
    allKey: "nav.plansAll",
    items: [
      { path: "/plans/weshare", name: "WeShare", descKey: "nav.wsDesc" },
      { path: "/plans/wecare", name: "WeCare", descKey: "nav.wcDesc" },
    ],
  },
  network: {
    key: "nav.network",
    owns: ["/hospital-info", "/clinic-info"],
    items: [
      {
        path: "/hospital-info",
        labelKey: "nav.hospitalFull",
        descKey: "nav.hospitalDesc",
        Icon: Hospital,
      },
      {
        path: "/clinic-info",
        labelKey: "nav.clinicFull",
        descKey: "nav.clinicDesc",
        Icon: Stethoscope,
      },
    ],
  },
};

type NavEntry = { path: string; key: string } | { menu: keyof typeof MENUS };

const NAV: readonly NavEntry[] = [
  { path: "/", key: "nav.home" },
  { menu: "plans" },
  /* Hospital Info and Clinic Info used to sit here as two separate pills. They are
     one subject — where you can be treated — and two pills spent the width of the bar
     saying so twice. The pages themselves are untouched. */
  { menu: "network" },
  { path: "/transparency", key: "nav.transparency" },
  { path: "/stories", key: "nav.stories" },
  { path: "/about", key: "nav.about" },
  { path: "/faq", key: "nav.faq" },
  { path: "/contact", key: "nav.contact" },
];

/** One pill in the bar. Hover turns it mint; the page you are on wears the brand fill. */
const pill = (active: boolean) =>
  cn(
    "flex items-center gap-1 whitespace-nowrap rounded-pill px-3.5 py-2.5 text-[14.5px] font-medium transition-colors duration-200",
    active
      ? "bg-grad-pill text-white shadow-glow-sm"
      : "text-ink-2 hover:bg-mint hover:text-teal-ink",
  );

export default function Header() {
  const { t, href } = useTranslation();
  const { basePath } = useLanguage();
  const router = useRouter();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  /** Which dropdown is open in the bar, and which accordion in the drawer. */
  const [openMenu, setOpenMenu] = useState<string | null>(null);
  const [openSection, setOpenSection] = useState<string | null>(null);
  const [openedAt, setOpenedAt] = useState(basePath);
  const menuRefs = useRef<Record<string, HTMLDivElement | null>>({});

  const label = (item: MenuItem) => item.name ?? t(item.labelKey as string);

  // A route change closes the drawer — Next reuses the layout across navigations, so
  // without this the panel stays open over the new page. Adjusted during render rather
  // than in an effect: an effect would commit the open panel first and then close it,
  // costing a second render pass and a visible flash of the old menu on the new page.
  if (basePath !== openedAt) {
    setOpenedAt(basePath);
    setOpen(false);
    setOpenMenu(null);
    setOpenSection(null);
  }

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // The drawer is a full-screen overlay; letting the page behind it scroll is the classic
  // iOS bug where the body drifts under the menu.
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  // A menu that can only be closed by clicking its own trigger is a trap. Pointer
  // anywhere outside, or Escape, closes it — and Escape returns focus to the trigger.
  // Keyed on whichever menu is open, so opening the second one closes the first.
  useEffect(() => {
    if (!openMenu) return;
    const host = () => menuRefs.current[openMenu];
    const onDown = (e: PointerEvent) => {
      if (!host()?.contains(e.target as Node)) setOpenMenu(null);
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== "Escape") return;
      setOpenMenu(null);
      host()?.querySelector("button")?.focus();
    };
    document.addEventListener("pointerdown", onDown);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("pointerdown", onDown);
      document.removeEventListener("keydown", onKey);
    };
  }, [openMenu]);

  return (
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-50 transition-[background-color,border-color,backdrop-filter] duration-300",
        // Transparent at the top so the hero's wash runs to the top of the window, then
        // white glass once scrolled, so the bar separates from the content beneath it.
        scrolled || open || openMenu
          ? "border-b border-line bg-white/90 backdrop-blur-xl [backdrop-filter:saturate(180%)_blur(18px)]"
          : "border-b border-transparent bg-transparent",
      )}
    >
      <div className="container relative flex h-[76px] items-center justify-between gap-4 lg:h-20">
        <Link href={href("/")} className="flex shrink-0 items-center" aria-label="We Kongsi">
          {/* The full lockup with its own tagline. Dark wordmark, so it only suits the
              light bar — the deep footer keeps the badge-plus-text <Logo>. */}
          <Image
            src="/images/wekongsi-logo-384.png"
            alt=""
            width={384}
            height={117}
            priority
            className="h-10 w-auto lg:h-11"
          />
        </Link>

        <nav className="absolute left-1/2 hidden -translate-x-1/2 items-center gap-1 rounded-pill border border-line bg-white/70 p-1.5 shadow-[0_6px_24px_-18px_rgba(18,63,70,.5)] backdrop-blur-xl xl:flex">
          {NAV.map((entry) => {
            if (!("menu" in entry)) {
              return (
                <Link
                  key={entry.path}
                  href={href(entry.path)}
                  className={pill(basePath === entry.path)}
                >
                  {t(entry.key)}
                </Link>
              );
            }

            const id = entry.menu;
            const def = MENUS[id];
            const isOpen = openMenu === id;
            const active = def.owns.includes(basePath);

            return (
              <div
                key={id}
                ref={(el) => {
                  menuRefs.current[id] = el;
                }}
                className="relative"
              >
                {/* A button, not a link, because the first press does not navigate.
                    Where the menu has a hub behind it, a second press goes there — and
                    the hub stays reachable from inside the menu, so keyboard and
                    screen-reader users never depend on pressing one control twice. */}
                <button
                  type="button"
                  aria-haspopup="menu"
                  aria-expanded={isOpen}
                  onClick={() => {
                    if (isOpen && def.hub) router.push(href(def.hub));
                    else setOpenMenu(isOpen ? null : id);
                  }}
                  className={pill(active)}
                >
                  {t(def.key)}
                  <ChevronDown
                    aria-hidden="true"
                    className={cn(
                      "h-3.5 w-3.5 transition-transform duration-200",
                      isOpen && "rotate-180",
                    )}
                    strokeWidth={2.5}
                  />
                </button>

                {isOpen && (
                  <div
                    role="menu"
                    aria-label={t(def.key)}
                    className="absolute left-1/2 top-[calc(100%+12px)] w-[340px] -translate-x-1/2 animate-[rise_.22s_cubic-bezier(.22,.61,.36,1)_both] overflow-hidden rounded-[20px] border border-line bg-white p-2 shadow-float motion-reduce:animate-none"
                  >
                    {def.items.map((item) => (
                      <Link
                        key={item.path}
                        role="menuitem"
                        href={href(item.path)}
                        onClick={() => setOpenMenu(null)}
                        className={cn(
                          "flex items-start gap-3 rounded-[14px] px-4 py-3 transition-colors duration-200",
                          basePath === item.path
                            ? "bg-mint"
                            : "hover:bg-mint-soft focus-visible:bg-mint-soft",
                        )}
                      >
                        {item.Icon && (
                          <span className="mt-0.5 grid h-8 w-8 shrink-0 place-items-center rounded-card bg-mint text-teal-ink">
                            <item.Icon aria-hidden="true" className="h-4 w-4" strokeWidth={1.9} />
                          </span>
                        )}
                        <span className="min-w-0">
                          <span className="block font-display text-[15.5px] font-semibold tracking-[-0.02em] text-deep">
                            {label(item)}
                          </span>
                          <span className="mt-0.5 block text-[13px] leading-snug text-ink-2">
                            {t(item.descKey)}
                          </span>
                        </span>
                      </Link>
                    ))}

                    {def.hub && def.allKey && (
                      <Link
                        role="menuitem"
                        href={href(def.hub)}
                        onClick={() => setOpenMenu(null)}
                        className="mt-1 flex items-center gap-1.5 border-t border-line px-4 pb-1 pt-3 text-[13.5px] font-semibold text-teal-deep transition-colors hover:text-teal-ink"
                      >
                        {t(def.allKey)}
                        <ArrowRight aria-hidden="true" className="h-3.5 w-3.5" />
                      </Link>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </nav>

        <div className="flex items-center gap-2">
          <LanguageSwitcher tone="light" />
          {/* Login, not Join. Membership is taken out through a referrer, so there is
              no signup form to send anyone to from the bar — the join routes live in
              the page CTAs, which open a chat. */}
          <Button asChild size="sm" className="hidden sm:inline-flex">
            <a href={external.login} target="_blank" rel="noopener noreferrer">
              {t("nav.login")}
              <ArrowRight className="h-4 w-4" />
            </a>
          </Button>
          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            aria-label={open ? t("site.nav.closeMenu") : t("site.nav.openMenu")}
            aria-expanded={open}
            className="grid h-10 w-10 place-items-center rounded-pill border border-line-2 bg-white text-deep backdrop-blur-md transition-colors hover:border-teal-deep hover:text-teal-deep xl:hidden"
          >
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {open && (
        <div className="max-h-[calc(100dvh-76px)] overflow-y-auto border-t border-line bg-white px-5 pb-8 pt-3 xl:hidden">
          <nav className="flex flex-col">
            {NAV.map((entry) => {
              if (!("menu" in entry)) {
                return (
                  <Link
                    key={entry.path}
                    href={href(entry.path)}
                    className={cn(
                      "border-b border-line py-3.5 font-display text-lg font-semibold transition-colors",
                      basePath === entry.path ? "text-teal-ink" : "text-deep",
                    )}
                  >
                    {t(entry.key)}
                  </Link>
                );
              }

              const id = entry.menu;
              const def = MENUS[id];
              const isOpen = openSection === id;
              const active = def.owns.includes(basePath);
              const toggle = () => setOpenSection(isOpen ? null : id);

              return (
                <div key={id} className="border-b border-line">
                  {/* With a hub behind it the row splits: the label goes to the hub and
                      the chevron opens the list, because a press-twice gesture on a
                      touch screen is a press people make by accident. Without one there
                      is nowhere for the label to go, so the whole row is the toggle. */}
                  <div className="flex items-center justify-between">
                    {def.hub ? (
                      <Link
                        href={href(def.hub)}
                        className={cn(
                          "flex-1 py-3.5 font-display text-lg font-semibold transition-colors",
                          active ? "text-teal-ink" : "text-deep",
                        )}
                      >
                        {t(def.key)}
                      </Link>
                    ) : (
                      <button
                        type="button"
                        onClick={toggle}
                        aria-expanded={isOpen}
                        className={cn(
                          "flex-1 py-3.5 text-left font-display text-lg font-semibold transition-colors",
                          active ? "text-teal-ink" : "text-deep",
                        )}
                      >
                        {t(def.key)}
                      </button>
                    )}
                    <button
                      type="button"
                      onClick={toggle}
                      aria-expanded={isOpen}
                      aria-label={t(def.key)}
                      className="grid h-10 w-10 place-items-center rounded-pill text-ink-2"
                    >
                      <ChevronDown
                        aria-hidden="true"
                        className={cn(
                          "h-5 w-5 transition-transform duration-200",
                          isOpen && "rotate-180",
                        )}
                      />
                    </button>
                  </div>

                  {isOpen && (
                    <ul className="animate-[rise_.2s_cubic-bezier(.22,.61,.36,1)_both] pb-3 motion-reduce:animate-none">
                      {def.items.map((item) => (
                        <li key={item.path}>
                          <Link
                            href={href(item.path)}
                            className={cn(
                              "flex items-start gap-3 rounded-card px-4 py-3 transition-colors",
                              basePath === item.path ? "bg-mint" : "hover:bg-mint-soft",
                            )}
                          >
                            {item.Icon && (
                              <span className="mt-0.5 grid h-8 w-8 shrink-0 place-items-center rounded-card bg-mint text-teal-ink">
                                <item.Icon
                                  aria-hidden="true"
                                  className="h-4 w-4"
                                  strokeWidth={1.9}
                                />
                              </span>
                            )}
                            <span className="min-w-0">
                              <span className="block font-display text-[15.5px] font-semibold text-deep">
                                {label(item)}
                              </span>
                              <span className="mt-0.5 block text-[13px] leading-snug text-ink-2">
                                {t(item.descKey)}
                              </span>
                            </span>
                          </Link>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              );
            })}
          </nav>
          <div className="mt-6 flex flex-col gap-3">
            <Button asChild size="lg">
              <a href={external.login} target="_blank" rel="noopener noreferrer">
                {t("nav.login")}
                <ArrowRight className="h-5 w-5" />
              </a>
            </Button>
            {/* The drawer used to carry Join above Login; with the bar now showing
                Login, a second Login button under it was the same door twice. */}
            <Button asChild variant="outline" size="lg">
              <a href={external.whatsapp} target="_blank" rel="noopener noreferrer">
                {t("footer.whatsapp")}
              </a>
            </Button>
          </div>
        </div>
      )}
    </header>
  );
}
