import Image from "next/image";
import { useTranslations } from "next-intl";

export default function Testimonials() {
  const t = useTranslations('Testimonials');

  const testimonials = [
    {
      name: t('t1Name'),
      role: t('t1Role'),
      text: t('t1Text'),
      rating: 5,
    },
    {
      name: t('t2Name'),
      role: t('t2Role'),
      text: t('t2Text'),
      rating: 5,
    },
    {
      name: t('t3Name'),
      role: t('t3Role'),
      text: t('t3Text'),
      rating: 5,
    },
  ]

  const starSrc =
    'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="%23f59e0b"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.802 2.036a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118L10 13.348l-2.985 2.125c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L3.38 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/></svg>';

  return (
    <section className="py-16 md:py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10 md:mb-14">
          <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 mb-2">
            {t('title')}
          </h2>
          <p className="text-gray-500 text-sm md:text-base">
            {t('subtitle')}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
          {testimonials.map((testimonial, index) => (
            <div
              key={index}
              className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm hover:shadow transition-shadow"
            >
              <div className="flex items-center gap-3 mb-3">
                <div className="w-12 h-12 rounded-full overflow-hidden ring-1 ring-gray-200">
                  <Image
                    src={`/boy.png`}
                    alt={testimonial.name}
                    className="w-full h-full object-cover"
                    loading="lazy"
                    width={48}
                    height={48}
                    unoptimized
                  />
                </div>
                <div>
                  <p className="font-semibold text-gray-900 leading-tight">
                    {testimonial.name}
                  </p>
                  <p className="text-xs text-gray-500">{testimonial.role}</p>
                </div>
              </div>
              <div className="flex items-center gap-1 mb-3">
                {Array.from({ length: testimonial.rating || 0 }).map((_, i) => (
                  <img key={i} src={starSrc} alt="star" className="w-4 h-4" />
                ))}
              </div>
              <p className="text-gray-700 text-sm leading-relaxed">
                “{testimonial.text}”
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
