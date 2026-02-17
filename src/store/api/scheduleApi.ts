import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import type { RootState } from '../store';

export interface TimeSlot {
  _id: string;
  schedule: string;
  startTime: string;
  endTime: string;
  duration_minutes: number;
  status: 'available' | 'booked';
  createdAt: string;
  updatedAt: string;
  __v: number;
}

export const scheduleApi = createApi({
  reducerPath: 'scheduleApi',
  baseQuery: fetchBaseQuery({
    baseUrl: import.meta.env.VITE_API_URL,
    prepareHeaders: (headers, { getState }) => {
      const token = (getState() as RootState).auth.token;
      if (token) {
        headers.set('authorization', `Bearer ${token}`);
      }
      return headers;
    },
  }),
  tagTypes: ['Schedule'],
  endpoints: (build) => ({
    getAvailableSlots: build.query<TimeSlot[], { doctorId: string; date: string }>({
      query: ({ doctorId, date }) => ({
        url: `doctor-schedules/available-slots/${doctorId}`,
        params: { date },
      }),
      providesTags: ['Schedule'],
    }),
  }),
});

export const { useGetAvailableSlotsQuery } = scheduleApi;
