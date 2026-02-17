import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import type { RootState } from '../store';

export const API_BASE_URL = `${import.meta.env.VITE_API_URL}`;

export interface LoginRequest {
    email: string;
    password: string;
}


export interface User {
    _id?: string;
    email: string;
    role: 'patient' | 'doctor';
}

export interface AuthResponse {
    accessToken: string;
    user: User;
}

export const authApi = createApi({
    reducerPath: 'authApi',
    baseQuery: fetchBaseQuery({
        baseUrl: API_BASE_URL,
        prepareHeaders: (headers, { getState }) => {
            const token = (getState() as RootState).auth.token;

            if (token) {
                headers.set('authorization', `Bearer ${token}`);
            }

            return headers;
        },
    }),
    tagTypes: ['Auth'],
    endpoints: (builder) => ({
        login: builder.mutation<AuthResponse, LoginRequest>({
            query: (credentials) => ({
                url: '/auth/login',
                method: 'POST',
                body: credentials,
            }),
        }),

        getCurrentUser: builder.query<AuthResponse, void>({
            query: () => '/auth/me',
            providesTags: ['Auth'],
        }),
    }),
});

export const {
    useLoginMutation,
    useGetCurrentUserQuery,
} = authApi;