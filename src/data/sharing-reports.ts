/**
 * Every monthly sharing report, read out of the PDFs in `Sharing Report/`.
 *
 * Three report templates ship different columns across the years, so each row was
 * matched to its own labels and then checked against the arithmetic the report states
 * itself: total shared = active members x per-member share. Rows where the stated
 * active count disagreed with that identity were corrected to the arithmetic.
 *
 * `active` is the count past the 90-day waiting period — the members who actually
 * share a given month, and the denominator behind `perMember`.
 *
 * `pdf` is set only for the months whose file ships in `public/reports`. Older months
 * still carry their figures; they simply have nothing to download yet.
 */
export type SharingReport = {
  id: string;
  year: number;
  month: number;
  /** Everyone enrolled, including those still inside the waiting period. */
  members: number;
  /** Members past the 90-day waiting period, who share this month's approved cost. */
  active: number;
  /** Hospitalisation cases approved and shared in the period. */
  cases: number;
  /** Total approved medical cost shared, in ringgit. */
  cost: number;
  /** What each active member paid, in ringgit. */
  perMember: number;
  /** Total collected from members, in ringgit. */
  shared: number;
  pdf: string | null;
};

export const sharingReports: SharingReport[] = [
  { id: "2023-09", year: 2023, month: 9, members: 930, active: 675, cases: 1, cost: 38650.95, perMember: 50.0, shared: 33750.0, pdf: null },
  { id: "2023-10", year: 2023, month: 10, members: 983, active: 726, cases: 1, cost: 2465.96, perMember: 10.15, shared: 7368.9, pdf: null },
  { id: "2023-11", year: 2023, month: 11, members: 973, active: 766, cases: 3, cost: 21432.5, perMember: 27.98, shared: 21432.68, pdf: null },
  { id: "2023-12", year: 2023, month: 12, members: 1447, active: 813, cases: 1, cost: 8484.1, perMember: 10.44, shared: 8487.72, pdf: null },
  { id: "2024-01", year: 2024, month: 1, members: 1548, active: 849, cases: 1, cost: 4683.05, perMember: 5.52, shared: 4686.48, pdf: null },
  { id: "2024-02", year: 2024, month: 2, members: 1618, active: 886, cases: 5, cost: 4447.05, perMember: 5.02, shared: 4447.72, pdf: null },
  { id: "2024-03", year: 2024, month: 3, members: 1618, active: 1201, cases: 2, cost: 45792.98, perMember: 38.13, shared: 45794.13, pdf: null },
  { id: "2024-04", year: 2024, month: 4, members: 1554, active: 1163, cases: 4, cost: 48684.92, perMember: 41.86, shared: 48683.18, pdf: null },
  { id: "2024-05", year: 2024, month: 5, members: 1460, active: 1062, cases: 5, cost: 43623.76, perMember: 41.08, shared: 43626.96, pdf: null },
  { id: "2024-06", year: 2024, month: 6, members: 1522, active: 1153, cases: 4, cost: 34644.74, perMember: 30.05, shared: 34647.65, pdf: null },
  { id: "2024-07", year: 2024, month: 7, members: 1625, active: 1151, cases: 6, cost: 30096.04, perMember: 26.14, shared: 30084.14, pdf: null },
  { id: "2024-08", year: 2024, month: 8, members: 1840, active: 1254, cases: 12, cost: 55593.79, perMember: 44.34, shared: 55602.36, pdf: null },
  { id: "2024-09", year: 2024, month: 9, members: 2018, active: 1319, cases: 6, cost: 44830.81, perMember: 33.99, shared: 44832.81, pdf: null },
  { id: "2024-10", year: 2024, month: 10, members: 2051, active: 1439, cases: 4, cost: 67206.25, perMember: 46.7, shared: 67201.3, pdf: null },
  { id: "2024-11", year: 2024, month: 11, members: 2164, active: 1582, cases: 7, cost: 66395.56, perMember: 41.97, shared: 66402.24, pdf: null },
  { id: "2024-12", year: 2024, month: 12, members: 2280, active: 1653, cases: 5, cost: 71647.92, perMember: 43.34, shared: 71641.02, pdf: null },
  { id: "2025-01", year: 2025, month: 1, members: 2465, active: 1679, cases: 17, cost: 67004.41, perMember: 39.91, shared: 67008.89, pdf: null },
  { id: "2025-02", year: 2025, month: 2, members: 2577, active: 1793, cases: 3, cost: 80202.04, perMember: 44.73, shared: 80200.89, pdf: null },
  { id: "2025-03", year: 2025, month: 3, members: 2704, active: 1930, cases: 15, cost: 84479.65, perMember: 43.77, shared: 84476.1, pdf: null },
  { id: "2025-04", year: 2025, month: 4, members: 2702, active: 2057, cases: 6, cost: 46710.09, perMember: 22.71, shared: 46714.47, pdf: null },
  { id: "2025-05", year: 2025, month: 5, members: 3125, active: 2214, cases: 14, cost: 102616.15, perMember: 46.35, shared: 102618.9, pdf: null },
  { id: "2025-06", year: 2025, month: 6, members: 3432, active: 2298, cases: 11, cost: 99905.9, perMember: 43.48, shared: 99917.04, pdf: null },
  { id: "2025-07", year: 2025, month: 7, members: 3910, active: 2411, cases: 6, cost: 44761.12, perMember: 18.56, shared: 44748.16, pdf: null },
  { id: "2025-08", year: 2025, month: 8, members: 4646, active: 2819, cases: 7, cost: 89433.97, perMember: 31.73, shared: 89446.87, pdf: null },
  { id: "2025-09", year: 2025, month: 9, members: 5700, active: 3183, cases: 8, cost: 151794.36, perMember: 47.69, shared: 151792.32, pdf: null },
  { id: "2025-10", year: 2025, month: 10, members: 6023, active: 3608, cases: 19, cost: 169018.06, perMember: 46.84, shared: 168998.72, pdf: null },
  { id: "2025-11", year: 2025, month: 11, members: 6550, active: 4199, cases: 14, cost: 204825.15, perMember: 48.78, shared: 204827.22, pdf: "/reports/sharing-record-nov-2025.pdf" },
  { id: "2025-12", year: 2025, month: 12, members: 6715, active: 5044, cases: 21, cost: 249055.53, perMember: 49.37, shared: 249022.28, pdf: "/reports/sharing-record-dec-2025.pdf" },
  { id: "2026-01", year: 2026, month: 1, members: 7230, active: 5249, cases: 16, cost: 251052.5, perMember: 47.83, shared: 251059.67, pdf: "/reports/sharing-record-jan-2026.pdf" },
  { id: "2026-02", year: 2026, month: 2, members: 7426, active: 5633, cases: 53, cost: 444542.25, perMember: 50.0, shared: 281650.0, pdf: "/reports/sharing-record-feb-2026.pdf" },
  { id: "2026-03", year: 2026, month: 3, members: 7836, active: 5737, cases: 46, cost: 431286.66, perMember: 50.0, shared: 286850.0, pdf: "/reports/sharing-record-mar-2026.pdf" },
  { id: "2026-04", year: 2026, month: 4, members: 7726, active: 6094, cases: 26, cost: 401721.39, perMember: 50.0, shared: 304700.0, pdf: "/reports/sharing-record-april-2026.pdf" },
  { id: "2026-05", year: 2026, month: 5, members: 8002, active: 6605, cases: 49, cost: 443729.07, perMember: 50.0, shared: 330250.0, pdf: "/reports/sharing-record-may-2026.pdf" },
  { id: "2026-06", year: 2026, month: 6, members: 7870, active: 6802, cases: 37, cost: 515210.44, perMember: 50.0, shared: 340100.0, pdf: "/reports/sharing-record-june-2026.pdf" },
  { id: "2026-07", year: 2026, month: 7, members: 7335, active: 6468, cases: 63, cost: 560246.36, perMember: 60.0, shared: 388080.0, pdf: "/reports/sharing-record-july-2026.pdf" },
  { id: "2026-08", year: 2026, month: 8, members: 7088, active: 6453, cases: 75, cost: 543358.5, perMember: 60.0, shared: 387180.0, pdf: "/reports/sharing-record-aug-2026.pdf" },
  { id: "2026-09", year: 2026, month: 9, members: 6940, active: 6446, cases: 40, cost: 387825.97, perMember: 60.0, shared: 386670.0, pdf: "/reports/sharing-record-sept-2026.pdf" },
  { id: "2026-10", year: 2026, month: 10, members: 6691, active: 6274, cases: 42, cost: 380527.94, perMember: 60.0, shared: 376440.0, pdf: "/reports/sharing-record-oct-2026.pdf" },
  { id: "2026-11", year: 2026, month: 11, members: 6485, active: 6078, cases: 53, cost: 367215.07, perMember: 60.0, shared: 364680.0, pdf: "/reports/sharing-record-nov-2026.pdf" },
];

