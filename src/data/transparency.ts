/**
 * The published sharing report, carried over verbatim from the existing wekongsi.com
 * transparency page.
 *
 * Every figure here is a public claim about member money, so none of it is generated,
 * rounded or extrapolated — it is transcribed. `period` is stored as a plain string
 * because it is the label of a published report, not a date to be reformatted per locale.
 *
 * NOTE FOR MAINTAINERS: this report covers April 2025 and counts 1,847 active members,
 * while the homepage counters in `src/data/site.ts` state 7,055 total members. Both
 * numbers came from the source site as-is. Refresh this file when the next monthly
 * report is published so the two stop disagreeing.
 */

export const latestReport = {
  period: "April 2025",
  periodRange: "1 April 2025 – 30 April 2025",
  totalSharing: 78_800,
  changeVsPrevious: "+8.2%",
  previousMonth: "March 2025",
  hospitalCases: 14,
  hospitalValue: 56_700,
  clinicCases: 87,
  clinicValue: 22_100,
  averagePerMember: 42.66,
  activeMembers: 1_847,
  contributionsReceived: 131_350,
  adminAndOperations: 15_762,
  addedToPool: 115_588,
  poolBalance: 287_440,
  approvalRate: "98.1%",
  casesApproved: 101,
  casesSubmitted: 103,
} as const;

export const caseBreakdown = [
  { labelKey: "tr.cases.inpatient", cases: 8, amount: 38_200 },
  { labelKey: "tr.cases.daySurgery", cases: 4, amount: 12_900 },
  { labelKey: "tr.cases.emergency", cases: 2, amount: 5_600 },
  { labelKey: "tr.cases.specialist", cases: 22, amount: 8_800 },
  { labelKey: "tr.cases.panelClinic", cases: 65, amount: 13_300 },
] as const;

export type ArchiveEntry = {
  id: string;
  /** A month label, or a year for the annual report. */
  period: string;
  annualYear?: number;
  cases: number;
  members: number;
  /** Annual entries quote an average member count rather than a point-in-time one. */
  averageMembers?: boolean;
  amount: number;
};

export const reportArchive: ArchiveEntry[] = [
  { id: "2025-04", period: "April 2025", cases: 101, members: 1_847, amount: 78_800 },
  { id: "2025-03", period: "March 2025", cases: 94, members: 1_821, amount: 72_850 },
  { id: "2025-02", period: "February 2025", cases: 89, members: 1_790, amount: 69_300 },
  { id: "2025-01", period: "January 2025", cases: 82, members: 1_755, amount: 65_200 },
  { id: "2024-12", period: "December 2024", cases: 98, members: 1_720, amount: 71_400 },
  { id: "2024-11", period: "November 2024", cases: 91, members: 1_695, amount: 68_900 },
  { id: "2024-annual", period: "", annualYear: 2024, cases: 1_024, members: 1_240, averageMembers: true, amount: 761_200 },
];

/** The independent partners and the role each one holds the programme to. */
export const governance = [
  { id: "emas", name: "eMAS", roleKey: "ab.p1.role", descKey: "tr.gov.emas" },
  { id: "bayes", name: "Bayes Actuarial Solutions", roleKey: "ab.p5.role", descKey: "tr.gov.bayes" },
  { id: "afsha", name: "Afsha Shariah Advisory", roleKey: "ab.p4.role", descKey: "tr.gov.afsha" },
  { id: "palladium", name: "Palladium Trustee", roleKey: "ab.p2.role", descKey: "tr.gov.palladium" },
  { id: "curlec", name: "Curlec", roleKey: "ab.p3.role", descKey: "tr.gov.curlec" },
  { id: "heydoc", name: "HEYDOC Health", roleKey: "ab.p6.role", descKey: "tr.gov.heydoc" },
] as const;
