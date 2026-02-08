"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "@/i18n/routing"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Search, InfoIcon, Instagram } from "lucide-react"

import { useCheckProfileMutation } from "@/redux/api/copyrightApi"
import { useTranslations } from "next-intl"

export default function ScanForm() {
  const t = useTranslations('ScanForm');
  const [profileLink, setProfileLink] = useState("")
  const [error, setError] = useState("")
  const router = useRouter()
  const [checkProfile, { isLoading }] = useCheckProfileMutation()

  const handleScan = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!profileLink.trim()) return
    setError("")

    try {
      // Store the profile link in session/context for later use
      sessionStorage.setItem("instagramProfileLink", profileLink)

      const result = await checkProfile({
        profileUrl: profileLink
      }).unwrap()

      if (result.success) {
        router.push("/results")
      }
    } catch (err: any) {
      console.error("Scan failed:", err)

      // Check for 403 status code in various possible locations in the error object
      if (err?.status === 403 || err?.data?.statusCode === 403) {
        router.push("/pricing")
        return
      }

      setError(err?.data?.message || t('error'))
    }
  }

  return (
    <div className="bg-white rounded-3xl shadow-xl shadow-purple-900/5 ring-1 ring-black/5 p-8 md:p-12 mb-12 max-w-4xl mx-auto transition-all duration-300 hover:shadow-2xl hover:shadow-purple-900/10">
      <div className="mb-10 text-center">
        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4 tracking-tight">{t('title')}</h2>
        <p className="text-lg text-gray-600 mb-6 max-w-2xl mx-auto">{t('description')}</p>

        <div className="inline-flex items-center gap-2 bg-purple-50 border border-purple-100 px-4 py-2 rounded-full transition-colors hover:bg-purple-100/80">
          <span className="text-purple-700 font-medium text-sm md:text-base">{t('example')}</span>
          <code className="text-purple-600 font-mono text-sm md:text-base">https://www.instagram.com/deinbenutzername</code>
        </div>
      </div>

      <form onSubmit={handleScan} className="space-y-8 max-w-2xl mx-auto">
        {/* Error Message */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-xl text-sm flex items-center gap-3 animate-in fade-in slide-in-from-top-2">
            <div className="w-2 h-2 rounded-full bg-red-500 shrink-0" />
            {error}
          </div>
        )}

        {/* Input Field */}
        <div className="relative group">
          <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none">
            <Instagram className="h-6 w-6 text-gray-400 group-focus-within:text-purple-600 transition-colors duration-200" />
          </div>
          <Input
            type="url"
            placeholder={t('placeholder')}
            value={profileLink}
            onChange={(e) => setProfileLink(e.target.value)}
            className="w-full pl-14 pr-4 py-7 text-lg rounded-xl border-gray-200 bg-gray-50/50 focus:bg-white focus:ring-4 focus:ring-purple-100 focus:border-purple-500 transition-all duration-200 shadow-sm hover:shadow-md placeholder:text-gray-400"
            disabled={isLoading}
          />
        </div>

        {/* Info Box */}
        <div className="bg-blue-50/80 border border-blue-100 rounded-xl p-5 flex gap-4">
          <div className="bg-blue-100 rounded-lg p-2 h-fit shrink-0">
            <InfoIcon className="w-5 h-5 text-blue-600" />
          </div>
          <p className="text-sm text-blue-900 leading-relaxed py-1">{t('info')}</p>
        </div>

        {/* Scan Button */}
        <div className="flex justify-center pt-2">
          <Button
            type="submit"
            disabled={isLoading || !profileLink.trim()}
            className="w-full sm:w-auto min-w-[240px] bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white py-7 text-lg font-bold rounded-xl shadow-lg hover:shadow-xl shadow-purple-500/20 flex items-center justify-center gap-2.5 transition-all transform hover:-translate-y-0.5 disabled:opacity-70 disabled:hover:translate-y-0 disabled:shadow-none"
          >
            {isLoading ? (
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <Search className="w-5 h-5" />
            )}
            {isLoading ? t('submitting') : t('submit')}
          </Button>
        </div>
      </form>
    </div>
  )
}
