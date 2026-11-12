import React from "react";
import Hero from "@/components/sections/Hero";
import IntroProcess from "@/components/sections/IntroProcess";
import HomePlans from "@/components/sections/HomePlans";
import Trust from "@/components/sections/Trust";
import StoriesPreview from "@/components/sections/StoriesPreview";
import Testimonials from "@/components/sections/Testimonials";
import FaqSection from "@/components/sections/FaqSection";
import FinalCta from "@/components/sections/FinalCta";

export default function Home() {
  return (
    <>
      {/* Hero carries the figures strip itself, so the page opens on one band. */}
      <Hero />
      {/* What We Kongsi is — not an insurer — and the four principles behind it. */}
      <IntroProcess />
      <HomePlans />
      <Trust />
      <StoriesPreview />
      <Testimonials />
      <FaqSection tone="light" />
      <FinalCta />
    </>
  );
}
