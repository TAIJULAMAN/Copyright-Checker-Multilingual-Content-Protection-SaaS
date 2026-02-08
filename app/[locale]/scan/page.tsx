import ScanForm from "@/components/scan-form"
import ScanBenefits from "@/components/scan-benefits"
import { useTranslations } from "next-intl"

export default function ScanPage() {
  const t = useTranslations('Scan');

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white py-6 md:py-12">
      <div className="max-w-7xl mx-auto px-5 lg:px-0">
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
