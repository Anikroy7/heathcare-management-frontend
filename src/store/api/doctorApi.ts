import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import type { RootState } from '../store';

export interface CreateDoctorDto {
  name: string;
  email: string;
  phone: string;
  password: string;
  specialization: string;
  license_number: string;
  address: string;
}

export interface DoctorProfile {
  _id: string;
  specialization: string;
  license_number: string;
  address: string;
  user: {
    _id: string;
    name: string;
    email: string;
    phone: string;
  };
}

export const doctorApi = createApi({
  reducerPath: 'doctorApi',
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
  tagTypes: ['Doctor'],
  endpoints: (build) => ({
    createDoctor: build.mutation<DoctorProfile, CreateDoctorDto>({
      query: (body) => ({
        url: 'doctors',
        method: 'POST',
        body,
      }),
      invalidatesTags: ['Doctor'],
    }),
    getAllDoctors: build.query<DoctorProfile[], void>({
      query: () => 'doctors',
      providesTags: ['Doctor'],
    }),
  }),
})

export const { useCreateDoctorMutation, useGetAllDoctorsQuery } = doctorApi
