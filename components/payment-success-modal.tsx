"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import Image from "next/image";
import { useTranslations } from "next-intl";

interface PaymentSuccessModalProps {
  isOpen: boolean;
  onClose: () => void;
  price?: number;
}

export default function PaymentSuccessModal({
  isOpen,
  onClose,
  price = 9.99,
}: PaymentSuccessModalProps) {
  const router = useRouter();
  const t = useTranslations('PaymentSuccessModal');
  const [generatingTime, setGeneratingTime] = useState(5);

  useEffect(() => {
    if (!isOpen) return;

    const timer = setInterval(() => {
      setGeneratingTime((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [isOpen]);

  const handleViewResults = () => {
    onClose();
    router.push("/scan");
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-2xl p-8 md:p-12 max-w-lg w-full text-center space-y-6 animate-in zoom-in-95 duration-300">
        {/* Success Icon */}
        <div className="flex justify-center">
          <div className="bg-green-100 p-4 rounded-full">
            <Image src="/payment.png" alt="Success" width={60} height={60} className="object-contain" />
          </div>
        </div>

        {/* Heading */}
        <div className="space-y-2">
          <h2 className="text-3xl font-extrabold text-gray-900 tracking-tight">
            {t('title')}
          </h2>
          <p className="text-gray-600 font-medium text-lg">
            {t('description')}
          </p>
        </div>

        {/* Status Message */}
        <div className="bg-gray-50 rounded-xl p-5 space-y-4 border border-gray-100">
          <p className="text-sm text-gray-600 leading-relaxed">
            {t('status')}
          </p>
          <div className="flex items-center justify-center gap-2 py-2 px-4 bg-white rounded-lg shadow-sm w-fit mx-auto border border-purple-100">
            <div className="w-2 h-2 rounded-full bg-purple-600 animate-pulse" />
            <p className="text-sm font-bold text-purple-600">
              {generatingTime > 0
                ? `${t('generating')} (${generatingTime}s)`
                : t('ready')}
            </p>
          </div>
        </div>

        <div className="rounded-xl border border-gray-100 p-5 text-left space-y-4 bg-white shadow-sm">
          <div className="flex items-center justify-between border-b border-gray-50 pb-3">
            <div>
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">{t('invoice')}</p>
              <p className="font-bold text-gray-900">#CW-{new Date().getFullYear()}-00{Math.floor(Math.random() * 99) + 1}</p>
            </div>
            <div className="text-right">
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">{t('date')}</p>
              <p className="font-bold text-gray-900">{new Date().toLocaleDateString('de-DE')}</p>
            </div>
          </div>
          <div className="space-y-3">
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-500 font-medium">{t('item')}</span>
              <span className="text-gray-900 font-bold">€{price.toFixed(2).replace('.', ',')}</span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-500 font-medium">{t('paymentMethod')}</span>
              <span className="text-[#003087] font-bold flex items-center gap-1.5">
                <img src="/paypal.png" alt="PayPal" className="h-3" />
                PayPal
              </span>
            </div>
          </div>
          <div className="border-t border-gray-100 pt-3 flex items-center justify-between">
            <span className="text-sm font-extrabold text-gray-900 uppercase tracking-tight">{t('totalPaid')}</span>
            <span className="text-xl font-black text-purple-600">€{price.toFixed(2).replace('.', ',')}</span>
          </div>
        </div>

        {/* View Results Button */}
        <Button
          onClick={handleViewResults}
          className="w-full bg-purple-600 hover:bg-purple-700 text-white py-7 text-xl font-bold rounded-xl transition-all shadow-lg hover:shadow-purple-200 active:scale-[0.98] ring-offset-2 focus:ring-2 focus:ring-purple-600"
        >
          {t('cta')}
        </Button>
      </div>
    </div>
  );
}
