import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import type { RootState } from '../store';

export interface Prescription {
  _id: string;
  appointment: string;
  patient: string;
  doctor: string;
  description: string;
  followUpDate?: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface CreatePrescriptionDto {
  appointment: string;
  patient: string;
  doctor: string;
  description: string;
  followUpDate?: string | null;
}

export const prescriptionApi = createApi({
  reducerPath: 'prescriptionApi',
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
  tagTypes: ['Prescription', 'Appointment'],
  endpoints: (build) => ({
    createPrescription: build.mutation<Prescription, CreatePrescriptionDto>({
      query: (body) => ({
        url: 'prescriptions',
        method: 'POST',
        body,
      }),
      invalidatesTags: ['Prescription', 'Appointment'],
    }),
    getPrescriptionByAppointment: build.query<Prescription, string>({
      query: (appointmentId) => `prescriptions/${appointmentId}`,
      providesTags: ['Prescription'],
    }),
  }),
});

export const { 
  useCreatePrescriptionMutation,
  useGetPrescriptionByAppointmentQuery 
} = prescriptionApi;
