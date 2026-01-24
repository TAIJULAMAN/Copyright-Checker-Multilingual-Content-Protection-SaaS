"use client";

import {
    useGetMySubscriptionQuery,
    useCreatePayPalOrderMutation,
    useGetSubscriptionHistoryQuery,
    useCancelSubscriptionMutation,
} from "@/redux/api/subscriptionApi";
import { format } from "date-fns";
import { Loader2, CreditCard, Calendar, Activity, ShieldCheck, ArrowRight, XCircle, ChevronLeft, ChevronRight } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "@/i18n/routing";
import { useState } from "react";
import { useTranslations } from "next-intl";
import Swal from "sweetalert2";
import { toast } from "sonner"; // Assuming sonner is used for toast notifications

interface MySubscriptionClientProps {
    recurringPlans: any[];
}

export default function MySubscriptionClient({ recurringPlans }: MySubscriptionClientProps) {
    const t = useTranslations("MySubscription");
    const { data, isLoading, error } = useGetMySubscriptionQuery();
    const [page, setPage] = useState(1);
    const limit = 5;
    const { data: historyData, isLoading: isHistoryLoading } = useGetSubscriptionHistoryQuery({ page, limit });
    const [cancelSubscription, { isLoading: isCancelling }] = useCancelSubscriptionMutation();

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

    const handleCancelSubscription = () => {
        Swal.fire({
            title: t("cancelConfirmationTitle") || "Are you sure?",
            text: t("cancelConfirmationText") || "You won't be able to revert this!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#d33",
            cancelButtonColor: "#3085d6",
            confirmButtonText: t("yesCancel") || "Yes, cancel it!",
            cancelButtonText: t("noKeepIt") || "No, keep it",
        }).then(async (result) => {
            if (result.isConfirmed) {
                try {
                    const res = await cancelSubscription().unwrap();
                    if (res.success) {
                        Swal.fire(
                            t("cancelledTitle") || "Cancelled!",
                            t("cancelledText") || "Your subscription has been cancelled.",
                            "success"
                        );
                    } else {
                        Swal.fire("Error", res.message || "Failed to cancel subscription", "error");
                    }
                } catch (error: any) {
                    Swal.fire("Error", error?.data?.message || "Something went wrong", "error");
                }
            }
        });
    };

    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-purple-600" />
            </div>
        );
    }

    // Check for error (excluding 404/null subscription which is handled below)
    if (error || (!data?.success && data?.message !== "User subscription fetched successfully")) {
        // Fallback handled nicely below if subscription is null, but if error is real (e.g. 500), UI might just show no active subscription or similar.
    }

    const subscription = data?.data?.subscription;
    const plan = data?.data?.plan;
    const remainingChecks = data?.data?.remainingChecks;

    // History data
    const subscriptionHistory = historyData?.data?.subscriptions || [];
    const meta = historyData?.data?.pagination;

    const totalPages = meta?.totalPages || 0;

    return (
        <div className="max-w-6xl mx-auto space-y-12">
            {/* SECTION 1: MY SUBSCRIPTION STATUS */}
            <div>
                {subscription && plan ? (
                    <div className="space-y-8">
                        <div>
                            <h1 className="text-3xl font-bold text-gray-900">{t("title")}</h1>
                            <p className="text-gray-600 mt-2">{t("description")}</p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            {/* Main Plan Card */}
                            <Card className="md:col-span-2 shadow-md">
                                <CardHeader className="pb-4 border-b">
                                    <div className="flex justify-between items-start">
                                        <div>
                                            <CardTitle className="text-2xl text-purple-700">{plan.name}</CardTitle>
                                            <CardDescription className="capitalize mt-1">
                                                {subscription.subscriptionType} {t("payment")}
                                            </CardDescription>
                                        </div>
                                        <div
                                            className={`px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wide ${subscription.status === "active" ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-700"
                                                }`}
                                        >
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
                                                <h3 className="font-medium text-gray-900">{t("startDate")}</h3>
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
                                                <h3 className="font-medium text-gray-900">{t("endDate")}</h3>
                                                <p className="text-sm text-gray-500">
                                                    {new Date(subscription.endDate).getFullYear() > 2100
                                                        ? t("lifetime")
                                                        : format(new Date(subscription.endDate), "MMMM d, yyyy")}
                                                </p>
                                            </div>
                                        </div>
                                        <div className="flex items-start gap-4">
                                            <div className="p-3 bg-purple-100 rounded-lg">
                                                <CreditCard className="w-6 h-6 text-purple-600" />
                                            </div>
                                            <div>
                                                <h3 className="font-medium text-gray-900">{t("amountPaid")}</h3>
                                                <p className="text-sm text-gray-500">${plan.price}</p>
                                            </div>
                                        </div>
                                        <div className="flex items-start gap-4">
                                            <div className="p-3 bg-purple-100 rounded-lg">
                                                <ShieldCheck className="w-6 h-6 text-purple-600" />
                                            </div>
                                            <div>
                                                <h3 className="font-medium text-gray-900">{t("planType")}</h3>
                                                <p className="text-sm text-gray-500 capitalize">{subscription.planType}</p>
                                            </div>
                                        </div>
                                    </div>

                                    {subscription.status === 'active' && (
                                        <div className="pt-4 border-t border-gray-100 flex justify-end">
                                            <Button
                                                variant="destructive"
                                                onClick={handleCancelSubscription}
                                                disabled={isCancelling}
                                                className="flex items-center gap-2"
                                            >
                                                {isCancelling ? <Loader2 className="w-4 h-4 animate-spin" /> : <XCircle className="w-4 h-4" />}
                                                {t('cancelSubscription') || "Cancel Subscription"}
                                            </Button>
                                        </div>
                                    )}
                                </CardContent>
                            </Card>

                            {/* Usage Stats Card */}
                            <Card className="shadow-md bg-purple-600 text-white border-none">
                                <CardHeader className="pb-2">
                                    <CardTitle className="text-lg flex items-center gap-2">
                                        <Activity className="w-5 h-5" /> {t("usageStats")}
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-6 pt-4">
                                    <div>
                                        <p className="text-purple-100 text-sm mb-1">{t("totalLimit")}</p>
                                        <div className="text-3xl font-bold">
                                            {subscription.accountLimit} {t("accounts")}
                                        </div>
                                    </div>
                                    <div>
                                        <p className="text-purple-100 text-sm mb-1">{t("checksUsed")}</p>
                                        <div className="text-3xl font-bold">{subscription.checksUsed}</div>
                                    </div>
                                    <div className="pt-4 border-t border-purple-500/30">
                                        <p className="text-purple-100 text-sm mb-1">{t("remaining")}</p>
                                        <div className="text-4xl font-extrabold">{remainingChecks}</div>
                                        <p className="text-xs text-purple-200 mt-1">{t("availableChecks")}</p>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>

                        <div className="flex justify-end pt-4">
                            <Link href="/scan">
                                <Button className="bg-purple-600 hover:bg-purple-700 text-lg px-8 py-6 h-auto shadow-lg">
                                    {t("startNewScan")} <ArrowRight className="ml-2 w-5 h-5" />
                                </Button>
                            </Link>
                        </div>
                    </div>
                ) : (
                    <div className="text-center py-10">
                        <div className="inline-flex p-3 bg-purple-100 rounded-full mb-4">
                            <CreditCard className="w-8 h-8 text-purple-600" />
                        </div>
                        <h2 className="text-3xl font-bold text-gray-900 mb-2">{t("noActive")}</h2>
                        <p className="text-gray-600 max-w-lg mx-auto">{t("noActiveDesc")}</p>
                    </div>
                )}
            </div>

            {/* SECTION 2: SUBSCRIPTION HISTORY */}
            <div className="border-t border-gray-200 pt-12">
                <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">
                    {t("historyTitle") || "Subscription History"}
                </h2>

                {isHistoryLoading ? (
                    <div className="flex justify-center py-8">
                        <Loader2 className="h-8 w-8 animate-spin text-purple-600" />
                    </div>
                ) : subscriptionHistory && subscriptionHistory.length > 0 ? (
                    <>
                        <Card className="shadow-sm">
                            <CardContent className="p-0">
                                {/* Mobile View: Cards */}
                                <div className="md:hidden divide-y divide-gray-100">
                                    {subscriptionHistory.map((sub: any) => (
                                        <div key={sub._id} className="p-4 space-y-3">
                                            <div className="flex justify-between items-start">
                                                <div>
                                                    <p className="font-medium text-gray-900">
                                                        {sub.planId?.name ||
                                                            (sub.planType === "2-account" ? "2 Accounts" : "1 Account")}
                                                    </p>
                                                    <p className="text-xs text-gray-500 mt-0.5">
                                                        {format(new Date(sub.startDate), "MMM d, yyyy")} -{" "}
                                                        {format(new Date(sub.endDate), "MMM d, yyyy")}
                                                    </p>
                                                </div>
                                                <span
                                                    className={`inline-flex px-2 py-0.5 rounded-full text-xs font-medium capitalize ${sub.status === "active"
                                                        ? "bg-green-100 text-green-700"
                                                        : sub.status === "expired"
                                                            ? "bg-gray-100 text-gray-600"
                                                            : "bg-red-50 text-red-600"
                                                        }`}
                                                >
                                                    {sub.status}
                                                </span>
                                            </div>
                                            <div className="flex items-center justify-between text-sm text-gray-600 bg-gray-50 p-2 rounded">
                                                <span>{t("checksUsed")}</span>
                                                <span className="font-medium">
                                                    {sub.checksUsed} / {sub.accountLimit}
                                                </span>
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                {/* Desktop View: Table */}
                                <div className="hidden md:block overflow-x-auto">
                                    <table className="w-full text-left text-sm text-gray-600">
                                        <thead className="bg-gray-50 text-gray-900 border-b border-gray-100">
                                            <tr>
                                                <th className="px-6 py-4 font-semibold">{t("plan") || "Plan"}</th>
                                                <th className="px-6 py-4 font-semibold">{t("status") || "Status"}</th>
                                                <th className="px-6 py-4 font-semibold">{t("date") || "Date"}</th>
                                                <th className="px-6 py-4 font-semibold">{t("checksUsed") || "Checks Used"}</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-gray-100">
                                            {subscriptionHistory.map((sub: any) => (
                                                <tr key={sub._id} className="hover:bg-gray-50/50">
                                                    <td className="px-6 py-4 font-medium text-gray-900">
                                                        {sub.planId?.name ||
                                                            (sub.planType === "2-account" ? "2 Accounts" : "1 Account")}
                                                    </td>
                                                    <td className="px-6 py-4">
                                                        <span
                                                            className={`inline-flex px-2 py-0.5 rounded-full text-xs font-medium capitalize ${sub.status === "active"
                                                                ? "bg-green-100 text-green-700"
                                                                : sub.status === "expired"
                                                                    ? "bg-gray-100 text-gray-600"
                                                                    : "bg-red-50 text-red-600"
                                                                }`}
                                                        >
                                                            {sub.status}
                                                        </span>
                                                    </td>
                                                    <td className="px-6 py-4">
                                                        {format(new Date(sub.startDate), "MMM d, yyyy")} -{" "}
                                                        {format(new Date(sub.endDate), "MMM d, yyyy")}
                                                    </td>
                                                    <td className="px-6 py-4">
                                                        {sub.checksUsed} / {sub.accountLimit}
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Pagination Controls */}
                        {totalPages > 1 && (
                            <div className="flex justify-center items-center gap-4 mt-6">
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => setPage(p => Math.max(1, p - 1))}
                                    disabled={page === 1}
                                >
                                    <ChevronLeft className="h-4 w-4" /> Previous
                                </Button>
                                <span className="text-sm text-gray-600">
                                    Page {page} of {totalPages}
                                </span>
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                                    disabled={page === totalPages}
                                >
                                    Next <ChevronRight className="h-4 w-4" />
                                </Button>
                            </div>
                        )}
                    </>
                ) : (
                    <div className="text-center py-8 bg-gray-50 rounded-lg">
                        <p className="text-gray-500">{t('noHistory') || "No subscription history found."}</p>
                    </div>
                )}
            </div>

            {/* SECTION 3: AVAILABLE PLANS */}
            <div className="border-t border-gray-200 pt-12">
                <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">
                    {t("availablePlans")}
                </h2>

                {recurringPlans.length > 0 ? (
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
                                    <p className="text-sm text-gray-500 capitalize mb-6">
                                        {plan.billingCycle} {t("payment")}
                                    </p>
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
                                            {t("processing")}
                                        </>
                                    ) : (
                                        t("subscribe")
                                    )}
                                </Button>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="text-center p-8 bg-white rounded-lg border border-gray-200">
                        <h3 className="text-lg font-medium text-gray-900">{t("noPlans")}</h3>
                        <p className="text-gray-500 mt-2">{t("noPlansDesc")}</p>
                    </div>
                )}
            </div>
        </div>
    );
}
