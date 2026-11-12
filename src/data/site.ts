/**
 * Figures and proper nouns carried over verbatim from the existing wekongsi.com build.
 *
 * These are factual claims about the program, so they live in one typed place rather
 * than being retyped into each view — and they are deliberately NOT in the translation
 * files, because a number that differs between languages is a number that is wrong in
 * at least two of them.
 */

/**
 * The headline figures, taken from the published record rather than kept by hand:
 * membership and sharing come from the latest sharing report (Oct 2026) and the sum
 * of all 38 of them, and the hospital count is the e-MAS panel in `hospitals.ts`.
 * Clinic coverage has no published source yet, so it stays as last supplied.
 */
export const communityStats = {
  totalMembers: 6691,
  membersInWaitingPeriod: 417,
  activeMembers: 6274,
  /** Total approved medical cost shared across every monthly report since Sept 2023. */
  sharedAmount: 6337987.89,
  supportedHospitals: 299,
  supportedClinics: 4571,
} as const;

export const programFacts = {
  /** Annual medical cost-sharing limit, in ringgit. */
  annualLimit: 1_000_000,
  /** Monthly inpatient sharing is capped at this amount per member. */
  sharingCap: 60,
  /** Optional Conditional Outpatient Benefit add-on, per month. */
  cobMonthly: 15,
  membershipMonthly: 40,
  membershipQuarterly: 100,
  membershipYearly: 360,
  /** COB support per episode, and episodes allowed per year. */
  cobPerEpisode: 120,
  cobEpisodesPerYear: 8,
  cobConditions: 17,
  waitingPeriodDays: 90,
  panelHospitals: "250+",
} as const;

/**
 * The additional benefits' own limits, in ringgit, keyed to the cov.a1–a5 copy.
 *
 * Figures, so they live here rather than in the translation files — and they are
 * read straight onto the coverage card, where the whole point is that the limit sits
 * beside the benefit rather than buried in a sentence about it.
 */
export const additionalBenefitLimits = {
  a1: 5_000,
  a2: 10_000,
  a3: 10_000,
  a4: 10_000,
  a5: 100_000,
} as const;

/**
 * Who may enrol, and how long each kind of support waits.
 *
 * Figures, so they live here and not in the copy: the entry ages, the waiting periods
 * and the accidental-injury limit are read straight onto the eligibility card and the
 * waiting-period timeline, where the number IS the content. The surrounding phrases are
 * translation keys with `{{min}}` / `{{days}}` / `{{amount}}` placeholders.
 *
 * `commonIllnessDays` is the same 90 days as `programFacts.waitingPeriodDays` and is
 * aliased to it rather than re-typed, so the two can never drift apart.
 */
export const eligibilityFacts = {
  /** Entry age for a *member*, counted on the day of enrolment. */
  entryAgeMin: 5,
  entryAgeMax: 45,
  /**
   * Minimum age to open the account itself — a different thing from the entry age
   * above. The account owner holds the membership and enrols and manages the members
   * under it, so a five-year-old can be a member but cannot be an owner.
   */
  ownerAgeMin: 18,
  /** Accidental injury is eligible from day one, up to this amount. */
  accidentLimit: 10_000,
  commonIllnessDays: programFacts.waitingPeriodDays,
  specifiedIllnessDays: 180,
} as const;

/**
 * The three illustrative months behind the cost-sharing examples on the WeShare page.
 *
 * Figures, so they live here rather than in the copy — the sentences in `cs.ex*` describe
 * these same numbers, and a number that drifts between the two is wrong in one of them.
 * These are illustrations of the mechanism, not published months; the real published
 * figures come from `sharing-reports.ts`.
 */
