import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Analytics } from "@vercel/analytics/react";
import { GoogleAnalytics } from "@next/third-parties/google";
import { QueryProvider } from "@/providers/query-provider";
import { ThemeProvider } from "@/providers/theme-provider";
import { AreaProvider } from "@/components/homepage/area-context";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://brightonhub.ai"),
  title: "Brighton Hub",
  description:
    "Real-time civic data for Brighton & Hove — environment, crime, transport, and planning dashboards in one place.",
  applicationName: "Brighton Hub",
  keywords: [
    "Brighton",
    "Brighton & Hove",
    "civic data",
    "open data",
    "air quality",
    "flood warnings",
    "carbon intensity",
    "crime statistics",
    "train departures",
    "planning applications",
  ],
  icons: { icon: "/favicon.ico" },
  alternates: { canonical: "/" },
  openGraph: {
    title: "Brighton Hub",
    description:
      "Real-time civic data for Brighton & Hove — environment, crime, transport, and planning dashboards.",
    type: "website",
    locale: "en_GB",
    siteName: "Brighton Hub",
    url: "/",
  },
  twitter: {
    card: "summary_large_image",
    title: "Brighton Hub",
    description:
      "Real-time civic data for Brighton & Hove — environment, crime, transport, and planning in one place.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en-GB" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased flex flex-col min-h-screen`}
      >
        <ThemeProvider>
        <QueryProvider>
        <AreaProvider>
          <a
            href="#main-content"
            className="sr-only focus:not-sr-only focus:fixed focus:top-2 focus:left-2 focus:z-[100] focus:rounded-md focus:bg-green-600 focus:px-4 focus:py-2 focus:text-sm focus:font-medium focus:text-white"
          >
            Skip to main content
          </a>
          <Header />
          <main id="main-content" className="flex-1">{children}</main>
          <Footer />
        </AreaProvider>
        </QueryProvider>
        </ThemeProvider>
        <Analytics />
        {process.env.NEXT_PUBLIC_GA_ID && (
          <GoogleAnalytics gaId={process.env.NEXT_PUBLIC_GA_ID} />
        )}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@graph': [
                {
                  '@type': 'WebSite',
                  '@id': 'https://brightonhub.ai/#website',
                  url: 'https://brightonhub.ai/',
                  name: 'Brighton Hub',
                  description:
                    'Real-time civic data for Brighton & Hove — environment, crime, transport, and planning dashboards in one place.',
                  inLanguage: 'en-GB',
                },
                {
                  '@type': 'Organization',
                  '@id': 'https://brightonhub.ai/#organization',
                  name: 'Brighton Hub',
                  url: 'https://brightonhub.ai/',
                  areaServed: {
                    '@type': 'City',
                    name: 'Brighton and Hove',
                    address: {
                      '@type': 'PostalAddress',
                      addressLocality: 'Brighton',
                      addressRegion: 'East Sussex',
                      addressCountry: 'GB',
                    },
                  },
                },
              ],
            }),
          }}
        />
      </body>
    </html>
  );
}
