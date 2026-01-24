"use client";

import { useState, useEffect } from "react";
import { useRouter } from "@/i18n/routing";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, Tag, ArrowLeft } from "lucide-react";
import { useGetSubscriptionPlansQuery, useCreatePayPalOrderMutation } from "@/redux/api/subscriptionApi";
import { toast } from "sonner";
import PageHeader from "@/components/page-header";
import { useParams } from "next/navigation";

export default function CheckoutPage() {
  const t = useTranslations('Pricing'); // Reusing pricing translations or add new ones
  const router = useRouter();
  const params = useParams();
  const planId = params?.planId as string;

  const [couponCode, setCouponCode] = useState("");
  const { data: plansData, isLoading: isPlansLoading } = useGetSubscriptionPlansQuery();
  const [createPayPalOrder, { isLoading: isCreatingOrder }] = useCreatePayPalOrderMutation();

  const selectedPlan = plansData?.data?.plans.find(p => p._id === planId);

  const handlePayment = async () => {
    if (!planId) return;

    try {
      const payload = {
        planId,
        ...(couponCode.trim() && { couponCode: couponCode.trim() })
      };

      const result = await createPayPalOrder(payload).unwrap();

      if (result.success && result.data.approveUrl) {
        window.location.href = result.data.approveUrl;
      } else {
        toast.error(result.message || "Failed to initiate payment");
      }
    } catch (error: any) {
      if (error?.status === 403) {
        toast.error(error?.data?.message || "You have already used a coupon. Only one coupon per user is allowed.");
      } else {
        toast.error(error?.data?.message || "Something went wrong");
      }
    }
  };

  if (isPlansLoading) {
    return (
      <div className="flex justify-center items-center h-screen bg-gray-50">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!selectedPlan) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4 bg-gray-50">
        <h2 className="text-xl font-semibold text-gray-900">Plan not found</h2>
        <Button onClick={() => router.push('/pricing')} variant="outline">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Pricing
        </Button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50/50 pb-20">
      <PageHeader
        title="Checkout"
        description="Review your order and complete payment"
        backLink={{ href: "/pricing", text: "Back to Plans" }}
      />

      <div className="max-w-md mx-auto px-4 -mt-8 relative z-10">
        <Card className="shadow-lg border-0 ring-1 ring-gray-200">
          <CardHeader className="space-y-1 pb-4 border-b border-gray-100">
            <CardTitle className="text-2xl font-bold">{selectedPlan.name}</CardTitle>
            <CardDescription>
              {selectedPlan.billingCycle} subscription
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-6 space-y-6">

            <div className="flex justify-between items-end">
              <span className="text-gray-600">Total Amount</span>
              <span className="text-3xl font-bold text-primary">${selectedPlan.price}</span>
            </div>

            <div className="space-y-2">
              <label htmlFor="coupon" className="text-sm font-medium text-gray-700 flex items-center gap-2">
                <Tag className="h-4 w-4" /> Coupon Code (Optional)
              </label>
              <Input
                id="coupon"
                placeholder="Enter coupon code"
                value={couponCode}
                onChange={(e) => setCouponCode(e.target.value)}
                className="bg-white"
              />
            </div>

          </CardContent>
          <CardFooter className="pt-2 pb-6">
            <Button
              className="w-full h-11 text-base cursor-pointer bg-purple-600 hover:bg-purple-700"
              onClick={handlePayment}
              disabled={isCreatingOrder}
            >
              {isCreatingOrder ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Processing...
                </>
              ) : (
                <>Proceed to Payment</>
              )}
            </Button>
          </CardFooter>
        </Card>

        <p className="text-center text-xs text-gray-500 mt-6 max-w-xs mx-auto">
          By proceeding, you agree to our Terms of Service and Privacy Policy. Secure payment processing by PayPal.
        </p>
      </div>
    </div>
  );
}
