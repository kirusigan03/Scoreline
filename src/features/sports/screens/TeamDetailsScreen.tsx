import React, { useState, useEffect } from 'react';
import {
  View,
  ScrollView,
  Image,
  TouchableOpacity,
  Linking,
  StyleSheet,
  Alert,
  RefreshControl,
} from 'react-native';
import Feather from 'react-native-vector-icons/Feather';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useTheme } from '../../../theme';
import {
  AppText,
  AppButton,
  ScreenContainer,
  ImageWithFallback,
  OfflineBanner,
  LoadingSkeleton,
  ErrorState,
  CachedDataIndicator,
} from '../../../components';
import { FavouriteButton } from '../../../components/sports';
import { HomeStackParamList } from '../../../navigation/types';
import { useGetTeamDetailsQuery } from '../api/sportsApi';
import { Team } from '../types';
import { useAppDispatch, useAppSelector } from '../../../app/hooks';
import { toggleFavourite } from '../../favourites/favouritesSlice';
import {
  saveTeamDetailsCache,
  getCachedTeamDetails,
} from '../../../storage/cacheStorage';

type Props = NativeStackScreenProps<HomeStackParamList, 'TeamDetails'>;

export const TeamDetailsScreen: React.FC<Props> = ({ route, navigation }) => {
  const { teamId, teamName } = route.params;
  const { colors, radii } = useTheme();
  const dispatch = useAppDispatch();

  const isOnline = useAppSelector((state) => state.offline.isOnline);
  const favourites = useAppSelector((state) => state.favourites.items);

  const [cachedTeam, setCachedTeam] = useState<Team | null>(null);
  const [isUsingCache, setIsUsingCache] = useState(false);

  // Independent API request for team details by ID
  const {
    data: onlineTeam,
    isLoading,
    isFetching,
    isError,
    refetch,
  } = useGetTeamDetailsQuery(teamId, {
    skip: !isOnline,
  });

  // Attempt to restore cached team details on mount / offline
  useEffect(() => {
    const loadCache = async () => {
      const cached = await getCachedTeamDetails(teamId);
      if (cached) {
        setCachedTeam(cached);
        if (!isOnline) {
          setIsUsingCache(true);
        }
      }
    };
    loadCache();
  }, [teamId, isOnline]);

  // When fresh team data arrives from API, update cache
  useEffect(() => {
    if (onlineTeam && isOnline) {
      saveTeamDetailsCache(onlineTeam);
      setCachedTeam(onlineTeam);
      setIsUsingCache(false);
    }
  }, [onlineTeam, isOnline]);

  // Fallback to cache if error or offline
  useEffect(() => {
    if ((!isOnline || isError) && cachedTeam) {
      setIsUsingCache(true);
    }
  }, [isOnline, isError, cachedTeam]);

  const team: Team | null = onlineTeam || cachedTeam;

  const isFav = favourites.some((item) => item.idTeam === teamId);

  const handleToggleFavourite = () => {
    if (team) {
      dispatch(toggleFavourite(team));
    } else {
      // If team details not yet loaded, toggle with minimal info
      dispatch(
        toggleFavourite({
          idTeam: teamId,
          strTeam: teamName || 'Sports Team',
          strSport: 'Sports',
        })
      );
    }
  };

  const handleOpenWebsite = async (url?: string) => {
    if (!url) return;
    try {
      const formattedUrl =
        url.startsWith('http://') || url.startsWith('https://')
          ? url
          : `https://${url}`;
      const canOpen = await Linking.canOpenURL(formattedUrl);
      if (canOpen) {
        await Linking.openURL(formattedUrl);
      } else {
        Alert.alert('Unable to open link', 'The provided URL cannot be opened.');
      }
    } catch {
      Alert.alert('Error', 'Could not open team website.');
    }
  };

  const badgeUrl = team?.strBadge || team?.strTeamBadge;
  const bannerUrl =
    team?.strTeamBanner || team?.strStadiumThumb || team?.strTeamFanart1;

  return (
    <ScreenContainer withTopInset={false}>
      {!isOnline && <OfflineBanner />}

      {/* Top Navigation Bar */}
      <View style={[styles.navBar, { borderBottomColor: colors.border }]}>
        <TouchableOpacity
          activeOpacity={0.7}
          onPress={() => navigation.goBack()}
          accessible={true}
          accessibilityRole="button"
          accessibilityLabel="Go back"
          style={[styles.backBtn, { backgroundColor: colors.surface, borderColor: colors.border }]}>
          <Feather name="arrow-left" size={20} color={colors.textPrimary} />
        </TouchableOpacity>
        <AppText variant="sectionTitle" numberOfLines={1} style={styles.navTitle}>
          {team?.strTeam || teamName || 'Team Details'}
        </AppText>
        <FavouriteButton
          isFavourite={isFav}
          onToggle={handleToggleFavourite}
          size={20}
        />
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
        refreshControl={
          <RefreshControl
            refreshing={isFetching && !isLoading}
            onRefresh={() => {
              refetch();
            }}
            tintColor={colors.primary}
            colors={[colors.primary]}
          />
        }>
        {isLoading && !team ? (
          <View style={styles.loadingContainer}>
            <LoadingSkeleton count={3} />
          </View>
        ) : isError && !team ? (
          <ErrorState
            title="Details Unavailable"
            message={
              isOnline
                ? "Failed to load details for this team from TheSportsDB. Please retry."
                : "You're offline and this team's details haven't been saved yet. Connect to the internet to view complete club information."
            }
            onRetry={() => {
              refetch();
            }}
          />
        ) : team ? (
          <>
            {/* Offline Cache Indicator */}
            {isUsingCache && team.cachedAt && (
              <CachedDataIndicator timestamp={team.cachedAt} />
            )}

            {/* Hero Card with Banner & Badge */}
            <View
              style={[
                styles.heroCard,
                {
                  backgroundColor: colors.card,
                  borderColor: colors.border,
                  borderRadius: radii.card,
                },
              ]}>
              {bannerUrl ? (
                <Image
                  source={{ uri: bannerUrl }}
                  style={styles.bannerImage}
                  resizeMode="cover"
                />
              ) : (
                <View
                  style={[
                    styles.bannerPlaceholder,
                    { backgroundColor: colors.accentSurface },
                  ]}>
                  <Feather name="shield" size={48} color={colors.primary} />
                </View>
              )}

              <View style={styles.badgeOverBanner}>
                <ImageWithFallback
                  uri={badgeUrl}
                  fallbackIcon="shield"
                  fallbackIconSize={40}
                  containerStyle={[
                    styles.badgeContainer,
                    { backgroundColor: colors.surface, borderColor: colors.border },
                  ]}
                />
              </View>

              <View style={styles.heroDetails}>
                <AppText variant="screenTitle" style={styles.teamTitle}>
                  {team.strTeam}
                </AppText>
                {team.strAlternate ? (
                  <AppText variant="bodySmall" secondary style={styles.altName}>
                    {team.strAlternate}
                  </AppText>
                ) : null}

                {/* Quick Meta Pills */}
                <View style={styles.pillsRow}>
                  {team.strSport ? (
                    <View style={[styles.metaPill, { backgroundColor: colors.accentSurface }]}>
                      <Feather name="activity" size={13} color={colors.primary} style={styles.pillIcon} />
                      <AppText variant="caption" style={[styles.pillBold, { color: colors.primary }]}>
                        {team.strSport}
                      </AppText>
                    </View>
                  ) : null}

                  {team.strCountry ? (
                    <View style={[styles.metaPill, styles.borderPill, { backgroundColor: colors.surface, borderColor: colors.border }]}>
                      <Feather name="map-pin" size={13} color={colors.textSecondary} style={styles.pillIcon} />
                      <AppText variant="caption" secondary>
                        {team.strCountry}
                      </AppText>
                    </View>
                  ) : null}

                  {team.intFormedYear ? (
                    <View style={[styles.metaPill, styles.borderPill, { backgroundColor: colors.surface, borderColor: colors.border }]}>
                      <Feather name="calendar" size={13} color={colors.textSecondary} style={styles.pillIcon} />
                      <AppText variant="caption" secondary>
                        Est. {team.intFormedYear}
                      </AppText>
                    </View>
                  ) : null}
                </View>
              </View>
            </View>

            {/* Quick Action: Add/Remove Favourite */}
            <AppButton
              title={isFav ? 'Remove from Favourites' : 'Add to Favourites'}
              variant={isFav ? 'outline' : 'primary'}
              onPress={handleToggleFavourite}
              leftIcon={
                <Feather
                  name={isFav ? 'heart' : 'heart'}
                  size={18}
                  color={isFav ? colors.primary : colors.primaryTextOnAccent}
                />
              }
              style={styles.favouriteActionButton}
            />

            {/* Competition / League Card */}
            {team.strLeague ? (
              <View
                style={[
                  styles.infoCard,
                  {
                    backgroundColor: colors.card,
                    borderColor: colors.border,
                    borderRadius: radii.card,
                  },
                ]}>
                <View style={styles.cardHeader}>
                  <Feather name="award" size={18} color={colors.primary} style={styles.cardIcon} />
                  <AppText variant="cardTitle">Competition</AppText>
                </View>
                <AppText variant="bodyBold" style={styles.cardTopMargin}>
                  {team.strLeague}
                </AppText>
                {team.strDivision ? (
                  <AppText variant="bodySmall" secondary style={styles.cardSubMargin}>
                    Division: {team.strDivision}
                  </AppText>
                ) : null}
              </View>
            ) : null}

            {/* Stadium Information Card */}
            {team.strStadium ? (
              <View
                style={[
                  styles.infoCard,
                  {
                    backgroundColor: colors.card,
                    borderColor: colors.border,
                    borderRadius: radii.card,
                  },
                ]}>
                <View style={styles.cardHeader}>
                  <Feather name="home" size={18} color={colors.primary} style={styles.cardIcon} />
                  <AppText variant="cardTitle">Home Venue</AppText>
                </View>
                <AppText variant="bodyBold" style={styles.cardTopMargin}>
                  {team.strStadium}
                </AppText>
                <View style={styles.venueMetaRow}>
                  {team.strStadiumLocation ? (
                    <AppText variant="bodySmall" secondary>
                      📍 {team.strStadiumLocation}
                    </AppText>
                  ) : null}
                  {team.intStadiumCapacity ? (
                    <AppText variant="bodySmall" secondary style={styles.capacityText}>
                      👥 Capacity: {Number(team.intStadiumCapacity).toLocaleString()}
                    </AppText>
                  ) : null}
                </View>
                {team.strStadiumDescription ? (
                  <AppText variant="bodySmall" secondary style={styles.stadiumDesc}>
                    {team.strStadiumDescription}
                  </AppText>
                ) : null}
              </View>
            ) : null}

            {/* Team Overview / Description Card */}
            {team.strDescriptionEN ? (
              <View
                style={[
                  styles.infoCard,
                  {
                    backgroundColor: colors.card,
                    borderColor: colors.border,
                    borderRadius: radii.card,
                  },
                ]}>
                <View style={styles.cardHeader}>
                  <Feather name="info" size={18} color={colors.primary} style={styles.cardIcon} />
                  <AppText variant="cardTitle">About the Club</AppText>
                </View>
                <AppText
                  variant="body"
                  secondary
                  style={[styles.descriptionText, { color: colors.textPrimary }]}>
                  {team.strDescriptionEN}
                </AppText>
              </View>
            ) : null}

            {/* Official Website Link */}
            {team.strWebsite ? (
              <TouchableOpacity
                activeOpacity={0.8}
                onPress={() => handleOpenWebsite(team.strWebsite)}
                accessible={true}
                accessibilityRole="link"
                accessibilityLabel={`Visit official website: ${team.strWebsite}`}
                style={[
                  styles.websiteCard,
                  {
                    backgroundColor: colors.surface,
                    borderColor: colors.border,
                    borderRadius: radii.card,
                  },
                ]}>
                <Feather name="globe" size={20} color={colors.primary} style={styles.webIcon} />
                <View style={styles.webContent}>
                  <AppText variant="label" style={{ color: colors.primary }}>
                    Official Website
                  </AppText>
                  <AppText variant="caption" secondary numberOfLines={1}>
                    {team.strWebsite}
                  </AppText>
                </View>
                <Feather name="external-link" size={18} color={colors.textSecondary} />
              </TouchableOpacity>
            ) : null}
          </>
        ) : null}
      </ScrollView>
    </ScreenContainer>
  );
};

