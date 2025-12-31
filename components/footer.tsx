import Image from "next/image";
import { Link } from "@/i18n/routing";
import { Lock, ShieldCheck, Twitter, Instagram, Linkedin } from "lucide-react";
import { useTranslations } from "next-intl";

export default function Footer() {
  const t = useTranslations('Footer');

  return (
    <footer className="bg-gray-900 text-gray-400 py-12">
      <div className="container mx-auto px-5 lg:px-0">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          <div>
            <div className="flex items-center justify-center gap-2 mb-4">
              <Image src="/hero.png" alt="Logo" width={100} height={100} />
            </div>
            <p className="text-sm">
              {t('disclaimer')}
            </p>
            <div className="mt-4 flex items-center gap-8">
              <div className="flex items-center gap-2">
                <Lock className="w-5 h-5 text-green-500" />
                <span className="text-gray-300">{t('ssl')}</span>
              </div>
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-green-500" />
                <span className="text-gray-300">{t('paypal')}</span>
              </div>
            </div>
          </div>

          <div>
            <h4 className="text-white font-semibold mb-4">{t('product')}</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/#features" className="hover:text-white">
                  {t('features')}
                </Link>
              </li>
              <li>
                <Link href="/pricing" className="hover:text-white">
                  {t('pricing')}
                </Link>
              </li>
              <li>
                <Link href="/faq" className="hover:text-white">
                  {t('helpCenter')}
                </Link>
              </li>
              <li>
                <Link href="/blog" className="hover:text-white">
                  {t('blog')}
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-semibold mb-4">{t('support')}</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/contact" className="hover:text-white">
                  {t('contact')}
                </Link>
              </li>
              <li>
                <Link href="/privacy" className="hover:text-white">
                  {t('privacy')}
                </Link>
              </li>
              <li>
                <Link href="/terms" className="hover:text-white">
                  {t('terms')}
                </Link>
              </li>
              <li>
                <Link href="/about" className="hover:text-white">
                  {t('about')}
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-semibold mb-4">{t('connect')}</h4>
            <div className="flex items-center gap-3">
              <Link
                href="#"
                aria-label="Twitter"
                className="p-2 rounded-lg bg-gray-800 hover:bg-gray-700 transition-colors"
              >
                <Twitter className="w-5 h-5 text-sky-400" />
              </Link>
              <Link
                href="#"
                aria-label="Instagram"
                className="p-2 rounded-lg bg-gray-800 hover:bg-gray-700 transition-colors"
              >
                <Instagram className="w-5 h-5 text-purple-500" />
              </Link>
              <Link
                href="#"
                aria-label="LinkedIn"
                className="p-2 rounded-lg bg-gray-800 hover:bg-gray-700 transition-colors"
              >
                <Linkedin className="w-5 h-5 text-sky-500" />
              </Link>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-800 pt-8 text-center text-sm">
          <p>{t('copyright')}</p>
        </div>
      </div>
    </footer>
  );
}
