"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "@/i18n/routing"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Search, InfoIcon } from "lucide-react"

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
    <div className="bg-white rounded-2xl shadow-lg ring-1 ring-black/5 p-8 md:p-12 mb-12">
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">{t('title')}</h2>
        <p className="text-gray-600">{t('description')}</p>
      </div>

      <form onSubmit={handleScan} className="space-y-6">
        {/* Error Message */}
        {error && (
          <div className="bg-red-50 text-red-600 p-3 rounded text-sm mb-4">
            {error}
          </div>
        )}

        {/* Input Field */}
        <div className="relative">
          <Input
            type="url"
            placeholder={t('placeholder')}
            value={profileLink}
            onChange={(e) => setProfileLink(e.target.value)}
            className="w-full px-4 py-3 text-lg rounded-lg border border-gray-300 bg-gray-50 transition-all"
            disabled={isLoading}
          />
          
        </div>

        {/* Info Box */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 flex gap-3">
          <InfoIcon className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
          <p className="text-sm text-blue-900">{t('info')}</p>
        </div>

        {/* Scan Button */}
        <div className="flex justify-center">
          <Button
            type="submit"
            disabled={isLoading || !profileLink.trim()}
            className="w-[200px] bg-purple-600 hover:bg-purple-700 cursor-pointer text-white py-3 text-lg font-semibold rounded-lg flex items-center justify-center gap-2 transition-all"
          >
            <Search className="w-5 h-5" />
            {isLoading ? t('submitting') : t('submit')}
          </Button>
        </div>
      </form>
    </div>
  )
}
