import AsyncStorage from '@react-native-async-storage/async-storage';
import { Team } from '../features/sports/types';

const getStorageKey = (username: string): string => {
  return `@scoreline_user_favourites_v1_${username.trim().toLowerCase()}`;
};

/**
 * Save user-scoped favourites to AsyncStorage.
 * Ensures user isolation so another user's saved items never leak.
 */
export const saveUserFavourites = async (
  username: string,
  favourites: Team[]
): Promise<void> => {
  try {
    if (!username) return;
    const key = getStorageKey(username);
    await AsyncStorage.setItem(key, JSON.stringify(favourites));
  } catch {
    // Fail silently
  }
};

/**
 * Retrieve user-scoped favourites.
 */
export const getUserFavourites = async (username: string): Promise<Team[]> => {
  try {
    if (!username) return [];
    const key = getStorageKey(username);
    const json = await AsyncStorage.getItem(key);
    if (json) {
      return JSON.parse(json);
    }
    return [];
  } catch {
    return [];
  }
};