export const sharingExamples = [
  /** A typical month: the share lands well under the cap. */
  { n: 1, bill: 100_000, members: 8_000, share: 12.5, paid: 12.5 },
  /** A heavy month: the division exceeds the cap, so the cap binds. */
  { n: 2, bill: 800_000, members: 8_000, share: 100, paid: 60 },
  /** A quiet month: nothing approved, so nothing is shared. */
  { n: 3, bill: 0, members: 8_000, share: 0, paid: 0 },
] as const;

export type Testimonial = {
  id: string;
  /** Display name — a proper noun, so it is not translated. */
  name: string;
  /** Translation key for the quote, and for the line under the name. */
  quoteKey: string;
  metaKey: string;
  initials: string;
  image?: string;
  /** Short editorial headline for the story card — summarises the member's own words. */
  headlineKey: string;
  /** Video testimonial, when one has been published for this member. */
  video?: string;
  /** True when that video was shot vertically (1080×1920), so the player matches it. */
  videoPortrait?: boolean;
};

/**
 * Members whose story has a published video carry a `video` URL; the card then offers it
 * to watch. The six text-only testimonials (no `image`) stay in the data for other
 * surfaces — the story carousel is built around a real member photograph.
 *
 * **Newest first.** This list is the running order, so a new testimonial goes at the
 * top. The carousel used to re-sort it to put the videos in front, which made sense
 * when only half the stories had one; now that nearly all of them do, that sort only
 * served to bury the newest arrivals. There is no date on a testimonial to sort by, and
 * adding one would be a field nobody could fill in for the older entries.
 */
export const testimonials: Testimonial[] = [
  { id: "arhuzaim", headlineKey: "ts.h.arhuzaim", name: "Mohd Arhuzaim bin Samijan", quoteKey: "ts.q.arhuzaim", metaKey: "ts.m.arhuzaim", initials: "MA", image: "/images/member-arhuzaim.jpg", video: "https://www.youtube.com/shorts/CHB6hUVlBz8", videoPortrait: true },
  { id: "rider", headlineKey: "ts.h.rider", name: "We Kongsi Member", quoteKey: "ts.q.rider", metaKey: "ts.m.rider", initials: "WK", image: "/images/member-rider.jpg", video: "https://www.youtube.com/shorts/cCrNxSwugn4", videoPortrait: true },
  { id: "king", headlineKey: "ts.h.king", name: "King Khairul", quoteKey: "ts.q.king", metaKey: "ts.m.king", initials: "KK", image: "/images/member-king.jpg", video: "https://youtu.be/NqCyEpq_F_I" },
  /* The only story published to Facebook rather than YouTube. Nothing here can embed
     it, so the card links out to the post — see the watch control in Testimonials. */
  { id: "albari", headlineKey: "ts.h.albari", name: "Muhammad Al-Bari", quoteKey: "ts.q.albari", metaKey: "ts.m.albari", initials: "MA", image: "/images/member-albari.jpg", video: "https://www.facebook.com/share/v/1S2THJpk2F/" },
  { id: "family", headlineKey: "ts.h.family", name: "We Kongsi Member", quoteKey: "ts.q.family", metaKey: "ts.m.family", initials: "WK", image: "/images/member-family.jpg", video: "https://www.youtube.com/shorts/-N2hc3zHGew", videoPortrait: true },
  { id: "xinmin", headlineKey: "ts.h.xinmin", name: "Xin Min", quoteKey: "ts.q.xinmin", metaKey: "ts.m.xinmin", initials: "XM", image: "/images/member-xinmin.jpg", video: "https://www.youtube.com/watch?v=u2ZxoJHv0oc&t=7s" },
  { id: "honey", headlineKey: "ts.h.honey", name: "Honey", quoteKey: "ts.q.honey", metaKey: "ts.m.honey", initials: "H", image: "/images/member-honey.jpg", video: "https://www.youtube.com/watch?v=L8HD1zJEHjc", videoPortrait: true },
  { id: "niena", headlineKey: "ts.h.niena", name: "Niena", quoteKey: "ts.q.niena", metaKey: "ts.m.niena", initials: "N", image: "/images/member-niena.jpg", video: "https://www.youtube.com/watch?v=FLR8F-Ohuj8&t=237s" },
  { id: "syafiq", headlineKey: "ts.h.syafiq", name: "Syafiq", quoteKey: "ts.q.syafiq", metaKey: "ts.m.syafiq", initials: "S", image: "/images/member-syafiq.jpg", video: "https://www.youtube.com/watch?v=u_IKmL7MA5E&t=11s" },
  { id: "ainul", headlineKey: "ts.h.ainul", name: "Ainul & Abdul", quoteKey: "ts.q.ainul", metaKey: "ts.m.ainul", initials: "AA", image: "/images/member-ainul.jpg", video: "https://www.youtube.com/watch?v=9u0jeksr9Ew&t=10s" },
  { id: "hizam", headlineKey: "ts.h.hizam", name: "Mohd Hizam", quoteKey: "ts.q.hizam", metaKey: "ts.m.hizam", initials: "MH", image: "/images/member-hizam.jpg" },
  { id: "maslina", headlineKey: "ts.h.maslina", name: "Puan Maslina", quoteKey: "ts.q.maslina", metaKey: "ts.m.maslina", initials: "PM", image: "/images/member-maslina.jpg" },
  { id: "faridah", headlineKey: "ts.h.faridah", name: "Faridah", quoteKey: "ts.q.faridah", metaKey: "ts.m.faridah", initials: "F" },
  { id: "kalai", headlineKey: "ts.h.kalai", name: "Kalai", quoteKey: "ts.q.kalai", metaKey: "ts.m.kalai", initials: "K" },
  { id: "weijie", headlineKey: "ts.h.weijie", name: "Wei Jie", quoteKey: "ts.q.weijie", metaKey: "ts.m.weijie", initials: "WJ" },
  { id: "suriani", headlineKey: "ts.h.suriani", name: "Suriani", quoteKey: "ts.q.suriani", metaKey: "ts.m.suriani", initials: "S" },
  { id: "daniel", headlineKey: "ts.h.daniel", name: "Daniel", quoteKey: "ts.q.daniel", metaKey: "ts.m.daniel", initials: "D" },
  { id: "hafiz", headlineKey: "ts.h.hafiz", name: "Hafiz", quoteKey: "ts.q.hafiz", metaKey: "ts.m.hafiz", initials: "H" },
];

