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

export interface CreatePayPalOrderRequest {
  planId: string;
  couponCode?: string;
}

export interface CreatePayPalOrderResponse {
  statusCode: number;
  data: {
    paypalOrderId: string;
    approveUrl: string;
    plan: Plan;
  };
  message: string;
  success: boolean;
}

export interface Subscription {
  _id: string;
  userId: string;
  planId: string;
  planType: string;
  subscriptionType: string;
  accountLimit: number;
  status: string;
  startDate: string;
  endDate: string;
  checksUsed: number;
  remainingChecks: number;
  createdAt: string;
  updatedAt: string;
}

export interface MySubscriptionResponse {
  statusCode: number;
  data: {
    subscription: Subscription;
    plan: Plan;
    remainingChecks: number;
  };
  message: string;
  success: boolean;
}

export const subscriptionApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getSubscriptionPlans: builder.query<SubscriptionResponse, void>({
      query: () => '/subscription/plans',
    }),
    createPayPalOrder: builder.mutation<CreatePayPalOrderResponse, CreatePayPalOrderRequest>({
      query: (data) => ({
        url: '/paypal',
        method: 'POST',
        body: data,
      }),
    }),
    getMySubscription: builder.query<MySubscriptionResponse, void>({
      query: () => '/subscription/my-subscription',
    }),
    getSubscriptionHistory: builder.query<any, { page: number; limit: number }>({
      query: ({ page, limit }) => `/subscription/my-history?limit=${limit}&page=${page}`,
    }),
    cancelSubscription: builder.mutation<any, void>({
      query: () => ({
        url: '/subscription/cancel',
        method: 'PUT',
      }),
    }),
  }),
});

export const { useGetSubscriptionPlansQuery, useCreatePayPalOrderMutation, useGetMySubscriptionQuery, useGetSubscriptionHistoryQuery, useCancelSubscriptionMutation } = subscriptionApi;
