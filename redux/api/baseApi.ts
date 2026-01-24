import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { BASE_URL } from './config';
import Cookies from 'js-cookie';

const baseQuery = fetchBaseQuery({
  baseUrl: BASE_URL,
  prepareHeaders: (headers) => {
    const token = Cookies.get('accessToken');
    if (token) {
      headers.set('authorization', `Bearer ${token}`);
    }
    return headers;
  },
});

const baseQueryWithReauth: any = async (args: any, api: any, extraOptions: any) => {
  let result = await baseQuery(args, api, extraOptions);

  if (result.error && result.error.status === 401) {
    const refreshToken = Cookies.get('refreshToken');

    if (refreshToken) {
      const refreshResult = await baseQuery(
        {
          url: '/auth/refresh-token',
          method: 'POST',
          body: { refreshToken },
        },
        api,
        extraOptions
      );

      if (refreshResult.data) {
        const { accessToken, refreshToken: newRefreshToken } = (refreshResult.data as any).data;

        Cookies.set('accessToken', accessToken);
        Cookies.set('refreshToken', newRefreshToken);

        // Retry the initial query
        result = await baseQuery(args, api, extraOptions);
      } else {
        // Refresh failed - logout
        Cookies.remove('accessToken');
        Cookies.remove('refreshToken');
        // Optional: Redirect to login or handle session expiry
        // window.location.href = '/auth'; // Uncomment if redirection is desired
      }
    } else {
      // No refresh token - logout
      Cookies.remove('accessToken');
      Cookies.remove('refreshToken');
      // window.location.href = '/auth';
    }
  }
  return result;
};

export const baseApi = createApi({
  reducerPath: 'api',
  baseQuery: baseQueryWithReauth,
  endpoints: () => ({}),
  tagTypes: ['Auth', 'User', 'faq', 'privacy', 'blog', 'about', 'termsAndConditions', 'imprint'],
});