import type React from "react"
import type { Metadata } from "next"
import { Geist, Geist_Mono } from "next/font/google"
import { Analytics } from "@vercel/analytics/next"
import Header from "@/components/header"
import Footer from "@/components/footer"
import ReduxProvider from "@/redux/provider"
import "../globals.css"
import {NextIntlClientProvider} from 'next-intl';
import {getMessages} from 'next-intl/server';

const _geist = Geist({ subsets: ["latin"] })
const _geistMono = Geist_Mono({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "copywright checker",
  description: "The best way to check your Instagram reels for copyrighted music",
  generator: "copywright checker",
  
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
}

export default async function LocaleLayout({
  children,
  params
}: {
  children: React.ReactNode;
  params: Promise<{locale: string}>;
}) {
  const {locale} = await params;
  const messages = await getMessages();

  return (
    <html lang={locale}>
      <body className={`font-sans antialiased flex flex-col min-h-screen`} suppressHydrationWarning>
        <NextIntlClientProvider messages={messages}>
          <ReduxProvider>
            <Header />

            <main className="flex-grow">{children}</main>

            <Footer />

            <Analytics />
          </ReduxProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  )
}
