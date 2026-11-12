import type { Config } from "tailwindcss";
import tailwindcssAnimate from "tailwindcss-animate";
import typography from "@tailwindcss/typography";

/**
 * Surface treatment follows the EASY Landing Page design reference
 * (`EASY Landing Page/styles.css`), but the colour is the We Kongsi logo's own: a
 * turquoise brand ramp over a dark *teal* ground. The logo's hand runs #006868 →
 * #00D0B0 and only its wordmark is navy, so every dark surface here is teal — a blue
 * ground made the brand read as someone else's.
 */
export default {
  darkMode: ["class"],
  content: ["./app/**/*.{ts,tsx}", "./src/**/*.{ts,tsx}"],
  theme: {
    container: {
      center: true,
      padding: { DEFAULT: "1.25rem", sm: "2rem", lg: "2.5rem" },
      screens: { sm: "640px", md: "768px", lg: "1024px", xl: "1280px", "2xl": "1360px" },
    },
    extend: {
      fontFamily: {
        /* One family, as the reference uses. `display` is kept as a separate token so a
           heading face can be reintroduced later without touching every component. */
        sans: ["var(--font-poppins)", "ui-sans-serif", "system-ui", "-apple-system", "Segoe UI", "Roboto", "Helvetica Neue", "Arial", "sans-serif"],
        display: ["var(--font-poppins)", "ui-sans-serif", "system-ui", "sans-serif"],
      },
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: { DEFAULT: "hsl(var(--primary))", foreground: "hsl(var(--primary-foreground))" },
        secondary: { DEFAULT: "hsl(var(--secondary))", foreground: "hsl(var(--secondary-foreground))" },
        muted: { DEFAULT: "hsl(var(--muted))", foreground: "hsl(var(--muted-foreground))" },
        accent: { DEFAULT: "hsl(var(--accent))", foreground: "hsl(var(--accent-foreground))" },
        destructive: { DEFAULT: "hsl(var(--destructive))", foreground: "hsl(var(--destructive-foreground))" },
        card: { DEFAULT: "hsl(var(--card))", foreground: "hsl(var(--card-foreground))" },
        popover: { DEFAULT: "hsl(var(--popover))", foreground: "hsl(var(--popover-foreground))" },

        /* --- Tidewater ------------------------------------------------------
         *
         * Deep Petrol #123F46 · Ocean Teal #087F7A · Turquoise #25B6A5 ·
         * Steel Blue #315A78 · Ice Blue #DCECF4 · Cool White #F7FAFA.
         *
         * Every value below is measured, not chosen by eye. The one that constrains
         * the whole system is Turquoise: 2.4:1 on Cool White, so it never carries
         * text on a light ground — it fills bars, rules and tiles, and becomes a
         * text colour only on Deep Petrol, where it measures 4.56:1.
         */
        /** `light` is the only turquoise that carries text, and only on a dark band.
         *  It was #6FE0CF while the blooms were faint; now that the dark bands glow at
         *  more than twice that alpha their lightest point measures L=0.095, where
         *  #6FE0CF fell to 4.3:1. #7FE8D8 holds 4.99:1 there — the headroom the
         *  stronger glow costs, paid back in the colour. */
        turq: { DEFAULT: "#25B6A5", light: "#7FE8D8", glow: "#9FF2E6" },
        /** `deep` is Ocean Teal, the action colour: 4.62:1 on Cool White, and white
         *  on it measures 4.85:1. `ink` is one step down, for 10–13px labels sitting
         *  on Ice Blue chips, where Ocean Teal itself is only 4.0:1. */
        teal: { DEFAULT: "#25B6A5", deep: "#087F7A", light: "#3ECFBE", ink: "#0A5F5B" },
        /** DEFAULT is the heading and solid-panel colour at 10.9:1 on Cool White; the
         *  band/deeper/darkest steps are backgrounds, never type. */
        deep: { DEFAULT: "#123F46", band: "#0C2E35", deeper: "#09242A", darkest: "#071D22" },
        /** Ink used ON a turquoise fill — 5.6:1, where white would be 2.9:1. */
        "on-accent": "#0A2F35",
        ink: { DEFAULT: "#123F46", 2: "#4A5E63", 3: "#5E7378" },
        /** `mint` is Ice Blue (chips, tiles, alternating bands); `soft` is the page
         *  itself, Cool White; `deep` is the pressed/track step. */
        mint: { DEFAULT: "#DCECF4", soft: "#F7FAFA", deep: "#CBE3EE" },
        line: "rgba(18,63,70,.12)",
        "line-2": "rgba(18,63,70,.20)",
        /** Kept under its old name so nothing breaks, but repointed: Tidewater has no
         *  warm neutral, so the alternating band is a cooler step of Ice Blue. */
        sand: { DEFAULT: "#E8F2F6", deep: "#D3E6EF" },
        /** Steel Blue — secondary figures, governance, the cool half of a dark band. */
        steel: "#315A78",
        /** The dark blue in the logo mark, sampled from it (1,022px of #082838). */
        navy: "#082838",
        /** `ink` is the text step: DEFAULT on the wash measures 4.36:1, just under AA. */
        warn: { DEFAULT: "#B4491B", ink: "#8A3713", bg: "rgba(255,150,80,.14)", line: "rgba(180,73,27,.24)" },
      },
      backgroundImage: {
        "grad-accent": "linear-gradient(120deg,#3ECFBE 0%,#25B6A5 55%,#087F7A 100%)",
        /** The primary button. Both stops are dark enough to carry white: #0A8078 is
         *  4.80:1 and #066B66 is 6.0:1, so the label clears AA across the whole sweep. */
        "grad-pill": "linear-gradient(120deg,#0A8078 0%,#066B66 100%)",
        /* The ground under the last stage of the sharing journey: the palette's own
           Mint → Cool White → Ice Blue, at the band's angle. It is the one panel in
           that row that is not white, which is how the destination reads as the
           destination without a heavier border or a bigger box. It holds its tint
           through the middle rather than passing through Cool White: the band behind
           it is already mint → white → ice blue, so a near-white midpoint made the
           panel disappear into its own ground. */
        "grad-stage": "linear-gradient(150deg,#C9EEE5 0%,#DEF4EE 48%,#D4E8F2 100%)",
        /* The middle card of a pricing row, which sits on the accent band rather
           than on white. `grad-stage` is paler than that band (#DCECF4 → #C9E6E0)
           and disappeared into it; this is the same ramp two steps deeper, so the
           card reads as an object on the band instead of a patch of it. The floor
           is `ink-2`, which measures 5.05:1 on the mint end and 4.93:1 on the ice
           blue one — the blue end was lightened to #BEDFEE to clear AA, because at
           #B7DBEA it fell to 4.72:1 and left no headroom at all. */
        "grad-card-mint": "linear-gradient(150deg,#B6E6DB 0%,#CBEDE7 48%,#BEDFEE 100%)",
        /* Dark bands. Light, not shapes: two wide diffuse blooms — turquoise from one
           corner, steel blue from the opposite — over a petrol base. No edges anywhere,
           so a dark section reads as lit rather than as a slab or a pattern. */
        /* Every alpha here is the largest the type on the band survives, not a taste
           call. The turquoise bloom is the binding one, and its ceiling was found by
           measuring rendered pixels, not by arithmetic — the arithmetic was a quarter
           too optimistic, because the brightest *pixel* of a lit band is a speck of
           the grain overlay rather than the gradient under it. At .184 the brightest
           point of band-dark measures rgb(35,100,101), where #7FE8D8 is 4.68:1 and
           white/75 is 4.63:1. At .28 both were under AA.

           Most of the extra depth therefore comes from the layers that have no such
           ceiling: the steel bloom went .45 → .58 (it darkens, so it is free), and
           the base ramps now end at #08232A instead of #0C2E35. Range is what makes
           a gradient visible, and the dark end of one carries no text. The steel bloom darkens rather than lightens, so it is free to be
           strong — .58 — and it is what gives the band two hues instead of two tints.
           The base ramps end deeper than they used to: range is what makes a gradient
           visible, and the dark end has no text on it to protect. */
        "band-hero":
          "radial-gradient(1000px 680px at 84% -6%,rgba(37,182,165,.20),transparent 62%),radial-gradient(900px 640px at 2% 104%,rgba(49,90,120,.52),transparent 64%),radial-gradient(760px 520px at 52% 46%,rgba(127,232,216,.07),transparent 66%),linear-gradient(160deg,#154A52 0%,#123F46 52%,#0A272E 100%)",
        "band-dark":
          "radial-gradient(1040px 700px at 6% -8%,rgba(37,182,165,.185),transparent 62%),radial-gradient(940px 660px at 96% 106%,rgba(49,90,120,.58),transparent 64%),radial-gradient(780px 540px at 58% 48%,rgba(127,232,216,.07),transparent 66%),linear-gradient(152deg,#123F46 0%,#0F3740 44%,#08232A 100%)",
        /* WeCare's panel. The brief gave #097292, and that colour is already close to
           the floor for white text on it — pure white measures 5.51:1 and white at 90%
           measures 4.79:1. So unlike the other bands this one carries no lightening
           bloom: every stop is #097292 or darker, which makes the flat colour the
           worst case anywhere on the card instead of something to go hunting for. */
        "band-ocean":
          "radial-gradient(1000px 700px at 96% 104%,rgba(3,42,60,.55),transparent 66%),linear-gradient(152deg,#097292 0%,#076A88 55%,#05607D 100%)",
        "band-cta":
          "radial-gradient(900px 580px at 86% 4%,rgba(37,182,165,.20),transparent 64%),radial-gradient(960px 600px at 4% 98%,rgba(49,90,120,.54),transparent 66%),linear-gradient(158deg,#123F46 0%,#0C2E35 50%,#072026 100%)",
        /** The signature wash: mint → near-white → ice blue at 105°, with two wide
         *  blooms. This is the gradient the brand brief specifies, nothing added. */
        "band-mint":
          "radial-gradient(900px 620px at 6% 0%,rgba(127,232,216,.5),transparent 62%),radial-gradient(880px 600px at 94% 8%,rgba(255,255,255,.92),transparent 60%),radial-gradient(1040px 700px at 46% 106%,rgba(176,222,242,.66),transparent 64%),linear-gradient(105deg,#D8F3EC 0%,#F5FAF9 46%,#DCECF4 100%)",
        /* For a band that must read as its own territory rather than a continuation of
           the near-white sections around it. */
        "band-accent":
          "radial-gradient(900px 560px at 90% -4%,rgba(255,255,255,.95),transparent 62%),radial-gradient(820px 560px at 4% 104%,rgba(127,232,216,.46),transparent 64%),linear-gradient(170deg,#DCECF4 0%,#C9E6E0 56%,#CBE3EE 100%)",
        "band-apps":
          "radial-gradient(1000px 560px at 50% -6%,rgba(201,238,229,.5),transparent 68%),linear-gradient(180deg,#F7FAFA 0%,#EAF4F7 46%,#F7FAFA 100%)",
        /* A one-pixel hairline that glows at its middle — laid along the top edge of a
           dark band so the join reads as light rather than as a border. */
        "edge-glow":
          "linear-gradient(90deg,transparent,rgba(127,232,216,.38) 18%,rgba(127,232,216,.75) 50%,rgba(127,232,216,.38) 82%,transparent)",
        /* The ring that appears around a card on hover: bright at the corner the
           pointer enters from, gone by the opposite one. */
        "ring-glow":
          "linear-gradient(135deg,rgba(37,182,165,.95) 0%,rgba(49,90,120,.45) 42%,rgba(37,182,165,0) 72%)",
      },
      boxShadow: {
        card: "0 1px 3px rgba(18,63,70,.05),0 22px 44px -32px rgba(18,63,70,.42)",
        float: "0 2px 6px rgba(18,63,70,.06),0 30px 58px -36px rgba(18,63,70,.5)",
        "card-dark": "inset 0 1px 0 rgba(255,255,255,.06),0 26px 52px -32px rgba(0,0,0,.9)",
        /** One long, soft, low-opacity shadow — the only resting depth in the system. */
        tide: "0 26px 52px -40px rgba(18,63,70,.55)",
        "tide-lg": "0 36px 68px -44px rgba(18,63,70,.62)",
        lift: "0 22px 40px -30px rgba(18,63,70,.5)",
        glow: "0 18px 34px -16px rgba(8,127,122,.55)",
        "glow-sm": "0 10px 22px -12px rgba(8,127,122,.5)",
        /** Resting depth plus a turquoise bloom under the card. The tier above
         *  `tide`, for the one object in a section that should look lit. */
        "tide-glow": "0 30px 60px -38px rgba(18,63,70,.55),0 0 46px -18px rgba(37,182,165,.32)",
        /** On a dark band, where a drop shadow does nothing and only light reads. */
        "glow-dark": "inset 0 1px 0 rgba(255,255,255,.08),0 0 56px -22px rgba(37,182,165,.45)",
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 6px)",
        sm: "calc(var(--radius) - 12px)",
        card: "18px",
        xl2: "22px",
        pill: "999px",
      },
      keyframes: {
        "accordion-down": { from: { height: "0" }, to: { height: "var(--radix-accordion-content-height)" } },
        "accordion-up": { from: { height: "var(--radix-accordion-content-height)" }, to: { height: "0" } },
        float: { "0%,100%": { transform: "translateY(0px)" }, "50%": { transform: "translateY(-12px)" } },
        marquee: { "0%": { transform: "translateX(0)" }, "100%": { transform: "translateX(-50%)" } },
        /* Aurora: three slow, independent drifts. Separate keyframes rather than one
           shared loop, so the blobs never line up and the motion stays non-repeating. */
        auroraA: {
          "0%,100%": { transform: "translate(-12%, -8%) scale(1)" },
          "50%": { transform: "translate(10%, 6%) scale(1.15)" },
        },
        auroraB: {
          "0%,100%": { transform: "translate(8%, 10%) scale(1.05)" },
          "50%": { transform: "translate(-10%, -6%) scale(0.9)" },
        },
        auroraC: { "0%": { transform: "rotate(0deg)" }, "100%": { transform: "rotate(360deg)" } },
        /* Transform only, deliberately: an above-the-fold heading at opacity 0 is not
           eligible for LCP until it becomes visible, so fading an h1 in makes LCP wait
           on hydration. This only ever moves it. */
        rise: { from: { transform: "translateY(22px)" }, to: { transform: "none" } },
        /* Tidewater's ambient motion. Nothing here changes opacity or size enough to
           shift layout — these are all slow transforms on decorative layers. */
        drift: {
          "0%,100%": { transform: "translate3d(0,0,0) scale(1)" },
          "50%": { transform: "translate3d(2.5%,-3%,0) scale(1.06)" },
        },
        "drift-slow": {
          "0%,100%": { transform: "translate3d(0,0,0) scale(1.04)" },
          "50%": { transform: "translate3d(-3%,2.5%,0) scale(0.96)" },
        },
        /* A third drift, so three pools never fall into a shared phase. */
        "drift-wide": {
          "0%,100%": { transform: "translate3d(0,0,0) scale(0.98)" },
          "50%": { transform: "translate3d(3.5%,2%,0) scale(1.1)" },
        },
        /* The sweep of light that crosses a card as the pointer enters it. Travel is
           in percentages of the card, so it works at any width. */
        sheen: {
          "0%": { transform: "translateX(-120%) skewX(-18deg)" },
          "100%": { transform: "translateX(220%) skewX(-18deg)" },
        },
        /* A breathing glow for the one figure in a section that is the point of it. */
        "pulse-glow": {
          "0%,100%": { opacity: "0.45", transform: "scale(1)" },
          "50%": { opacity: "0.85", transform: "scale(1.08)" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        float: "float 6s cubic-bezier(0.4,0,0.2,1) infinite",
        marquee: "marquee var(--duration,40s) linear infinite",
        "aurora-a": "auroraA 18s ease-in-out infinite",
        "aurora-b": "auroraB 22s ease-in-out infinite",
        "aurora-c": "auroraC 34s linear infinite",
        drift: "drift 24s cubic-bezier(0.4,0,0.2,1) infinite",
        "drift-slow": "drift-slow 31s cubic-bezier(0.4,0,0.2,1) infinite",
        "drift-wide": "drift-wide 26s cubic-bezier(0.4,0,0.2,1) infinite",
        sheen: "sheen 1.1s cubic-bezier(0.22,0.61,0.36,1)",
        "pulse-glow": "pulse-glow 7s cubic-bezier(0.4,0,0.2,1) infinite",
      },
    },
  },
  plugins: [tailwindcssAnimate, typography],
} satisfies Config;
