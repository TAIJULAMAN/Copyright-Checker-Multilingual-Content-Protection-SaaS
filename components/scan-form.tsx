"use client"

import type React from "react"

import { useState, useMemo, useEffect } from "react"
import { useRouter } from "@/i18n/routing"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Search, InfoIcon, Instagram, Loader2, Clock } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

import { useCheckProfileMutation, useGetMyJobsQuery, Job } from "@/redux/api/copyrightApi"
import { useGetMySubscriptionQuery, useGetSubscriptionPlansQuery, useCreatePayPalOrderMutation } from "@/redux/api/subscriptionApi"
import { useSelector } from "react-redux"
import { selectCurrentUser } from "@/redux/slices/authSlice"
import { skipToken } from "@reduxjs/toolkit/query"
import { useTranslations } from "next-intl"
import { useSearchParams } from "next/navigation"

export default function ScanForm() {
  const t = useTranslations('ScanForm');
  const [profileLink, setProfileLink] = useState("")
  const [error, setError] = useState("")
  const [scanStarted, setScanStarted] = useState(false)
  const router = useRouter()
  const user = useSelector(selectCurrentUser)

  const { data: jobsData, isLoading: isJobsLoading } = useGetMyJobsQuery(user ? undefined : skipToken, {
    pollingInterval: 5000, // Poll every 5 seconds if we're on this page
  })

  const { data: subData, isLoading: isSubLoading } = useGetMySubscriptionQuery(user ? undefined : skipToken, {
    refetchOnMountOrArgChange: true
  })

  const { data: plansData } = useGetSubscriptionPlansQuery()
  const [createPayPalOrder, { isLoading: isCreatingOrder }] = useCreatePayPalOrderMutation()

  const searchParams = useSearchParams()
  const planId = searchParams.get("planId")

  const remainingChecks = subData?.data?.remainingChecks ?? 0;
  const hasActivePlan = subData?.data?.subscription?.status === 'active' || remainingChecks > 0;
  const showPaymentPhase = (!user || !hasActivePlan);

  const [checkProfile, { isLoading: isMutationLoading }] = useCheckProfileMutation()

  useEffect(() => {
    if (!isSubLoading && planId && !hasActivePlan) {
      router.push(`/checkout/${planId}`);
    }
    
    if (typeof window !== 'undefined') {
      const savedLink = sessionStorage.getItem("instagramProfileLink")
      if (savedLink && !profileLink) {
        setProfileLink(savedLink)
      }
    }
  }, [planId, hasActivePlan, isSubLoading, router])

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

      if (planId && !hasActivePlan) {
        router.push(`/checkout/${planId}`);
        return;
      }

      const result = await checkProfile({
        profileUrl: profileLink
      }).unwrap()

      if (result.success) {
        setScanStarted(true)
        // Keep the alert visible for a bit or until redirect
        setTimeout(() => {
          router.push("/results")
        }, 1500)
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
      {!showPaymentPhase && (
        <div className="mb-6 md:mb-10 text-center">
          <p className="text-sm md:text-lg text-gray-600 mb-4 md:mb-6 max-w-2xl mx-auto">{t('description')}</p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-2 bg-purple-50 border border-purple-100 px-3 py-2 md:px-4 md:py-3 rounded-xl sm:rounded-xl transition-colors hover:bg-purple-100/80 max-w-3xl mx-auto">
            <span className="text-purple-700 font-medium text-xs md:text-base whitespace-nowrap">{t('example')}</span>
            <code className="text-purple-600 font-mono text-xs md:text-base break-all">{'https://www.instagram.com/deinbenutzername'}</code>
          </div>
        </div>
      )}

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
        {(activeJob || scanStarted || isMutationLoading) && (
          <Alert className="bg-purple-50 border-purple-200 text-purple-900 animate-in fade-in slide-in-from-top-2">
            <Clock className="h-5 w-5 text-purple-600" />
            <AlertTitle className="font-bold text-purple-800">
              {scanStarted || isMutationLoading ? t('submitting') : t('processing')}
            </AlertTitle>
            <AlertDescription className="text-purple-700 mt-1">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <p>{t('timeNotice')}</p>
                {activeJob && (
                  <Button
                    type="button"
                    variant="outline"
                    className="bg-white border-purple-200 text-purple-700 hover:bg-purple-50 hover:border-purple-300 font-bold px-4 py-1 h-9 rounded-lg shrink-0"
                    onClick={() => router.push('/results')}
                  >
                    {t('viewResults')}
                  </Button>
                )}
              </div>
            </AlertDescription>
          </Alert>
        )}

        {/* Input Field or CTA */}
        {showPaymentPhase ? (
          <div className="flex flex-col items-center justify-center pt-2 gap-3 pb-4">
            <Button
              type="button"
              onClick={(e) => {
                e.preventDefault();
                router.push("/pricing");
              }}
              className="w-full sm:w-auto min-w-[280px] bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white p-6 md:p-8 rounded-full shadow-lg hover:shadow-xl shadow-purple-500/20 flex flex-col items-center justify-center gap-1 transition-all transform hover:-translate-y-0.5 mt-4"
            >
              <div className="text-lg md:text-xl font-bold">{t('purchaseCta')}</div>
            </Button>
            <p className="text-xs md:text-sm text-gray-500 font-medium">
              {t('purchaseSubtext')}
            </p>
          </div>
        ) : (
          <>
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
                disabled={isProcessing || isLoading || isCreatingOrder}
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
            <div className="flex flex-col items-center pt-2">
              <Button
                type="submit"
                disabled={isProcessing || isLoading || isCreatingOrder || (!profileLink.trim() && !activeJob)}
                className="w-full sm:w-auto min-w-[240px] bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white py-3 md:py-7 text-sm md:text-lg font-bold rounded-full shadow-lg hover:shadow-xl shadow-purple-500/20 flex items-center justify-center gap-2.5 transition-all transform hover:-translate-y-0.5 disabled:opacity-70 disabled:hover:translate-y-0 disabled:shadow-none mb-3"
              >
                {isProcessing || isCreatingOrder ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  <Search className="w-5 h-5" />
                )}
                {isProcessing || isCreatingOrder ? t('processing') : t('submit')}
              </Button>
              {planId && !hasActivePlan && (
                <p className="text-xs md:text-sm text-gray-500 font-medium">
                  {t('purchaseSubtext')}
                </p>
              )}
            </div>
          </>
        )}
      </form>
    </div>
  )
}

