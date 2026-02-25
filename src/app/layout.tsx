import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { QueryProvider } from "@/providers/query-provider";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { Analytics } from "@vercel/analytics/next";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Brighton Hub",
  description:
    "Real-time civic data for Brighton & Hove — environment, crime, transport, and planning dashboards in one place.",
  openGraph: {
    title: "Brighton Hub",
    description:
      "Real-time civic data for Brighton & Hove — environment, crime, transport, and planning dashboards.",
    type: "website",
    locale: "en_GB",
    siteName: "Brighton Hub",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased flex flex-col min-h-screen`}
      >
        <QueryProvider>
          <Header />
          <main className="flex-1">{children}</main>
          <Footer />
        </QueryProvider>
        <Analytics />
      </body>
    </html>
  );
}
