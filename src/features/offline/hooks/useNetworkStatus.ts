import { useAppSelector } from '../../../app/hooks';
import { RootState } from '../../../app/store';

export const useNetworkStatus = () => {
  const isOnline = useAppSelector((state: RootState) => state.offline.isOnline);
  const isInternetReachable = useAppSelector((state: RootState) => state.offline.isInternetReachable);
  const lastRefreshTimestamp = useAppSelector((state: RootState) => state.offline.lastRefreshTimestamp);
  const showReconnectedNotice = useAppSelector((state: RootState) => state.offline.showReconnectedNotice);

  return {
    isOnline,
    isInternetReachable,
    lastRefreshTimestamp,
    showReconnectedNotice,
  };
};
