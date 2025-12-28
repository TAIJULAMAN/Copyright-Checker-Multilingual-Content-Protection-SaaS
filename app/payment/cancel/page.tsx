"use client";

import { useRouter } from "next/navigation";
import { XCircle, RefreshCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export default function PaymentCancelPage() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-md shadow-xl border-t-4 border-t-red-500">
        <CardContent className="pt-8 pb-8 px-6 text-center">
          <div className="mb-6 flex justify-center">
            <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center">
              <XCircle className="w-10 h-10 text-red-600" />
            </div>
          </div>

          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Payment Cancelled
          </h1>
          <p className="text-gray-600 mb-8">
            Your transaction was cancelled and no payment was charged. If you experienced an issue, you can try again.
          </p>

          <div className="space-y-3">
            <Button
              onClick={() => router.push("/pricing")}
              className="w-full bg-[#d6322f] hover:bg-[#b02220] text-white h-12 text-lg"
            >
              <RefreshCcw className="mr-2 w-5 h-5" /> Try Again
            </Button>
            <Button
              variant="outline"
              onClick={() => router.push("/")}
              className="w-full text-gray-600 border-gray-300 hover:bg-gray-50"
            >
              Return to Home
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
