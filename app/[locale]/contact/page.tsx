"use client"

import { Button } from "@/components/ui/button"
import { Link } from "@/i18n/routing"
import PageHeader from "@/components/page-header"
import { useCreateContactMutation } from "@/redux/api/contactApi"
import { useState } from "react"
import type React from "react"
import { useTranslations } from "next-intl"

export default function ContactUs() {
  const t = useTranslations('Contact');
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  })
  const [status, setStatus] = useState<{ type: "success" | "error" | ""; message: string }>({ type: "", message: "" })
  const [createContact, { isLoading }] = useCreateContactMutation()

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setStatus({ type: "", message: "" })

    if (!formData.name || !formData.email || !formData.subject || !formData.message) {
      setStatus({ type: "error", message: t('validationError') })
      return
    }

    try {
      const result = await createContact(formData).unwrap()
      if (result.success) {
        setStatus({ type: "success", message: t('success') })
        setFormData({ name: "", email: "", subject: "", message: "" })
      }
    } catch (err: any) {
      console.error("Failed to send message:", err)
      setStatus({ type: "error", message: err?.data?.message || t('error') })
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      <PageHeader title={t('title')} description={t('description')} backLink={{ href: "/", text: t('backToHome') }} />

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Contact Form */}
          {/* <div className="bg-white rounded-lg border border-gray-200 p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">{t('sendMessage')}</h2>
            <form className="space-y-6" onSubmit={handleSubmit}>
              {status.message && (
                <div className={`p-3 rounded text-sm ${status.type === "success" ? "bg-green-50 text-green-600" : "bg-red-50 text-red-600"}`}>
                  {status.message}
                </div>
              )}
              <div>
                <label className="block text-sm font-medium text-gray-900 mb-2">{t('name')}</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-red-600"
                  placeholder={t('namePlaceholder')}
                  disabled={isLoading}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-900 mb-2">{t('email')}</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-red-600"
                  placeholder={t('emailPlaceholder')}
                  disabled={isLoading}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-900 mb-2">{t('subject')}</label>
                <input
                  type="text"
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-red-600"
                  placeholder={t('subjectPlaceholder')}
                  disabled={isLoading}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-900 mb-2">{t('message')}</label>
                <textarea
                  rows={5}
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-red-600"
                  placeholder={t('messagePlaceholder')}
                  disabled={isLoading}
                ></textarea>
              </div>
              <Button type="submit" className="w-full bg-purple-600 hover:bg-purple-700 text-white py-3 rounded-lg font-semibold" disabled={isLoading}>
                {isLoading ? t('sendingButton') : t('sendButton')}
              </Button>
            </form>
          </div> */}

          {/* Contact Information */}
          <div className="space-y-8">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-6">{t('getInTouch')}</h2>
              <div className="space-y-6">
                <div className="flex gap-4">
                  <div className="bg-purple-100 rounded-lg p-3 h-fit">
                    <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                      />
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">{t('emailLabel')}</h3>
                    <p className="text-gray-600">team@copyrightchecker.de</p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="bg-purple-100 rounded-lg p-3 h-fit">
                    <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                      />
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">{t('phoneLabel')}</h3>
                    <p className="text-gray-600">+ 49 72217791999</p>
                  </div>
                </div>

                <div className="flex gap-4">
    
               
                </div>
              </div>
            </div>

            {/* Business Hours */}
            <div className="bg-gray-50 rounded-lg p-6">
              <h3 className="font-semibold text-gray-900 mb-4">{t('businessHours')}</h3>
              <div className="space-y-2 text-sm text-gray-600">
                <p>
                  <span className="font-medium">{t('daysWeek')}</span> 9:00 AM - 6:00 PM 
                </p>
                <p>
                  <span className="font-medium">{t('daysSat')}</span> {t('closed')}
                </p>
                <p>
                  <span className="font-medium">{t('daysSun')}</span> {t('closed')}
                </p>
              </div>
            </div>
          </div>

          
        </div>
      </div>
    </div>
  )
}
