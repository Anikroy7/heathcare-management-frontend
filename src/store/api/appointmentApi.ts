import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import type { RootState } from '../store';

export interface Appointment {
  _id: string;
  status: 'pending' | 'confirmed' | 'cancelled' | 'completed' | string;
  createdAt: string;
  updatedAt: string;
  __v: number;

  doctor: {
    _id: string;
    address: string;
    license_number: string;
    specialization: string;
    createdAt: string;
    updatedAt: string;
    __v: number;
    user: string;
  };

  patient: {
    _id: string;
    user: {
      _id: string;
      name: string;
      email: string;
    };
    phone: string;
    gender: 'male' | 'female' | 'other' | string;
    date_of_birth: string;
    createdAt: string;
    updatedAt: string;
    __v: number;
  };

  schedule: {
    _id: string;
    doctor: string;
    date: string;
    startTime: string;
    totalSlot: number;
    slot_duration_minutes: number;
    isActive: boolean;
    createdAt: string;
    updatedAt: string;
    __v: number;
  };

  scheduleSlot: {
    _id: string;
    schedule: string;
    startTime: string;
    endTime: string;
    duration_minutes: number;
    status: 'available' | 'booked' | 'cancelled' | string;
    createdAt: string;
    updatedAt: string;
    __v: number;
  };
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
    getScheduleAppointments: build.query<Appointment[], string>({
      query: (scheduleId) => `appointments/${scheduleId}`,
      providesTags: ['Appointment'],
      transformResponse: (response: Appointment | Appointment[]) => {
        // Backend returns single object, convert to array
        return Array.isArray(response) ? response : response ? [response] : [];
      },
    }),
  }),
});

export const { 
  useCreateAppointmentMutation, 
  useGetUserAppointmentsQuery,
  useGetScheduleAppointmentsQuery 
} = appointmentApi;
