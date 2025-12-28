"use client";

import { useGetMySubscriptionQuery } from "@/redux/api/subscriptionApi";
import { format } from "date-fns";
import { Loader2, CreditCard, Calendar, Activity, ShieldCheck, User, ArrowRight } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function MySubscriptionPage() {
  const { data, isLoading, error } = useGetMySubscriptionQuery();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-purple-600" />
      </div>
    );
  }

  if (error || !data?.success) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4">
        <p className="text-red-500">Failed to load subscription details.</p>
        <Link href="/pricing">
          <Button variant="outline">View Plans</Button>
        </Link>
      </div>
    );
  }

  const { subscription, plan, remainingChecks } = data.data;

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto space-y-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">My Subscription</h1>
          <p className="text-gray-600 mt-2">Manage your current plan and usage</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Main Plan Card */}
          <Card className="md:col-span-2 shadow-md">
            <CardHeader className="pb-4 border-b">
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="text-2xl text-purple-700">{plan.name}</CardTitle>
                  <CardDescription className="capitalize mt-1">
                    {subscription.subscriptionType} Payment
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
                    <h3 className="font-medium text-gray-900">Start Date</h3>
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
                    <h3 className="font-medium text-gray-900">End Date</h3>
                    <p className="text-sm text-gray-500">
                       {/* Handle far future dates typically used for 'forever' or show actual date */}
                       {new Date(subscription.endDate).getFullYear() > 2100 ? "Lifetime Access" : format(new Date(subscription.endDate), "MMMM d, yyyy")}
                    </p>
                  </div>
                </div>
                 <div className="flex items-start gap-4">
                  <div className="p-3 bg-purple-100 rounded-lg">
                    <CreditCard className="w-6 h-6 text-purple-600" />
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-900">Amount Paid</h3>
                    <p className="text-sm text-gray-500">${plan.price}</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                   <div className="p-3 bg-purple-100 rounded-lg">
                    <ShieldCheck className="w-6 h-6 text-purple-600" />
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-900">Plan Type</h3>
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
                <Activity className="w-5 h-5" /> Usage Statistics
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6 pt-4">
               <div>
                <p className="text-purple-100 text-sm mb-1">Total Limit</p>
                <div className="text-3xl font-bold">{subscription.accountLimit} Accounts</div>
              </div>
              <div>
                <p className="text-purple-100 text-sm mb-1">Checks Used</p>
                <div className="text-3xl font-bold">{subscription.checksUsed}</div>
              </div>
              <div className="pt-4 border-t border-purple-500/30">
                <p className="text-purple-100 text-sm mb-1">Remaining</p>
                <div className="text-4xl font-extrabold">{remainingChecks}</div>
                <p className="text-xs text-purple-200 mt-1">Available Checks</p>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="flex justify-end pt-4">
           <Link href="/scan">
            <Button className="bg-purple-600 hover:bg-purple-700 text-lg px-8 py-6 h-auto shadow-lg">
              Start New Scan <ArrowRight className="ml-2 w-5 h-5" />
            </Button>
           </Link>
        </div>
      </div>
    </div>
  );
}


