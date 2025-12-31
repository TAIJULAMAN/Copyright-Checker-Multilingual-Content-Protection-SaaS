import { Users, Shield, Zap, Download } from "lucide-react"
import { useTranslations } from "next-intl";

export default function Features() {
  const t = useTranslations('Features');

  const features = [
    {
      icon: Users,
      title: t('f1Title'),
      description: t('f1Desc'),
    },
    {
      icon: Shield,
      title: t('f2Title'),
      description: t('f2Desc'),
    },
    {
      icon: Zap,
      title: t('f3Title'),
      description: t('f3Desc'),
    },
    {
      icon: Download,
      title: t('f4Title'),
      description: t('f4Desc'),
    },
  ]

  return (
    <section className="py-12 sm:py-16 md:py-20 bg-[#1b2149] px-4 sm:px-6">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-8 sm:mb-10 md:mb-14 px-2">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white mb-2 sm:mb-3">
            {t('title')}
          </h2>
          <p className="text-gray-300 text-sm sm:text-base max-w-2xl mx-auto">
            {t('subtitle')}
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5 md:gap-6">
          {features.map((feature, index) => {
            const Icon = feature.icon
            const colorSets = [
              { ring: "ring-green-500/30", text: "text-green-600", bg: "bg-green-50" },
              { ring: "ring-red-500/30", text: "text-red-600", bg: "bg-red-50" },
              { ring: "ring-emerald-500/30", text: "text-emerald-600", bg: "bg-emerald-50" },
              { ring: "ring-teal-500/30", text: "text-teal-600", bg: "bg-teal-50" },
            ]
            const cs = colorSets[index % colorSets.length]
            return (
              <div key={index} className="bg-white p-5 sm:p-6 rounded-xl shadow border border-gray-200 hover:shadow-md transition-shadow duration-200 h-full">
                <div className={`w-9 h-9 sm:w-10 sm:h-10 rounded-md ${cs.bg} ${cs.ring} ring-2 flex items-center justify-center mb-3 sm:mb-4`}>
                  <Icon className={`w-4 h-4 sm:w-5 sm:h-5 ${cs.text}`} />
                </div>
                <h3 className="font-bold text-gray-900 mb-1.5 sm:mb-2 text-base sm:text-lg">
                  {feature.title}
                </h3>
                <p className="text-gray-600 text-sm sm:text-[0.9375rem] leading-relaxed">
                  {feature.description}
                </p>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
