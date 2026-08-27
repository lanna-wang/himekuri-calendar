import type { MetadataRoute } from "next";
import { SITE_URL } from "./shared-metadata";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: `${SITE_URL}/`,
      changeFrequency: "daily",
      priority: 1,
    },
    {
      url: `${SITE_URL}/jar`,
      changeFrequency: "daily",
      priority: 0.8,
    },
  ];
}
