"use client"

import { Link } from "@/i18n/routing"
import { ChevronDown } from "lucide-react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import PageHeader from "@/components/page-header"
import { useGetAllFaqQuery } from "@/redux/api/faqApi"
import { useTranslations } from "next-intl"

export default function FAQ() {
  const t = useTranslations('FAQ');
  const [openIndex, setOpenIndex] = useState<number | null>(null)

  // Fetch FAQs from API
  const { data, isLoading, isError } = useGetAllFaqQuery(undefined)

  // Extract FAQ items from API response
  const faqItems = data?.data || []


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
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
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
          <div className="space-y-4">
            {faqItems?.map((item: any, index: number) => (
              <div
                key={item?._id || index}
                className="border border-gray-200 rounded-lg overflow-hidden bg-white hover:shadow-sm transition-shadow"
              >
                <button
                  onClick={() => setOpenIndex(openIndex === index ? null : index)}
                  className="w-full px-6 py-5 text-left flex items-center justify-between hover:bg-gray-50 transition-colors"
                >
                  <span className="text-lg font-semibold text-gray-900">{item?.question}</span>
                  <ChevronDown
                    className={`w-5 h-5 text-gray-600 transition-transform ${openIndex === index ? "rotate-180" : ""}`}
                  />
                </button>
                {openIndex === index && (
                  <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 text-gray-700">{item?.answer}</div>
                )}
              </div>
            ))}
          </div>
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
