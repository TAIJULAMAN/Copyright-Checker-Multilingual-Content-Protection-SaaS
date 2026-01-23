import MySubscriptionClient from "@/components/my-subscription-client";
import { BASE_URL, REVALIDATE_TIME } from "@/redux/api/config";
import { cookies } from "next/headers";

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

async function getSubscriptionHistory() {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("accessToken")?.value;

    if (!token) return null;

    const res = await fetch(`${BASE_URL}/subscription/my-history`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      cache: 'no-store', // History should be fresh
    });

    if (!res.ok) return null;

    return res.json();
  } catch (error) {
    return null;
  }
}

export default async function MySubscriptionPage() {
  const [plansResponse, historyResponse] = await Promise.all([
    getSubscriptionPlans(),
    getSubscriptionHistory(),
  ]);

  const plansData = plansResponse?.data?.plans || [];
  const subscriptionHistory = historyResponse?.data?.subscriptions || [];

  const recurringPlans = plansData.filter(
    (plan: any) => plan.subscriptionType === "recurring" && plan.billingCycle === "monthly"
  ) || [];

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <MySubscriptionClient recurringPlans={recurringPlans} subscriptionHistory={subscriptionHistory} />
    </div>
  );
}
