import { baseApi } from './baseApi';
import { User } from '../slices/authSlice';

export interface UpdateUserRequest {
  fullname?: string;
  mobile?: string;
  street?: string;
  houseNumber?: string;
  zipCode?: string;
  city?: string;
  country?: string;
  company?: string;
}

export interface UpdateUserResponse {
  statusCode: number;
  data: {
    user: User;
  };
  message: string;
  success: boolean;
}

export const userApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    updateUser: builder.mutation<UpdateUserResponse, UpdateUserRequest>({
      query: (data) => ({
        url: '/users/update-user',
        method: 'PATCH',
        body: data,
      }),
      invalidatesTags: ['Auth'],
    }),
    updateAvatar: builder.mutation({
      query: (formData) => ({
        url: '/users/update-avatar',
        method: 'PATCH',
        body: formData,
      }),
      invalidatesTags: ['Auth'],
    }),
    getInvoices: builder.query({
      query: () => ({
        url: '/users/invoices',
        method: 'GET',
      }),
      providesTags: ['Auth'],
    }),
  }),
});

export const { useUpdateUserMutation, useUpdateAvatarMutation, useGetInvoicesQuery } = userApi;
