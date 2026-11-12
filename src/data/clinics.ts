/**
 * The MiCare panel GP list, read from `Clinic Info/MiCare panel GP list (Aso) for
 * Sep '26.xls` (ASO panel, September 2026).
 *
 * **Unlike the hospital panel, this one is not in the bundle.** There are 4,709 clinics
 * against 299 hospitals, and inlining them costs 936 kB of JavaScript that every page on
 * the site would pay for. So the rows are a static JSON file in `public/data/`, fetched
 * once when the directory mounts — 188 kB over the wire, on one page, after the shell has
 * already painted.
 *
 * The file is column-indexed rather than a list of objects: with 4,709 rows, repeating
 * six key names each time cost more than the values themselves, and `Selangor` alone
 * appeared 1,520 times. States and towns are lookup tables; a row holds their indices.
 *
 * Clinic names and addresses are kept exactly as the panel list prints them, including
 * the capitals — they are proper nouns on an official list, and re-casing 4,709 Malaysian
 * clinic names by rule would mangle the ones with initials in them ("KLINIK K.H. ONG").
 * States and towns are a closed vocabulary, so those are re-cased. The list's one typo,
 * a single clinic filed under "TERENGGAU", is corrected to Terengganu.
 *
 * ## Regenerating
 *
 * Replace the spreadsheet, re-run the extractor over it, and update `clinicCounts` below
 * to match the new totals. The counts are constants rather than derived because the hero
 * states them before the data has loaded — deriving them would mean shipping the rows
 * twice, which is the thing this file exists to avoid.
 */

/** One clinic, after decoding. */
export type Clinic = {
  name: string;
  town: string;
  state: string;
  phone: string;
  address: string;
  /** Raw opening hours, e.g. `(MON-FRI): 8.00AM-5.00PM (SAT): 8.00AM-1.00PM`. */
  hours: string;
};

/** The payload's wire shape. A row is `[stateIdx, townIdx, name, address, phone, hours]`. */
type ClinicPayload = {
  source: string;
  states: string[];
  towns: string[];
  rows: [number, number, string, string, string, string][];
};

export const CLINICS_URL = "/data/clinics.json";

/**
 * Stated on the page before the rows arrive, so they cannot be derived from them.
 * Keep in step with the spreadsheet — see "Regenerating" above.
 */
export const clinicCounts = {
  total: 4709,
  states: 16,
  towns: 663,
};

/** The states the panel covers, in the order the filter offers them. */
export const clinicStates = [
  "Johor",
  "Kedah",
  "Kelantan",
  "Kuala Lumpur",
  "Labuan",
  "Melaka",
  "Negeri Sembilan",
  "Pahang",
  "Perak",
  "Perlis",
  "Pulau Pinang",
  "Putrajaya",
  "Sabah",
  "Sarawak",
  "Selangor",
  "Terengganu",
];

/**
 * Fetch and decode the panel.
 *
 * Decoding is a single pass that resolves the two index columns, which is why the
 * directory can hold the whole list in memory and filter it per keystroke without a
 * round trip — 4,709 rows is nothing to filter, and everything to download twice.
 */
export async function loadClinics(signal?: AbortSignal): Promise<Clinic[]> {
  const res = await fetch(CLINICS_URL, { signal });
  if (!res.ok) throw new Error(`clinics: ${res.status}`);
  const data = (await res.json()) as ClinicPayload;

  return data.rows.map(([s, t, name, address, phone, hours]) => ({
    name,
    address,
    phone,
    hours,
    state: data.states[s],
    town: data.towns[t],
  }));
}

/**
 * Split the packed hours string into its day groups.
 *
 * The list writes a week as `(MON-FRI): 8.00AM-5.00PM (SAT-SUN & PH): CLOSED` — one
 * line that is hard to scan and impossible to align in a card. Each `(DAYS): TIME` pair
 * becomes a row. Anything that does not match the pattern is returned whole rather than
 * dropped: it is still the opening hours, just written another way.
 */
export function splitHours(hours: string): { days: string; time: string }[] {
  const out: { days: string; time: string }[] = [];
  const re = /\(([^)]+)\)\s*:?\s*([^(]*)/g;
  let m: RegExpExecArray | null;

  while ((m = re.exec(hours)) !== null) {
    const days = m[1].trim();
    const time = m[2].replace(/^[:\s]+/, "").trim();
    if (days && time) out.push({ days, time });
  }

  return out.length ? out : [{ days: "", time: hours }];
}
