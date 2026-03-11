import { baseApi } from './baseApi';
import { User } from '../slices/authSlice';

export interface LoginRequest {
  email: string;
  password?: string;
}

export interface LoginResponse {
  statusCode: number;
  data: {
    user: User;
    accessToken: string;
    refreshToken: string;
  };
  message: string;
  success: boolean;
}

export interface RegisterRequest {
  firstName: string;
  lastName: string;
  email: string;
  mobile: string;
  password?: string;
  street?: string;
  houseNumber?: string;
  zipCode?: string;
  city?: string;
  country?: string;
  company?: string;
}

export interface RegisterResponse {
  statusCode: number;
  data: User;
  message: string;
  success: boolean;
}

export const authApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    login: builder.mutation<LoginResponse, LoginRequest>({
      query: (credentials) => ({
        url: '/auth/login',
        method: 'POST',
        body: credentials,
      }),
      async onQueryStarted(args, { queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          if (data.success && data.data.accessToken) {
            const Cookies = (await import('js-cookie')).default;
            Cookies.set('accessToken', data.data.accessToken);
            Cookies.set('refreshToken', data.data.refreshToken);
          }
        } catch (err) {
          // login failed
        }
      },
      invalidatesTags: ['Auth'],
    }),
    register: builder.mutation<RegisterResponse, RegisterRequest>({
      query: (data) => ({
        url: '/auth/register',
        method: 'POST',
        body: data,
      }),
      async onQueryStarted(args, { queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          // Note: RegisterResponse might not include tokens, check data structure
          // If it does, set them here. 
        } catch (err) {
          // register failed
        }
      },
      invalidatesTags: ['Auth'],
    }),
    changePassword: builder.mutation<void, any>({
      query: (data) => ({
        url: '/auth/change-password',
        method: 'POST',
        body: data,
      }),
    }),
    forgotPassword: builder.mutation<{ message: string }, { email: string }>({
      query: (data) => ({
        url: '/auth/forgot-password',
        method: 'POST',
        body: data,
      }),
    }),
    verifyResetOtp: builder.mutation<
      { data: { resetToken: string; message: string }; message: string; success: boolean },
      { email: string; otp: string }
    >({
      query: (data) => ({
        url: '/auth/verify-reset-otp',
        method: 'POST',
        // Assuming the API expects otp in the body alongside email. 
        // If it's strictly cookies, we might need a different approach, 
        // but typically explicit body is preferred for API clients.
        body: data,
      }),
    }),
    resetPassword: builder.mutation<
      { message: string; success: boolean },
      { newPassword: string; confirmPassword: string; token: string }
    >({
      query: ({ token, ...data }) => ({
        url: '/auth/reset-password',
        method: 'POST',
        body: data,
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }),
    }),
    logout: builder.mutation<void, void>({
      query: () => ({
        url: '/auth/logout',
        method: 'POST',
      }),
      invalidatesTags: ['Auth'],
    }),
    getMe: builder.query<{ data: { user: User } }, void>({
      query: () => ({
        url: '/auth/me',
        method: 'GET',
      }),
      providesTags: ['Auth'],
    }),
  }),
});

export const {
  useLoginMutation,
  useRegisterMutation,
  useChangePasswordMutation,
  useLogoutMutation,
  useGetMeQuery,
  useForgotPasswordMutation,
  useVerifyResetOtpMutation,
  useResetPasswordMutation
} = authApi;

