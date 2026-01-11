import MySubscriptionClient from "@/components/my-subscription-client";
import { BASE_URL, REVALIDATE_TIME } from "@/redux/api/config";

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

export default async function MySubscriptionPage() {
  const response = await getSubscriptionPlans();
  const plansData = response?.data?.plans || [];

  const recurringPlans = plansData.filter(
    (plan: any) => plan.subscriptionType === "recurring" && plan.billingCycle === "monthly"
  ) || [];

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <MySubscriptionClient recurringPlans={recurringPlans} />
    </div>
  );
}
