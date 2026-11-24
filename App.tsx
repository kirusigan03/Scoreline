import React, { useEffect, useState, useMemo } from 'react';
import { View, StyleSheet } from 'react-native';
import { Provider } from 'react-redux';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { store } from './src/app/store';
import { RootNavigator } from './src/navigation/RootNavigator';
import { ThemeContext, darkTheme, lightTheme, ThemeMode } from './src/theme';
import { getThemePreference, saveThemePreference } from './src/storage/preferencesStorage';
import { setTheme } from './src/features/settings/settingsSlice';
import { dismissReconnectedNotice } from './src/features/offline/offlineSlice';
import { initNetworkListener } from './src/services/network/networkService';
import { Snackbar } from './src/components/feedback';
import { useAppSelector, useAppDispatch } from './src/app/hooks';

const AppContent: React.FC = () => {
  const [themeMode, setThemeModeState] = useState<ThemeMode>('dark');
  const dispatch = useAppDispatch();
  const showReconnectedNotice = useAppSelector(
    (state) => state.offline.showReconnectedNotice
  );

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

    // Initialize network monitoring with automatic reconnect refresh
    const unsubscribeNet = initNetworkListener();

    return () => {
      unsubscribeNet();
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
        <View style={styles.rootContainer}>
          <RootNavigator />
          <Snackbar
            visible={showReconnectedNotice}
            type="success"
            message="Back online — fresh sports data loaded!"
            onDismiss={() => dispatch(dismissReconnectedNotice())}
            duration={3500}
          />
        </View>
      </SafeAreaProvider>
    </ThemeContext.Provider>
  );
};

const styles = StyleSheet.create({
  rootContainer: {
    flex: 1,
  },
});

export default function App(): React.JSX.Element {
  return (
    <Provider store={store}>
      <AppContent />
    </Provider>
  );
}
