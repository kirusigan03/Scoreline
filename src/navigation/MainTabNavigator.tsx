import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Feather from 'react-native-vector-icons/Feather';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { MainTabParamList } from './types';
import { HomeNavigator } from './HomeNavigator';
import { FavouritesNavigator } from './FavouritesNavigator';
import { ProfileScreen } from '../features/settings/screens/ProfileScreen';
import { useTheme } from '../theme';

const Tab = createBottomTabNavigator<MainTabParamList>();

const HomeTabIcon = ({ color }: { color: string }) => (
  <Feather name="home" size={22} color={color} />
);

const FavouritesTabIcon = ({ color }: { color: string }) => (
  <Feather name="heart" size={22} color={color} />
);

const ProfileTabIcon = ({ color }: { color: string }) => (
  <Feather name="user" size={22} color={color} />
);

export const MainTabNavigator: React.FC = () => {
  const { colors } = useTheme();
  const insets = useSafeAreaInsets();

  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.textSecondary,
        tabBarStyle: {
          backgroundColor: colors.surface,
          borderTopColor: colors.border,
          borderTopWidth: 1,
          height: 60 + insets.bottom,
          paddingBottom: insets.bottom > 0 ? insets.bottom : 8,
          paddingTop: 8,
        },
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: '600',
        },
      }}>
      <Tab.Screen
        name="HomeTab"
        component={HomeNavigator}
        options={{
          tabBarLabel: 'Home',
          tabBarIcon: HomeTabIcon,
        }}
      />
      <Tab.Screen
        name="FavouritesTab"
        component={FavouritesNavigator}
        options={{
          tabBarLabel: 'Favourites',
          tabBarIcon: FavouritesTabIcon,
        }}
      />
      <Tab.Screen
        name="ProfileTab"
        component={ProfileScreen}
        options={{
          tabBarLabel: 'Profile',
          tabBarIcon: ProfileTabIcon,
        }}
      />
    </Tab.Navigator>
  );
};
