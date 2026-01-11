import { Check } from "lucide-react";
import PricingClient from "./pricing-client";
import { BASE_URL, REVALIDATE_TIME } from "@/redux/api/config";
import { getTranslations } from "next-intl/server";
import { Plan } from "@/redux/api/subscriptionApi";

async function getSubscriptionPlans() {
  try {
    const res = await fetch(`${BASE_URL}/subscription/plans`, {
      next: { revalidate: REVALIDATE_TIME },
    });
    
    if (!res.ok) return null;
    
    return res.json();
  } catch (error) {
    return null;
  }
}

export default async function Pricing() {
  const t = await getTranslations('Pricing');
  const response = await getSubscriptionPlans();
  const plans = response?.data?.plans || [];
  const isLoading = !response && !plans.length; // Not exactly loading, but initial state logic if needed, though mostly null check handles it.
  const error = !response;

  const oneTimePlans = plans.filter(
    (plan: Plan) => plan.subscriptionType === "one-time"
  ) || [];

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

              <PricingClient planId={plan._id} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
