"use client";

import { Link } from "@/i18n/routing"
import { Button } from "@/components/ui/button"
import PageHeader from "@/components/page-header"
import { useTranslations } from "next-intl"
import FaqClient from "./faq-client"
import { useGetAllFaqQuery } from "@/redux/api/faqApi"
import { Loader2 } from "lucide-react"

export default function FAQ() {
  const t = useTranslations('FAQ');
  const { data: response, isLoading, isError } = useGetAllFaqQuery(undefined);
  const faqItems = response?.data || [];

  return (
    <div className="min-h-screen bg-white">
      <PageHeader
        title={t('title')}
        description={t('description')}
        backLink={{ href: "/", text: t('backToHome') }}
      />

      {/* FAQ Accordion */}
      <main className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-16">

        {/* Loading State */}
        {isLoading && (
          <div className="flex items-center justify-center py-10">
            <Loader2 className="w-8 h-8 animate-spin text-purple-600" />
          </div>
        )}

        {/* Error State */}
        {isError && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
            <p className="text-red-800 font-semibold">{t('errorTitle')}</p>
            <p className="text-red-600 text-sm mt-2">{t('errorDesc')}</p>
          </div>
        )}

        {/* FAQ Items */}
        {!isLoading && !isError && (
          <FaqClient faqItems={faqItems} />
        )}

        {/* Contact Support Section */}
        <div className="mt-16 text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-3">{t('stillQuestions')}</h2>
          <p className="text-gray-600 mb-6">{t('cantFind')}</p>
          <Link href="/contact">
            <Button className="bg-purple-600 hover:bg-purple-700 text-white px-8 py-6 rounded-lg">
              {t('contactSupport')}
            </Button>
          </Link>
        </div>
      </main>
    </div>
  )
}
