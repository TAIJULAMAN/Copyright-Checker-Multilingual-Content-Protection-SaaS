import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { BASE_URL } from './config';
import Cookies from 'js-cookie';
import { logout, setCredentials } from '../slices/authSlice';

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

const isTokenExpired = (token: string) => {
  if (!token) return true;
  try {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    );
    const { exp } = JSON.parse(jsonPayload);
    // Refresh if expiring in less than 30 seconds
    return Date.now() >= exp * 1000 - 30000;
  } catch (error) {
    return true;
  }
};

const baseQueryWithReauth: any = async (args: any, api: any, extraOptions: any) => {
  let accessToken = Cookies.get('accessToken');
  const refreshToken = Cookies.get('refreshToken');

  // If token is expired but we have a refresh token, try to refresh first
  if (accessToken && isTokenExpired(accessToken) && refreshToken) {
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
      const { accessToken: newAccessToken, refreshToken: newRefreshToken, user } = (refreshResult.data as any).data;

      Cookies.set('accessToken', newAccessToken);
      Cookies.set('refreshToken', newRefreshToken);

      if (user) {
        api.dispatch(setCredentials({ user, accessToken: newAccessToken, refreshToken: newRefreshToken }));
      }

      accessToken = newAccessToken;
    }
  }

  let result = await baseQuery(args, api, extraOptions);

  if (result.error && result.error.status === 401) {
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
        const { accessToken: newAccessToken, refreshToken: newRefreshToken } = (refreshResult.data as any).data;

        Cookies.set('accessToken', newAccessToken);
        Cookies.set('refreshToken', newRefreshToken);

        // Retry the initial query
        result = await baseQuery(args, api, extraOptions);
      } else {
        // Refresh failed - logout
        Cookies.remove('accessToken');
        Cookies.remove('refreshToken');
        api.dispatch(logout());
      }
    } else {
      // No refresh token - logout
      Cookies.remove('accessToken');
      Cookies.remove('refreshToken');
      api.dispatch(logout());
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