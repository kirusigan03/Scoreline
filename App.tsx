import React, { useEffect, useState, useMemo } from 'react';
import { Provider } from 'react-redux';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import NetInfo from '@react-native-community/netinfo';
import { store } from './src/app/store';
import { RootNavigator } from './src/navigation/RootNavigator';
import { ThemeContext, darkTheme, lightTheme, ThemeMode } from './src/theme';
import { getThemePreference, saveThemePreference } from './src/storage/preferencesStorage';
import { setNetworkStatus } from './src/features/offline/offlineSlice';
import { setTheme } from './src/features/settings/settingsSlice';

const AppContent: React.FC = () => {
  const [themeMode, setThemeModeState] = useState<ThemeMode>('dark');

  useEffect(() => {
    // Restore persistent theme preference
    const restoreTheme = async () => {
      const savedMode = await getThemePreference();
      if (savedMode) {
        setThemeModeState(savedMode);
        store.dispatch(setTheme(savedMode));
      }
    };
    restoreTheme();

    // Subscribe to network connectivity changes
    const unsubscribeNetInfo = NetInfo.addEventListener((state) => {
      const isOnline = Boolean(state.isConnected);
      store.dispatch(
        setNetworkStatus({
          isOnline,
          isInternetReachable: state.isInternetReachable,
        })
      );
    });

    return () => {
      unsubscribeNetInfo();
    };
  }, []);

  const setThemeMode = (mode: ThemeMode) => {
    setThemeModeState(mode);
    saveThemePreference(mode);
    store.dispatch(setTheme(mode));
  };

  const toggleTheme = () => {
    const nextMode: ThemeMode = themeMode === 'dark' ? 'light' : 'dark';
    setThemeMode(nextMode);
  };

  const themeValue = useMemo(
    () => ({
      theme: themeMode === 'dark' ? darkTheme : lightTheme,
      themeMode,
      toggleTheme,
      setThemeMode,
    }),
    [themeMode]
  );

  return (
    <ThemeContext.Provider value={themeValue}>
      <SafeAreaProvider>
        <RootNavigator />
      </SafeAreaProvider>
    </ThemeContext.Provider>
  );
};

export default function App(): React.JSX.Element {
  return (
    <Provider store={store}>
      <AppContent />
    </Provider>
  );
}