/** The eight sharing benefits, keyed to the coverage.c1–c8 translation groups. */
export const coverageItems = Array.from({ length: 8 }, (_, i) => ({
  id: `c${i + 1}`,
  amountKey: `coverage.c${i + 1}.amt`,
  titleKey: `coverage.c${i + 1}.t`,
  descKey: `coverage.c${i + 1}.d`,
}));

export type Leader = {
  id: string;
  /** A proper noun — the same in every language. */
  name: string;
  roleKey: string;
  /**
   * Optional, and typed that way deliberately although all seven currently have one:
   * with the array left to infer, `image` became required and the initials fallback
   * in the portrait grid narrowed to `never`. A leader added tomorrow without a
   * photograph should still render, as initials rather than a stock face.
   */
  image?: string;
};

/**
 * Names are proper nouns and stay in one form across languages; only the role is
 * translated. All seven have a studio portrait from the same session — Abu Bakar's
 * was shot full-length and is cropped to the 2:3 the others are framed at.
 */
export const leaders: Leader[] = [
  { id: "chun-sian", name: "Tan Chun Sian", roleKey: "ab.role.ceo", image: "/images/leader-chun-sian.jpg" },
  { id: "lego", name: "Lego Shum Kah Weng", roleKey: "ab.role.cso", image: "/images/leader-lego.jpg" },
  { id: "loh", name: "Loh Chien Sern", roleKey: "ab.role.advisor", image: "/images/leader-loh.jpg" },
  { id: "edward", name: "Edward Chew Jing Yao", roleKey: "ab.role.cto", image: "/images/leader-edward.jpg" },
  { id: "chun-howe", name: "Tan Chun Howe", roleKey: "ab.role.cfo", image: "/images/leader-chun-howe.jpg" },
  { id: "abu-bakar", name: "Abu Bakar Bin Othman", roleKey: "ab.role.trainer", image: "/images/leader-abu-bakar.jpg" },
  { id: "aminuddin", name: "M. Aminuddin Bin Ismail", roleKey: "ab.role.shariah", image: "/images/leader-aminuddin.jpg" },
];

