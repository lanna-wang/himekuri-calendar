import type { Metadata } from "next";

export const SITE_URL = "https://himekuri-calendar-seven.vercel.app";

export const SITE_NAME = "himekuri";

export const SITE_TITLE = "himekuri — daily gratitude calendar";

export const SITE_DESCRIPTION =
  "A daily art discovery and gratitude journaling ritual inspired by the Japanese himekuri tear-off calendar.";

/**
 * Nested metadata objects are shallowly *replaced* between segments, not
 * merged — a child that sets `openGraph` drops every field the root set. Spread
 * these into any child segment's `openGraph` / `twitter` so the shared tags
 * (image, type, site name, card) survive.
 */
export const sharedOpenGraph = {
  type: "website",
  siteName: SITE_NAME,
  locale: "en_US",
  images: [
    {
      url: "/og-image.png",
      width: 1200,
      height: 630,
      alt: "himekuri — a daily gratitude calendar showing the day's artwork",
    },
  ],
} satisfies NonNullable<Metadata["openGraph"]>;

export const sharedTwitter = {
  card: "summary_large_image",
  images: ["/og-image.png"],
} satisfies NonNullable<Metadata["twitter"]>;
