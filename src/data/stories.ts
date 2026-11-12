/**
 * Stories — the content hub's model, and the editorial plan behind it.
 *
 * This file is both the data the site renders and the marketing team's running list.
 * Every planned article has an entry; `status` decides whether it is a page or a note
 * to self. Only `published` entries get a route, a sitemap line, a card or a filter —
 * a `draft` is invisible to visitors and exists here so the plan lives next to the
 * thing it plans.
 *
 * **Nothing is invented.** Where an article's facts come from the company's own
 * published material — the certificate's own dates, the sharing reports, the panel
 * lists, the members' own testimonials — it is written and published. Where it needs a
 * photograph nobody has supplied, findings nobody has collected, or clinical review
 * nobody has done, it is a draft with `needs` saying exactly what is missing. That is
 * the instruction in the brief and it is also the only honest way to run this: a blog
 * that fills its gaps with plausible text is worse than a blog with gaps.
 *
 * ## Adding an article
 *
 * 1. Add the entry below, with `status: "draft"` and `needs` while it is being worked on.
 * 2. Add its copy keys to `src/translations/en.json` (`st.<id>.t`, `.d`, `.body`, `.alt`).
 * 3. Drop the images in `public/images/`.
 * 4. Flip `status` to `"published"`. The route, sitemap entry, filters, section
 *    listings and homepage preview all follow on their own.
 */

export type StoryCategory =
  | "community"
  | "partnerships"
  | "member"
  | "governance"
  | "programme"
  | "agents"
  | "health";

/**
 * Every category the model knows, in the order the filters offer them.
 *
 * The full taxonomy, not the list a visitor sees: the index only renders a filter for
 * a category that has a published article in it, so a tab can never lead to an empty
 * page. Publish the first article in a category and its filter appears.
 */
export const STORY_CATEGORIES: readonly StoryCategory[] = [
  "community",
  "partnerships",
  "member",
  "governance",
  "programme",
  "agents",
  "health",
];

export type Story = {
  /** Also the URL: /stories/<slug>. Changing it breaks a published link. */
  slug: string;
  category: StoryCategory;
  /**
   * `published` renders; `draft` does not and has no route. A draft is the plan, and
   * `needs` is what stands between it and publication.
   */
  status: "published" | "draft";
  /** Plain English, for whoever picks the draft up. Never rendered. */
  needs?: string[];
  /** ISO, year-month or full date. Display and sort; omitted when not known. */
  date?: string;
  titleKey: string;
  excerptKey: string;
  /** List-valued key holding the body as paragraphs — see `tList`. */
  bodyKey?: string;
  cover?: string;
  coverAltKey?: string;
  /**
   * How the cover is framed. Default `photo`, which fills the frame and crops.
   *
   * The other two must never be cropped, for the same reason: they carry type.
   * `artwork` is a designed graphic — a launch key art with a logo and a headline
   * in it — and loses its headline the moment a frame crops it. `document` is a
   * portrait scan, such as a certificate, which has to be read.
   */
  coverFit?: "photo" | "artwork" | "document";
  gallery?: { src: string; altKey: string }[];
  /** A member's own video on the We Kongsi channel. */
  video?: string;
  /** Byline. Defaults to the team when absent. */
  authorKey?: string;
  /** Overrides the <title> and meta description; falls back to title and excerpt. */
  seoTitleKey?: string;
  seoDescKey?: string;
  /** The one post the index leads with. Exactly one published entry should carry it. */
  featured?: boolean;
};

