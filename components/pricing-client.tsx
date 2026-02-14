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
      router.push(`/login?callbackUrl=/checkout/${planId}`);
      return;
    }
    router.push(`/checkout/${planId}`);
  };

  return (
    <Button
      onClick={handleBuyNow}
      className="w-full mb-6 bg-purple-600 hover:bg-purple-700 text-white rounded-full"
    >
      {t('buyNow')}
    </Button>
  );
}
