import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import type { PatientProfile } from '../types/patient.type'

export interface CreatePatientDto {
  name: string;
  date_of_birth: string;
  gender: 'male' | 'female' | 'other';
  email: string;
  phone: string;
  password: string;
}

// Define a service using a base URL and expected endpoints
export const patientApi = createApi({
  reducerPath: 'patientApi',
  baseQuery: fetchBaseQuery({ baseUrl: import.meta.env.VITE_API_URL }),
  tagTypes: ['Patient'],
  endpoints: (build) => ({
    getAllPatients: build.query<PatientProfile[], void>({
      query: () => `patients`,
      providesTags: ['Patient'],
    }),
    createPatient: build.mutation<PatientProfile, CreatePatientDto>({
      query: (body) => ({
        url: 'patients',
        method: 'POST',
        body,
      }),
      invalidatesTags: ['Patient'],
    }),
  }),
})

// Export hooks for usage in functional components, which are
// auto-generated based on the defined endpoints
export const { useGetAllPatientsQuery, useCreatePatientMutation } = patientApi