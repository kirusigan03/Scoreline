/**
 * Centralized API configuration for Scoreline mobile app.
 * Public sports endpoints use TheSportsDB free-tier API key '3'.
 */
export const API_CONFIG = {
  THE_SPORTS_DB_BASE_URL: 'https://www.thesportsdb.com/api/v1/json/3',
  DUMMY_JSON_BASE_URL: 'https://dummyjson.com',
  REQUEST_TIMEOUT_MS: 15000,
  DEFAULT_LEAGUE: 'English Premier League',
  DEFAULT_SPORT: 'Soccer',
  POPULAR_LEAGUES: [
    { id: '4328', name: 'English Premier League', sport: 'Soccer' },
    { id: '4335', name: 'Spanish La Liga', sport: 'Soccer' },
    { id: '4387', name: 'NBA', sport: 'Basketball' },
    { id: '4370', name: 'Formula 1', sport: 'Motorsport' },
    { id: '4391', name: 'NFL', sport: 'American Football' },
    { id: '4380', name: 'NHL', sport: 'Ice Hockey' },
  ],
};
