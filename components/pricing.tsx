"use client";

import { Check, Loader2, ShieldCheck } from "lucide-react";
import PricingClient from "./pricing-client";
import { useTranslations } from "next-intl";
import { Plan, useGetSubscriptionPlansQuery } from "@/redux/api/subscriptionApi";

export default function Pricing() {
  const t = useTranslations('Pricing');
  const { data: response, isLoading, isError } = useGetSubscriptionPlansQuery();
  const plans = response?.data?.plans || [];

  const oneTimePlans = plans.filter(
    (plan: Plan) => plan.subscriptionType === "one-time"
  ) || [];

  if (isLoading) {
    return (
      <div className="py-20 flex justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-[#1b2149]" />
      </div>
    );
  }

  if (isError) return <div className="py-20 text-center text-red-500">{t('error')}</div>;

  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            {t('title')}
          </h2>
          {/* <p className="text-gray-600">{t('subtitle')} </p> */}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {oneTimePlans.map((plan: Plan) => (
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
                    <ShieldCheck className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                    <span className="text-gray-700 text-sm">{feature}</span>
                  </div>
                ))}
              </div>
              <div className="flex flex-col items-center justify-center my-5">
                <span className="text-4xl font-bold text-[#1b2149]">
                  €{plan.price}
                </span>
                <span className="text-sm text-gray-500 italic mt-1">{t('vatIncl')}</span>
              </div>
              {/* <div className="flex items-center justify-center">
                <p className="text-gray-600 text-sm mb-6 capitalize"> {t('payment')}</p>
              </div> */}

              <PricingClient planId={plan._id} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
