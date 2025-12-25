import { baseApi } from './baseApi';

export interface CheckProfileRequest {
  profileUrl: string;
  maxVideos: number;
}

export interface CheckProfileResponse {
  statusCode: number;
  message: string;
  success: boolean;
  data: any;
}

export const copyrightApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    checkProfile: builder.mutation<CheckProfileResponse, CheckProfileRequest>({
      query: (data) => ({
        url: '/copyright/check-profile',
        method: 'POST',
        body: data,
      }),
    }),
  }),
});

export const { useCheckProfileMutation } = copyrightApi;
