import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface OfflineState {
  isOnline: boolean;
  isInternetReachable: boolean | null;
  lastRefreshTimestamp: number | null;
  showReconnectedNotice: boolean;
}

const initialState: OfflineState = {
  isOnline: true,
  isInternetReachable: true,
  lastRefreshTimestamp: null,
  showReconnectedNotice: false,
};

export const offlineSlice = createSlice({
  name: 'offline',
  initialState,
  reducers: {
    setNetworkStatus: (
      state,
      action: PayloadAction<{ isOnline: boolean; isInternetReachable?: boolean | null }>
    ) => {
      const wasOffline = !state.isOnline;
      state.isOnline = action.payload.isOnline;
      if (action.payload.isInternetReachable !== undefined) {
        state.isInternetReachable = action.payload.isInternetReachable;
      }
      if (wasOffline && action.payload.isOnline) {
        state.showReconnectedNotice = true;
      }
    },
    setLastRefreshTime: (state, action: PayloadAction<number>) => {
      state.lastRefreshTimestamp = action.payload;
    },
    dismissReconnectedNotice: (state) => {
      state.showReconnectedNotice = false;
    },
  },
});

export const {
  setNetworkStatus,
  setLastRefreshTime,
  dismissReconnectedNotice,
} = offlineSlice.actions;

export default offlineSlice.reducer;
