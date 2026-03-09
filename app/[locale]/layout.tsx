import type React from "react"
import type { Metadata } from "next"
import { Geist, Geist_Mono } from "next/font/google"
import { Analytics } from "@vercel/analytics/next"
import Header from "@/components/header"
import Footer from "@/components/footer"
import { Toaster } from "@/components/ui/sonner"
import ReduxProvider from "@/redux/provider"
import "../globals.css"
import { NextIntlClientProvider } from 'next-intl';
import { getMessages } from 'next-intl/server';
import Script from "next/script"
import MetaPixel from "@/components/meta-pixel"

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
    <html lang={locale} suppressHydrationWarning>
      <head>
        {/* 1. Cookiebot CMP - Must be a raw <script> in <head> to load FIRST.
            Next.js <Script> with afterInteractive injects into <body>, not <head>,
            so Cookiebot can't block other scripts in time. */}
        <script
          id="Cookiebot"
          src="https://consent.cookiebot.com/uc.js"
          data-cbid="05ffcbf8-d6c1-49ba-8e6c-0e25caeb7e22"
          data-blockingmode="auto"
          type="text/javascript"
        />

        {/* 2. Google Consent Mode v2 - Set defaults BEFORE any Google tags load.
            All consent categories denied by default; Cookiebot will update them
            when the user accepts cookies. */}
        <script
          id="google-consent-mode"
          dangerouslySetInnerHTML={{
            __html: `
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('consent', 'default', {
                'ad_storage': 'denied',
                'ad_user_data': 'denied',
                'ad_personalization': 'denied',
                'analytics_storage': 'denied',
                'functionality_storage': 'denied',
                'personalization_storage': 'denied',
                'security_storage': 'granted',
                'wait_for_update': 500
              });
            `,
          }}
        />
      </head>
      <body className={`font-sans antialiased flex flex-col min-h-screen`} suppressHydrationWarning>
        <noscript>
          <img
            height="1"
            width="1"
            style={{ display: "none" }}
            src="https://www.facebook.com/tr?id=1251478372560101&ev=PageView&noscript=1"
            alt=""
          />
        </noscript>

        {/* 3. Google Analytics - Uses beforeInteractive so Cookiebot can manage it.
            Consent Mode ensures no data is sent until the user grants analytics consent. */}
        <Script
          id="gtag-js"
          src="https://www.googletagmanager.com/gtag/js?id=G-YG846MDVOJ"
          strategy="beforeInteractive"
        />
        <Script id="google-analytics" strategy="beforeInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-YG846MDVOJ');
          `}
        </Script>

        {/* 4. Cookiebot consent callback - Updates Google Consent Mode when user accepts.
            This bridges Cookiebot consent categories to Google consent signals. */}
        <Script id="cookiebot-consent-callback" strategy="afterInteractive">
          {`
            window.addEventListener('CookiebotOnAccept', function () {
              if (typeof gtag === 'function') {
                gtag('consent', 'update', {
                  'ad_storage': Cookiebot.consent.marketing ? 'granted' : 'denied',
                  'ad_user_data': Cookiebot.consent.marketing ? 'granted' : 'denied',
                  'ad_personalization': Cookiebot.consent.marketing ? 'granted' : 'denied',
                  'analytics_storage': Cookiebot.consent.statistics ? 'granted' : 'denied',
                  'functionality_storage': Cookiebot.consent.preferences ? 'granted' : 'denied',
                  'personalization_storage': Cookiebot.consent.preferences ? 'granted' : 'denied',
                });
              }
            });
          `}
        </Script>

        {/* 5. Meta Pixel - afterInteractive, Cookiebot auto mode will handle blocking */}
        <Script id="facebook-pixel" strategy="afterInteractive">
          {`
            !function(f,b,e,v,n,t,s)
            {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
            n.callMethod.apply(n,arguments):n.queue.push(arguments)};
            if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
            n.queue=[];t=b.createElement(e);t.async=!0;
            t.src=v;s=b.getElementsByTagName(e)[0];
            s.parentNode.insertBefore(t,s)}(window, document,'script',
            'https://connect.facebook.net/en_US/fbevents.js');
            fbq('init', '1251478372560101');
            fbq('track', 'PageView');
          `}
        </Script>

        <NextIntlClientProvider messages={messages}>
          <ReduxProvider>
            <MetaPixel />
            <Header />

            <main className="flex-grow">{children}</main>

            <Footer />
            <Toaster />
            <Analytics />
          </ReduxProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  )
}
