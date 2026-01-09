"use client";

import { Button } from "@/components/ui/button";
import { Check } from "lucide-react";
import Image from "next/image";
import { Link } from "@/i18n/routing";
import { useTranslations } from "next-intl";

export default function Hero() {
  const t = useTranslations('Hero');

  return (
    <section
      className="min-h-[80vh] md:min-h-[70vh] bg-white w-full overflow-hidden"
    >
      <div className="h-full flex items-center">
        <div className="container mx-auto px-5 lg:px-0 py-10 md:py-20 lg:py-24 relative">
          {/* <div className="relative mx-auto mb-6 md:mb-0 w-40 h-40 sm:w-48 sm:h-48 md:absolute md:top-1/5 md:left-1/2 md:-translate-x-1/2 md:-translate-y-1/2 md:w-56 md:h-56 lg:w-48 lg:h-48 z-10">
                <Image
                  src="/hero.png"
                  alt="Copyright Check Badge"
                  fill
                  priority
                  className="object-contain"
                  sizes="(max-width: 768px) 160px, (max-width: 1024px) 192px, 256px"
                />
              </div> */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
              
            {/* Left Column: Text and Actions */}
            <div className="flex flex-col gap-6">
              <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold text-gray-900 leading-tight">
                {t('titlePrefix')}{" "}
                <br className="hidden sm:block" />
                <span> {t('titleMiddle')} </span>
                <br className="hidden sm:block" /> 
                <span className="text-purple-600 inline-block max-w-[800px]">{t('titleSuffix')}</span>
              </h1>

              <div className="max-w-2xl">
                <p className="text-gray-700 text-base sm:text-lg mb-6">
                  {t('description')}
                </p>

                <div className="flex flex-col sm:flex-row gap-4 mb-6">
                  <Button 
                    asChild
                    className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-4 text-base sm:text-lg w-full sm:w-auto flex-shrink-0"
                    size="lg"
                  >
                    <Link href="/scan">
                      <span className="mr-2">▶</span> {t('cta')}
                    </Link>
                  </Button>
                  <div className="flex items-center justify-center sm:justify-start text-sm text-gray-600">
                    
                  </div>
                  
                  
                </div>

                {/* Mobile Image */}
                <div className="relative w-full h-[400px] mb-8 md:hidden">
                  <Image
                    src="/heroupdateimg.png"
                    alt="Copyright Check Badge"
                    fill
                    priority
                    className="object-contain"
                    sizes="100vw"
                  />
                  <div 
                    className="absolute inset-0 pointer-events-none"
                    style={{
                      background: 'linear-gradient(to right, transparent 80%, white 98%)'
                    }}
                  />
                </div>
                {/* <p className="text-center sm:text-left">
                  {t('trust')}
                </p> */}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-3">
                <div className="flex items-center gap-2">
                  <div className="w-5 h-5 rounded-full bg-green-400 flex items-center justify-center">
                    <Check className="w-3 h-3 text-white" />
                  </div>
                  <span className="text-gray-700 text-sm">{t('secure')}</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-5 h-5 rounded-full bg-green-400 flex items-center justify-center">
                    <Check className="w-3 h-3 text-white" />
                  </div>
                  <span className="text-gray-700 text-sm">
                    {t('noLogin')}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-5 h-5 rounded-full bg-green-400 flex items-center justify-center">
                    <Check className="w-3 h-3 text-white" />
                  </div>
                  <span className="text-gray-700 text-sm">{t('aiDetection')}</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-5 h-5 rounded-full bg-green-400 flex items-center justify-center">
                    <Check className="w-3 h-3 text-white" />
                  </div>
                  <span className="text-gray-700 text-sm">{t('instantResults')}</span>
                </div>
              </div>

              <p className="text-xs text-gray-500 leading-relaxed max-w-2xl" dangerouslySetInnerHTML={{__html: t.raw('disclaimer')}} />
            </div>

            {/* Right Column: Image */}
            <div className="relative w-full h-[400px] md:h-[600px] hidden md:block mt-8 md:mt-0">
              <Image
                src="/heroupdateimg.png"
                alt="Copyright Check Badge"
                fill
                priority
                className="object-contain"
                sizes="(max-width: 768px) 100vw, 50vw"
              />
              <div 
                className="absolute inset-0 pointer-events-none"
                style={{
                  background: 'linear-gradient(to right, transparent 80%, white 90%)'
                }}
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
