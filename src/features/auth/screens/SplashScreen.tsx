import React, { useEffect } from 'react';
import { View, StyleSheet, ActivityIndicator } from 'react-native';
import Feather from 'react-native-vector-icons/Feather';
import { AppText } from '../../../components/common/AppText';
import { useAppDispatch } from '../../../app/hooks';
import { setCredentials, setInitialized } from '../authSlice';
import { getSecureTokens } from '../../../storage/secureStorage';
import { getCachedUserProfile } from '../../../storage/preferencesStorage';

export const SplashScreen: React.FC = () => {
  const dispatch = useAppDispatch();

  useEffect(() => {
    const initializeAuth = async () => {
      try {
        const tokens = await getSecureTokens();
        const cachedUser = await getCachedUserProfile();

        if (tokens && tokens.accessToken && cachedUser) {
          // Restore authenticated session from secure storage & profile cache
          dispatch(
            setCredentials({
              user: cachedUser,
            })
          );
        }
      } catch {
        // Fallback to unauthenticated state
      } finally {
        dispatch(setInitialized(true));
      }
    };

    initializeAuth();
  }, [dispatch]);

  return (
    <View style={styles.container}>
      <View style={styles.brandContainer}>
        <View style={styles.iconCircle}>
          <Feather name="activity" size={38} color="#101820" />
        </View>
        <AppText variant="display" style={styles.brandText}>
          SCORELINE
        </AppText>
        <AppText variant="caption" style={styles.tagline}>
          Discover. Follow. Stay Connected.
        </AppText>
      </View>
      <View style={styles.footer}>
        <ActivityIndicator size="small" color="#C5F451" />
        <AppText variant="caption" style={styles.loadingText}>
          Initializing session...
        </AppText>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
    backgroundColor: '#101820',
  },
  brandContainer: {
    alignItems: 'center',
  },
  iconCircle: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: '#C5F451',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  brandText: {
    color: '#F8FAFC',
    fontSize: 34,
    fontWeight: '800',
    letterSpacing: 3,
  },
  tagline: {
    color: '#AAB4C0',
    marginTop: 8,
    fontSize: 13,
    letterSpacing: 1,
  },
  footer: {
    position: 'absolute',
    bottom: 48,
    alignItems: 'center',
  },
  loadingText: {
    color: '#AAB4C0',
    marginTop: 8,
    fontSize: 12,
  },
});
