"use client";

import { Button } from "@/components/ui/button";
import { useRouter } from "@/i18n/routing";
import { useSelector } from "react-redux";
import { selectCurrentUser } from "@/redux/slices/authSlice";
import { useTranslations } from "next-intl";

interface PricingClientProps {
  planId: string;
}

export default function PricingClient({ planId }: PricingClientProps) {
  const router = useRouter();
  const t = useTranslations('Pricing');
  const user = useSelector(selectCurrentUser);

  const handleBuyNow = () => {
    if (!user) {
      const isReturningUser = localStorage.getItem("returningUser") === "true";
      const targetPath = isReturningUser ? "/login" : "/signup";
      const callbackUrl = encodeURIComponent(`/checkout/${planId}`);
      router.push(`${targetPath}?callbackUrl=${callbackUrl}`);
      return;
    }
    router.push(`/checkout/${planId}`);
  };

  return (
    <div className="flex flex-col items-center">
      <Button
        onClick={handleBuyNow}
        className="w-full mb-2 bg-purple-600 hover:bg-purple-700 text-white rounded-full"
      >
        {t('buyNow')}
      </Button>
      <p className="text-[10px] text-gray-500 text-center mb-6">
        {t('purchaseSubtext')}
      </p>
    </div>
  );
}
