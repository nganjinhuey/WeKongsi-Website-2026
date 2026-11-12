/**
 * Logo walls. Company and hospital names are proper nouns — they are the alt text and are
 * not translated, which is why these live here rather than in the translation files.
 *
 * The hospital list is the same indicative set the Hospital Info page names in text; it is
 * explicitly not the authoritative eMAS panel, and that page says so.
 */
export type Logo = { name: string; src: string };

// Afsha is deliberately absent: the only Afsha asset in the library is the certificate
// document, not a wordmark, and the Trust section already shows that certificate at full
// size. Repeating it here rendered as an illegible grey smudge in the logo row.
export const partnerLogos: Logo[] = [
  { name: "eMAS", src: "/images/partner-emas.jpg" },
  { name: "Palladium Trustee", src: "/images/partner-palladium.jpg" },
  { name: "Curlec by Razorpay", src: "/images/partner-curlec.jpg" },
  { name: "Bayes Actuarial Solutions", src: "/images/partner-bayes.jpg" },
  { name: "HEYDOC Health", src: "/images/partner-heydoc.jpg" },
];

export const hospitalLogos: Logo[] = [
  { name: "Institut Jantung Negara", src: "/images/hospital-ijn.jpg" },
  { name: "Sunway Medical Centre", src: "/images/hospital-sunway.jpg" },
  { name: "Thomson Hospital", src: "/images/hospital-thomson.jpg" },
  { name: "University Malaya Medical Centre", src: "/images/hospital-umsc.jpg" },
  { name: "Penang Adventist Hospital", src: "/images/hospital-adventist.jpg" },
  { name: "ParkCity Medical Centre", src: "/images/hospital-parkcity.jpg" },
  { name: "KPJ Healthcare", src: "/images/hospital-kpj.jpg" },
  { name: "Assunta Hospital", src: "/images/hospital-assunta.jpg" },
  { name: "Lourdes Medical Services", src: "/images/hospital-lourdes.jpg" },
  { name: "Avisena Specialist Hospital", src: "/images/hospital-avisena.jpg" },
  { name: "Pantai Hospitals", src: "/images/hospital-pantai.jpg" },
];