export const stories: Story[] = [
  /* ---------------------------------------------------------------------
   * A. Community & events
   * ------------------------------------------------------------------ */
  {
    slug: "kongsi-sihat-2025",
    category: "community",
    status: "published",
    date: "2025-10",
    titleKey: "st.kongsisihat.t",
    excerptKey: "st.kongsisihat.d",
    bodyKey: "st.kongsisihat.body",
    cover: "/images/story-kongsisihat.jpg",
    coverAltKey: "st.kongsisihat.alt",
    gallery: [{ src: "/images/story-heal.jpg", altKey: "st.kongsisihat.alt2" }],
  },
  {
    slug: "three-years-of-wekongsi",
    category: "community",
    status: "published",
    date: "2026-04-18",
    titleKey: "st.anniversary.t",
    excerptKey: "st.anniversary.d",
    bodyKey: "st.anniversary.body",
    cover: "/images/story-anniversary.jpg",
    coverAltKey: "st.anniversary.alt",
    gallery: [{ src: "/images/team-group.jpg", altKey: "st.anniversary.alt2" }],
  },
  {
    slug: "inside-the-agent-community",
    category: "agents",
    status: "draft",
    date: "2026-09-03",
    needs: [
      "Photographs from the 3 September 2026 agent bonding session.",
      "Confirmation of the venue and what the session covered.",
    ],
    titleKey: "st.agentcommunity.t",
    excerptKey: "st.agentcommunity.d",
  },
  {
    slug: "culture-of-healthcare-awareness",
    category: "community",
    status: "draft",
    needs: [
      "Which awareness initiatives to cover, and when each ran.",
      "Photographs, and a decision on how the public can take part.",
    ],
    titleKey: "st.awareness.t",
    excerptKey: "st.awareness.d",
  },

  /* ---------------------------------------------------------------------
   * B. Partnerships & collaborations
   * ------------------------------------------------------------------ */
  {
    slug: "heydoc-health-partnership",
    category: "partnerships",
    status: "published",
    /* The date on the ceremony backdrop in the cover photograph. */
    date: "2026-05-18",
    titleKey: "st.heydoc.t",
    excerptKey: "st.heydoc.d",
    bodyKey: "st.heydoc.body",
    cover: "/images/story-heydoc.jpg",
    coverAltKey: "st.heydoc.alt",
  },
  {
    slug: "healthcare-network-partnerships",
    category: "partnerships",
    status: "published",
    titleKey: "st.network.t",
    excerptKey: "st.network.d",
    bodyKey: "st.network.body",
    cover: "/images/coverage-clinic.jpg",
    coverAltKey: "st.network.alt",
  },
  {
    slug: "blockchain-for-good-hackathon",
    category: "partnerships",
    status: "draft",
    date: "2025-07",
    needs: [
      "A photograph from the Joint Fund Hackathon.",
      "Written confirmation of the Top 3 placing from the organisers.",
    ],
    titleKey: "st.hackathon.t",
    excerptKey: "st.hackathon.d",
  },
  {
    slug: "wekongsi-in-copenhagen",
    category: "partnerships",
    status: "draft",
    date: "2025-11",
    needs: [
      "Photographs from Copenhagen.",
      "The name of the event and what was presented.",
    ],
    titleKey: "st.copenhagen.t",
    excerptKey: "st.copenhagen.d",
  },

  /* ---------------------------------------------------------------------
   * C. Member stories — every one built on a testimonial the member has
   *    already given and the site already publishes.
   *
   *    Newest first, like the testimonial carousel they are drawn from.
   *    None of them carries a date, so this order is the order the member
   *    row renders in; a new story goes at the top of the section.
   * ------------------------------------------------------------------ */
  {
    slug: "an-ordinary-day-that-changed-everything",
    category: "member",
    status: "published",
    titleKey: "st.arhuzaim.t",
    excerptKey: "st.arhuzaim.d",
    bodyKey: "st.arhuzaim.body",
    cover: "/images/member-arhuzaim.jpg",
    coverAltKey: "st.arhuzaim.alt",
    video: "https://www.youtube.com/shorts/CHB6hUVlBz8",
  },
  {
    slug: "the-rider-who-never-thought-it-would-happen",
    category: "member",
    status: "published",
    titleKey: "st.rider.t",
    excerptKey: "st.rider.d",
    bodyKey: "st.rider.body",
    cover: "/images/member-rider.jpg",
    coverAltKey: "st.rider.alt",
    video: "https://www.youtube.com/shorts/cCrNxSwugn4",
  },
  {
    slug: "a-family-trip-that-took-a-turn",
    category: "member",
    status: "published",
    titleKey: "st.family.t",
    excerptKey: "st.family.d",
    bodyKey: "st.family.body",
    cover: "/images/member-family.jpg",
    coverAltKey: "st.family.alt",
    video: "https://www.youtube.com/shorts/-N2hc3zHGew",
  },
  {
    slug: "when-heart-pain-led-to-admission",
    category: "member",
    status: "published",
    titleKey: "st.king.t",
    excerptKey: "st.king.d",
    bodyKey: "st.king.body",
    cover: "/images/member-king.jpg",
    coverAltKey: "st.king.alt",
    video: "https://youtu.be/NqCyEpq_F_I",
  },
  {
    slug: "an-accident-on-the-way-to-work",
    category: "member",
    status: "published",
    titleKey: "st.albari.t",
    excerptKey: "st.albari.d",
    bodyKey: "st.albari.body",
    cover: "/images/member-albari.jpg",
    coverAltKey: "st.albari.alt",
    /* The one member video published to Facebook rather than YouTube. */
    video: "https://www.facebook.com/share/v/1S2THJpk2F/",
  },
  {
    slug: "a-surgery-and-the-community",
    category: "member",
    status: "published",
    titleKey: "st.honey.t",
    excerptKey: "st.honey.d",
    bodyKey: "st.honey.body",
    cover: "/images/member-honey.jpg",
    coverAltKey: "st.honey.alt",
    video: "https://www.youtube.com/watch?v=L8HD1zJEHjc",
  },
  {
    slug: "support-when-it-matters-most",
    category: "member",
    status: "published",
    titleKey: "st.xinmin.t",
    excerptKey: "st.xinmin.d",
    bodyKey: "st.xinmin.body",
    cover: "/images/member-xinmin.jpg",
    coverAltKey: "st.xinmin.alt",
    video: "https://www.youtube.com/watch?v=u2ZxoJHv0oc",
  },
  {
    slug: "wekongsi-mantap",
    category: "member",
    status: "published",
    titleKey: "st.mantap.t",
    excerptKey: "st.mantap.d",
    bodyKey: "st.mantap.body",
    cover: "/images/member-father.jpg",
    coverAltKey: "st.mantap.alt",
    video: "https://www.youtube.com/watch?v=9u0jeksr9Ew",
  },

  /* ---------------------------------------------------------------------
   * D. Trust, governance & transparency
   * ------------------------------------------------------------------ */
  {
    slug: "shariah-compliance-certification",
    category: "governance",
    status: "published",
    date: "2026-01-08",
    titleKey: "st.shariah.t",
    excerptKey: "st.shariah.d",
    bodyKey: "st.shariah.body",
    cover: "/images/cert-shariah-2026.jpg",
    coverAltKey: "st.shariah.alt",
    coverFit: "document",
  },
  {
    slug: "where-the-communitys-money-goes",
    category: "governance",
    status: "published",
    titleKey: "st.money.t",
    excerptKey: "st.money.d",
    bodyKey: "st.money.body",
    cover: "/images/viz-sharing.jpg",
    coverAltKey: "st.money.alt",
  },
  {
    slug: "monthly-sharing-reports",
    category: "governance",
    status: "published",
    titleKey: "st.reports.t",
    excerptKey: "st.reports.d",
    bodyKey: "st.reports.body",
    cover: "/images/viz-report.jpg",
    coverAltKey: "st.reports.alt",
  },

  /* ---------------------------------------------------------------------
   * E. Programme launches & updates
   * ------------------------------------------------------------------ */
  {
    slug: "introducing-wecare",
    category: "programme",
    status: "published",
    date: "2026-11-01",
    titleKey: "st.wecare.t",
    excerptKey: "st.wecare.d",
    bodyKey: "st.wecare.body",
    cover: "/images/story-wecare.jpg",
    coverAltKey: "st.wecare.alt",
    coverFit: "artwork",
    featured: true,
  },
  {
    slug: "understanding-cob",
    category: "programme",
    status: "published",
    titleKey: "st.cob.t",
    excerptKey: "st.cob.d",
    bodyKey: "st.cob.body",
    cover: "/images/wecare-teleconsult.jpg",
    coverAltKey: "st.cob.alt",
  },
  {
    slug: "digital-onboarding",
    category: "programme",
    status: "draft",
    date: "2026-10-07",
    needs: [
      "Screenshots of the onboarding system as it went live.",
      "A list of what actually changed for a new member.",
    ],
    titleKey: "st.onboarding.t",
    excerptKey: "st.onboarding.d",
  },
  {
    slug: "whats-new-in-wekongsi",
    category: "programme",
    status: "published",
    date: "2026-11",
    titleKey: "st.whatsnew.t",
    excerptKey: "st.whatsnew.d",
    bodyKey: "st.whatsnew.body",
    cover: "/images/life-family.jpg",
    coverAltKey: "st.whatsnew.alt",
  },

  /* ---------------------------------------------------------------------
   * F. Agent & community development
   * ------------------------------------------------------------------ */
  {
    slug: "empowering-our-agents",
    category: "agents",
    status: "draft",
    needs: [
      "What the training programme covers, and how often it runs.",
      "Photographs from a session.",
    ],
    titleKey: "st.agenttraining.t",
    excerptKey: "st.agenttraining.d",
  },
  {
    slug: "behind-the-scenes-agents",
    category: "agents",
    status: "draft",
    needs: [
      "Agents willing to be named and photographed, with their consent on file.",
    ],
    titleKey: "st.agentbts.t",
    excerptKey: "st.agentbts.d",
  },
  {
    slug: "agent-voice-survey-2026",
    category: "agents",
    status: "draft",
    date: "2026-10-15",
    needs: [
      "The survey findings. The brief is explicit that these are published only once collected.",
      "Response rate, and which findings are for publication.",
    ],
    titleKey: "st.agentsurvey.t",
    excerptKey: "st.agentsurvey.d",
  },
  {
    slug: "wecare-agent-briefing",
    category: "agents",
    status: "draft",
    date: "2026-10-31",
    needs: ["What the briefing covered, and a screenshot or photograph from the session."],
    titleKey: "st.agentbriefing.t",
    excerptKey: "st.agentbriefing.d",
  },

  /* ---------------------------------------------------------------------
   * G. Healthcare insights
   *
   * All drafts. The brief requires that medical content be reviewed by a qualified
   * healthcare professional, and no such review has happened — so none of these is
   * published, however straightforward the subject looks.
   * ------------------------------------------------------------------ */
  ...(
    [
      ["why-hospital-bills-are-a-challenge", "st.ins.bills"],
      ["how-medical-cost-sharing-works", "st.ins.howsharing"],
      ["what-happens-when-admitted", "st.ins.admitted"],
      ["why-a-referral-letter-matters", "st.ins.referral"],
      ["before-joining-a-cost-sharing-community", "st.ins.beforejoining"],
      ["hospitalisation-vs-outpatient", "st.ins.inVsOut"],
      ["clinic-or-hospital", "st.ins.clinicOrHospital"],
      ["when-teleconsultation-helps", "st.ins.tele"],
      ["preparing-for-a-hospital-admission", "st.ins.prepare"],
      ["waiting-periods-explained", "st.ins.waiting"],
    ] as const
  ).map(([slug, key]) => ({
    slug,
    category: "health" as const,
    status: "draft" as const,
    needs: [
      "Review and sign-off by a qualified healthcare professional before publication.",
      "A cover image.",
    ],
    titleKey: `${key}.t`,
    excerptKey: `${key}.d`,
  })),
];

