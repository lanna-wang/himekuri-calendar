import type { Metadata, Viewport } from "next";
import localFont from "next/font/local";
import "./globals.css";
import {
  SITE_DESCRIPTION,
  SITE_TITLE,
  SITE_URL,
  sharedOpenGraph,
  sharedTwitter,
} from "./shared-metadata";

const mori = localFont({
  src: [
    {
      path: "../../public/fonts/PPMori-Regular.otf",
      weight: "400",
      style: "normal",
    },
    {
      path: "../../public/fonts/PPMori-Semibold.otf",
      weight: "600",
      style: "normal",
    },
  ],
  variable: "--font-mori",
  display: "swap",
});

const pangaia = localFont({
  src: [
    {
      path: "../../public/fonts/PPPangaia-Ultralight.otf",
      weight: "200",
      style: "normal",
    },
    {
      path: "../../public/fonts/PPPangaia-UltralightItalic.otf",
      weight: "200",
      style: "italic",
    },
    {
      path: "../../public/fonts/PPPangaia-Medium.otf",
      weight: "500",
      style: "normal",
    },
    {
      path: "../../public/fonts/PPPangaia-MediumItalic.otf",
      weight: "500",
      style: "italic",
    },
    {
      path: "../../public/fonts/PPPangaia-Bold.otf",
      weight: "700",
      style: "normal",
    },
  ],
  variable: "--font-pangaia",
  display: "swap",
});

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  themeColor: "#faf6ef",
};

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: SITE_TITLE,
  description: SITE_DESCRIPTION,
  alternates: {
    canonical: "/",
  },
  openGraph: {
    ...sharedOpenGraph,
    title: SITE_TITLE,
    description: SITE_DESCRIPTION,
    url: "/",
  },
  twitter: {
    ...sharedTwitter,
    title: SITE_TITLE,
    description: SITE_DESCRIPTION,
  },
  robots: {
    index: true,
    follow: true,
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "himekuri",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${pangaia.variable} ${mori.variable} h-full`}>
      <body className="min-h-[100dvh] flex flex-col bg-cream text-charcoal antialiased">
        {children}
      </body>
    </html>
  );
}
