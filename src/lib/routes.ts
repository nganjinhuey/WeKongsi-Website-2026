/**
 * Every route the site serves, in one list. The catch-all route uses it to decide what
 * exists (anything else 404s rather than rendering a soft 200), to pre-render each page
 * in all three languages, and to build the sitemap — so a page added here is wired up
 * everywhere at once.
 */
import { published } from "@/data/stories";

export type RouteKey =
  | "home"
  | "plans"
  | "weshare"
  | "wecare"
  | "hospital-info"
  | "clinic-info"
  | "transparency"
  | "about"
  | "faq"
  | "contact"
  | "stories"
  /** Every article under /stories shares this key; the path tells them apart. */
  | "story";

export type SiteRoute = {
  key: RouteKey;
  path: string;
  /** Translation keys for <title> and <meta name="description">. */
  titleKey: string;
  descKey: string;
  /** Sitemap weighting. */
  priority: number;
};

export const routes: SiteRoute[] = [
  { key: "home", path: "/", titleKey: "meta.home.title", descKey: "meta.home.desc", priority: 1 },
  { key: "plans", path: "/plans", titleKey: "meta.plans.title", descKey: "meta.plans.desc", priority: 0.9 },
  { key: "weshare", path: "/plans/weshare", titleKey: "meta.weshare.title", descKey: "meta.weshare.desc", priority: 0.9 },
  { key: "wecare", path: "/plans/wecare", titleKey: "meta.wecare.title", descKey: "meta.wecare.desc", priority: 0.9 },
  { key: "hospital-info", path: "/hospital-info", titleKey: "meta.hospital.title", descKey: "meta.hospital.desc", priority: 0.8 },
  { key: "clinic-info", path: "/clinic-info", titleKey: "meta.clinic.title", descKey: "meta.clinic.desc", priority: 0.8 },
  { key: "transparency", path: "/transparency", titleKey: "meta.transparency.title", descKey: "meta.transparency.desc", priority: 0.8 },
  { key: "stories", path: "/stories", titleKey: "meta.stories.title", descKey: "meta.stories.desc", priority: 0.8 },
  /**
   * One route per PUBLISHED article, generated from the stories data rather than
   * listed. A draft has no route, no sitemap line and no page — it is an editorial
   * note, not a URL. Publishing one gives it a static page and its own <title> and
   * description from the same copy keys the article itself renders.
   */
  ...published.map((story) => ({
    key: "story" as const,
    path: `/stories/${story.slug}`,
    titleKey: story.seoTitleKey ?? story.titleKey,
    descKey: story.seoDescKey ?? story.excerptKey,
    priority: 0.6,
  })),
  { key: "about", path: "/about", titleKey: "meta.about.title", descKey: "meta.about.desc", priority: 0.7 },
  { key: "faq", path: "/faq", titleKey: "meta.faq.title", descKey: "meta.faq.desc", priority: 0.7 },
  { key: "contact", path: "/contact", titleKey: "meta.contact.title", descKey: "meta.contact.desc", priority: 0.6 },
];

export const findRoute = (path: string) => routes.find((r) => r.path === path);

/** External destinations, kept here so a URL change is a one-line edit. */
export const external = {
  login: "https://app.wekongsi.com/auth/login",
  /**
   * Joining goes through a referrer, so the "join" buttons open a chat rather than a
   * signup form. `https://app.wekongsi.com/auth/register` used to sit here and now
   * returns 404 — self-serve registration was retired, and every Join button on the
   * site was walking members into a dead page. The destination is the same WhatsApp
   * thread as `whatsapp`; it is kept under its own name because the intent differs,
   * and because if a referred-signup URL ever exists this is the one line to change.
   */
  join: "https://wa.me/60108768760",
  whatsapp: "https://wa.me/60108768760",
  /**
   * The two Program Guidelines, served from `public/guidelines/`. Each plan page
   * links its own: they are different documents governing different products, and
   * `guidelines` used to point at a single outpatient page for both.
   */
  guidelinesWeshare: "/guidelines/weshare-program-guidelines-nov-2026.pdf",
  guidelinesWecare: "/guidelines/wecare-program-guidelines-nov-2026.pdf",
  /**
   * The two Section 7.C forms, served from `public/forms/`. They are the only way to
   * open a formal Dispute or Appeal: the Guidelines do not recognise one raised by
   * phone or chat, so these sit on the Contact page beside the ordinary enquiry form
   * rather than being buried in a guidelines appendix.
   */
  formDispute: "/forms/dispute-form-df-01.pdf",
  formAppeal: "/forms/appeal-form-af-01.pdf",
  /** The WeCare plan page. */
  wecare: "/plans/wecare",
  /**
   * The Conditional Outpatient Benefit's own pages, which live outside this app on
   * the same domain — hence absolute URLs and a new tab rather than `href()`.
   * `cobGuideline` is the benefit's terms; `cobUtilisation` is the usage report that
   * sits alongside the monthly sharing report on the Transparency page.
   */
  cobGuideline: "https://www.wekongsi.com/outpatient/guideline/index.html",
  cobUtilisation: "https://www.wekongsi.com/outpatient/guideline/utilisation.html",
  facebook: "https://www.facebook.com/wekongsi.health",
  instagram: "https://www.instagram.com/wekongsi",
  linkedin: "https://www.linkedin.com/company/wekongsi",
  email: "info@wekongsi.com",
  phone: "+60 10-876 8760",
  phoneHref: "tel:+60108768760",
  /**
   * The WeCare clinical hotline, run by MiCare — a different number from the one
   * above, and deliberately so: anything to do with a doctor, a prescription, a panel
   * clinic or the per-episode cap goes here, and anything to do with the membership
   * itself goes to We Kongsi customer service on `phone`.
   */
  micare: "1800 88 7940",
  micareHref: "tel:1800887940",
};

export const SITE_URL = "https://www.wekongsi.com";
