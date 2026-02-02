"use client";

import MySubscriptionClient from "@/components/my-subscription-client";
import { useGetSubscriptionPlansQuery, useGetSubscriptionHistoryQuery } from "@/redux/api/subscriptionApi";
import { Loader2 } from "lucide-react";

export default function MySubscriptionPage() {
  const { data: plansResponse, isLoading: isPlansLoading } = useGetSubscriptionPlansQuery();
  // Call history with default params since we can't easily get page/limit from server props in client component initially,
  // or we can just fetch the first page.
  const { data: historyResponse, isLoading: isHistoryLoading } = useGetSubscriptionHistoryQuery({ page: 1, limit: 10 });

  const plansData = plansResponse?.data?.plans || [];
  const subscriptionHistory = historyResponse?.data?.subscriptions || [];

  const recurringPlans = plansData.filter(
    (plan: any) => plan.subscriptionType === "recurring" && plan.billingCycle === "monthly"
  ) || [];

  if (isPlansLoading || isHistoryLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-gray-500" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <MySubscriptionClient recurringPlans={recurringPlans} subscriptionHistory={subscriptionHistory} />
    </div>
  );
}