const styles = StyleSheet.create({
  navBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 12,
    borderBottomWidth: 1,
  },
  backBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
  },
  navTitle: {
    flex: 1,
    marginHorizontal: 12,
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 40,
  },
  loadingContainer: {
    paddingTop: 16,
  },
  heroCard: {
    borderWidth: 1,
    overflow: 'hidden',
    marginBottom: 16,
  },
  bannerImage: {
    width: '100%',
    height: 150,
  },
  bannerPlaceholder: {
    width: '100%',
    height: 120,
    alignItems: 'center',
    justifyContent: 'center',
  },
  badgeOverBanner: {
    marginTop: -40,
    marginLeft: 20,
  },
  badgeContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    borderWidth: 2,
  },
  heroDetails: {
    padding: 20,
    paddingTop: 12,
  },
  teamTitle: {
    fontSize: 24,
    fontWeight: '800',
  },
  altName: {
    marginTop: 2,
    marginBottom: 8,
  },
  pillsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginTop: 12,
  },
  metaPill: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 14,
  },
  borderPill: {
    borderWidth: 1,
  },
  pillIcon: {
    marginRight: 6,
  },
  pillBold: {
    fontWeight: '700',
  },
  favouriteActionButton: {
    marginBottom: 16,
  },
  infoCard: {
    padding: 18,
    borderWidth: 1,
    marginBottom: 16,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  cardIcon: {
    marginRight: 8,
  },
  cardTopMargin: {
    marginTop: 6,
  },
  cardSubMargin: {
    marginTop: 2,
  },
  venueMetaRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 6,
  },
  capacityText: {
    marginLeft: 12,
  },
  stadiumDesc: {
    marginTop: 8,
    lineHeight: 18,
  },
  descriptionText: {
    marginTop: 10,
    lineHeight: 22,
    fontSize: 14,
  },
  websiteCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderWidth: 1,
    marginBottom: 16,
  },
  webIcon: {
    marginRight: 12,
  },
  webContent: {
    flex: 1,
  },
});
