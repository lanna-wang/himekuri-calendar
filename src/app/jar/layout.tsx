import type { Metadata } from "next";
import { sharedOpenGraph, sharedTwitter } from "../shared-metadata";

const TITLE = "gratitude jar — himekuri";
const DESCRIPTION =
  "Every gratitude note you've written, collected as stars in a glass jar.";

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: {
    canonical: "/jar",
  },
  openGraph: {
    ...sharedOpenGraph,
    title: TITLE,
    description: DESCRIPTION,
    url: "/jar",
  },
  twitter: {
    ...sharedTwitter,
    title: TITLE,
    description: DESCRIPTION,
  },
};

export default function JarLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return children;
}
