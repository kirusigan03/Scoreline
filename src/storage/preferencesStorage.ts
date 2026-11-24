import AsyncStorage from '@react-native-async-storage/async-storage';
import { ThemeMode } from '../theme';

const STORAGE_KEYS = {
  THEME_MODE: '@scoreline_theme_mode_v1',
  USER_PROFILE: '@scoreline_user_profile_v1',
  LAST_REFRESH: '@scoreline_last_refresh_v1',
} as const;

export interface CachedUserProfile {
  id: number;
  username: string;
  email: string;
  firstName: string;
  lastName: string;
  image?: string;
}

/**
 * Save user theme preference (light/dark).
 */
export const saveThemePreference = async (mode: ThemeMode): Promise<void> => {
  try {
    await AsyncStorage.setItem(STORAGE_KEYS.THEME_MODE, mode);
  } catch {
    // Fail silently
  }
};

/**
 * Retrieve saved theme preference.
 */
export const getThemePreference = async (): Promise<ThemeMode | null> => {
  try {
    const value = await AsyncStorage.getItem(STORAGE_KEYS.THEME_MODE);
    if (value === 'dark' || value === 'light') {
      return value;
    }
    return null;
  } catch {
    return null;
  }
};

/**
 * Save non-sensitive user profile data for offline display.
 */
export const saveCachedUserProfile = async (profile: CachedUserProfile): Promise<void> => {
  try {
    await AsyncStorage.setItem(STORAGE_KEYS.USER_PROFILE, JSON.stringify(profile));
  } catch {
    // Fail silently
  }
};

/**
 * Retrieve cached user profile.
 */
export const getCachedUserProfile = async (): Promise<CachedUserProfile | null> => {
  try {
    const json = await AsyncStorage.getItem(STORAGE_KEYS.USER_PROFILE);
    if (json) {
      return JSON.parse(json);
    }
    return null;
  } catch {
    return null;
  }
};

/**
 * Remove cached profile on logout.
 */
export const clearCachedUserProfile = async (): Promise<void> => {
  try {
    await AsyncStorage.removeItem(STORAGE_KEYS.USER_PROFILE);
  } catch {
    // Fail silently
  }
};

/**
 * Save last successful data refresh timestamp.
 */
export const saveLastRefreshTimestamp = async (timestamp: number): Promise<void> => {
  try {
    await AsyncStorage.setItem(STORAGE_KEYS.LAST_REFRESH, timestamp.toString());
  } catch {
    // Fail silently
  }
};

/**
 * Get last successful data refresh timestamp.
 */
export const getLastRefreshTimestamp = async (): Promise<number | null> => {
  try {
    const val = await AsyncStorage.getItem(STORAGE_KEYS.LAST_REFRESH);
    return val ? parseInt(val, 10) : null;
  } catch {
    return null;
  }
};