/**
 * The licensed partners behind the programme. Company names are not translated, and
 * neither is a partner's own wordmark — `logo` is the mark as the partner supplies it,
 * on white, so it sits in a card without a cut-out or a recolour.
 */
export const partners = [
  { id: "emas", name: "eMAS", roleKey: "ab.p1.role", descKey: "ab.p1.d", logo: "/images/partner-emas.jpg" },
  { id: "palladium", name: "Palladium Trustee", roleKey: "ab.p2.role", descKey: "ab.p2.d", logo: "/images/partner-palladium.jpg" },
  { id: "curlec", name: "Curlec", roleKey: "ab.p3.role", descKey: "ab.p3.d", logo: "/images/partner-curlec.jpg" },
  { id: "afsha", name: "Afsha Shariah Advisory", roleKey: "ab.p4.role", descKey: "ab.p4.d", logo: "/images/partner-afsha.jpg" },
  { id: "bayes", name: "Bayes Actuarial Solutions", roleKey: "ab.p5.role", descKey: "ab.p5.d", logo: "/images/partner-bayes.jpg" },
  { id: "heydoc", name: "HEYDOC Health", roleKey: "ab.p6.role", descKey: "ab.p6.d", logo: "/images/partner-heydoc.jpg" },
] as const;



/**
 * WeCare — the standalone outpatient subscription.
 *
 * Figures, so they live here and not in the copy: the subscription prices, the per-episode
 * cap and the Care Episode entitlement are read straight onto the pricing cards and the
 * 1 + 1 figure, where the number IS the content. The surrounding phrases are translation
 * keys with `{{amount}}` / `{{count}}` / `{{hours}}` placeholders.
 *
 * Every value is from the WeCare Program Guidelines (November 2026). The monthly
 * equivalent of the annual price and the saving against four quarters are deliberately
 * NOT stored — they are derived where they are shown, so they cannot drift from the two
 * prices they come from.
 */
export const wecareFacts = {
  /** Paid in advance. There is no registration fee and no administration fee. */
  quarterly: 45,
  yearly: 160,
  /** Paid once, when restarting a membership that has been terminated. */
  reactivation: 30,
  /** Every Care Episode is supported up to this amount; the surplus is the member's. */
  perEpisodeCap: 40,
  /** The full year's release, and the largest balance a member can hold at one time. */
  episodesPerYear: 8,
  /** Common acute conditions the plan supports, listed in `wcx.cond.list`. */
  conditions: 21,
  /** Teleconsultation hours — daily, weekends and public holidays included. */
  teleHours: "9am to 10pm",
} as const;


/**
 * The two Program Guidelines, as published in `public/guidelines/`.
 *
 * Both plan pages state a document's length and weight before the reader commits to
 * opening it — a 72-page PDF on a phone connection is worth warning someone about —
 * so these are figures like any other and belong here rather than in the markup.
 *
 * Re-measure both when a document is replaced: `stat -f%z` for the bytes, and the page
 * count from the file itself. Measured on 9 November 2026 as 1.45 MB / 72 pages and
 * 0.54 MB / 17 pages.
 */
export const guidelineDocs = {
  weshare: { pages: 72, size: "1.5 MB" },
  wecare: { pages: 17, size: "0.5 MB" },
} as const;
