import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import type { RootState } from '../store';

export interface Appointment {
  _id: string;
  patient: {
    _id: string;
    user: string;
    date_of_birth: string;
    gender: string;
  };
  doctor: {
    _id: string;
    user: {
      _id: string;
      name: string;
      email: string;
      phone: string;
    };
    specialization: string;
    license_number: string;
    address: string;
  };
  schedule: {
    _id: string;
    startTime: string;
    endTime: string;
    duration_minutes: number;
    status: string;
    schedule: {
      _id: string;
      date: string;
      startTime: string;
      totalSlot: number;
      slot_duration_minutes: number;
      isActive: boolean;
    };
  } | null;
  status: 'pending' | 'visited' | 'canceled';
  createdAt: string;
  updatedAt: string;
}

export interface CreateAppointmentDto {
  patient?: string;
  doctor: string;
  schedule: string;
  scheduleSlot: string;
  status?: 'pending' | 'visited' | 'canceled';
}

export const appointmentApi = createApi({
  reducerPath: 'appointmentApi',
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
  tagTypes: ['Appointment'],
  endpoints: (build) => ({
    createAppointment: build.mutation<Appointment, CreateAppointmentDto>({
      query: (body) => ({
        url: 'appointments',
        method: 'POST',
        body,
      }),
      invalidatesTags: ['Appointment'],
    }),
    getUserAppointments: build.query<Appointment[], void>({
      query: () => 'appointments/user',
      providesTags: ['Appointment'],
    }),
  }),
});

export const { useCreateAppointmentMutation, useGetUserAppointmentsQuery } = appointmentApi;
