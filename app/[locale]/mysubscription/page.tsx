"use client";

import { useGetMySubscriptionQuery, useGetSubscriptionPlansQuery, useCreatePayPalOrderMutation } from "@/redux/api/subscriptionApi";
import { format } from "date-fns";
import { Loader2, CreditCard, Calendar, Activity, ShieldCheck, ArrowRight } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "@/i18n/routing";
import { useState } from "react";
import { useTranslations } from "next-intl";

export default function MySubscriptionPage() {
  const t = useTranslations('MySubscription');
  const { data, isLoading, error } = useGetMySubscriptionQuery();

  // Fetch plans for empty state (always fetch to be ready)
  const { data: plansData, isLoading: isPlansLoading } = useGetSubscriptionPlansQuery();
  
  const [createPayPalOrder, { isLoading: isCreatingOrder }] = useCreatePayPalOrderMutation();
  const [selectedPlanId, setSelectedPlanId] = useState<string | null>(null);

  const handleBuyNow = async (planId: string) => {
    setSelectedPlanId(planId);
    try {
      const result = await createPayPalOrder({ planId }).unwrap();
      if (result.success && result.data.approveUrl) {
        window.location.href = result.data.approveUrl;
      }
    } catch (err) {
      console.error("Error creating order:", err);
    } finally {
      setSelectedPlanId(null);
    }
  };

  const recurringPlans = plansData?.data?.plans.filter(
    (plan: any) => plan.subscriptionType === "recurring" && plan.billingCycle === "monthly"
  ) || [];

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-purple-600" />
      </div>
    );
  }

  // Check for error (excluding 404/null subscription which is handled below)
  if (error || (!data?.success && data?.message !== "User subscription fetched successfully")) {
     // NOTE: We might want to be more specific about errors, but for now fallback roughly
     // If data is just missing subscription, success might still be true or handled.
     // Let's rely on data?.data?.subscription check mainly.
  }

  const subscription = data?.data?.subscription;
  const plan = data?.data?.plan;
  const remainingChecks = data?.data?.remainingChecks;

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto space-y-12">
        
        {/* SECTION 1: MY SUBSCRIPTION STATUS */}
        <div>
            {subscription && plan ? (
                <div className="space-y-8">
                    <div>
                    <h1 className="text-3xl font-bold text-gray-900">{t('title')}</h1>
                    <p className="text-gray-600 mt-2">{t('description')}</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {/* Main Plan Card */}
                    <Card className="md:col-span-2 shadow-md">
                        <CardHeader className="pb-4 border-b">
                        <div className="flex justify-between items-start">
                            <div>
                            <CardTitle className="text-2xl text-purple-700">{plan.name}</CardTitle>
                            <CardDescription className="capitalize mt-1">
                                {subscription.subscriptionType} {t('payment')}
                            </CardDescription>
                            </div>
                            <div className={`px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wide ${
                            subscription.status === 'active' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'
                            }`}>
                            {subscription.status}
                            </div>
                        </div>
                        </CardHeader>
                        <CardContent className="pt-6 space-y-6">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                            <div className="flex items-start gap-4">
                            <div className="p-3 bg-purple-100 rounded-lg">
                                <Calendar className="w-6 h-6 text-purple-600" />
                            </div>
                            <div>
                                <h3 className="font-medium text-gray-900">{t('startDate')}</h3>
                                <p className="text-sm text-gray-500">
                                {format(new Date(subscription.startDate), "MMMM d, yyyy")}
                                </p>
                            </div>
                            </div>
                            <div className="flex items-start gap-4">
                            <div className="p-3 bg-purple-100 rounded-lg">
                                <Calendar className="w-6 h-6 text-purple-600" />
                            </div>
                            <div>
                                <h3 className="font-medium text-gray-900">{t('endDate')}</h3>
                                <p className="text-sm text-gray-500">
                                {new Date(subscription.endDate).getFullYear() > 2100 ? t('lifetime') : format(new Date(subscription.endDate), "MMMM d, yyyy")}
                                </p>
                            </div>
                            </div>
                            <div className="flex items-start gap-4">
                            <div className="p-3 bg-purple-100 rounded-lg">
                                <CreditCard className="w-6 h-6 text-purple-600" />
                            </div>
                            <div>
                                <h3 className="font-medium text-gray-900">{t('amountPaid')}</h3>
                                <p className="text-sm text-gray-500">${plan.price}</p>
                            </div>
                            </div>
                            <div className="flex items-start gap-4">
                            <div className="p-3 bg-purple-100 rounded-lg">
                                <ShieldCheck className="w-6 h-6 text-purple-600" />
                            </div>
                            <div>
                                <h3 className="font-medium text-gray-900">{t('planType')}</h3>
                                <p className="text-sm text-gray-500 capitalize">{subscription.planType}</p>
                            </div>
                            </div>
                        </div>
                        </CardContent>
                    </Card>

                    {/* Usage Stats Card */}
                    <Card className="shadow-md bg-purple-600 text-white border-none">
                        <CardHeader className="pb-2">
                        <CardTitle className="text-lg flex items-center gap-2">
                            <Activity className="w-5 h-5" /> {t('usageStats')}
                        </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-6 pt-4">
                        <div>
                            <p className="text-purple-100 text-sm mb-1">{t('totalLimit')}</p>
                            <div className="text-3xl font-bold">{subscription.accountLimit} {t('accounts')}</div>
                        </div>
                        <div>
                            <p className="text-purple-100 text-sm mb-1">{t('checksUsed')}</p>
                            <div className="text-3xl font-bold">{subscription.checksUsed}</div>
                        </div>
                        <div className="pt-4 border-t border-purple-500/30">
                            <p className="text-purple-100 text-sm mb-1">{t('remaining')}</p>
                            <div className="text-4xl font-extrabold">{remainingChecks}</div>
                            <p className="text-xs text-purple-200 mt-1">{t('availableChecks')}</p>
                        </div>
                        </CardContent>
                    </Card>
                    </div>

                    <div className="flex justify-end pt-4">
                    <Link href="/scan">
                        <Button className="bg-purple-600 hover:bg-purple-700 text-lg px-8 py-6 h-auto shadow-lg">
                        {t('startNewScan')} <ArrowRight className="ml-2 w-5 h-5" />
                        </Button>
                    </Link>
                    </div>
                </div>
            ) : (
                <div className="text-center py-10">
                    <div className="inline-flex p-3 bg-purple-100 rounded-full mb-4">
                        <CreditCard className="w-8 h-8 text-purple-600" />
                    </div>
                    <h2 className="text-3xl font-bold text-gray-900 mb-2">{t('noActive')}</h2>
                    <p className="text-gray-600 max-w-lg mx-auto">
                        {t('noActiveDesc')}
                    </p>
                </div>
            )}
        </div>

        <div className="border-t border-gray-200 pt-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">{t('availablePlans')}</h2>
            
            {isPlansLoading ? (
            <div className="flex justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-purple-600" />
            </div>
            ) : recurringPlans.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 w-full">
                {recurringPlans.map((plan: any) => (
                <div
                    key={plan._id}
                    className="relative rounded-xl p-8 border border-gray-200 bg-white hover:shadow-lg transition-shadow flex flex-col"
                >
                    <div className="text-center">
                    <h3 className="text-xl font-bold text-gray-900 mb-2">{plan.name}</h3>
                    <div className="flex items-baseline justify-center my-4">
                        <span className="text-4xl font-bold text-[#1b2149]">${plan.price}</span>
                    </div>
                    <p className="text-sm text-gray-500 capitalize mb-6">{plan.billingCycle} {t('payment')}</p>
                    </div>
                    
                    <div className="space-y-3 flex-grow mb-8">
                    {plan.features.map((feature: string, i: number) => (
                        <div key={i} className="flex items-start gap-3">
                        <div className="mt-0.5 rounded-full bg-green-100 p-1">
                            <ShieldCheck className="w-3 h-3 text-green-600" />
                        </div>
                        <span className="text-gray-700 text-sm">{feature}</span>
                        </div>
                    ))}
                    </div>

                    <Button
                    onClick={() => handleBuyNow(plan._id)}
                    disabled={isCreatingOrder && selectedPlanId === plan._id}
                    className="w-full bg-purple-600 hover:bg-purple-700 text-white"
                    >
                    {isCreatingOrder && selectedPlanId === plan._id ? (
                        <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        {t('processing')}
                        </>
                    ) : (
                        t('subscribe')
                    )}
                    </Button>
                </div>
                ))}
            </div>
            ) : (
                <div className="text-center p-8 bg-white rounded-lg border border-gray-200">
                    <h3 className="text-lg font-medium text-gray-900">{t('noPlans')}</h3>
                    <p className="text-gray-500 mt-2">
                        {t('noPlansDesc')}
                    </p>
                </div>
            )}
        </div>
      </div>
    </div>
  );
}
