import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { API_CONFIG } from '../../../services/api/apiConfig';
import { SportCategory, SportLeague, Team } from '../types';

interface AllSportsResponse {
  sports: SportCategory[];
}

interface AllLeaguesResponse {
  leagues: SportLeague[];
}

interface TeamsResponse {
  teams: Team[] | null;
}

export const sportsApi = createApi({
  reducerPath: 'sportsApi',
  baseQuery: fetchBaseQuery({
    baseUrl: API_CONFIG.THE_SPORTS_DB_BASE_URL,
    timeout: API_CONFIG.REQUEST_TIMEOUT_MS,
  }),
  tagTypes: ['Sports', 'Teams', 'TeamDetails'],
  endpoints: (builder) => ({
    getSportsCategories: builder.query<SportCategory[], void>({
      query: () => '/all_sports.php',
      transformResponse: (response: AllSportsResponse) => response.sports || [],
      providesTags: ['Sports'],
    }),

    getAllLeagues: builder.query<SportLeague[], void>({
      query: () => '/all_leagues.php',
      transformResponse: (response: AllLeaguesResponse) => response.leagues || [],
      providesTags: ['Sports'],
    }),

    getTeamsByLeague: builder.query<Team[], string>({
      query: (leagueName) =>
        `/search_all_teams.php?l=${encodeURIComponent(leagueName)}`,
      transformResponse: (response: TeamsResponse) => response.teams || [],
      providesTags: (result, error, league) => [{ type: 'Teams', id: league }],
    }),

    searchTeams: builder.query<Team[], string>({
      query: (query) => `/searchteams.php?t=${encodeURIComponent(query)}`,
      transformResponse: (response: TeamsResponse) => response.teams || [],
    }),

    getTeamDetails: builder.query<Team | null, string>({
      query: (idTeam) => `/lookupteam.php?id=${encodeURIComponent(idTeam)}`,
      transformResponse: (response: TeamsResponse) =>
        response.teams && response.teams.length > 0 ? response.teams[0] : null,
      providesTags: (result, error, id) => [{ type: 'TeamDetails', id }],
    }),
  }),
});

export const {
  useGetSportsCategoriesQuery,
  useGetAllLeaguesQuery,
  useGetTeamsByLeagueQuery,
  useLazySearchTeamsQuery,
  useGetTeamDetailsQuery,
} = sportsApi;
