"use client"

import type React from "react"

import { useState, useMemo } from "react"
import { useRouter } from "@/i18n/routing"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Search, InfoIcon, Instagram, Loader2 } from "lucide-react"

import { useCheckProfileMutation, useGetMyJobsQuery, Job } from "@/redux/api/copyrightApi"
import { useTranslations } from "next-intl"

export default function ScanForm() {
  const t = useTranslations('ScanForm');
  const [profileLink, setProfileLink] = useState("")
  const [error, setError] = useState("")
  const router = useRouter()

  const { data: jobsData, isLoading: isJobsLoading } = useGetMyJobsQuery(undefined, {
    pollingInterval: 5000, // Poll every 5 seconds if we're on this page
  })

  const [checkProfile, { isLoading: isMutationLoading }] = useCheckProfileMutation()

  const activeJob = useMemo(() => {
    return jobsData?.data?.jobs.find((job: Job) =>
      job.status === 'pending' || job.status === 'processing'
    )
  }, [jobsData])

  const isProcessing = isMutationLoading || !!activeJob
  const isLoading = isJobsLoading

  const handleScan = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!profileLink.trim() || isProcessing) return
    setError("")

    try {
      sessionStorage.setItem("instagramProfileLink", profileLink)

      const result = await checkProfile({
        profileUrl: profileLink
      }).unwrap()

      if (result.success) {
        router.push("/results")
      }
    } catch (err: any) {
      console.error("Scan failed:", err)

      if (err?.status === 403 || err?.data?.statusCode === 403) {
        router.push("/pricing")
        return
      }

      setError(err?.data?.message || t('error'))
    }
  }

  return (
    <div className={`bg-white rounded-3xl shadow-xl shadow-purple-900/5 ring-1 ring-black/5 p-4 md:p-12 mb-12 max-w-4xl mx-auto transition-all duration-300 hover:shadow-2xl hover:shadow-purple-900/10 ${isProcessing ? 'opacity-90' : ''}`}>
      <div className="mb-6 md:mb-10 text-center">
        <p className="text-sm md:text-lg text-gray-600 mb-4 md:mb-6 max-w-2xl mx-auto">{t('description')}</p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-2 bg-purple-50 border border-purple-100 px-3 py-2 md:px-4 md:py-3 rounded-xl sm:rounded-xl transition-colors hover:bg-purple-100/80 max-w-3xl mx-auto">
          <span className="text-purple-700 font-medium text-xs md:text-base whitespace-nowrap">{t('example')}</span>
          <code className="text-purple-600 font-mono text-xs md:text-base break-all">{'https://www.instagram.com/deinbenutzername'}</code>
        </div>
      </div>

      <form onSubmit={handleScan} className="space-y-4 md:space-y-8 max-w-3xl mx-auto relative">
        {/* Overlay for non-clickable state when processing */}
        {isProcessing && !isMutationLoading && (
          <div className="absolute inset-0 z-10 cursor-not-allowed" title="Scan in progress..." />
        )}

        {/* Error Message */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-xl text-sm flex items-center gap-3 animate-in fade-in slide-in-from-top-2">
            <div className="w-2 h-2 rounded-full bg-red-500 shrink-0" />
            {error}
          </div>
        )}

        {/* Processing Notification */}
        {activeJob && (
          <div className="bg-purple-50 border border-purple-200 text-purple-700 p-4 rounded-xl text-sm flex flex-col md:flex-row items-center justify-between gap-3 animate-in fade-in">
            <div className="flex items-center gap-3">
              <Loader2 className="w-4 h-4 animate-spin text-purple-600" />
              <span>Ein Scan läuft gerade für <strong>@{activeJob.instagramUsername}</strong>...</span>
            </div>
            <Button
              variant="outline"
              className="bg-white border-purple-200 text-purple-700 hover:bg-purple-50 hover:border-purple-300 font-bold px-4 py-1 h-9 rounded-lg"
              onClick={() => router.push('/results')}
            >
              Ergebnisse ansehen
            </Button>
          </div>
        )}

        {/* Input Field */}
        <div className="relative group">
          <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none">
            <Instagram className={`h-6 w-6 transition-colors duration-200 ${isProcessing ? 'text-purple-300' : 'text-gray-400 group-focus-within:text-purple-600'}`} />
          </div>
          <Input
            type="url"
            placeholder={t('placeholder')}
            value={activeJob ? `https://www.instagram.com/${activeJob.instagramUsername}` : profileLink}
            onChange={(e) => setProfileLink(e.target.value)}
            className="w-full pl-14 pr-4 py-3 md:py-7 text-sm md:text-lg rounded-xl border-gray-200 bg-gray-50/50 focus:bg-white focus:ring-4 focus:ring-purple-100 focus:border-purple-500 transition-all duration-200 shadow-sm hover:shadow-md placeholder:text-gray-400 disabled:bg-gray-50 disabled:text-gray-500"
            disabled={isProcessing || isLoading}
          />
        </div>

        {/* Info Box */}
        {!activeJob && (
          <div className="bg-blue-50/80 border border-blue-100 rounded-xl p-3 md:p-5 flex gap-3 md:gap-4">
            <div className="bg-blue-100 rounded-lg p-2 h-fit shrink-0">
              <InfoIcon className="w-5 h-5 text-blue-600" />
            </div>
            <p className="text-xs md:text-sm text-blue-900 leading-relaxed py-1">{t('info')}</p>
          </div>
        )}

        {/* Scan Button */}
        <div className="flex justify-center pt-2">
          <Button
            type="submit"
            disabled={isProcessing || isLoading || (!profileLink.trim() && !activeJob)}
            className="w-full sm:w-auto min-w-[240px] bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white py-3 md:py-7 text-sm md:text-lg font-bold rounded-full shadow-lg hover:shadow-xl shadow-purple-500/20 flex items-center justify-center gap-2.5 transition-all transform hover:-translate-y-0.5 disabled:opacity-70 disabled:hover:translate-y-0 disabled:shadow-none"
          >
            {isProcessing ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              <Search className="w-5 h-5" />
            )}
            {isProcessing ? t('processing') : t('submit')}
          </Button>
        </div>
      </form>
    </div>
  )
}

