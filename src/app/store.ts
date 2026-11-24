import { configureStore } from '@reduxjs/toolkit';
import authReducer from '../features/auth/authSlice';
import settingsReducer from '../features/settings/settingsSlice';
import offlineReducer from '../features/offline/offlineSlice';
import favouritesReducer from '../features/favourites/favouritesSlice';
import { authApi } from '../features/auth/api/authApi';
import { sportsApi } from '../features/sports/api/sportsApi';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    settings: settingsReducer,
    offline: offlineReducer,
    favourites: favouritesReducer,
    [authApi.reducerPath]: authApi.reducer,
    [sportsApi.reducerPath]: sportsApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }).concat(authApi.middleware, sportsApi.middleware),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