/**
 * A story that is actually renderable.
 *
 * The optional fields above are optional because a draft has not got them yet. A
 * published one always has, and saying so in the type is what stops every component
 * downstream from guarding against a cover image that cannot be missing.
 */
export type PublishedStory = Story & {
  status: "published";
  bodyKey: string;
  cover: string;
  coverAltKey: string;
};

const isPublished = (s: Story): s is PublishedStory =>
  s.status === "published" && Boolean(s.bodyKey && s.cover && s.coverAltKey);

/** What visitors can see. Everything downstream reads this, not `stories`. */
export const published = stories.filter(isPublished);

/** The editorial backlog, for whoever is planning the next one. */
export const drafts = stories.filter((s) => s.status === "draft");

/** Newest first; undated posts sink to the back rather than claiming a date. */
export const storiesByDate: PublishedStory[] = [...published].sort((a, b) =>
  (b.date ?? "").localeCompare(a.date ?? ""),
);

export const featuredStory = published.find((s) => s.featured) ?? storiesByDate[0];

/** The categories that have something published in them, in taxonomy order. */
export const activeCategories = STORY_CATEGORIES.filter((c) =>
  published.some((s) => s.category === c),
);

export const byCategory = (category: StoryCategory): PublishedStory[] =>
  storiesByDate.filter((s) => s.category === category);

