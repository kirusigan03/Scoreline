import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import {
  LoginCredentials,
  LoginResponse,
  RegisterPayload,
  RegisterResponse,
  User,
} from '../types';
import { getSecureTokens } from '../../../storage/secureStorage';

const DUMMY_JSON_BASE_URL = 'https://dummyjson.com';

export const authApi = createApi({
  reducerPath: 'authApi',
  baseQuery: fetchBaseQuery({
    baseUrl: DUMMY_JSON_BASE_URL,
    prepareHeaders: async (headers) => {
      const tokens = await getSecureTokens();
      if (tokens && tokens.accessToken) {
        headers.set('Authorization', `Bearer ${tokens.accessToken}`);
      }
      headers.set('Content-Type', 'application/json');
      return headers;
    },
  }),
  tagTypes: ['User'],
  endpoints: (builder) => ({
    login: builder.mutation<LoginResponse, LoginCredentials>({
      query: (credentials) => ({
        url: '/auth/login',
        method: 'POST',
        body: credentials,
      }),
    }),
    register: builder.mutation<RegisterResponse, RegisterPayload>({
      query: (newUser) => ({
        url: '/users/add',
        method: 'POST',
        body: newUser,
      }),
    }),
    getCurrentUser: builder.query<User, void>({
      query: () => '/auth/me',
      providesTags: ['User'],
    }),
    refreshSession: builder.mutation<{ token: string; refreshToken: string }, { refreshToken: string }>({
      query: (body) => ({
        url: '/auth/refresh',
        method: 'POST',
        body,
      }),
    }),
  }),
});

export const {
  useLoginMutation,
  useRegisterMutation,
  useGetCurrentUserQuery,
  useRefreshSessionMutation,
} = authApi;
