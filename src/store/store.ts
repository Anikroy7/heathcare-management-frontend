import { configureStore } from '@reduxjs/toolkit'
// Or from '@reduxjs/toolkit/query/react'
import { patientApi } from './api/patientApi'
import { doctorApi } from './api/doctorApi'
import authReducer from './slices/authSlices';
import { authApi } from './api/authApi';

export const store = configureStore({
  reducer: {
    // Add the generated reducer as a specific top-level slice
    [patientApi.reducerPath]: patientApi.reducer,
    [doctorApi.reducerPath]: doctorApi.reducer,
    [authApi.reducerPath]: authApi.reducer,

    auth: authReducer,

  },
  // Adding the api middleware enables caching, invalidation, polling,
  // and other useful features of `rtk-query`.
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(patientApi.middleware, doctorApi.middleware, authApi.middleware),
})


// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch