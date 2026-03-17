import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface User {
  _id: string;
  email: string;
  id?: string;
  fullname?: string;
  name?: string;
  mobile: string;
  avatar: string;
  isPremiumMember: boolean;
  role: string;
  isBlocked: boolean;
  hasEverSubscribed: boolean;
  address?: string;
  street?: string;
  houseNumber?: string;
  zipCode?: string;
  city?: string;
  country?: string;
  company?: string;
  boundInstagramAccounts: any[];
  hasEverUsedCoupon: boolean;
  createdAt: string;
  updatedAt: string;
  __v: number;
}

interface AuthState {
  user: User | null;
  token: string | null;
  refreshToken: string | null;
}

const initialState: AuthState = {
  user: null,
  token: null,
  refreshToken: null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setCredentials: (
      state,
      action: PayloadAction<{ user: User; accessToken: string; refreshToken: string }>
    ) => {
      state.user = action.payload.user;
      state.token = action.payload.accessToken;
      state.refreshToken = action.payload.refreshToken;
    },
    logout: (state) => {
      state.user = null;
      state.token = null;
      state.refreshToken = null;
    },
  },
});

export const { setCredentials, logout } = authSlice.actions;

export default authSlice.reducer;

// Selectors
export const selectCurrentUser = (state: any) => state.auth.user;
export const selectCurrentToken = (state: any) => state.auth.token;