export const findStory = (slug: string) =>
  published.find((s) => s.slug === slug);

/**
 * Up to three others to read next — same category first, then whatever is newest, so
 * a reader always gets a full row even in a category with one post in it.
 */
export function relatedStories(slug: string, limit = 3): PublishedStory[] {
  const current = findStory(slug);
  if (!current) return storiesByDate.slice(0, limit);

  const sameCategory = storiesByDate.filter(
    (s) => s.slug !== slug && s.category === current.category,
  );
  const rest = storiesByDate.filter((s) => s.slug !== slug && s.category !== current.category);
  return [...sameCategory, ...rest].slice(0, limit);
}

/**
 * A date for display: "June 2026" from `2026-06`, "8 January 2026" from `2026-01-08`.
 *
 * The precision of the stored string is the precision shown — a post the company only
 * knows the month of should not appear to know the day.
 */
export function storyDate(date: string | undefined, locale = "en-MY"): string | null {
  if (!date) return null;
  const [y, m, d] = date.split("-");
  const base = new Date(Number(y), Number(m) - 1, d ? Number(d) : 1);
  return d
    ? base.toLocaleDateString(locale, { day: "numeric", month: "long", year: "numeric" })
    : base.toLocaleDateString(locale, { month: "long", year: "numeric" });
}
