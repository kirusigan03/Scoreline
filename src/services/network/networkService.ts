import NetInfo, { NetInfoState } from '@react-native-community/netinfo';
import { store } from '../../app/store';
import { setNetworkStatus } from '../../features/offline/offlineSlice';
import { sportsApi } from '../../features/sports/api/sportsApi';

let wasPreviouslyOffline = false;

/**
 * Initializes global network listener.
 * Detects online/offline transitions, updates Redux offline state,
 * and automatically triggers RTK Query data refetch when reconnecting.
 */
export const initNetworkListener = () => {
  return NetInfo.addEventListener((state: NetInfoState) => {
    const isConnected = Boolean(state.isConnected && state.isInternetReachable !== false);

    store.dispatch(
      setNetworkStatus({
        isOnline: isConnected,
        isInternetReachable: state.isInternetReachable,
      })
    );

    // Automatic reconnection handler
    if (wasPreviouslyOffline && isConnected) {
      // Reconnected! Automatically trigger refetch for cached queries
      store.dispatch(sportsApi.util.invalidateTags(['Sports', 'Teams']));
    }

    wasPreviouslyOffline = !isConnected;
  });
};

/**
 * Quick one-off check for internet reachability.
 */
export const checkCurrentNetworkStatus = async (): Promise<boolean> => {
  const state = await NetInfo.fetch();
  return Boolean(state.isConnected && state.isInternetReachable !== false);
};
