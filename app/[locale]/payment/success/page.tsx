"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { CheckCircle, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Suspense } from "react";

function SuccessContent() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const planName = searchParams.get("plan");
  const amount = searchParams.get("amount");
  const orderId = searchParams.get("orderId");

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-md shadow-xl border-t-4 border-t-green-500">
        <CardContent className="pt-8 pb-8 px-6 text-center">
          <div className="mb-6 flex justify-center">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center">
              <CheckCircle className="w-10 h-10 text-green-600" />
            </div>
          </div>

          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Payment Successful!
          </h1>
          <p className="text-gray-600 mb-8">
            Thank you for your purchase. Your account has been upgraded.
          </p>

          <div className="bg-gray-50 rounded-lg p-4 mb-8 text-left border border-gray-100">
            <div className="flex justify-between mb-2">
              <span className="text-gray-500 text-sm">Order ID</span>
              <span className="text-gray-900 font-medium text-sm font-mono truncate max-w-[150px]">
                {orderId || "N/A"}
              </span>
            </div>
            <div className="flex justify-between mb-2">
              <span className="text-gray-500 text-sm">Plan</span>
              <span className="text-gray-900 font-medium text-sm">
                {planName || "Subscription"}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500 text-sm">Amount Paid</span>
              <span className="text-gray-900 font-bold text-sm">
                ${amount || "0.00"}
              </span>
            </div>
          </div>

          <div className="space-y-3">
            <Button
              onClick={() => router.push("/scan")}
              className="w-full bg-purple-600 hover:bg-purple-700 text-white h-12 text-lg"
            >
              Start Scanning Now <ArrowRight className="ml-2 w-5 h-5" />
            </Button>
            <Button
              variant="outline"
              onClick={() => router.push("/mysubscription")}
              className="w-full text-gray-600 border-gray-300 hover:bg-gray-50"
            >
              View My Subscriptions
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default function PaymentSuccessPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Loading...</div>}>
      <SuccessContent />
    </Suspense>
  );
}
