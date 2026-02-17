import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import type { RootState } from '../store';

export interface DoctorSchedule {
  _id: string;
  doctor: string;
  startTime: string;
  totalSlot: number;
  slot_duration_minutes: number;
  isActive: boolean;
  date: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateDoctorScheduleDto {
  doctor?: string;
  startTime: string;
  totalSlot: number;
  slot_duration_minutes: number;
  isActive?: boolean;
  date: string;
}

export const doctorScheduleApi = createApi({
  reducerPath: 'doctorScheduleApi',
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
  tagTypes: ['DoctorSchedule'],
  endpoints: (build) => ({
    getMySchedules: build.query<DoctorSchedule[], void>({
      query: () => 'doctor-schedules/my-schedules',
      providesTags: ['DoctorSchedule'],
    }),
    createSchedule: build.mutation<DoctorSchedule, CreateDoctorScheduleDto>({
      query: (body) => ({
        url: 'doctor-schedules',
        method: 'POST',
        body,
      }),
      invalidatesTags: ['DoctorSchedule'],
    }),
  }),
});

export const { useGetMySchedulesQuery, useCreateScheduleMutation } = doctorScheduleApi;