/** The newest report — what the Transparency page opens on. */
export const latestReport = sharingReports[sharingReports.length - 1];

/** Programme totals since sharing began, summed from the reports above. */
export const sharingTotals = {
  months: sharingReports.length,
  cost: sharingReports.reduce((n, r) => n + r.cost, 0),
  cases: sharingReports.reduce((n, r) => n + r.cases, 0),
};

export const MONTH_SHORT = ["", "Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

export const MONTH_LONG = ["", "January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

/**
 * The month a report is shared in — which is the month the report is named for.
 *
 * This used to add a month, on the reasoning that the programme settles in arrears and
 * October's cases are what members contribute towards in November. The reports say
 * otherwise, and say it on their own first page: "SHARING REPORT NOVEMBER 2026 /
 * Sharing period: 07 Oct 2026 to 06 Nov 2026". A report is named for the month its
 * period *ends* in, the deduction falls on the 7th, and so the arrears are already
 * inside the name. Adding a month to it counted them twice, and the page ended up
 * headed "Sharing for November" over a lede reading "the October 2026 sharing report".
 *
 * Kept as a function rather than inlined because the page titles itself by it, and
 * because the relationship is a fact about the programme worth stating once.
 */
export const sharingMonthOf = (r: SharingReport) => ({ year: r.year, month: r.month });

/** The report before this one, for the month-on-month change. Null for the first. */
export const previousReport = (r: SharingReport): SharingReport | null =>
  sharingReports[sharingReports.findIndex((x) => x.id === r.id) - 1] ?? null;
