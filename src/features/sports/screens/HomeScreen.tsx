import React, { useState, useEffect, useCallback, useMemo } from 'react';
import {
  View,
  FlatList,
  RefreshControl,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import Feather from 'react-native-vector-icons/Feather';
import { useTheme } from '../../../theme';
import {
  AppText,
  ScreenContainer,
  SearchBar,
  Avatar,
  OfflineBanner,
  LoadingSkeleton,
  ErrorState,
  EmptyState,
  CachedDataIndicator,
  SectionHeader,
} from '../../../components';
import { CategoryChip, TeamCard } from '../../../components/sports';
import { API_CONFIG } from '../../../services/api/apiConfig';
import {
  useGetTeamsByLeagueQuery,
  useLazySearchTeamsQuery,
} from '../api/sportsApi';
import { Team, SportsListCache } from '../types';
import { useAppDispatch, useAppSelector } from '../../../app/hooks';
import { toggleFavourite, setUserScopedFavourites } from '../../favourites/favouritesSlice';
import {
  saveSportsListCache,
  getSportsListCache,
} from '../../../storage/cacheStorage';
import {
  getUserFavourites,
  saveUserFavourites,
} from '../../../storage/favouritesStorage';
import { setLastRefreshTime } from '../../offline/offlineSlice';

const CATEGORIES = [
  { id: '1', name: 'All Sports', icon: 'globe' },
  { id: '2', name: 'Soccer', icon: 'target' },
  { id: '3', name: 'Basketball', icon: 'circle' },
  { id: '4', name: 'Motorsport', icon: 'compass' },
  { id: '5', name: 'American Football', icon: 'shield' },
  { id: '6', name: 'Ice Hockey', icon: 'zap' },
];

export const HomeScreen: React.FC<{ navigation: any }> = ({ navigation }) => {
  const { colors, radii } = useTheme();
  const dispatch = useAppDispatch();

  const user = useAppSelector((state) => state.auth.user);
  const isOnline = useAppSelector((state) => state.offline.isOnline);
  const favourites = useAppSelector((state) => state.favourites.items);

  const [selectedCategory, setSelectedCategory] = useState('All Sports');
  const [selectedLeague, setSelectedLeague] = useState(API_CONFIG.DEFAULT_LEAGUE);
  const [searchQuery, setSearchQuery] = useState('');
  const [cachedData, setCachedData] = useState<SportsListCache | null>(null);
  const [isUsingCache, setIsUsingCache] = useState(false);

  // RTK Query for teams by league
  const {
    data: onlineTeams,
    isLoading: isLoadingTeams,
    isFetching: isFetchingTeams,
    isError: isTeamsError,
    refetch: refetchTeams,
  } = useGetTeamsByLeagueQuery(selectedLeague, {
    skip: searchQuery.trim().length > 0,
  });

  // Lazy query for team search
  const [
    triggerSearch,
    { data: searchResults, isFetching: isSearching, isError: isSearchError },
  ] = useLazySearchTeamsQuery();

  // Load user favourites on mount / user change
  useEffect(() => {
    const loadFavourites = async () => {
      if (user?.username) {
        const saved = await getUserFavourites(user.username);
        dispatch(
          setUserScopedFavourites({
            userScopedId: user.username,
            items: saved,
          })
        );
      }
    };
    loadFavourites();
  }, [user?.username, dispatch]);

  // Sync favourites changes to storage
  useEffect(() => {
    if (user?.username && favourites) {
      saveUserFavourites(user.username, favourites);
    }
  }, [favourites, user?.username]);

  // Load cached data when offline or on first launch
  useEffect(() => {
    const loadCache = async () => {
      const cached = await getSportsListCache();
      if (cached) {
        setCachedData(cached);
        if (!isOnline) {
          setIsUsingCache(true);
        }
      }
    };
    loadCache();
  }, [isOnline]);

  // Cache fresh data whenever successfully fetched online
  useEffect(() => {
    if (onlineTeams && onlineTeams.length > 0 && isOnline) {
      saveSportsListCache(onlineTeams, selectedLeague, selectedCategory);
      setCachedData({
        teams: onlineTeams,
        league: selectedLeague,
        sport: selectedCategory,
        timestamp: Date.now(),
      });
      setIsUsingCache(false);
      dispatch(setLastRefreshTime(Date.now()));
    }
  }, [onlineTeams, selectedLeague, selectedCategory, isOnline, dispatch]);

  // If online query failed or offline, fall back to cache
  useEffect(() => {
    if ((!isOnline || isTeamsError) && cachedData?.teams) {
      setIsUsingCache(true);
    }
  }, [isOnline, isTeamsError, cachedData]);

  // Debounced search handling
  useEffect(() => {
    const query = searchQuery.trim();
    if (query.length >= 2 && isOnline) {
      const timer = setTimeout(() => {
        triggerSearch(query);
      }, 400);
      return () => clearTimeout(timer);
    }
  }, [searchQuery, isOnline, triggerSearch]);

  const handleRefresh = useCallback(() => {
    if (isOnline) {
      refetchTeams();
    }
  }, [isOnline, refetchTeams]);

  // Determine active teams list
  const displayedTeams: Team[] = useMemo(() => {
    if (searchQuery.trim().length >= 2) {
      return searchResults || [];
    }
    if (isUsingCache && cachedData?.teams) {
      return cachedData.teams;
    }
    return onlineTeams || [];
  }, [searchQuery, searchResults, isUsingCache, cachedData, onlineTeams]);

  const isFavourite = (teamId: string) => {
    return favourites.some((item) => item.idTeam === teamId);
  };

  const handleToggleFavourite = (team: Team) => {
    dispatch(toggleFavourite(team));
  };

  const handleTeamPress = (team: Team) => {
    navigation.navigate('TeamDetails', {
      teamId: team.idTeam,
      teamName: team.strTeam,
    });
  };

  const greetingName = user?.firstName || user?.username || 'Fan';

  return (
    <ScreenContainer withTopInset={false}>
      {/* Offline Banner */}
      {!isOnline && <OfflineBanner />}

      {/* Main Header */}
      <View style={[styles.header, { borderBottomColor: colors.border }]}>
        <View style={styles.brandRow}>
          <View style={[styles.brandIcon, { backgroundColor: colors.accentSurface }]}>
            <Feather name="activity" size={20} color={colors.primary} />
          </View>
          <View>
            <AppText variant="caption" secondary style={styles.appTitle}>
              SCORELINE
            </AppText>
            <AppText variant="sectionTitle" numberOfLines={1}>
              Hello, {greetingName} 👋
            </AppText>
          </View>
        </View>
        <TouchableOpacity
          activeOpacity={0.8}
          onPress={() => navigation.navigate('ProfileTab')}
          accessibilityRole="button"
          accessibilityLabel="Open profile">
          <Avatar name={greetingName} size={42} uri={user?.image} />
        </TouchableOpacity>
      </View>

      <FlatList
        data={displayedTeams}
        keyExtractor={(item) => item.idTeam}
        renderItem={({ item }) => (
          <TeamCard
            team={item}
            isFavourite={isFavourite(item.idTeam)}
            onPress={() => handleTeamPress(item)}
            onToggleFavourite={() => handleToggleFavourite(item)}
          />
        )}
        contentContainerStyle={styles.listContent}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={isFetchingTeams && !isLoadingTeams}
            onRefresh={handleRefresh}
            tintColor={colors.primary}
            colors={[colors.primary]}
          />
        }
        ListHeaderComponent={
          <View style={styles.headerComponent}>
            {/* Search Bar */}
            <SearchBar
              value={searchQuery}
              onChangeText={setSearchQuery}
              placeholder="Search teams across all sports..."
              style={styles.searchBar}
            />

            {/* Offline Cache Indicator */}
            {isUsingCache && cachedData?.timestamp && (
              <CachedDataIndicator timestamp={cachedData.timestamp} />
            )}

            {/* Search Active Notification */}
            {searchQuery.trim().length > 0 ? (
              <AppText variant="label" secondary style={styles.searchNotice}>
                Showing search results for "{searchQuery}"
              </AppText>
            ) : (
              <>
                {/* Sports Category Chips */}
                <ScrollView
                  horizontal
                  showsHorizontalScrollIndicator={false}
                  contentContainerStyle={styles.chipsScroll}>
                  {CATEGORIES.map((cat) => (
                    <CategoryChip
                      key={cat.id}
                      label={cat.name}
                      icon={cat.icon}
                      selected={selectedCategory === cat.name}
                      onPress={() => {
                        setSelectedCategory(cat.name);
                        const matchedLeague = API_CONFIG.POPULAR_LEAGUES.find(
                          (l) => l.sport.toLowerCase() === cat.name.toLowerCase()
                        );
                        if (matchedLeague) {
                          setSelectedLeague(matchedLeague.name);
                        }
                      }}
                    />
                  ))}
                </ScrollView>

                {/* Featured Sports Discovery Banner */}
                <View
                  style={[
                    styles.featuredCard,
                    {
                      backgroundColor: colors.card,
                      borderColor: colors.border,
                      borderRadius: radii.card,
                    },
                  ]}>
                  <View style={styles.featuredBadgeRow}>
                    <View style={[styles.liveTag, { backgroundColor: colors.accentSurface }]}>
                      <View style={[styles.liveDot, { backgroundColor: colors.primary }]} />
                      <AppText
                        variant="caption"
                        style={[styles.featuredTagText, { color: colors.primary }]}>
                        FEATURED LEAGUE
                      </AppText>
                    </View>
                    <Feather name="trending-up" size={16} color={colors.primary} />
                  </View>
                  <AppText variant="sectionTitle" style={styles.featuredTitle}>
                    {selectedLeague}
                  </AppText>
                  <AppText variant="bodySmall" secondary style={styles.featuredDesc}>
                    Explore official squads, badges, and verified club information.
                  </AppText>
                </View>

                {/* Popular Leagues Selection */}
                <SectionHeader title="Popular Leagues" style={styles.sectionHeader} />
                <ScrollView
                  horizontal
                  showsHorizontalScrollIndicator={false}
                  contentContainerStyle={styles.leaguesScroll}>
                  {API_CONFIG.POPULAR_LEAGUES.map((league) => (
                    <TouchableOpacity
                      key={league.id}
                      activeOpacity={0.7}
                      onPress={() => setSelectedLeague(league.name)}
                      style={[
                        styles.leaguePill,
                        {
                          backgroundColor:
                            selectedLeague === league.name
                              ? colors.primary
                              : colors.surface,
                          borderColor:
                            selectedLeague === league.name
                              ? colors.primary
                              : colors.border,
                          borderRadius: radii.chip,
                        },
                      ]}>
                      <AppText
                        variant="caption"
                        style={{
                          color:
                            selectedLeague === league.name
                              ? colors.primaryTextOnAccent
                              : colors.textPrimary,
                          fontWeight: selectedLeague === league.name ? '700' : '500',
                        }}>
                        {league.name}
                      </AppText>
                    </TouchableOpacity>
                  ))}
                </ScrollView>

                <SectionHeader
                  title="Clubs & Teams"
                  actionText={`${displayedTeams.length} teams`}
                  style={styles.sectionHeader}
                />
              </>
            )}
          </View>
        }
        ListEmptyComponent={
          isLoadingTeams || isSearching ? (
            <LoadingSkeleton count={5} />
          ) : isTeamsError || isSearchError ? (
            <ErrorState
              title="Unable to load sports data"
              message={
                isOnline
                  ? "We couldn't connect to TheSportsDB. Please retry or check back shortly."
                  : 'You are currently offline and no saved data was found for this league.'
              }
              onRetry={handleRefresh}
            />
          ) : (
            <EmptyState
              icon={searchQuery ? 'search' : 'shield'}
              title={searchQuery ? 'No teams found' : 'No teams available'}
              description={
                searchQuery
                  ? `We could not find any team matching "${searchQuery}". Try searching another name.`
                  : 'No teams returned for this category. Please select another league above.'
              }
              actionText={searchQuery ? 'Clear Search' : undefined}
              onAction={() => setSearchQuery('')}
            />
          )
        }
      />
    </ScreenContainer>
  );
};

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 14,
    borderBottomWidth: 1,
  },
  brandRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  brandIcon: {
    width: 42,
    height: 42,
    borderRadius: 21,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  appTitle: {
    letterSpacing: 2,
    fontWeight: '700',
    fontSize: 11,
  },
  listContent: {
    paddingHorizontal: 16,
    paddingBottom: 24,
  },
  headerComponent: {
    paddingTop: 16,
  },
  searchBar: {
    marginBottom: 16,
  },
  searchNotice: {
    marginBottom: 12,
    paddingHorizontal: 4,
  },
  chipsScroll: {
    paddingBottom: 14,
  },
  featuredCard: {
    padding: 18,
    borderWidth: 1,
    marginBottom: 16,
  },
  featuredBadgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  liveTag: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  liveDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    marginRight: 6,
  },
  featuredTagText: {
    fontWeight: '700',
  },
  featuredTitle: {
    marginBottom: 6,
  },
  featuredDesc: {
    lineHeight: 18,
  },
  sectionHeader: {
    paddingHorizontal: 0,
    paddingVertical: 8,
  },
  leaguesScroll: {
    paddingBottom: 16,
  },
  leaguePill: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderWidth: 1.5,
    marginRight: 8,
  },
});
