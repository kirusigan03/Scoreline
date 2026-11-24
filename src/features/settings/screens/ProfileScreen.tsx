import React, { useState } from 'react';
import {
  View,
  ScrollView,
  StyleSheet,
} from 'react-native';
import Feather from 'react-native-vector-icons/Feather';
import { useTheme } from '../../../theme';
import {
  AppText,
  ScreenContainer,
  AppHeader,
  Avatar,
  SettingsRow,
  ThemeToggle,
  ConfirmationDialog,
  OfflineBanner,
} from '../../../components';
import { useAppDispatch, useAppSelector } from '../../../app/hooks';
import { logout } from '../../auth/authSlice';
import { clearUserFavourites } from '../../favourites/favouritesSlice';
import { clearSecureTokens } from '../../../storage/secureStorage';
import { clearCachedUserProfile } from '../../../storage/preferencesStorage';

export const ProfileScreen: React.FC = () => {
  const { colors, isDark, radii } = useTheme();
  const dispatch = useAppDispatch();

  const user = useAppSelector((state) => state.auth.user);
  const isOnline = useAppSelector((state) => state.offline.isOnline);
  const lastRefreshTimestamp = useAppSelector(
    (state) => state.offline.lastRefreshTimestamp
  );
  const favouritesCount = useAppSelector((state) => state.favourites.items.length);

  const [showLogoutDialog, setShowLogoutDialog] = useState(false);

  const handleConfirmLogout = async () => {
    setShowLogoutDialog(false);
    // 1. Remove secure tokens from Keychain
    await clearSecureTokens();
    // 2. Clear non-sensitive profile from storage
    await clearCachedUserProfile();
    // 3. Clear in-memory user-specific favourites
    dispatch(clearUserFavourites());
    // 4. Reset Redux auth state (RootNavigator automatically redirects to Auth stack)
    dispatch(logout());
  };

  const fullName =
    user?.firstName && user?.lastName
      ? `${user.firstName} ${user.lastName}`
      : user?.username || 'Scoreline Fan';

  const lastRefreshFormatted = lastRefreshTimestamp
    ? new Date(lastRefreshTimestamp).toLocaleTimeString([], {
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
      })
    : 'Not yet refreshed';

  return (
    <ScreenContainer withTopInset={false}>
      {!isOnline && <OfflineBanner />}

      <AppHeader title="Profile & Settings" />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}>
        {/* User Profile Card */}
        <View
          style={[
            styles.profileCard,
            {
              backgroundColor: colors.card,
              borderColor: colors.border,
              borderRadius: radii.card,
            },
          ]}>
          <Avatar name={fullName} size={72} uri={user?.image} style={styles.avatar} />
          <AppText variant="sectionTitle" center style={styles.name}>
            {fullName}
          </AppText>
          <AppText variant="bodySmall" secondary center style={styles.username}>
            @{user?.username || 'user'}
          </AppText>
          {user?.email ? (
            <View style={styles.emailRow}>
              <Feather name="mail" size={14} color={colors.textSecondary} style={styles.emailIcon} />
              <AppText variant="caption" secondary>
                {user.email}
              </AppText>
            </View>
          ) : null}

          <View style={styles.statsDivider} />

          {/* Quick Stats */}
          <View style={styles.statsRow}>
            <View style={styles.statItem}>
              <AppText variant="sectionTitle" style={{ color: colors.primary }}>
                {favouritesCount}
              </AppText>
              <AppText variant="caption" secondary>
                Saved Clubs
              </AppText>
            </View>
            <View style={[styles.statDividerVertical, { backgroundColor: colors.border }]} />
            <View style={styles.statItem}>
              <View style={styles.statusDotRow}>
                <View
                  style={[
                    styles.statusDot,
                    { backgroundColor: isOnline ? colors.success : colors.warning },
                  ]}
                />
                <AppText variant="label" style={{ color: isOnline ? colors.success : colors.warning }}>
                  {isOnline ? 'Online' : 'Offline'}
                </AppText>
              </View>
              <AppText variant="caption" secondary>
                Network State
              </AppText>
            </View>
          </View>
        </View>

        {/* Section: Appearance (Light / Dark Mode Bonus) */}
        <AppText variant="sectionTitle" style={styles.sectionTitle}>
          Appearance
        </AppText>
        <View
          style={[
            styles.settingCard,
            {
              backgroundColor: colors.card,
              borderColor: colors.border,
              borderRadius: radii.card,
            },
          ]}>
          <View style={styles.settingRowContent}>
            <View
              style={[
                styles.iconBox,
                { backgroundColor: colors.accentSurface },
              ]}>
              <Feather
                name={isDark ? 'moon' : 'sun'}
                size={20}
                color={colors.primary}
              />
            </View>
            <View style={styles.settingDetails}>
              <AppText variant="cardTitle">App Theme</AppText>
              <AppText variant="caption" secondary>
                {isDark ? 'Dark Theme (Scoreline Original)' : 'Light Theme'}
              </AppText>
            </View>
            <ThemeToggle />
          </View>
        </View>

        {/* Section: Data & Connectivity */}
        <AppText variant="sectionTitle" style={styles.sectionTitle}>
          Connectivity & Data
        </AppText>
        <SettingsRow
          icon={isOnline ? 'wifi' : 'wifi-off'}
          title="Connection Mode"
          subtitle={
            isOnline
              ? 'Real-time updates enabled'
              : 'Offline-first: displaying cached data'
          }
          value={isOnline ? 'Online' : 'Offline'}
          showChevron={false}
        />
        <SettingsRow
          icon="clock"
          title="Last Synchronized"
          subtitle="Timestamp of most recent API refresh"
          value={lastRefreshFormatted}
          showChevron={false}
        />

        {/* Section: App Information */}
        <AppText variant="sectionTitle" style={styles.sectionTitle}>
          About Application
        </AppText>
        <SettingsRow
          icon="shield"
          title="Scoreline Mobile"
          subtitle="Discover. Follow. Stay Connected."
          value="v1.0.0"
          showChevron={false}
        />
        <SettingsRow
          icon="book-open"
          title="Module IN3210"
          subtitle="Assignment 2 – Build Your Own Discovery App"
          value="Index: 234109F"
          showChevron={false}
        />
        <SettingsRow
          icon="database"
          title="Sports Data Provider"
          subtitle="TheSportsDB Public API (Free Tier)"
          showChevron={false}
        />

        {/* Logout Action */}
        <View style={styles.logoutWrapper}>
          <SettingsRow
            icon="log-out"
            title="Sign Out"
            subtitle="Clears active session & secure tokens"
            destructive
            onPress={() => setShowLogoutDialog(true)}
            showChevron={false}
          />
        </View>
      </ScrollView>

      {/* Logout Confirmation Dialog */}
      <ConfirmationDialog
        visible={showLogoutDialog}
        icon="log-out"
        title="Sign Out"
        message="Are you sure you want to sign out of Scoreline? Your saved favourites will remain securely stored for your next login."
        confirmText="Sign Out"
        cancelText="Cancel"
        isDestructive
        onConfirm={handleConfirmLogout}
        onCancel={() => setShowLogoutDialog(false)}
      />
    </ScreenContainer>
  );
};

const styles = StyleSheet.create({
  scrollContent: {
    padding: 16,
    paddingBottom: 40,
  },
  profileCard: {
    padding: 24,
    borderWidth: 1,
    alignItems: 'center',
    marginBottom: 24,
  },
  avatar: {
    marginBottom: 14,
  },
  name: {
    marginBottom: 4,
  },
  username: {
    marginBottom: 8,
  },
  emailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  emailIcon: {
    marginRight: 6,
  },
  statsDivider: {
    height: 1,
    width: '100%',
    backgroundColor: '#34414D20',
    marginVertical: 14,
  },
  statsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    justifyContent: 'space-around',
  },
  statItem: {
    alignItems: 'center',
  },
  statDividerVertical: {
    width: 1,
    height: 36,
  },
  statusDotRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 2,
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 6,
  },
  sectionTitle: {
    marginBottom: 12,
    marginLeft: 4,
  },
  settingCard: {
    padding: 14,
    borderWidth: 1,
    marginBottom: 12,
  },
  settingRowContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconBox: {
    width: 38,
    height: 38,
    borderRadius: 19,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  settingDetails: {
    flex: 1,
  },
  logoutWrapper: {
    marginTop: 16,
  },
});
