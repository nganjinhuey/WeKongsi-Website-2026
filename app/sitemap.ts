import type { MetadataRoute } from "next";
import { LANGUAGES, hreflangOf, localisePath } from "@/lib/i18n";
import { routes, SITE_URL } from "@/lib/routes";

export const dynamic = "force-static";

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();

  return routes.flatMap((route) =>
    LANGUAGES.map((language) => ({
      url: `${SITE_URL}${localisePath(route.path, language)}`,
      lastModified,
      changeFrequency: "monthly" as const,
      priority: route.priority,
      // Declaring the alternates here as well as in each page's <head> is what stops
      // the language versions being read as duplicates of one another.
      alternates: {
        languages: Object.fromEntries(
          LANGUAGES.map((l) => [hreflangOf(l), `${SITE_URL}${localisePath(route.path, l)}`]),
        ),
      },
    })),
  );
}
