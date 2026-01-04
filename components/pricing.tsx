"use client";

import { Button } from "@/components/ui/button";
import { useGetSubscriptionPlansQuery } from "@/redux/api/subscriptionApi";
import { Check } from "lucide-react";
import { useRouter } from "@/i18n/routing";
import { useState } from "react";
import { toast } from "sonner";
import { useSelector } from "react-redux";
import { selectCurrentUser } from "@/redux/slices/authSlice";
import { useTranslations } from "next-intl";

export default function Pricing() {
  const router = useRouter();
  const t = useTranslations('Pricing');
  const user = useSelector(selectCurrentUser);
  const { data, isLoading, error } = useGetSubscriptionPlansQuery();
  const handleBuyNow = (planId: string) => {
    if (!user) {
      router.push(`/login?callbackUrl=/checkout/${planId}`);
      return;
    }
    router.push(`/checkout/${planId}`);
  };

  const oneTimePlans = data?.data?.plans.filter(
    (plan) => plan.subscriptionType === "one-time"
  ) || [];

  if (isLoading) return <div className="py-20 text-center">{t('loading')}</div>;
  if (error) return <div className="py-20 text-center text-red-500">{t('error')}</div>;

  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            {t('title')}
          </h2>
          <p className="text-gray-600">{t('subtitle')}</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {oneTimePlans.map((plan) => (
            <div
              key={plan._id}
              className="relative rounded-xl p-8 border border-gray-200 bg-white hover:shadow-lg transition-shadow"
            >
              <div className="flex justify-center items-center gap-2">
                <h3 className="text-xl font-bold text-gray-900 mb-2">
                  {plan.name}
                </h3>
              </div>
              <div className="space-y-3 mt-5 min-h-[150px]">
                {plan.features.map((feature, i) => (
                  <div key={i} className="flex items-start gap-3">
                    <Check className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                    <span className="text-gray-700 text-sm">{feature}</span>
                  </div>
                ))}
              </div>
              <div className="flex items-baseline justify-center my-5">
                <span className="text-4xl font-bold text-[#1b2149]">
                  ${plan.price}
                </span>
              </div>
              <div className="flex items-center justify-center">
                <p className="text-gray-600 text-sm mb-6 capitalize">{plan.billingCycle} {t('payment')}</p>
              </div>

              <Button
                onClick={() => handleBuyNow(plan._id)}
                className="w-full mb-6 bg-purple-600 hover:bg-purple-700 text-white"
              >
                {t('buyNow')}
              </Button>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
