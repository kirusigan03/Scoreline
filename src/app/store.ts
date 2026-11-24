import { configureStore } from '@reduxjs/toolkit';
import authReducer from '../features/auth/authSlice';
import settingsReducer from '../features/settings/settingsSlice';
import offlineReducer from '../features/offline/offlineSlice';
import { authApi } from '../features/auth/api/authApi';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    settings: settingsReducer,
    offline: offlineReducer,
    [authApi.reducerPath]: authApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }).concat(authApi.middleware),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
