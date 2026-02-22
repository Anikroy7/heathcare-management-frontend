import { configureStore } from '@reduxjs/toolkit'
// Or from '@reduxjs/toolkit/query/react'
import { patientApi } from './api/patientApi'
import { doctorApi } from './api/doctorApi'
import authReducer from './slices/authSlices';
import { authApi } from './api/authApi';
import { scheduleApi } from './api/scheduleApi';
import { appointmentApi } from './api/appointmentApi';
import { doctorScheduleApi } from './api/doctorScheduleApi';
import { prescriptionApi } from './api/prescriptionApi';

export const store = configureStore({
  reducer: {
    // Add the generated reducer as a specific top-level slice
    [patientApi.reducerPath]: patientApi.reducer,
    [doctorApi.reducerPath]: doctorApi.reducer,
    [authApi.reducerPath]: authApi.reducer,
    [scheduleApi.reducerPath]: scheduleApi.reducer,
    [appointmentApi.reducerPath]: appointmentApi.reducer,
    [doctorScheduleApi.reducerPath]: doctorScheduleApi.reducer,
    [prescriptionApi.reducerPath]: prescriptionApi.reducer,

    auth: authReducer,

  },
  // Adding the api middleware enables caching, invalidation, polling,
  // and other useful features of `rtk-query`.
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(
      patientApi.middleware, 
      doctorApi.middleware, 
      authApi.middleware, 
      scheduleApi.middleware, 
      appointmentApi.middleware,
      doctorScheduleApi.middleware,
      prescriptionApi.middleware
    ),
})


// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch