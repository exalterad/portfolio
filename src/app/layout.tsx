import type { Metadata, Viewport } from "next";
import { Orbitron, Space_Grotesk, Geist_Mono } from "next/font/google";

import { site } from "@/config/site";

import "./globals.css";

const spaceGrotesk = Space_Grotesk({
  variable: "--font-sans",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const orbitron = Orbitron({
  variable: "--font-orbitron",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800", "900"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const siteUrl = new URL(site.url);

export const metadata: Metadata = {
  metadataBase: siteUrl,
  title: {
    default: `${site.name} — Portfolio`,
    template: `%s · ${site.name}`,
  },
  description: site.description,
  keywords: [
    "portfolio",
    "hobbyutvecklare",
    "gaming",
    "Counter-Strike 2",
    "Next.js",
    "React",
    site.username,
    site.name,
  ],
  authors: [{ name: site.name, url: site.url }],
  creator: site.name,
  openGraph: {
    type: "website",
    locale: site.locale,
    url: site.url,
    siteName: site.name,
    title: `${site.name} — Portfolio`,
    description: site.description,
  },
  twitter: {
    card: "summary_large_image",
    title: `${site.name} — Portfolio`,
    description: site.description,
  },
  robots: { index: true, follow: true },
  alternates: { canonical: site.url },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: dark)", color: "#070712" },
    { color: "#070712" },
  ],
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: site.name,
  alternateName: site.username,
  description: site.description,
  url: site.url,
  image: site.avatar,
  email: site.email,
  sameAs: site.social.map((s) => s.href),
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="sv" className="dark" suppressHydrationWarning>
      <body
        suppressHydrationWarning
        className={`${spaceGrotesk.variable} ${spaceGrotesk.className} ${orbitron.variable} ${geistMono.variable} min-h-screen bg-background text-foreground antialiased`}
      >
        <script
          id="json-ld-person"
          type="application/ld+json"
          suppressHydrationWarning
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        {children}
      </body>
    </html>
  );
}
