import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  saveSportsListCache,
  getSportsListCache,
  saveTeamDetailsCache,
  getCachedTeamDetails,
} from '../src/storage/cacheStorage';
import { Team } from '../src/features/sports/types';

describe('Offline-first Storage and Cache Handling', () => {
  beforeEach(async () => {
    await AsyncStorage.clear();
    jest.clearAllMocks();
  });

  const mockTeams: Team[] = [
    {
      idTeam: '133604',
      strTeam: 'Arsenal',
      strSport: 'Soccer',
      strLeague: 'English Premier League',
      strCountry: 'England',
      strBadge: 'https://example.com/arsenal.png',
    },
    {
      idTeam: '133613',
      strTeam: 'Chelsea',
      strSport: 'Soccer',
      strLeague: 'English Premier League',
      strCountry: 'England',
      strBadge: 'https://example.com/chelsea.png',
    },
  ];

  it('should serialize and persist sports list for offline access', async () => {
    await saveSportsListCache(mockTeams, 'English Premier League', 'Soccer');

    const cached = await getSportsListCache();
    expect(cached).not.toBeNull();
    expect(cached?.league).toBe('English Premier League');
    expect(cached?.teams).toHaveLength(2);
    expect(cached?.teams[0].strTeam).toBe('Arsenal');
    expect(cached?.timestamp).toBeGreaterThan(0);
  });

  it('should persist and retrieve individual team details offline', async () => {
    const detailedTeam: Team = {
      ...mockTeams[0],
      strStadium: 'Emirates Stadium',
      intFormedYear: '1886',
      strDescriptionEN: 'Arsenal Football Club is a professional football club.',
    };

    await saveTeamDetailsCache(detailedTeam);

    const cached = await getCachedTeamDetails('133604');
    expect(cached).not.toBeNull();
    expect(cached?.strStadium).toBe('Emirates Stadium');
    expect(cached?.intFormedYear).toBe('1886');
  });

  it('should gracefully handle empty or nonexistent cache without throwing', async () => {
    const nonExistentTeam = await getCachedTeamDetails('999999');
    expect(nonExistentTeam).toBeNull();

    const emptyList = await getSportsListCache();
    expect(emptyList).toBeNull();
  });
});
