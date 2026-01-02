import { Shield, Zap, FileText } from "lucide-react"
import { useTranslations } from "next-intl"

export default function ScanBenefits() {
  const t = useTranslations('ScanBenefits');
  
  const benefits = [
    {
      icon: Shield,
      title: t('secureAnalysis.title'),
      description: t('secureAnalysis.description'),
      bgColor: "bg-emerald-50",
      iconBg: "bg-emerald-500",
    },
    {
      icon: Zap,
      title: t('fastResults.title'),
      description: t('fastResults.description'),
      bgColor: "bg-purple-50",
      iconBg: "bg-purple-500",
    },
    {
      icon: FileText,
      title: t('detailedReports.title'),
      description: t('detailedReports.description'),
      bgColor: "bg-yellow-50",
      iconBg: "bg-yellow-400",
    },
  ]

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {benefits.map((benefit, index) => {
        const Icon = benefit.icon
        return (
          <div key={index} className={`${benefit.bgColor} rounded-xl p-6 border border-gray-200`}>
            <div className={`${benefit.iconBg} w-12 h-12 rounded-lg flex items-center justify-center mb-4`}>
              <Icon className="w-6 h-6 text-white" />
            </div>
            <h3 className="text-lg font-bold text-gray-900 mb-2">{benefit.title}</h3>
            <p className="text-gray-700 text-sm leading-relaxed">{benefit.description}</p>
          </div>
        )
      })}
    </div>
  )
}
