"use client"

import { useState, useEffect } from "react"
import { useTranslations, useLocale } from "next-intl"
import { Link, useRouter, usePathname } from "@/i18n/routing"
import { Button } from "@/components/ui/button"
import { X, Globe } from "lucide-react"

export default function CookieBanner() {
    const t = useTranslations("CookieBanner")
    const locale = useLocale()
    const router = useRouter()
    const pathname = usePathname()

    const [isVisible, setIsVisible] = useState(false)
    const [showDenyOffer, setShowDenyOffer] = useState(false)

    useEffect(() => {
        const consent = localStorage.getItem("cookie-consent")
        if (!consent) {
            setIsVisible(true)
        }
    }, [])

    const handleAccept = () => {
        localStorage.setItem("cookie-consent", "accepted")
        setIsVisible(false)
    }

    const handleDeny = () => {
        setShowDenyOffer(true)
    }

    const handleSwitchToGerman = () => {
        localStorage.setItem("cookie-consent", "accepted-de")
        router.push(pathname, { locale: "de" })
        setIsVisible(false)
    }

    const handleStay = () => {
        localStorage.setItem("cookie-consent", "denied")
        setIsVisible(false)
    }

    const handleClose = () => {
        setIsVisible(false)
    }

    if (!isVisible) return null

    return (
        <div className="fixed inset-x-0 bottom-0 z-[100] p-4 md:p-6 lg:p-8 bg-background/95 backdrop-blur-xl border-t shadow-2xl animate-in slide-in-from-bottom duration-500">
            <div className="max-w-7xl mx-auto relative">
                <button
                    onClick={handleClose}
                    className="absolute -top-2 -right-2 md:top-0 md:right-0 p-2 rounded-full hover:bg-muted font-bold transition-all"
                    aria-label="Close"
                >
                    <X className="w-5 h-5" />
                </button>

                {!showDenyOffer ? (
                    <>
                        <div className="flex flex-col md:flex-row md:items-start justify-between gap-6 pr-10">
                            <div className="flex-1">
                                <div className="flex items-center gap-3 mb-3">
                                    <h2 className="text-xl md:text-2xl font-bold tracking-tight text-foreground">{t("title")}</h2>
                                    <div className="hidden sm:flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-primary/10 text-[10px] font-bold uppercase tracking-wider text-primary border border-primary/20">
                                        <Globe className="w-3 h-3" />
                                        <span>{locale === 'en' ? 'English' : 'Deutsch'}</span>
                                    </div>
                                </div>
                                <p className="text-sm md:text-base text-muted-foreground leading-relaxed max-w-5xl">
                                    {t("description")}
                                </p>
                            </div>
                        </div>

                        <div className="mt-8 flex flex-col sm:flex-row items-center justify-between gap-6">
                            <div className="flex flex-wrap items-center gap-3 w-full sm:w-auto">
                                <Button
                                    variant="outline"
                                    size="lg"
                                    className="flex-1 sm:flex-none min-w-[120px] font-bold border-2 hover:bg-muted transition-all active:scale-95"
                                    onClick={handleDeny}
                                >
                                    {t("deny")}
                                </Button>
                        
                                <Button
                                    size="lg"
                                    className="w-full sm:w-auto min-w-[160px] font-bold bg-primary text-primary-foreground hover:bg-primary/90 shadow-lg shadow-primary/20 transition-all active:scale-95"
                                    onClick={handleAccept}
                                >
                                    {t("ok")}
                                </Button>
                            </div>

                            <div className="flex items-center gap-6 text-xs font-bold text-muted-foreground">
                                <Link href="/imprint" className="hover:text-primary transition-colors uppercase tracking-widest">{t("imprint")}</Link>
                                <Link href="/privacy" className="hover:text-primary transition-colors uppercase tracking-widest">{t("privacy")}</Link>
                                <Link href="/terms" className="hover:text-primary transition-colors uppercase tracking-widest">{t("terms")}</Link>
                                <Link href="/about" className="hover:text-primary transition-colors uppercase tracking-widest">{t("about")}</Link>
                        
                            </div>
                        </div>
                    </>
                ) : (
                    <div className="flex flex-col items-center text-center py-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                        <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-6">
                            <Globe className="w-8 h-8 text-primary" />
                        </div>
                        <h2 className="text-xl md:text-2xl font-bold mb-3 max-w-2xl">{t("denyMessage")}</h2>
                        <p className="text-muted-foreground mb-8 max-w-lg">
                            Your privacy choices are important to us. You can continue in English with limited features or switch to the German version for the full local experience.
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
                            <Button variant="ghost" className="font-bold py-6 px-8" onClick={handleStay}>
                                Stay in English
                            </Button>
                            <Button onClick={handleSwitchToGerman} size="lg" className="bg-primary hover:bg-primary/90 font-bold py-6 px-10 shadow-xl shadow-primary/20">
                                {t("switchToGerman")}
                            </Button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}
