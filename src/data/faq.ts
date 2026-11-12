/**
 * The shape of every question set on the site.
 *
 * Only the structure lives here — how many groups, in what order, and how many
 * questions each holds. The text is translation keys under the set's own namespace
 * (`<ns>.<id>.label`, `<ns>.<id>.q1`, `<ns>.<id>.a1` …), so the copy stays in
 * `en.json` with everything else.
 *
 * The counts are fixed because the copy is. A count that is too high renders a key
 * rather than failing, so `npm run i18n:check` is what actually catches a mismatch:
 * every key these counts imply is referenced in the source and must exist.
 *
 * They are also deliberately short. This is a public page, and the Program Guidelines
 * linked from each plan are where the detail belongs — an FAQ that reproduces them is
 * one nobody reads.
 */
export type FaqGroup = {
  /** Key segment under the set's namespace, and the tab's DOM id. */
  id: string;
  /** How many question/answer pairs the group holds. */
  count: number;
};

/** The WeShare plan page — everything specific to inpatient cost-sharing. */
export const weshareFaq: FaqGroup[] = [
  { id: "join", count: 3 },
  { id: "pay", count: 3 },
  { id: "wait", count: 2 },
  { id: "share", count: 3 },
  { id: "care", count: 2 },
  { id: "stop", count: 2 },
];

/** The WeCare plan page — everything specific to the outpatient subscription. */
export const wecareFaq: FaqGroup[] = [
  { id: "basics", count: 3 },
  { id: "episodes", count: 3 },
  { id: "using", count: 3 },
  { id: "covered", count: 3 },
  { id: "pay", count: 3 },
];

/**
 * The FAQ page — the questions someone asks before they have chosen a plan.
 *
 * Deliberately general: what the programme is, how the two plans differ, how to join
 * and who holds the money. Anything that only matters once you are on a particular
 * plan belongs on that plan's page, not here.
 */
export const generalFaq: FaqGroup[] = [
  { id: "about", count: 3 },
  { id: "plans", count: 3 },
  { id: "join", count: 3 },
  { id: "money", count: 3 },
  { id: "trust", count: 3 },
  { id: "help", count: 3 },
];
