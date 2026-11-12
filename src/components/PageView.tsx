import React from "react";
import { HTML_LANG, type Language } from "@/lib/i18n";
import type { SiteRoute } from "@/lib/routes";
import HtmlLang from "@/components/HtmlLang";

import Home from "@/views/Home";
import Plans from "@/views/Plans";
import WeShare from "@/views/WeShare";
import WeCare from "@/views/WeCare";
import Transparency from "@/views/Transparency";
import HospitalInfo from "@/views/HospitalInfo";
import ClinicInfo from "@/views/ClinicInfo";
import Stories from "@/views/Stories";
import Story from "@/views/Story";
import About from "@/views/About";
import Faq from "@/views/Faq";
import Contact from "@/views/Contact";

/**
 * Routes whose key is enough to pick a view. Articles are not among them: every post
 * under /stories shares the key "story" and is told apart by its path, so that one is
 * resolved below rather than looked up here.
 */
const VIEWS: Partial<Record<SiteRoute["key"], React.ComponentType>> = {
  home: Home,
  plans: Plans,
  weshare: WeShare,
  wecare: WeCare,
  "hospital-info": HospitalInfo,
  "clinic-info": ClinicInfo,
  stories: Stories,
  transparency: Transparency,
  about: About,
  faq: Faq,
  contact: Contact,
};

export default function PageView({ route, language }: { route: SiteRoute; language: Language }) {
  const Simple = VIEWS[route.key];

  // `lang` on the wrapper is the part that ships in the server HTML — the document
  // element is corrected on the client by <HtmlLang>. See that file for why.
  return (
    <div lang={HTML_LANG[language]}>
      <HtmlLang />
      {Simple ? <Simple /> : <Story slug={route.path.replace("/stories/", "")} />}
    </div>
  );
}
