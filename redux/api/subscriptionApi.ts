import { baseApi } from './baseApi';

export interface Plan {
  _id: string;
  name: string;
  planType: string;
  subscriptionType: "one-time" | "recurring";
  accountLimit: number;
  billingCycle: string;
  price: number;
  features: string[];
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface SubscriptionResponse {
  statusCode: number;
  data: {
    plans: Plan[];
  };
  message: string;
  success: boolean;
}

export const subscriptionApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getSubscriptionPlans: builder.query<SubscriptionResponse, void>({
      query: () => '/subscription/plans',
    }),
  }),
});

export const { useGetSubscriptionPlansQuery } = subscriptionApi;
