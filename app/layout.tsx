import type { Metadata } from "next";
import React from "react";
import { Poppins } from "next/font/google";
import "./globals.css";
import { Providers } from "@/components/providers";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import WhatsAppButton from "@/components/WhatsAppButton";
import SkipLink from "@/components/SkipLink";
import { SITE_URL } from "@/lib/routes";

/**
 * Poppins carries the whole site, as the Angsana reference does.
 *
 * It is not a variable font, so every weight is a separate file — these five are the
 * ones the site actually uses (400 body, 500 labels, 600 headings and most UI, 700 and
 * 800 for the few places that go heavier). Adding another costs a download on first
 * paint, so check it is really used before requesting it.
 *
 * Loaded through next/font, which self-hosts and preloads it; an @import would cost
 * two extra round trips before first paint.
 */
const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  variable: "--font-poppins",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "We Kongsi — Community-Driven Medical Cost-Sharing",
    template: "%s | We Kongsi",
  },
  description:
    "We Kongsi is a community-driven medical cost-sharing program making healthcare support more accessible and affordable for Malaysians.",
  authors: [{ name: "Kita Kongsi Sdn Bhd" }],
  robots: { index: true, follow: true },
  icons: { icon: "/images/wekongsi-badge-96.png" },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  // `lang` is set per-request by the catch-all route's <html lang> — but the App Router
  // has a single root <html>, so the honest default is English and each page overrides
  // the attribute client-side via <HtmlLang>. See src/components/HtmlLang.tsx.
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        {/* Marks the document as script-enabled before first paint, which is what lets the
            scroll-entrance styles hide content without risking a permanently blank page
            when JavaScript never runs. Deliberately inline and render-blocking: a deferred
            script would add the class after paint and cause a visible flash. */}
        <script
          dangerouslySetInnerHTML={{
            __html: "document.documentElement.classList.add('js')",
          }}
        />
      </head>
      <body
        className={`${poppins.variable} flex min-h-screen flex-col bg-background font-sans text-deep antialiased`}
      >
        <Providers>
          <SkipLink />
          <Header />
          <main id="main" className="flex-1">
            {children}
          </main>
          <Footer />
          <WhatsAppButton />
        </Providers>
      </body>
    </html>
  );
}
