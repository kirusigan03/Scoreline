import React from 'react';
import {
  TouchableOpacity,
  View,
  StyleSheet,
  ViewStyle,
} from 'react-native';
import Feather from 'react-native-vector-icons/Feather';
import { useTheme } from '../../theme';
import { AppText } from '../common/AppText';
import { ImageWithFallback } from '../common/ImageWithFallback';
import { FavouriteButton } from './FavouriteButton';

export interface TeamCardData {
  idTeam: string;
  strTeam: string;
  strSport?: string;
  strLeague?: string;
  strCountry?: string;
  strBadge?: string;
  strTeamBadge?: string;
}

export interface TeamCardProps {
  team: TeamCardData;
  isFavourite?: boolean;
  onPress: () => void;
  onToggleFavourite: () => void;
  style?: ViewStyle;
}

export const TeamCard: React.FC<TeamCardProps> = ({
  team,
  isFavourite = false,
  onPress,
  onToggleFavourite,
  style,
}) => {
  const { colors, radii } = useTheme();

  const badgeUrl = team.strBadge || team.strTeamBadge;
  const subtitle = team.strLeague || team.strCountry || team.strSport || 'Sports Club';

  return (
    <TouchableOpacity
      activeOpacity={0.8}
      onPress={onPress}
      accessible={true}
      accessibilityRole="button"
      accessibilityLabel={`${team.strTeam}, ${team.strSport || 'Sport'}, ${subtitle}`}
      style={[
        styles.card,
        {
          backgroundColor: colors.card,
          borderColor: colors.border,
          borderRadius: radii.card,
        },
        style,
      ]}>
      <View style={styles.badgeWrapper}>
        <ImageWithFallback
          uri={badgeUrl}
          fallbackIcon="shield"
          fallbackIconSize={28}
          containerStyle={[
            styles.badgeContainer,
            { backgroundColor: colors.surface, borderColor: colors.border },
          ]}
        />
      </View>
      <View style={styles.content}>
        <AppText variant="cardTitle" numberOfLines={1} style={styles.teamName}>
          {team.strTeam}
        </AppText>
        <View style={styles.metaRow}>
          {team.strSport ? (
            <View style={[styles.sportTag, { backgroundColor: colors.accentSurface }]}>
              <AppText
                variant="caption"
                style={{ color: colors.primary, fontWeight: '700', fontSize: 11 }}>
                {team.strSport}
              </AppText>
            </View>
          ) : null}
          <AppText variant="bodySmall" secondary numberOfLines={1} style={styles.subtitle}>
            {subtitle}
          </AppText>
        </View>
      </View>
      <View style={styles.actionContainer}>
        <FavouriteButton
          isFavourite={isFavourite}
          onToggle={onToggleFavourite}
          size={18}
        />
        <Feather
          name="chevron-right"
          size={18}
          color={colors.textMuted}
          style={styles.chevron}
        />
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 14,
    borderWidth: 1,
    marginBottom: 12,
    minHeight: 76,
  },
  badgeWrapper: {
    marginRight: 14,
  },
  badgeContainer: {
    width: 52,
    height: 52,
    borderRadius: 26,
    borderWidth: 1,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
  },
  teamName: {
    marginBottom: 4,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  sportTag: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
    marginRight: 8,
  },
  subtitle: {
    flex: 1,
  },
  actionContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 8,
  },
  chevron: {
    marginLeft: 6,
  },
});
