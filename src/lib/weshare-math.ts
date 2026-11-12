/**
 * The arithmetic behind the WeShare page's two calculators.
 *
 * Kept as pure functions, separate from the components, for two reasons: the rules are
 * claims about members' money and deserve tests, and the same numbers appear in more
 * than one place on the page. See `weshare-math.test.ts`.
 *
 * Every rule here comes from the Program Guidelines as reflected in `programFacts`:
 * the monthly share is the month's approved bills divided across active members and
 * capped; co-share is an age-banded percentage of the approved bill, capped per
 * admission, and waived entirely at government hospitals.
 */

/** Monthly inpatient sharing cap, per member, in ringgit. */
export const SHARING_CAP = 60;

/** The member's own portion of an approved inpatient bill, capped per admission. */
export const CO_SHARE_CAP = 500;

export type AgeBand = "0-5" | "6-45" | "46+";

/** Co-share rate by age band, as a fraction of the approved bill. */
export const CO_SHARE_RATES: Record<AgeBand, number> = {
  "0-5": 0.25,
  "6-45": 0.1,
  "46+": 0.2,
};

export type ShareResult = {
  /** Bills divided across active members, before the cap is applied. */
  rawShare: number;
  /** What the member actually shares this month. */
  perMember: number;
  /** True when the division came out above the cap. */
  capped: boolean;
  /** Per member, the part of the raw share the cap held back. */
  carriedPerMember: number;
  /** Across every active member — the month's total carried forward. */
  carriedTotal: number;
};

/**
 * What one member shares in a month.
 *
 * A month with no approved bills costs nothing: there is no floor, only a ceiling.
 * Anything the cap holds back is carried forward rather than written off, which is why
 * `carried*` is returned rather than discarded.
 */
export function monthlyShare(
  approvedBills: number,
  activeMembers: number,
  cap: number = SHARING_CAP,
): ShareResult {
  // No members means nothing to divide by — not an error, just nothing shared.
  if (!Number.isFinite(activeMembers) || activeMembers <= 0 || approvedBills <= 0) {
    return { rawShare: 0, perMember: 0, capped: false, carriedPerMember: 0, carriedTotal: 0 };
  }
  const rawShare = approvedBills / activeMembers;
  const perMember = Math.min(rawShare, cap);
  const carriedPerMember = Math.max(0, rawShare - cap);
  return {
    rawShare,
    perMember,
    capped: rawShare > cap,
    carriedPerMember,
    carriedTotal: carriedPerMember * activeMembers,
  };
}

export type CoShareResult = {
  /** The age-banded percentage applied, as a fraction. */
  rate: number;
  /** The member's portion before the per-admission cap. */
  rawCoShare: number;
  /** What the member actually pays. */
  memberPays: number;
  /** What the community shares — the rest of the approved bill. */
  communityShares: number;
  /** True when the per-admission cap reduced what the member pays. */
  capped: boolean;
  /** True when this was waived because it is a government hospital. */
  waived: boolean;
};

/**
 * The member's own portion of an approved inpatient bill.
 *
 * A government hospital admission carries no co-share at all, so the switch short-
 * circuits the whole calculation rather than multiplying by zero — the distinction
 * matters for the line of explanation the widget shows.
 */
export function coShare(
  approvedBill: number,
  band: AgeBand,
  governmentHospital = false,
  cap: number = CO_SHARE_CAP,
): CoShareResult {
  const rate = CO_SHARE_RATES[band];
  const bill = Math.max(0, approvedBill);

  if (governmentHospital) {
    return { rate, rawCoShare: 0, memberPays: 0, communityShares: bill, capped: false, waived: true };
  }

  const rawCoShare = bill * rate;
  const memberPays = Math.min(rawCoShare, cap);
  return {
    rate,
    rawCoShare,
    memberPays,
    communityShares: bill - memberPays,
    capped: rawCoShare > cap,
    waived: false,
  };
}

/** The age band a given age falls into. */
export function bandForAge(age: number): AgeBand {
  if (age <= 5) return "0-5";
  if (age <= 45) return "6-45";
  return "46+";
}
