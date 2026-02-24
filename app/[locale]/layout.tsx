import type React from "react"
import type { Metadata } from "next"
import { Geist, Geist_Mono } from "next/font/google"
import { Analytics } from "@vercel/analytics/next"
import Header from "@/components/header"
import Footer from "@/components/footer"
import CookieBanner from "@/components/cookie-banner"
import { Toaster } from "@/components/ui/sonner"
import ReduxProvider from "@/redux/provider"
import "../globals.css"
import { NextIntlClientProvider } from 'next-intl';
import { getMessages } from 'next-intl/server';

const _geist = Geist({ subsets: ["latin"] })
const _geistMono = Geist_Mono({ subsets: ["latin"] })






export const metadata: Metadata = {
  title: {
    default: "Instagram Reel Abmahnung vermeiden - Copyright Check für Unternehmen & Creator",
    template: "%s | CopyrightChecker.de",
  },

  description:
    "Prüfe deine Instagram Reels automatisch auf mögliche Musik Copyright Risiken. Ideal für Unternehmen, Creator und Agenturen. Kein Login erforderlich. Schnelle Risikoanalyse.",

  applicationName: "CopyrightChecker.de",
  generator: "CopyrightChecker.de",
  referrer: "origin-when-cross-origin",

  keywords: [
    // Core German keywords
    "Instagram Reels Copyright Check",
    "Instagram Urheberrecht prüfen",
    "Reels Copyright Risiko",
    "Instagram Musik Copyright",
    "Urheberrechtsprüfung Instagram",
    "Instagram Reels analysieren",
    "Copyright Checker Instagram",

    // AI / Tool intent
    "KI Musik Erkennung",
    "automatische Copyright Prüfung",
    "AI Copyright Checker",
    "Musik Urheberrecht erkennen",

    // Creator / business intent
    "Content Creator Tools",
    "Social Media Urheberrecht",
    "Instagram Creator Tool",
    "Reels vor Veröffentlichung prüfen",

    // Brand
    "CopyrightChecker",
    "CopyrightChecker.de",
  ],

  authors: [{ name: "CopyrightChecker.de" }],
  creator: "CopyrightChecker.de",
  publisher: "CopyrightChecker.de",

  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },

  alternates: {
    canonical: "https://www.copyrightchecker.de",
    languages: {
      de: "https://www.copyrightchecker.de/de",
      en: "https://www.copyrightchecker.de/en",
    },
  },

  openGraph: {
    type: "website",
    locale: "de_DE",
    url: "https://www.copyrightchecker.de",
    siteName: "CopyrightChecker.de",
    title: "Instagram Reel Abmahnung vermeiden - Copyright Check für Unternehmen & Creator",
    description:
      "Automatischer Copyright Check für Instagram Reels. Erkenne Musikrisiken frühzeitig und reduziere Abmahngefahr.",
    images: [
      {
        url: "https://www.copyrightchecker.de/og-image.png",
        width: 1200,
        height: 630,
        alt: "Instagram Reels Copyright Checker",
      },
    ],
  },

  twitter: {
    card: "summary_large_image",
    title: "Instagram Reel Abmahnung vermeiden - Copyright Check für Unternehmen & Creator",
    description:
      "Automatischer Copyright Check für Instagram Reels. Für Unternehmen, Creator und Agenturen.",
    images: ["https://www.copyrightchecker.de/og-image.png"],
  },

  icons: {
    icon: [
      {
        url: "/logo.svg",
        media: "(prefers-color-scheme: light)",
      },
      {
        url: "/logo.svg",
        media: "(prefers-color-scheme: dark)",
      },
      {
        url: "/logo.svg",
        type: "image/svg+xml",
      },
    ],
    apple: "/logo.svg",
  },

  category: "technology",
};






export default async function LocaleLayout({
  children,
  params
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const messages = await getMessages();

  return (
    <html lang={locale}>
      <body className={`font-sans antialiased flex flex-col min-h-screen`} suppressHydrationWarning>
        <NextIntlClientProvider messages={messages}>
          <ReduxProvider>
            <Header />

            <main className="flex-grow">{children}</main>

            <Footer />
            <CookieBanner />
            <Toaster />
            <Analytics />
          </ReduxProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  )
}
