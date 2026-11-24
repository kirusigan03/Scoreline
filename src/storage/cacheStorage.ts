import AsyncStorage from '@react-native-async-storage/async-storage';
import { Team, SportsListCache, TeamDetailsCache } from '../features/sports/types';

const CACHE_KEYS = {
  SPORTS_LIST: '@scoreline_sports_list_cache_v1',
  TEAM_DETAILS: '@scoreline_team_details_cache_v1',
  LAST_REFRESH: '@scoreline_last_refresh_timestamp_v1',
} as const;

/**
 * Persist the last successfully loaded sports list.
 * Offline-first twist: Allows user to browse last loaded list with zero internet.
 */
export const saveSportsListCache = async (
  teams: Team[],
  league: string,
  sport: string
): Promise<void> => {
  try {
    const payload: SportsListCache = {
      teams,
      league,
      sport,
      timestamp: Date.now(),
    };
    await AsyncStorage.setItem(CACHE_KEYS.SPORTS_LIST, JSON.stringify(payload));
    await AsyncStorage.setItem(CACHE_KEYS.LAST_REFRESH, Date.now().toString());
  } catch {
    // Fail silently without blocking UI
  }
};

/**
 * Retrieve cached sports list.
 */
export const getSportsListCache = async (): Promise<SportsListCache | null> => {
  try {
    const json = await AsyncStorage.getItem(CACHE_KEYS.SPORTS_LIST);
    if (json) {
      return JSON.parse(json);
    }
    return null;
  } catch {
    return null;
  }
};

/**
 * Persist a team's detailed information for offline viewing.
 */
export const saveTeamDetailsCache = async (team: Team): Promise<void> => {
  try {
    const existing = await getTeamDetailsCacheMap();
    existing[team.idTeam] = {
      team: { ...team, cachedAt: Date.now() },
      timestamp: Date.now(),
    };
    await AsyncStorage.setItem(CACHE_KEYS.TEAM_DETAILS, JSON.stringify(existing));
  } catch {
    // Fail silently
  }
};

/**
 * Get cached details for a specific team ID.
 */
export const getCachedTeamDetails = async (teamId: string): Promise<Team | null> => {
  try {
    const map = await getTeamDetailsCacheMap();
    if (map[teamId] && map[teamId].team) {
      return map[teamId].team;
    }
    return null;
  } catch {
    return null;
  }
};

const getTeamDetailsCacheMap = async (): Promise<TeamDetailsCache> => {
  try {
    const json = await AsyncStorage.getItem(CACHE_KEYS.TEAM_DETAILS);
    if (json) {
      return JSON.parse(json);
    }
    return {};
  } catch {
    return {};
  }
};
