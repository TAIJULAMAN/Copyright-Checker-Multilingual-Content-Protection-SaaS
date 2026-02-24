"use client";

import ScanForm from "@/components/scan-form"
import ScanBenefits from "@/components/scan-benefits"
import { useTranslations } from "next-intl"
import { useSelector } from "react-redux"
import { selectCurrentUser } from "@/redux/slices/authSlice"
import { useRouter } from "@/i18n/routing"
import { useEffect, Suspense } from "react"
import { useSearchParams } from "next/navigation"

function ScanPageContent() {
  const t = useTranslations('Scan');
  const user = useSelector(selectCurrentUser);
  const router = useRouter();
  const searchParams = useSearchParams();
  const showWelcome = searchParams.get("welcome") === "true";

  useEffect(() => {
    if (!user) {
      const isReturningUser = localStorage.getItem("returningUser") === "true";
      const targetPath = isReturningUser ? "/login" : "/signup";
      router.push(`${targetPath}?callbackUrl=/scan`);
    }
  }, [user, router]);

  if (!user) return null;

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white py-6 md:py-12">
      <div className="max-w-7xl mx-auto px-5 lg:px-0">
        {/* Welcome Message */}
        {showWelcome && (
          <div className="text-center mb-6 animate-in fade-in slide-in-from-top-4 duration-700">
            <p className="text-purple-600 font-bold text-sm md:text-base tracking-tight">
              Willkommen, dein Account ist eingerichtet.
            </p>
          </div>
        )}

        {/* Header Section */}
        <div className="text-center mb-12">
          <h1 className="text-2xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-4 text-balance">{t('title')}</h1>
          <p className="text-sm md:text-lg text-gray-600 text-balance">
            {t('description')}
          </p>
        </div>

        {/* Scan Form Section */}
        <ScanForm />

        {/* Benefits Section */}
        <ScanBenefits />
      </div>
    </div>
  )
}

export default function ScanPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Loading...</div>}>
      <ScanPageContent />
    </Suspense>
  );
}
