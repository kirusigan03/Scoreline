import React from 'react';
import {
  View,
  FlatList,
  StyleSheet,
} from 'react-native';
import Feather from 'react-native-vector-icons/Feather';
import { useTheme } from '../../../theme';
import {
  AppText,
  ScreenContainer,
  AppHeader,
  EmptyState,
  OfflineBanner,
} from '../../../components';
import { TeamCard } from '../../../components/sports';
import { useAppDispatch, useAppSelector } from '../../../app/hooks';
import { toggleFavourite } from '../favouritesSlice';
import { Team } from '../../sports/types';

export const FavouritesScreen: React.FC<{ navigation: any }> = ({ navigation }) => {
  const { colors, radii } = useTheme();
  const dispatch = useAppDispatch();

  const isOnline = useAppSelector((state) => state.offline.isOnline);
  const favourites = useAppSelector((state) => state.favourites.items);

  const handleToggleFavourite = (team: Team) => {
    dispatch(toggleFavourite(team));
  };

  const handleTeamPress = (team: Team) => {
    navigation.navigate('TeamDetails', {
      teamId: team.idTeam,
      teamName: team.strTeam,
    });
  };

  const handleExplorePress = () => {
    navigation.navigate('HomeTab');
  };

  const countText =
    favourites.length === 1
      ? '1 team saved'
      : `${favourites.length} teams saved`;

  return (
    <ScreenContainer withTopInset={false}>
      {!isOnline && <OfflineBanner />}

      {/* Screen Header */}
      <AppHeader
        title="Your Favourites"
        subtitle={favourites.length > 0 ? countText : undefined}
      />

      <FlatList
        data={favourites}
        keyExtractor={(item) => item.idTeam}
        renderItem={({ item }) => (
          <TeamCard
            team={item}
            isFavourite={true}
            onPress={() => handleTeamPress(item)}
            onToggleFavourite={() => handleToggleFavourite(item)}
          />
        )}
        contentContainerStyle={[
          styles.listContent,
          favourites.length === 0 && styles.emptyListContent,
        ]}
        showsVerticalScrollIndicator={false}
        ListHeaderComponent={
          favourites.length > 0 ? (
            <View
              style={[
                styles.offlineNotice,
                {
                  backgroundColor: colors.surface,
                  borderColor: colors.border,
                  borderRadius: radii.card,
                },
              ]}>
              <Feather name="check-circle" size={16} color={colors.primary} style={styles.noticeIcon} />
              <AppText variant="caption" secondary style={styles.noticeText}>
                All saved favourites are stored offline and accessible without an internet connection.
              </AppText>
            </View>
          ) : undefined
        }
        ListEmptyComponent={
          <EmptyState
            icon="heart"
            title="No favourites yet"
            description="Save the teams you love and find them here. Your favourites will always stay accessible offline."
            actionText="Explore Sports"
            onAction={handleExplorePress}
          />
        }
      />
    </ScreenContainer>
  );
};

const styles = StyleSheet.create({
  listContent: {
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 32,
  },
  emptyListContent: {
    flexGrow: 1,
    justifyContent: 'center',
  },
  offlineNotice: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderWidth: 1,
    marginBottom: 16,
  },
  noticeIcon: {
    marginRight: 10,
  },
  noticeText: {
    flex: 1,
    lineHeight: 18,
  },
});
