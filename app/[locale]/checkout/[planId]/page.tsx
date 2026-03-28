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
import { useSelector } from "react-redux";
import { selectCurrentUser } from "@/redux/slices/authSlice";

export default function CheckoutPage() {
  const t = useTranslations('Pricing'); // Reusing pricing translations or add new ones
  const router = useRouter();
  const params = useParams();
  const planId = params?.planId as string;
  const user = useSelector(selectCurrentUser);

  useEffect(() => {
    if (!user) {
      const callbackUrl = encodeURIComponent(`/checkout/${planId}`);
      router.push(`/signup?callbackUrl=${callbackUrl}`);
    }
  }, [user, planId, router]);

  const [couponCode, setCouponCode] = useState("");
  const { data: plansData, isLoading: isPlansLoading } = useGetSubscriptionPlansQuery();
  const [createPayPalOrder, { isLoading: isCreatingOrder }] = useCreatePayPalOrderMutation();

  const selectedPlan = plansData?.data?.plans.find(p => p._id === planId);

  const handlePayment = async () => {
    if (!planId || !selectedPlan) return;

    try {
      const grossAmount = selectedPlan.price;
      const netAmount = Math.round((grossAmount / 1.19) * 100) / 100;
      const taxAmount = Math.round((grossAmount - netAmount) * 100) / 100;

      const payload = {
        planId,
        ...(couponCode.trim() && { couponCode: couponCode.trim() }),
        paypalInfo: {
          description: "Copyrightchecker.de - Instagram Account/s Copyright Risikoanalyse 1x Account Check (Einmalzahlung)",
          currency: "EUR",
          breakdown: {
            item_total: netAmount,
            tax_total: taxAmount,
            total: grossAmount
          }
        }
      };

      const result = await createPayPalOrder(payload).unwrap();

      if (result.success && result.data.approveUrl) {
        window.location.href = result.data.approveUrl;
      } else {
        toast.error(result.message || "Failed to initiate payment");
      }
    } catch (error: any) {
      console.log('Checkout Error:', error);
      if (error?.status === 403) {
        toast.error(t('couponError'));
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
        backLink={{ href: "/pricing", text: "Zurück" }}
      />

      <div className="max-w-md mx-auto px-4 mt-8 relative z-10">
        <Card className="shadow-lg border-0 ring-1 ring-gray-200">
          <CardHeader className="space-y-1 pb-4 border-b border-gray-100">
            <CardTitle className="text-2xl font-bold">{selectedPlan.name}</CardTitle>
            <CardDescription>
              Einmalzahlung
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-6 space-y-6">

            <div className="space-y-3">
              <div className="flex justify-between text-sm text-gray-500">
                <span>Zwischensumme (Netto)</span>
                <span>€{(selectedPlan.price / 1.19).toFixed(2).replace(".", ",")}</span>
              </div>
              <div className="flex justify-between text-sm text-gray-500">
                <span>MwSt. (19%)</span>
                <span>€{(selectedPlan.price - (selectedPlan.price / 1.19)).toFixed(2).replace(".", ",")}</span>
              </div>
              <div className="flex justify-between items-end pt-2 border-t border-gray-100">
                <span className="text-gray-900 font-bold">Gesamtbetrag (Brutto)</span>
                <div className="text-right">
                  <span className="text-3xl font-bold text-primary block">€{selectedPlan.price}</span>
                  <span className="text-sm text-gray-500 italic">{t('vatIncl')}</span>
                </div>
              </div>
            </div>

            <div className="space-y-2 pt-4">
              <label htmlFor="coupon" className="text-sm font-medium text-gray-700 flex items-center gap-2">
                <Tag className="h-4 w-4" /> Coupon Code (Optional)
              </label>
              <Input
                id="coupon"
                placeholder="Rabattcode hier einfügen"
                value={couponCode}
                onChange={(e) => setCouponCode(e.target.value)}
                className="bg-white"
              />
            </div>

          </CardContent>
          <CardFooter className="flex flex-col gap-4   py-8 px-6 border-t bg-gray-50/30 ">
            <div className="w-full space-y-4">
              <h3 className="text-center text-[11px] font-bold text-gray-400 uppercase tracking-wider">
                Kostenpflichtig bestellen und zu PayPal
              </h3>

              <Button
                className="w-full h-14 cursor-pointer transition-all rounded-full border-none shadow-md hover:shadow-xl flex items-center justify-center py-6 bg-[#ffc439] active:scale-[0.98] ring-offset-2 focus:ring-2 focus:ring-[#ffc439] group"
                onClick={handlePayment}
                disabled={isCreatingOrder}
              >
                {isCreatingOrder ? (
                  <div className="flex items-center gap-2">
                    <Loader2 className="h-5 w-5 animate-spin text-[#003087]" />
                    <span className="text-[#003087] font-bold">Verarbeitung...</span>
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    <img src="/paypalcheckout button.png" alt="PayPal" className="h-8 md:h-10 object-contain" />
                  </div>
                )}
              </Button>
            </div>

          </CardFooter>
        </Card>

        <p className="text-center text-xs text-gray-500 mt-6 max-w-xl mx-auto">
          Mit Klick auf „Jetzt kostenpflichtig bestellen und mit PayPal zahlen“ akzeptierst du unsere Nutzungsbedingungen und Datenschutzerklärung.
          Die Zahlung wird über PayPal abgewickelt.
        </p>
      </div>
    </div>
  );
}
